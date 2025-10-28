import { ui } from '@joint/plus';
import TreeGraph from '../../classes/TreeGraph';

export default {
    theme: 'modern',
    // Disable multiple roots.
    // Literally, disable producing new roots by "no element position is valid".
    validatePosition: () => false,
    // Call a custom layout function
    reconnectElements: (elements, parent, prevSiblingRank, direction, treeView) => {
        const tree = treeView.model;
        const graph = tree.graph as TreeGraph;
        const shouldAddToHistory = { addToHistory: true };
        const siblingRank = prevSiblingRank + 0.5;
        elements.forEach(el => {
            const link = graph.getParentLink(el);
            if (!link) return;
            link.set('source', { id: parent.id }, shouldAddToHistory);
            el.set({ siblingRank, direction }, shouldAddToHistory);
        });
        graph.triggerLayout();
    }
} as Partial<ui.TreeLayoutView.Options>;
