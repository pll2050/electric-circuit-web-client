import { dia, g, layout, graphUtils } from '@joint/plus';
import { makeBoundaryElement, makeElement, makeLink, getElementBBox, getLabelHeight } from './shapes';
import { BOUNDARY_PADDING, LABEL_MARGIN, MAX_LEVEL, PARENT_GAP, SIBLING_GAP } from './theme';
import { Connections } from './enums';

import type { TreeData } from './types';

export function generateTree(graph: dia.Graph, data: TreeData) {

    const layoutGraph = new dia.Graph({}, {
        cellNamespace: graph.get('cells').cellNamespace
    });

    const treeLayout = new layout.TreeLayout({
        graph: layoutGraph,
        parentGap: PARENT_GAP,
        siblingGap: SIBLING_GAP,
        direction: 'B',
        updateVertices: (link, vertices) => {
            const source = link.getSourceElement();
            if (source && source.get('connections') === Connections.Branch) {
                const childOffset = source.get('childOffset');
                if (childOffset) {
                    // The children are offset by the `childOffset` value
                    // but the vertices are at its original position.
                    // We need to move the vertices as well.
                    vertices.forEach(vertex => vertex.y += childOffset);
                }
                link.vertices(vertices);
            }
        }
    });

    // Create cells from the tree structure
    const cells = graphUtils.constructTree(data, {
        makeElement,
        makeLink: (parentElement, childElement) => makeLink(parentElement, childElement, {
            direction: parentElement.get('connectionDirection'),
            style: parentElement.get('connectionStyle')
        }),
        children: 'children'
    });

    layoutGraph.resetCells(cells);

    // Sort elements by level (from the bottom to the top)
    const sortedElements = layoutGraph.getElements().sort((a, b) => b.get('level') - a.get('level'));
    const boundaryElements = sortedElements.filter(element => element.get('boundary'));

    layoutGraph.getElements().forEach(element => {
        const [parent] = layoutGraph.getNeighbors(element, { inbound: true });
        if (parent && parent.isElement()) {
            element.set('offset', parent.get('childOffset'));
        }
    });

    boundaryElements.forEach(element => {

        const [parent] = layoutGraph.getNeighbors(element, { inbound: true });
        if (parent && parent.isElement()) {
            const siblings = layoutGraph.getNeighbors(parent, { outbound: true });
            siblings.forEach(sibling => {
                sibling.set('offset', parent.get('childOffset') + BOUNDARY_PADDING);
            });
        }

        element.set({
            prevSiblingGap: BOUNDARY_PADDING,
            nextSiblingGap: BOUNDARY_PADDING
        })
    });

    // Find the position of all elements
    treeLayout.layout();

    const adjacencyList = graphUtils.toAdjacencyList(layoutGraph);

    const boundaries: { [id: string]: dia.Element } = boundaryElements.reduce((acc: Record<dia.Cell.ID, dia.Element>, element) => {

        const successors = layoutGraph.getSuccessors(element);
        const successorBoundaries = successors
            .filter(successor => successor.get('boundary'))
            .map(successor => acc[successor.id]);

        const containedElements = [element, ...successors, ...successorBoundaries];
        const bbox = g.Rect.fromRectUnion(...containedElements.map(element => getElementBBox(element)));
        bbox.inflate(BOUNDARY_PADDING);
        if (element.get('boundaryLabel')) {
            bbox.height += 2 * LABEL_MARGIN + getLabelHeight(element.get('boundaryLabel'));
        }

        const boundary = makeBoundaryElement(`boundary-${element.id}`, element.get('boundaryLabel') || '');
        boundary.set({
            position: { x: bbox.x, y: bbox.y },
            size: { width: bbox.width, height: bbox.height },
            z: element.get('level') - (MAX_LEVEL + 2) // Note: links are -1
        });

        acc[element.id] = boundary;
        return acc;

    }, {});

    // Remove links between parent and children for `serial` and `none` connections
    layoutGraph.getLinks().forEach(link => {
        const sourceElement = link.getSourceElement();
        if ([Connections.Parallel, Connections.Branch].includes(sourceElement.get('connections'))) return;
        link.remove();
    });

    sortedElements.forEach(parentElement => {

        // Add links between siblings
        const siblings = adjacencyList[parentElement.id];
        const siblingElements = siblings.map(siblingId => layoutGraph.getCell(siblingId) as dia.Element);
        if (parentElement.get('connections') === Connections.Serial) {
            for (let i = 1; i < siblings.length; i++) {
                const source = siblingElements[i - 1];
                const target = siblingElements[i];
                layoutGraph.addCell(makeLink(source, target, {
                    direction: parentElement.get('connectionDirection'),
                    style: parentElement.get('connectionStyle')
                }));
            }
        }
        // Resize the elements width to fit the children
        if (siblings.length > 0) {
            const bbox = graph.getCellsBBox(siblingElements);
            const parentElementBBox = parentElement.getBBox();
            const minSize = parentElement.get('minSize') || 0
            const width = Math.max(minSize, bbox.width);
            const x = bbox.x + (bbox.width - width) / 2;
            parentElement.set({
                position: { x, y: parentElementBBox.y },
                size: { width, height: parentElementBBox.height }
            });
        }
    });

    const diagramElements = layoutGraph.getElements();
    const diagramLinks = layoutGraph.getLinks();
    // Make sure the elements are updated first.
    // When the element's type changes, the element is removed and a new one is added.
    // The links are not removed, but disconnected at first. They are connected back
    // when the links are updated.
    const diagramCells = [...Object.values(boundaries), ...diagramElements, ...diagramLinks];
    const originalCells = graph.getCells();
    const diagramCellsMap: Record<dia.Cell.ID, dia.Cell> = {};

    // Reset the diagram cells `graph` reference
    // Make them not belong to the `layoutGraph` anymore.
    layoutGraph.resetCells([]);

    // Here we do not want to remove the existing elements but only update them if they exist.
    // e.g. Using resetCells() would remove all elements from the graph and add new ones.
    diagramCells.forEach(cell => {
        diagramCellsMap[cell.id] = cell;
        const originalCell = graph.getCell(cell.id);
        if (originalCell) {
            if (originalCell.get('type') !== cell.get('type')) {
                // The type of the cell has changed. We need to replace the cell.
                originalCell.remove({ disconnectLinks: true });
                if (cell.isElement()) {
                    cell.set('highlighted', originalCell.get('highlighted'));
                }
                graph.addCell(cell);
            } else {
                // `dirty` to make sure the arrowheads are re-rendered
                originalCell.set(cell.attributes, { dirty: originalCell.isLink() });
            }
        } else {
            graph.addCell(cell);
        }
    });

    originalCells.forEach(cell => {
        if (!diagramCellsMap[cell.id]) {
            cell.remove();
        }
    });


    return graph.getBBox();
}
