export const useDrawingTemplate = () => {
  // A3 size in pixels (420mm x 297mm at 96 DPI)
  const A3_WIDTH = 1587
  const A3_HEIGHT = 1123
  const MARGIN = 20
  const TITLE_BLOCK_HEIGHT = 180
  const TITLE_BLOCK_WIDTH = 400

  const createDrawingBorder = (joint: any, graph: any, pageSize: string = 'A3') => {
    const sizes: Record<string, { width: number; height: number }> = {
      A4: { width: 1123, height: 794 },
      A3: { width: A3_WIDTH, height: A3_HEIGHT },
      A2: { width: 2245, height: 1587 },
      A1: { width: 3174, height: 2245 }
    }

    const { width, height } = sizes[pageSize] || sizes.A3

    // Outer border
    const outerBorder = new joint.shapes.standard.Rectangle({
      position: { x: MARGIN, y: MARGIN },
      size: { width: width - MARGIN * 2, height: height - MARGIN * 2 },
      attrs: {
        body: {
          fill: 'none',
          stroke: '#000000',
          strokeWidth: 2
        },
        label: {
          text: ''
        }
      }
    })

    // Inner border
    const innerBorder = new joint.shapes.standard.Rectangle({
      position: { x: MARGIN + 10, y: MARGIN + 10 },
      size: { width: width - MARGIN * 2 - 20, height: height - MARGIN * 2 - 20 },
      attrs: {
        body: {
          fill: 'none',
          stroke: '#000000',
          strokeWidth: 1
        },
        label: {
          text: ''
        }
      }
    })

    outerBorder.set('selectable', false)
    innerBorder.set('selectable', false)

    graph.addCell([outerBorder, innerBorder])

    return { outerBorder, innerBorder, width, height }
  }

  const createTitleBlock = (
    joint: any,
    graph: any,
    canvasWidth: number,
    canvasHeight: number,
    projectInfo?: any
  ) => {
    const x = canvasWidth - MARGIN - TITLE_BLOCK_WIDTH - 10
    const y = canvasHeight - MARGIN - TITLE_BLOCK_HEIGHT - 10

    // Title block main border
    const titleBlockBorder = new joint.shapes.standard.Rectangle({
      position: { x, y },
      size: { width: TITLE_BLOCK_WIDTH, height: TITLE_BLOCK_HEIGHT },
      attrs: {
        body: {
          fill: '#ffffff',
          stroke: '#000000',
          strokeWidth: 2
        },
        label: {
          text: ''
        }
      }
    })
    titleBlockBorder.set('selectable', false)

    // Create title block sections
    const sections = []

    // Title section (top)
    const titleSection = new joint.shapes.standard.Rectangle({
      position: { x, y },
      size: { width: TITLE_BLOCK_WIDTH, height: 50 },
      attrs: {
        body: {
          fill: '#e8f4f8',
          stroke: '#000000',
          strokeWidth: 1
        },
        label: {
          text: projectInfo?.name || '프로젝트명',
          fill: '#000000',
          fontSize: 18,
          fontWeight: 'bold'
        }
      }
    })
    titleSection.set('selectable', false)
    sections.push(titleSection)

    // Grid for information fields
    const fieldHeight = 26
    const fields = [
      { label: '설계자:', value: projectInfo?.designer || '', y: y + 50 },
      { label: '회사:', value: projectInfo?.company || '', y: y + 50 + fieldHeight },
      { label: '프로젝트 번호:', value: projectInfo?.projectNumber || '', y: y + 50 + fieldHeight * 2 },
      { label: '도면 번호:', value: 'D-001', y: y + 50 + fieldHeight * 3 },
      { label: '버전:', value: projectInfo?.version || '1.0', y: y + 50 + fieldHeight * 4 }
    ]

    fields.forEach((field, index) => {
      // Label background
      const labelRect = new joint.shapes.standard.Rectangle({
        position: { x, y: field.y },
        size: { width: 120, height: fieldHeight },
        attrs: {
          body: {
            fill: '#f0f0f0',
            stroke: '#000000',
            strokeWidth: 1
          },
          label: {
            text: field.label,
            fill: '#000000',
            fontSize: 11,
            fontWeight: 'bold',
            textAnchor: 'start',
            refX: 5,
            refY: 13
          }
        }
      })
      labelRect.set('selectable', false)

      // Value background
      const valueRect = new joint.shapes.standard.Rectangle({
        position: { x: x + 120, y: field.y },
        size: { width: TITLE_BLOCK_WIDTH - 120, height: fieldHeight },
        attrs: {
          body: {
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 1
          },
          label: {
            text: field.value,
            fill: '#000000',
            fontSize: 11,
            textAnchor: 'start',
            refX: 5,
            refY: 13
          }
        }
      })
      valueRect.set('selectable', false)

      sections.push(labelRect, valueRect)
    })

    graph.addCell([titleBlockBorder, ...sections])

    return { titleBlockBorder, sections }
  }

  const createGridLines = (
    joint: any,
    graph: any,
    canvasWidth: number,
    canvasHeight: number,
    gridSpacing: number = 100
  ) => {
    const lines = []
    const startX = MARGIN + 10
    const startY = MARGIN + 10
    const endX = canvasWidth - MARGIN - 10
    const endY = canvasHeight - MARGIN - 10

    // Vertical grid lines
    for (let x = startX; x <= endX; x += gridSpacing) {
      const line = new joint.shapes.standard.Link({
        source: { x, y: startY },
        target: { x, y: endY },
        attrs: {
          line: {
            stroke: '#e0e0e0',
            strokeWidth: 0.5,
            strokeDasharray: '2,2'
          }
        },
        z: -1
      })
      line.set('selectable', false)
      lines.push(line)
    }

    // Horizontal grid lines
    for (let y = startY; y <= endY; y += gridSpacing) {
      const line = new joint.shapes.standard.Link({
        source: { x: startX, y },
        target: { x: endX, y },
        attrs: {
          line: {
            stroke: '#e0e0e0',
            strokeWidth: 0.5,
            strokeDasharray: '2,2'
          }
        },
        z: -1
      })
      line.set('selectable', false)
      lines.push(line)
    }

    graph.addCells(lines)
    return lines
  }

  const createZoneMarkers = (
    joint: any,
    graph: any,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const markers = []
    const startX = MARGIN + 10
    const startY = MARGIN + 10
    const endX = canvasWidth - MARGIN - 10
    const endY = canvasHeight - MARGIN - 10
    const zoneWidth = (endX - startX) / 8
    const zoneHeight = (endY - startY) / 6

    // Top zone markers (A, B, C, D, E, F, G, H)
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    letters.forEach((letter, i) => {
      const marker = new joint.shapes.standard.Rectangle({
        position: { x: startX + i * zoneWidth, y: MARGIN },
        size: { width: zoneWidth, height: 10 },
        attrs: {
          body: {
            fill: '#f0f0f0',
            stroke: '#000000',
            strokeWidth: 1
          },
          label: {
            text: letter,
            fill: '#000000',
            fontSize: 8,
            fontWeight: 'bold'
          }
        }
      })
      marker.set('selectable', false)
      markers.push(marker)
    })

    // Left zone markers (1, 2, 3, 4, 5, 6)
    for (let i = 0; i < 6; i++) {
      const marker = new joint.shapes.standard.Rectangle({
        position: { x: MARGIN, y: startY + i * zoneHeight },
        size: { width: 10, height: zoneHeight },
        attrs: {
          body: {
            fill: '#f0f0f0',
            stroke: '#000000',
            strokeWidth: 1
          },
          label: {
            text: (i + 1).toString(),
            fill: '#000000',
            fontSize: 8,
            fontWeight: 'bold'
          }
        }
      })
      marker.set('selectable', false)
      markers.push(marker)
    }

    graph.addCells(markers)
    return markers
  }

  const createCompleteTemplate = (
    joint: any,
    graph: any,
    pageSize: string = 'A3',
    projectInfo?: any
  ) => {
    // Clear existing template elements
    const cells = graph.getCells()
    cells.forEach((cell: any) => {
      if (cell.get('selectable') === false) {
        cell.remove()
      }
    })

    const { width, height } = createDrawingBorder(joint, graph, pageSize)
    createZoneMarkers(joint, graph, width, height)
    createGridLines(joint, graph, width, height, 50)
    createTitleBlock(joint, graph, width, height, projectInfo)

    return { width, height }
  }

  return {
    createDrawingBorder,
    createTitleBlock,
    createGridLines,
    createZoneMarkers,
    createCompleteTemplate
  }
}
