import { ref, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { useDrawingTemplate } from './useDrawingTemplate'

export const useCircuitEditor = (containerRef: Ref<HTMLDivElement | null>, projectInfo?: any) => {
  let joint: any = null
  let graph: any = null
  let paper: any = null
  let currentPageSize: string = 'A3'

  const initialize = async () => {
    if (!containerRef.value) return

    try {
      // Import JointJS dynamically (client-side only)
      joint = await import('jointjs')

      console.log('JointJS loaded successfully:', joint)

      // Create graph
      graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes })

      // Create paper with larger dimensions for A3 template
      paper = new joint.dia.Paper({
        el: containerRef.value,
        model: graph,
        width: 1587,  // A3 width
        height: 1123, // A3 height
        gridSize: 10,
        drawGrid: false, // Disable default grid, we'll draw custom one
        background: {
          color: 'white'
        },
        cellViewNamespace: joint.shapes,
        interactive: (cellView: any) => {
          // Make template elements non-interactive
          if (cellView.model.get('selectable') === false) {
            return false
          }
          return true
        },
        defaultLink: new joint.shapes.standard.Link(),
        linkPinning: false,
        snapLinks: { radius: 20 }
      })

      // Draw the template
      const { createCompleteTemplate } = useDrawingTemplate()
      createCompleteTemplate(joint, graph, currentPageSize, projectInfo)

      console.log('Circuit editor initialized with drawing template')

      return { joint, graph, paper }
    } catch (error) {
      console.error('Failed to load JointJS:', error)
      return null
    }
  }

  const cleanup = () => {
    if (paper) {
      paper.remove()
      paper = null
    }
    if (graph) {
      graph.clear()
      graph = null
    }
  }

  const createComponentWithPorts = (type: string, label: string, color: string, strokeColor: string) => {
    return new joint.shapes.standard.Rectangle({
      size: { width: 80, height: 50 },
      attrs: {
        label: {
          text: label,
          fill: '#1f2937',
          fontSize: 14,
          fontWeight: 'bold'
        },
        body: {
          fill: color,
          stroke: strokeColor,
          strokeWidth: 2,
          rx: 5,
          ry: 5
        }
      },
      ports: {
        groups: {
          'in': {
            position: 'left',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: strokeColor,
                strokeWidth: 2,
                fill: '#fff'
              }
            }
          },
          'out': {
            position: 'right',
            attrs: {
              circle: {
                r: 6,
                magnet: true,
                stroke: strokeColor,
                strokeWidth: 2,
                fill: '#fff'
              }
            }
          }
        },
        items: [
          { group: 'in', id: 'in1' },
          { group: 'out', id: 'out1' }
        ]
      }
    })
  }

  const addComponent = (type: string, position?: { x: number; y: number }) => {
    if (!joint || !graph) {
      console.error('JointJS not initialized')
      return
    }

    const pos = position || {
      x: Math.random() * 300 + 150,
      y: Math.random() * 200 + 100
    }

    try {
      let element: any

      switch (type) {
        case 'resistor':
          element = createComponentWithPorts(type, 'R', '#dbeafe', '#3b82f6')
          break

        case 'capacitor':
          element = createComponentWithPorts(type, 'C', '#dcfce7', '#22c55e')
          break

        case 'inductor':
          element = createComponentWithPorts(type, 'L', '#fce7f3', '#ec4899')
          break

        case 'battery':
          element = createComponentWithPorts(type, 'V', '#fef9c3', '#eab308')
          break

        case 'ac-source':
          element = createComponentWithPorts(type, 'AC', '#fef3c7', '#f59e0b')
          break

        case 'switch':
          element = createComponentWithPorts(type, 'S', '#f3e8ff', '#a855f7')
          break

        default:
          element = createComponentWithPorts(type, type.toUpperCase(), '#f3f4f6', '#6b7280')
      }

      element.position(pos.x, pos.y)
      element.set('componentType', type)

      graph.addCell(element)
      console.log('Added component:', type, 'at', pos)

      return element
    } catch (error) {
      console.error('Error adding component:', error)
    }
  }

  const zoomIn = () => {
    if (!paper) return
    const currentScale = paper.scale()
    const newScale = Math.min(currentScale.sx * 1.2, 3) // Max zoom 300%
    const paperEl = paper.el as HTMLElement
    const rect = paperEl.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    paper.scale(newScale, newScale)
    return newScale
  }

  const zoomOut = () => {
    if (!paper) return
    const currentScale = paper.scale()
    const newScale = Math.max(currentScale.sx * 0.8, 0.1) // Min zoom 10%
    const paperEl = paper.el as HTMLElement
    const rect = paperEl.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    paper.scale(newScale, newScale)
    return newScale
  }

  const setZoom = (zoomPercent: number) => {
    if (!paper) return
    const scale = zoomPercent / 100
    paper.scale(scale, scale)
    return scale
  }

  const fitToScreen = () => {
    if (!paper) return
    paper.scaleContentToFit({ padding: 20 })
    const scale = paper.scale()
    return scale.sx
  }

  const deleteSelected = () => {
    if (!graph || !paper) return

    // Get selected cells (elements with selection highlight)
    const cells = graph.getCells()
    const selectedCells = cells.filter((cell: any) => {
      const view = paper.findViewByModel(cell)
      return view && view.el.classList.contains('selected')
    })

    if (selectedCells.length > 0) {
      selectedCells.forEach((cell: any) => cell.remove())
      console.log('Deleted', selectedCells.length, 'components')
    } else {
      console.log('No components selected')
    }
  }

  const setupEventHandlers = () => {
    if (!paper) return

    let selectedElement: any = null
    let isPanning = false
    let startPanX = 0
    let startPanY = 0
    let panOffsetX = 0
    let panOffsetY = 0

    const paperEl = paper.el as HTMLElement

    // Mouse wheel zoom
    paperEl.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault()

      const delta = e.deltaY
      const currentScale = paper.scale()
      const zoomFactor = delta > 0 ? 0.9 : 1.1
      const newScale = Math.max(0.1, Math.min(3, currentScale.sx * zoomFactor))

      // Get mouse position relative to paper
      const rect = paperEl.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      // Calculate zoom center
      const offsetX = mouseX / currentScale.sx
      const offsetY = mouseY / currentScale.sy

      paper.scale(newScale, newScale)

      // Adjust translation to zoom at mouse position
      const newOffsetX = mouseX / newScale
      const newOffsetY = mouseY / newScale
      const dx = (newOffsetX - offsetX) * newScale
      const dy = (newOffsetY - offsetY) * newScale

      paper.translate(paper.translate().tx + dx, paper.translate().ty + dy)
    })

    // Panning with middle mouse button or space + left mouse
    paperEl.addEventListener('mousedown', (e: MouseEvent) => {
      // Middle mouse button or space + left mouse
      if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
        e.preventDefault()
        isPanning = true
        startPanX = e.clientX
        startPanY = e.clientY
        const translate = paper.translate()
        panOffsetX = translate.tx
        panOffsetY = translate.ty
        paperEl.style.cursor = 'grabbing'
      }
    })

    paperEl.addEventListener('mousemove', (e: MouseEvent) => {
      if (isPanning) {
        e.preventDefault()
        const dx = e.clientX - startPanX
        const dy = e.clientY - startPanY
        paper.translate(panOffsetX + dx, panOffsetY + dy)
      }
    })

    paperEl.addEventListener('mouseup', (e: MouseEvent) => {
      if (isPanning) {
        isPanning = false
        paperEl.style.cursor = 'default'
      }
    })

    paperEl.addEventListener('mouseleave', () => {
      if (isPanning) {
        isPanning = false
        paperEl.style.cursor = 'default'
      }
    })

    // Click on element to select
    paper.on('element:pointerclick', (elementView: any) => {
      if (isPanning) return

      // Deselect previous element
      if (selectedElement) {
        selectedElement.unhighlight()
        selectedElement.el.classList.remove('selected')
      }

      // Select new element
      selectedElement = elementView
      elementView.highlight()
      elementView.el.classList.add('selected')

      console.log('Selected:', elementView.model.get('componentType'))
    })

    // Click on blank to deselect
    paper.on('blank:pointerclick', () => {
      if (isPanning) return

      if (selectedElement) {
        selectedElement.unhighlight()
        selectedElement.el.classList.remove('selected')
        selectedElement = null
      }
    })
  }

  const updatePageSize = (pageSize: string, projectInfo?: any) => {
    if (!joint || !graph) return

    currentPageSize = pageSize
    const { createCompleteTemplate } = useDrawingTemplate()
    createCompleteTemplate(joint, graph, pageSize, projectInfo)

    // Update paper size
    const sizes: Record<string, { width: number; height: number }> = {
      A4: { width: 1123, height: 794 },
      A3: { width: 1587, height: 1123 },
      A2: { width: 2245, height: 1587 },
      A1: { width: 3174, height: 2245 }
    }

    const { width, height } = sizes[pageSize] || sizes.A3
    paper.setDimensions(width, height)
  }

  const updateProjectInfo = (projectInfo: any) => {
    if (!joint || !graph) return

    const { createCompleteTemplate } = useDrawingTemplate()
    createCompleteTemplate(joint, graph, currentPageSize, projectInfo)
  }

  return {
    initialize,
    cleanup,
    addComponent,
    zoomIn,
    zoomOut,
    setZoom,
    fitToScreen,
    deleteSelected,
    setupEventHandlers,
    updatePageSize,
    updateProjectInfo,
    getGraph: () => graph,
    getPaper: () => paper,
    getJoint: () => joint
  }
}
