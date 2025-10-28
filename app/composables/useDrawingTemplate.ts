export const useDrawingTemplate = () => {
  // A3 size in pixels (420mm x 297mm at 96 DPI)
  const A3_WIDTH = 1587
  const A3_HEIGHT = 1123
  const MARGIN = 20
  const TITLE_BLOCK_HEIGHT = 180
  const TITLE_BLOCK_WIDTH = 400

  // Load and parse XML template
  const loadXMLTemplate = async (pageSize: string = 'A3') => {
    try {
      const templateFile = pageSize.toLowerCase() === 'a4' ? 'a4-template.xml' : 'a3-template.xml'
      const response = await fetch(`/assets/layouts/${templateFile}`)
      
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.statusText}`)
      }
      
      const xmlText = await response.text()
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
      
      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror')
      if (parserError) {
        throw new Error('XML parsing error: ' + parserError.textContent)
      }
      
      return xmlDoc
    } catch (error) {
      console.error('Error loading XML template:', error)
      return null
    }
  }

  // Parse XML and create JointJS elements
  const createTemplateFromXML = async (joint: any, graph: any, pageSize: string = 'A3', projectInfo?: any) => {
    const xmlDoc = await loadXMLTemplate(pageSize)
    if (!xmlDoc) {
      console.error('Failed to load XML template, falling back to default')
      return createCompleteTemplate(joint, graph, pageSize, projectInfo)
    }

    // Clear existing template elements
    const cells = graph.getCells()
    cells.forEach((cell: any) => {
      if (cell.get('selectable') === false) {
        cell.remove()
      }
    })

    const pageInfo = xmlDoc.querySelector('page-info')
    const width = parseInt(pageInfo?.querySelector('width')?.textContent || '1587')
    const height = parseInt(pageInfo?.querySelector('height')?.textContent || '1123')

    // Create borders
    const borders = xmlDoc.querySelectorAll('borders rectangle')
    borders.forEach((borderEl) => {
      const posEl = borderEl.querySelector('position')
      const sizeEl = borderEl.querySelector('size')
      const styleEl = borderEl.querySelector('style')
      const selectableEl = borderEl.querySelector('selectable')

      const x = parseInt(posEl?.getAttribute('x') || '0')
      const y = parseInt(posEl?.getAttribute('y') || '0')
      const w = parseInt(sizeEl?.getAttribute('width') || '100')
      const h = parseInt(sizeEl?.getAttribute('height') || '100')
      const stroke = styleEl?.getAttribute('stroke') || '#000000'
      const strokeWidth = parseInt(styleEl?.getAttribute('stroke-width') || '1')
      const fill = styleEl?.getAttribute('fill') || 'none'

      const border = new joint.shapes.standard.Rectangle({
        position: { x, y },
        size: { width: w, height: h },
        attrs: {
          body: {
            fill,
            stroke,
            strokeWidth
          },
          label: { text: '' }
        }
      })

      border.set('selectable', selectableEl?.textContent === 'true')
      graph.addCell(border)
    })

    // Create zone markers
    await createZoneMarkersFromXML(joint, graph, xmlDoc, width, height)

    // Create title block
    await createTitleBlockFromXML(joint, graph, xmlDoc, projectInfo)

    return { width, height }
  }

  const createZoneMarkersFromXML = async (joint: any, graph: any, xmlDoc: Document, width: number, height: number) => {
    const zones = xmlDoc.querySelectorAll('zone-markers zones')
    
    zones.forEach((zoneEl) => {
      const type = zoneEl.getAttribute('type')
      const start = zoneEl.getAttribute('start') || 'A'
      const spacing = parseInt(zoneEl.getAttribute('spacing') || '150')
      const margin = parseInt(zoneEl.getAttribute('margin') || '30')
      const textStyle = zoneEl.querySelector('text-style')
      const fontSize = parseInt(textStyle?.getAttribute('font-size') || '12')
      const fontWeight = textStyle?.getAttribute('font-weight') || 'bold'
      const fill = textStyle?.getAttribute('fill') || '#000000'

      if (type === 'horizontal') {
        // Create horizontal markers (A, B, C...)
        let label = start
        for (let x = margin + spacing; x < width - margin; x += spacing) {
          // Top marker
          const topMarker = new joint.shapes.standard.Rectangle({
            position: { x: x - 10, y: 5 },
            size: { width: 20, height: 20 },
            attrs: {
              body: { fill: 'none', stroke: 'none' },
              label: {
                text: label,
                fill,
                fontSize,
                fontWeight
              }
            }
          })
          topMarker.set('selectable', false)
          graph.addCell(topMarker)

          // Bottom marker
          const bottomMarker = new joint.shapes.standard.Rectangle({
            position: { x: x - 10, y: height - 25 },
            size: { width: 20, height: 20 },
            attrs: {
              body: { fill: 'none', stroke: 'none' },
              label: {
                text: label,
                fill,
                fontSize,
                fontWeight
              }
            }
          })
          bottomMarker.set('selectable', false)
          graph.addCell(bottomMarker)

          label = String.fromCharCode(label.charCodeAt(0) + 1)
        }
      } else if (type === 'vertical') {
        // Create vertical markers (1, 2, 3...)
        let label = parseInt(start)
        for (let y = margin + spacing; y < height - margin; y += spacing) {
          // Left marker
          const leftMarker = new joint.shapes.standard.Rectangle({
            position: { x: 5, y: y - 10 },
            size: { width: 20, height: 20 },
            attrs: {
              body: { fill: 'none', stroke: 'none' },
              label: {
                text: label.toString(),
                fill,
                fontSize,
                fontWeight
              }
            }
          })
          leftMarker.set('selectable', false)
          graph.addCell(leftMarker)

          // Right marker
          const rightMarker = new joint.shapes.standard.Rectangle({
            position: { x: width - 25, y: y - 10 },
            size: { width: 20, height: 20 },
            attrs: {
              body: { fill: 'none', stroke: 'none' },
              label: {
                text: label.toString(),
                fill,
                fontSize,
                fontWeight
              }
            }
          })
          rightMarker.set('selectable', false)
          graph.addCell(rightMarker)

          label++
        }
      }
    })
  }

  const createTitleBlockFromXML = async (joint: any, graph: any, xmlDoc: Document, projectInfo?: any) => {
    const titleBlockEl = xmlDoc.querySelector('title-block')
    if (!titleBlockEl) return

    const posEl = titleBlockEl.querySelector('position')
    const sizeEl = titleBlockEl.querySelector('size')
    const borderEl = titleBlockEl.querySelector('border')

    const x = parseInt(posEl?.getAttribute('x') || '0')
    const y = parseInt(posEl?.getAttribute('y') || '0')
    const w = parseInt(sizeEl?.getAttribute('width') || '400')
    const h = parseInt(sizeEl?.getAttribute('height') || '180')

    // Create title block border
    const titleBlockBorder = new joint.shapes.standard.Rectangle({
      position: { x, y },
      size: { width: w, height: h },
      attrs: {
        body: {
          fill: borderEl?.getAttribute('fill') || '#f8f8f8',
          stroke: borderEl?.getAttribute('stroke') || '#000000',
          strokeWidth: parseInt(borderEl?.getAttribute('stroke-width') || '2')
        },
        label: { text: '' }
      }
    })
    titleBlockBorder.set('selectable', false)
    graph.addCell(titleBlockBorder)

    // Create title section
    const titleSectionEl = titleBlockEl.querySelector('title-section')
    if (titleSectionEl) {
      const titlePosEl = titleSectionEl.querySelector('position')
      const titleSizeEl = titleSectionEl.querySelector('size')
      const titleBorderEl = titleSectionEl.querySelector('border')
      const titleTextEl = titleSectionEl.querySelector('text')

      const titleX = x + parseInt(titlePosEl?.getAttribute('x') || '0')
      const titleY = y + parseInt(titlePosEl?.getAttribute('y') || '0')
      const titleW = parseInt(titleSizeEl?.getAttribute('width') || '400')
      const titleH = parseInt(titleSizeEl?.getAttribute('height') || '40')

      const titleSection = new joint.shapes.standard.Rectangle({
        position: { x: titleX, y: titleY },
        size: { width: titleW, height: titleH },
        attrs: {
          body: {
            fill: titleBorderEl?.getAttribute('fill') || '#e8e8e8',
            stroke: titleBorderEl?.getAttribute('stroke') || '#000000',
            strokeWidth: parseInt(titleBorderEl?.getAttribute('stroke-width') || '1')
          },
          label: {
            text: projectInfo?.name || titleTextEl?.getAttribute('placeholder') || '새 프로젝트',
            fill: '#000000',
            fontSize: parseInt(titleTextEl?.getAttribute('font-size') || '16'),
            fontWeight: titleTextEl?.getAttribute('font-weight') || 'bold',
            textVerticalAnchor: 'middle',
            refY: '50%'
          }
        }
      })
      titleSection.set('selectable', false)
      graph.addCell(titleSection)
    }

    // Create information fields
    const fieldsEl = titleBlockEl.querySelector('fields')
    if (fieldsEl) {
      const fields = fieldsEl.querySelectorAll('field')
      
      fields.forEach((fieldEl) => {
        const label = fieldEl.querySelector('label')?.textContent || ''
        const posEl = fieldEl.querySelector('position')
        const labelWidth = parseInt(fieldEl.querySelector('label-width')?.textContent || '120')
        const valueWidth = parseInt(fieldEl.querySelector('value-width')?.textContent || '280')
        const fieldHeight = parseInt(fieldEl.querySelector('height')?.textContent || '26')
        const placeholder = fieldEl.querySelector('placeholder')?.textContent || ''

        const fieldX = x + parseInt(posEl?.getAttribute('x') || '0')
        const fieldY = y + parseInt(posEl?.getAttribute('y') || '0')

        // Label background
        const labelRect = new joint.shapes.standard.Rectangle({
          position: { x: fieldX, y: fieldY },
          size: { width: labelWidth, height: fieldHeight },
          attrs: {
            body: {
              fill: '#f0f0f0',
              stroke: '#000000',
              strokeWidth: 1
            },
            label: {
              text: label,
              fill: '#000000',
              fontSize: 11,
              fontWeight: 'bold',
              textAnchor: 'start',
              textVerticalAnchor: 'middle',
              refX: 5,
              refY: '50%'
            }
          }
        })
        labelRect.set('selectable', false)
        graph.addCell(labelRect)

        // Value background
        let value = ''
        switch (label) {
          case '설계자:':
            value = projectInfo?.designer || ''
            break
          case '회사:':
            value = projectInfo?.company || ''
            break
          case '프로젝트 번호:':
            value = projectInfo?.projectNumber || ''
            break
          case '도면 번호:':
            value = placeholder
            break
          case '버전:':
            value = projectInfo?.version || placeholder
            break
        }

        const valueRect = new joint.shapes.standard.Rectangle({
          position: { x: fieldX + labelWidth, y: fieldY },
          size: { width: valueWidth, height: fieldHeight },
          attrs: {
            body: {
              fill: '#ffffff',
              stroke: '#000000',
              strokeWidth: 1
            },
            label: {
              text: value,
              fill: '#000000',
              fontSize: 11,
              textAnchor: 'start',
              textVerticalAnchor: 'middle',
              refX: 5,
              refY: '50%'
            }
          }
        })
        valueRect.set('selectable', false)
        graph.addCell(valueRect)
      })
    }
  }

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
    // createGridLines(joint, graph, width, height, 50) // 격자선 제거
    createTitleBlock(joint, graph, width, height, projectInfo)

    return { width, height }
  }

  return {
    createDrawingBorder,
    createTitleBlock,
    createGridLines,
    createZoneMarkers,
    createCompleteTemplate,
    loadXMLTemplate,
    createTemplateFromXML
  }
}
