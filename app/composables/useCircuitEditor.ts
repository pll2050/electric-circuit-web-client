import type { Ref } from 'vue'
import { useDrawingTemplate } from './useDrawingTemplate'

// 확대/축소 설정
const ZOOM_SETTINGS = {
  min: 0.2,
  max: 3
}

const GRID_SIZE = 10
const DEFAULT_PAPER_SIZE = { width: 1123, height: 794 } // A4 (297mm x 210mm at 96 DPI)

export const useCircuitEditor = (containerRef: Ref<HTMLDivElement | null>, projectInfo?: any) => {
  // JointJS 관련 변수들
  let joint: any = null  // @joint/plus만 사용
  let graph: any = null
  let paper: any = null
  let scroller: any = null
  let commandManager: any = null
  let clipboard: any = null
  let snaplines: any = null
  let selection: any = null
  let tooltip: any = null

  let currentPageSize: string = 'A4'  // A4 템플릿 사용

  /**
   * 초기화 함수
   */
  const initialize = async () => {
    if (!containerRef.value) {
      console.error('❌ Container not found')
      return null
    }

    console.log('📦 [PAPER] Container element:', containerRef.value)
    console.log('📦 [PAPER] Container ID:', containerRef.value.id)
    console.log('📦 [PAPER] Container className:', containerRef.value.className)
    console.log('📦 [PAPER] Container parent:', containerRef.value.parentElement)
    console.log('📏 [PAPER] Container dimensions:', {
      width: containerRef.value.clientWidth,
      height: containerRef.value.clientHeight
    })

    try {
      // 1. JointJS Plus 모듈 import
      console.log('🔄 Loading JointJS Plus module...')
      joint = await import('@joint/plus')
      console.log('✅ JointJS Plus loaded successfully')

      // 2. Graph 생성
      graph = new joint.dia.Graph({}, {
        cellNamespace: joint.shapes
      })
      console.log('✅ Graph created:', graph)

      // 3. CommandManager 생성 (실행 취소/다시 실행)
      commandManager = new joint.dia.CommandManager({
        graph: graph
      })
      console.log('✅ CommandManager created')

      // 4. Paper 생성
      paper = new joint.dia.Paper({
        model: graph,
        width: DEFAULT_PAPER_SIZE.width,
        height: DEFAULT_PAPER_SIZE.height,
        gridSize: GRID_SIZE,
        drawGrid: true,  // KitchenSink와 동일하게 true만 설정
        background: {
          color: '#ffffff'
        },
        cellViewNamespace: joint.shapes,
        interactive: (cellView: any) => {
          // 템플릿 요소는 선택 불가
          if (cellView.model.get('selectable') === false) {
            return false
          }
          return { linkMove: false }
        },
        async: true,
        sorting: joint.dia.Paper.sorting.APPROX,
        defaultLink: new joint.shapes.standard.Link({
          attrs: {
            line: {
              stroke: '#3b82f6',
              strokeWidth: 2,
              targetMarker: {
                type: 'path',
                d: 'M 10 -5 0 0 10 5 z'
              }
            }
          }
        }),
        linkPinning: false,
        snapLinks: { radius: 20 }
      })
      console.log('✅ Paper created:', paper)

      // 5. Snaplines 생성 (요소 정렬 가이드)
      snaplines = new joint.ui.Snaplines({
        paper: paper
      })
      console.log('✅ Snaplines created')

      // 6. PaperScroller 생성 (KitchenSink 방식)
      console.log('🔄 Creating PaperScroller...')
      scroller = new joint.ui.PaperScroller({
        paper: paper,
        autoResizePaper: true,
        scrollWhileDragging: true,
        borderless: true,  // KitchenSink와 동일
        cursor: 'grab'
      })

      console.log('📌 [PAPER] Appending scroller to container...')
      console.log('📌 [PAPER] Scroller element:', scroller.el)
      console.log('📌 [PAPER] Scroller element tagName:', scroller.el.tagName)
      console.log('📌 [PAPER] Scroller element className:', scroller.el.className)
      console.log('📌 [PAPER] Container before append:', containerRef.value.children.length, 'children')

      // 컨테이너에 Scroller 추가 (기존 내용 유지)
      // Note: Navigator는 별도 컨테이너에 있으므로 충돌하지 않음
      if (containerRef.value.children.length === 0) {
        containerRef.value.appendChild(scroller.el)
        console.log('✅ [PAPER] Scroller appended to empty container')
      } else {
        // 이미 scroller가 있다면 교체
        containerRef.value.innerHTML = ''
        containerRef.value.appendChild(scroller.el)
        console.log('✅ [PAPER] Scroller replaced in container')
      }

      console.log('📌 [PAPER] Container after append:', containerRef.value.children.length, 'children')
      console.log('📌 [PAPER] Container first child:', containerRef.value.firstChild)

      // KitchenSink는 render() 없이 center()만 호출
      scroller.center()

      console.log('✅ PaperScroller created and rendered')
      console.log('📐 Scroller dimensions:', {
        scrollerWidth: scroller.el.clientWidth,
        scrollerHeight: scroller.el.clientHeight,
        paperWidth: paper.options.width,
        paperHeight: paper.options.height
      })

      // 7. Paper 이벤트 설정 (팬 & 핀치 줌)
      paper.on('paper:pan', (evt: any, tx: number, ty: number) => {
        evt.preventDefault()
        scroller.el.scrollLeft += tx
        scroller.el.scrollTop += ty
      })

      paper.on('paper:pinch', (_evt: any, ox: number, oy: number, scale: number) => {
        const zoom = scroller.zoom()
        scroller.zoom(zoom * scale, {
          min: ZOOM_SETTINGS.min,
          max: ZOOM_SETTINGS.max,
          ox,
          oy,
          absolute: true
        })
      })

      // 8. Clipboard 생성 (복사/붙여넣기)
      clipboard = new joint.ui.Clipboard()
      console.log('Clipboard created')

      // 9. Selection 초기화
      initializeSelection()

      // 10. Tooltip 생성
      tooltip = new joint.ui.Tooltip({
        rootTarget: document.body,
        target: '[data-tooltip]',
        direction: joint.ui.Tooltip.TooltipArrowPosition.Auto,
        padding: 12,
        animation: {
          delay: '250ms'
        }
      })
      console.log('Tooltip created')

      // 11. Link 이벤트 설정
      initializeLinkTools()

      // 12. 키보드 단축키 초기화
      initializeKeyboardShortcuts()

      // 13. Drawing Template 생성
      console.log('🔄 Creating drawing template...')
      const { createTemplateFromXML } = useDrawingTemplate()
      await createTemplateFromXML(joint, graph, currentPageSize, projectInfo)
      console.log('✅ Drawing template created')

      console.log('🎉 Circuit editor initialized with all advanced features')
      console.log('📊 Final state:', {
        hasJoint: !!joint,
        hasGraph: !!graph,
        hasPaper: !!paper,
        hasScroller: !!scroller,
        hasSelection: !!selection,
        graphCells: graph.getCells().length
      })

      return { joint, graph, paper, scroller }
    } catch (error) {
      console.error('❌ Failed to initialize circuit editor:', error)
      console.error('Error details:', error instanceof Error ? error.message : error)
      console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace')
      return null
    }
  }

  /**
   * Selection 초기화
   */
  const initializeSelection = () => {
    if (!scroller || !paper || !graph || !joint) {
      console.error('Selection 초기화 실패: 필요한 요소들이 초기화되지 않음')
      return
    }

    try {
      // KitchenSink 방식으로 Selection 생성
      selection = new joint.ui.Selection({
        paper: scroller,
        useModelGeometry: true,
        translateConnectedLinks: joint.ui.Selection.ConnectedLinksTranslation.SUBGRAPH,
        handles: [
          {
            ...joint.ui.Selection.getDefaultHandle('rotate'),
            position: joint.ui.Selection.HandlePosition.SW
          },
          {
            ...joint.ui.Selection.getDefaultHandle('resize'),
            position: joint.ui.Selection.HandlePosition.SE
          }
        ]
      })

      // Selection 변경 시 이벤트
      selection.collection.on('reset add remove', () => {
        onSelectionChange()
      })

      // Paper blank 클릭 시 선택 해제 또는 팬 시작 (KitchenSink 방식)
      paper.on('blank:pointerdown', (evt: any) => {
        if (evt.shiftKey) {
          selection.startSelecting(evt)
        } else {
          selection.collection.reset([])
          scroller.startPanning(evt)
          paper.removeTools()
        }
      })

      // Element/Cell 클릭 시 선택 (KitchenSink 방식)
      paper.on('cell:pointerdown element:magnet:pointerdown', (cellView: any, evt: any) => {
        // 템플릿 요소는 선택 불가
        if (cellView.model.get('selectable') === false) {
          return
        }

        if (evt.shiftKey) {
          cellView.preventDefaultInteraction(evt)
          selection.startSelecting(evt)
        }
      })

      // Element 클릭 시 선택 추가 (Ctrl/Meta 키)
      paper.on('element:pointerdown', (elementView: any, evt: any) => {
        // 템플릿 요소는 선택 불가
        if (elementView.model.get('selectable') === false) {
          return
        }

        if (evt.ctrlKey || evt.metaKey) {
          selection.collection.add(elementView.model)
        }
      })

      console.log('Selection initialized')
    } catch (error) {
      console.error('Selection 초기화 오류:', error)
    }
  }

  /**
   * Selection 변경 시 호출
   */
  const onSelectionChange = () => {
    if (!paper || !selection || !joint) return

    paper.removeTools()
    joint.ui.FreeTransform?.clear(paper)

    const selectedCells = selection.collection.toArray()

    if (selectedCells.length === 1) {
      const cell = selectedCells[0]
      const cellView = paper.findViewByModel(cell)

      if (cell.isElement()) {
        // Element 선택 시 FreeTransform 표시
        try {
          const freeTransform = new joint.ui.FreeTransform({
            cellView: cellView,
            allowRotation: true,
            preserveAspectRatio: false,
            allowOrthogonalResize: true,
            useBordersToResize: true
          })
          freeTransform.render()
        } catch (error) {
          console.warn('FreeTransform 생성 실패:', error)
        }
      } else if (cell.isLink()) {
        // Link 선택 시 도구 표시
        addLinkTools(cellView)
      }
    }
  }

  /**
   * Link 도구 추가
   */
  const addLinkTools = (linkView: any) => {
    if (!joint) return

    try {
      const tools = new joint.dia.ToolsView({
        tools: [
          new joint.linkTools.Vertices(),
          new joint.linkTools.SourceAnchor(),
          new joint.linkTools.TargetAnchor(),
          new joint.linkTools.SourceArrowhead(),
          new joint.linkTools.TargetArrowhead(),
          new joint.linkTools.Boundary({ padding: 15 }),
          new joint.linkTools.Remove({ offset: -20, distance: 40 })
        ]
      })

      linkView.addTools(tools)
    } catch (error) {
      console.warn('Link 도구 추가 실패:', error)
    }
  }

  /**
   * Link hover 이벤트 초기화
   */
  const initializeLinkTools = () => {
    if (!paper || !joint) return

    try {
      // Link에 마우스 올렸을 때 도구 표시
      paper.on('link:mouseenter', (linkView: any) => {
        if (linkView.hasTools()) return

        const tools = new joint.dia.ToolsView({
          name: 'link-hover',
          tools: [
            new joint.linkTools.Vertices({ vertexAdding: false }),
            new joint.linkTools.SourceArrowhead(),
            new joint.linkTools.TargetArrowhead()
          ]
        })

        linkView.addTools(tools)
      })

      // Link에서 마우스 벗어났을 때 hover 도구 제거
      paper.on('link:mouseleave', (linkView: any) => {
        if (linkView.hasTools('link-hover')) {
          linkView.removeTools()
        }
      })

      console.log('Link tools initialized')
    } catch (error) {
      console.error('Link 도구 초기화 오류:', error)
    }
  }

  /**
   * 키보드 단축키 초기화
   */
  const initializeKeyboardShortcuts = () => {
    if (!graph || !clipboard || !selection || !commandManager) return

    const handleKeyDown = (evt: KeyboardEvent) => {
      // Ctrl+C: 복사
      if ((evt.ctrlKey || evt.metaKey) && evt.key === 'c' && !evt.shiftKey) {
        const selectedCells = selection.collection.toArray()
        const copiableCells = selectedCells.filter((cell: any) => cell.get('selectable') !== false)
        if (copiableCells.length > 0) {
          clipboard.copyElements(copiableCells, graph)
          console.log('복사됨:', copiableCells.length, '개 요소')
        }
      }

      // Ctrl+V: 붙여넣기
      if ((evt.ctrlKey || evt.metaKey) && evt.key === 'v' && !evt.shiftKey) {
        if (!clipboard.isEmpty()) {
          const center = scroller.getVisibleArea().center()
          const pastedCells = clipboard.pasteCellsAtPoint(graph, center)
          selection.collection.reset(pastedCells.filter((cell: any) => cell.isElement()))
          console.log('붙여넣기됨:', pastedCells.length, '개 요소')
        }
      }

      // Delete 또는 Backspace: 삭제
      if (evt.key === 'Delete' || evt.key === 'Backspace') {
        const selectedCells = selection.collection.toArray()
        const deletableCells = selectedCells.filter((cell: any) => cell.get('selectable') !== false)
        if (deletableCells.length > 0) {
          graph.removeCells(deletableCells)
          console.log('삭제됨:', deletableCells.length, '개 요소')
        }
      }

      // Ctrl+Z: 실행 취소
      if ((evt.ctrlKey || evt.metaKey) && evt.key === 'z' && !evt.shiftKey) {
        if (commandManager.hasUndo()) {
          commandManager.undo()
          console.log('실행 취소')
        }
      }

      // Ctrl+Shift+Z 또는 Ctrl+Y: 다시 실행
      if ((evt.ctrlKey || evt.metaKey) && (evt.key === 'y' || (evt.key === 'z' && evt.shiftKey))) {
        if (commandManager.hasRedo()) {
          commandManager.redo()
          console.log('다시 실행')
        }
      }

      // Ctrl+A: 전체 선택
      if ((evt.ctrlKey || evt.metaKey) && evt.key === 'a') {
        evt.preventDefault()
        const allElements = graph.getElements().filter((el: any) => el.get('selectable') !== false)
        selection.collection.reset(allElements)
        console.log('전체 선택:', allElements.length, '개 요소')
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    console.log('Keyboard shortcuts initialized')
  }

  /**
   * 정리 함수
   */
  const cleanup = () => {
    console.log('Cleaning up circuit editor...')

    // Tooltip 정리
    if (tooltip) {
      try {
        tooltip.remove()
      } catch (error) {
        console.error('Tooltip 제거 오류:', error)
      }
    }

    // Selection 정리
    if (selection) {
      try {
        selection.remove()
      } catch (error) {
        console.error('Selection 제거 오류:', error)
      }
    }

    // Snaplines 정리
    if (snaplines) {
      try {
        snaplines.remove()
      } catch (error) {
        console.error('Snaplines 제거 오류:', error)
      }
    }

    // CommandManager 정리
    if (commandManager) {
      try {
        commandManager.reset()
      } catch (error) {
        console.error('CommandManager 정리 오류:', error)
      }
    }

    // Clipboard 정리
    if (clipboard) {
      try {
        clipboard.clear()
      } catch (error) {
        console.error('Clipboard 정리 오류:', error)
      }
    }

    // Scroller 정리
    if (scroller) {
      try {
        scroller.remove()
      } catch (error) {
        console.error('Scroller 제거 오류:', error)
      }
    }

    // Paper 정리
    if (paper) {
      try {
        paper.off()
        paper.remove()
      } catch (error) {
        console.error('Paper 제거 오류:', error)
      }
    }

    // Graph 정리
    if (graph) {
      try {
        graph.off()
        graph.clear()
      } catch (error) {
        console.error('Graph 정리 오류:', error)
      }
    }

    console.log('Cleanup completed')
  }

  /**
   * 컴포넌트 추가 (포트 포함)
   */
  const createComponentWithPorts = (_type: string, label: string, color: string, strokeColor: string) => {
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

  /**
   * 컴포넌트 추가
   */
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
      element.set('selectable', true) // 선택 가능 표시

      graph.addCell(element)
      console.log('Added component:', type, 'at', pos)

      return element
    } catch (error) {
      console.error('Error adding component:', error)
    }
  }

  /**
   * 확대
   */
  const zoomIn = () => {
    if (!scroller) return
    const currentZoom = scroller.zoom()
    const newZoom = Math.min(currentZoom * 1.2, ZOOM_SETTINGS.max)
    scroller.zoom(newZoom, { absolute: true })
    return newZoom
  }

  /**
   * 축소
   */
  const zoomOut = () => {
    if (!scroller) return
    const currentZoom = scroller.zoom()
    const newZoom = Math.max(currentZoom * 0.8, ZOOM_SETTINGS.min)
    scroller.zoom(newZoom, { absolute: true })
    return newZoom
  }

  /**
   * 줌 설정
   */
  const setZoom = (zoomPercent: number) => {
    if (!scroller) return
    const scale = zoomPercent / 100
    scroller.zoom(scale, { absolute: true })
    return scale
  }

  /**
   * 화면 맞춤
   */
  const fitToScreen = () => {
    if (!scroller) return
    scroller.zoomToFit({ useModelGeometry: true, padding: 20 })
    const zoom = scroller.zoom()
    return zoom
  }

  /**
   * 선택된 요소 삭제
   */
  const deleteSelected = () => {
    if (!graph || !selection) return

    const selectedCells = selection.collection.toArray()
    const deletableCells = selectedCells.filter((cell: any) => cell.get('selectable') !== false)

    if (deletableCells.length > 0) {
      graph.removeCells(deletableCells)
      console.log('Deleted', deletableCells.length, 'components')
    }
  }

  /**
   * 선택 해제
   */
  const clearSelection = () => {
    if (!selection) return
    selection.collection.reset([])
  }

  /**
   * 그리드 토글 (KitchenSink 방식)
   */
  const toggleGrid = () => {
    if (!paper) return
    const currentGrid = paper.options.drawGrid
    // KitchenSink와 동일하게 boolean 값만 사용
    paper.setGrid(!currentGrid)
    console.log(currentGrid ? '그리드 숨김' : '그리드 표시')
  }

  /**
   * 이벤트 핸들러 설정 (레거시 호환용)
   */
  const setupEventHandlers = () => {
    console.log('Event handlers already set up in initialize()')
  }

  /**
   * 페이지 크기 변경
   */
  const updatePageSize = async (pageSize: string, projectInfo?: any) => {
    if (!joint || !graph || !paper) return

    currentPageSize = pageSize
    const { createTemplateFromXML } = useDrawingTemplate()
    await createTemplateFromXML(joint, graph, pageSize, projectInfo)

    // Paper 크기 변경
    const sizes = {
      A4: { width: 1123, height: 794 },
      A3: { width: 1587, height: 1123 },
      A2: { width: 2245, height: 1587 },
      A1: { width: 3174, height: 2245 }
    } as const

    const sizeInfo = sizes[pageSize as keyof typeof sizes] || sizes.A3
    paper.setDimensions(sizeInfo.width, sizeInfo.height)

    if (scroller) {
      scroller.options.baseWidth = sizeInfo.width
      scroller.options.baseHeight = sizeInfo.height
      scroller.adjustPaper()
    }
  }

  /**
   * 프로젝트 정보 업데이트
   */
  const updateProjectInfo = async (projectInfo: any) => {
    if (!joint || !graph) return

    const { createTemplateFromXML } = useDrawingTemplate()
    await createTemplateFromXML(joint, graph, currentPageSize, projectInfo)
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
    clearSelection,
    setupEventHandlers,
    toggleGrid,
    updatePageSize,
    updateProjectInfo,
    // Navigator용 getter 함수들
    getScroller: () => scroller,
    getGraph: () => graph,
    getPaper: () => paper,
    getJoint: () => joint
  }
}
