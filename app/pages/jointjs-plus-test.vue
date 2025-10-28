<template>
  <div class="h-screen w-screen flex flex-col p-4 bg-gray-100">
    <div class="mb-4 bg-white p-4 rounded shadow">
      <h1 class="text-2xl font-bold mb-2">JointJS+ 테스트 페이지</h1>
      <p class="text-gray-600">JointJS+ 프리미엄 기능 테스트 (Navigator 미니맵 포함)</p>
      <div class="mt-4 flex gap-2 flex-wrap">
        <button
          @click="addBasicShape"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          기본 도형 추가
        </button>
        <button
          @click="addPlusShape"
          class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Plus 전용 도형 추가
        </button>
        <button
          @click="enableSelection"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          선택 도구 활성화
        </button>
        <button
          @click="fitToScreen"
          class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
        >
          화면 맞춤
        </button>
        <button
          @click="clearAll"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          전체 삭제
        </button>
      </div>
      <div class="mt-4 grid grid-cols-2 gap-4 text-xs text-gray-600">
        <div>
          <p class="font-semibold mb-1">시스템 정보</p>
          <p>버전: {{ packageVersion }}</p>
          <p>상태: {{ initStatus }}</p>
          <p>미니맵: {{ minimapStatus }}</p>
        </div>
        <div>
          <p class="font-semibold mb-1">키보드 단축키</p>
          <p>• Ctrl+C/V: 복사/붙여넣기</p>
          <p>• Ctrl+Z/Y: 실행취소/다시실행</p>
          <p>• Delete: 삭제 | Ctrl+A: 전체선택</p>
          <p>• Shift+드래그: 영역선택</p>
        </div>
      </div>
    </div>

    <div class="flex-1 flex gap-4 overflow-hidden">
      <!-- 메인 캔버스 -->
      <div class="flex-1 bg-white rounded shadow overflow-hidden relative">
        <div ref="paperContainer" class="w-full h-full"></div>
      </div>

      <!-- Navigator 도구 및 미니맵 영역 -->
      <div class="navigator-panel bg-white rounded shadow overflow-hidden flex flex-col" style="width: 340px;">
        <!-- Navigator 툴바 -->
        <div ref="navigatorToolbar" class="navigator-toolbar border-b"></div>

        <!-- Navigator 미니맵 -->
        <div ref="navigatorContainer" class="flex-1 relative bg-gray-50 p-4"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const paperContainer = ref<HTMLDivElement | null>(null)
const navigatorContainer = ref<HTMLDivElement | null>(null)
const navigatorToolbar = ref<HTMLDivElement | null>(null)
const packageVersion = ref('확인 중...')
const initStatus = ref('초기화 중...')
const minimapStatus = ref('비활성화')

// JointJS+ 관련 변수들
let graph: any = null
let paper: any = null
let scroller: any = null
let navigator: any = null
let toolbar: any = null
let selection: any = null
let commandManager: any = null
let clipboard: any = null
let snaplines: any = null
let tooltip: any = null
let jointPlusModule: any = null
let jointCoreModule: any = null

const ZOOM_SETTINGS = {
  min: 0.2,
  max: 2
}

const GRID_SIZE = 10
const DEFAULT_PAPER_SIZE = { width: 1000, height: 1000 }

onMounted(async () => {
  console.log('JointJS+ 테스트 페이지 마운트됨')

  if (!paperContainer.value) {
    console.error('Paper 컨테이너를 찾을 수 없습니다')
    initStatus.value = '오류: 컨테이너 없음'
    return
  }

  try {
    // JointJS+ 와 Core 모듈 import
    console.log('@joint/plus import 시도 중...')
    jointPlusModule = await import('@joint/plus')
    console.log('@joint/plus 로드 성공')

    console.log('@joint/core import 시도 중...')
    jointCoreModule = await import('@joint/core')
    console.log('@joint/core 로드 성공')

    // 버전 정보 설정
    packageVersion.value = '@joint/plus v4.1.1-trial'

    // 1. Graph 생성
    graph = new jointCoreModule.dia.Graph({}, {
      cellNamespace: {
        ...jointCoreModule.shapes,
        ...jointPlusModule.shapes
      }
    })
    console.log('Graph 생성 완료')

    // 2. CommandManager 생성 (실행 취소/다시 실행)
    commandManager = new jointCoreModule.dia.CommandManager({
      graph: graph
    })
    console.log('CommandManager 생성 완료')

    // 3. Paper 생성
    paper = new jointCoreModule.dia.Paper({
      model: graph,
      width: DEFAULT_PAPER_SIZE.width,
      height: DEFAULT_PAPER_SIZE.height,
      gridSize: GRID_SIZE,
      drawGrid: {
        name: 'dot',
        args: { color: '#e5e7eb', thickness: 1 }
      },
      background: {
        color: '#ffffff'
      },
      cellViewNamespace: {
        ...jointCoreModule.shapes,
        ...jointPlusModule.shapes
      },
      interactive: { linkMove: false },
      async: true,
      sorting: jointCoreModule.dia.Paper.sorting.APPROX,
      defaultLink: new jointCoreModule.shapes.standard.Link({
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
      })
    })
    console.log('Paper 생성 완료')

    // 4. Snaplines 생성 (요소 정렬 가이드)
    snaplines = new jointPlusModule.ui.Snaplines({
      paper: paper
    })
    console.log('Snaplines 생성 완료')

    // 5. PaperScroller 생성 (스크롤 및 줌 기능)
    scroller = new jointPlusModule.ui.PaperScroller({
      paper: paper,
      autoResizePaper: true,
      scrollWhileDragging: true,
      borderless: false,
      cursor: 'grab',
      baseWidth: DEFAULT_PAPER_SIZE.width,
      baseHeight: DEFAULT_PAPER_SIZE.height,
      contentOptions: {
        padding: 100,
        allowNewOrigin: 'any',
        useModelGeometry: true
      }
    })

    paperContainer.value.appendChild(scroller.el)
    scroller.render().center()
    console.log('PaperScroller 생성 완료')

    // 6. Paper 이벤트 설정 (팬 & 핀치 줌)
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

    // 7. Clipboard 생성 (복사/붙여넣기)
    clipboard = new jointPlusModule.ui.Clipboard()
    console.log('Clipboard 생성 완료')

    // 8. Selection 초기화 (개선된 버전)
    initializeSelection()

    // 9. Tooltip 생성
    tooltip = new jointPlusModule.ui.Tooltip({
      rootTarget: document.body,
      target: '[data-tooltip]',
      direction: jointPlusModule.ui.Tooltip.TooltipArrowPosition.Auto,
      padding: 12,
      animation: {
        delay: '250ms'
      }
    })
    console.log('Tooltip 생성 완료')

    // 10. 초기 샘플 도형 추가
    const rect = new jointCoreModule.shapes.standard.Rectangle({
      position: { x: 100, y: 100 },
      size: { width: 120, height: 80 },
      attrs: {
        label: {
          text: 'JointJS Core',
          fill: '#1f2937'
        },
        body: {
          fill: '#dbeafe',
          stroke: '#3b82f6',
          strokeWidth: 2
        }
      }
    })

    const circle = new jointCoreModule.shapes.standard.Circle({
      position: { x: 300, y: 150 },
      size: { width: 80, height: 80 },
      attrs: {
        label: {
          text: 'Circle',
          fill: '#1f2937'
        },
        body: {
          fill: '#dcfce7',
          stroke: '#22c55e',
          strokeWidth: 2
        }
      }
    })

    graph.addCells([rect, circle])

    // 11. Link 이벤트 설정 (hover 시 도구 표시)
    initializeLinkTools()

    // 12. 키보드 단축키 초기화
    initializeKeyboardShortcuts()

    // 13. Navigator 생성
    createNavigator()

    initStatus.value = '초기화 완료 (고급 기능 포함)'
    console.log('JointJS+ 초기화 성공 - 모든 고급 기능 활성화됨')
    console.log('지원 기능: Snaplines, Selection, Clipboard, CommandManager, FreeTransform, Navigator, Keyboard Shortcuts')

  } catch (error) {
    console.error('JointJS+ 초기화 실패:', error)
    initStatus.value = `오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`
  }
})

// Selection 초기화 함수 (KitchenSink 참고)
const initializeSelection = () => {
  if (!scroller || !paper || !graph || !jointPlusModule) {
    console.error('Selection 초기화 실패: 필요한 요소들이 초기화되지 않음')
    return
  }

  try {
    // Selection 생성 (개선된 버전)
    selection = new jointPlusModule.ui.Selection({
      paper: scroller,
      useModelGeometry: true,
      translateConnectedLinks: jointPlusModule.ui.Selection.ConnectedLinksTranslation.SUBGRAPH,
      handles: [
        {
          name: 'remove',
          position: 'nw',
          events: { pointerdown: 'removeElements' },
          attrs: {
            '.handle': {
              'data-tooltip': '삭제',
              'data-tooltip-position': 'left'
            }
          }
        },
        {
          name: 'rotate',
          position: 'sw',
          events: { pointerdown: 'startRotating', pointermove: 'doRotate', pointerup: 'stopBatch' },
          attrs: {
            '.handle': {
              'data-tooltip': '회전',
              'data-tooltip-position': 'left'
            }
          }
        },
        {
          name: 'resize',
          position: 'se',
          events: { pointerdown: 'startResizing', pointermove: 'doResize', pointerup: 'stopBatch' },
          attrs: {
            '.handle': {
              'data-tooltip': '크기 조절',
              'data-tooltip-position': 'right'
            }
          }
        }
      ]
    })

    // Selection 이벤트
    selection.on('removeElements', () => {
      const selectedCells = selection.collection.toArray()
      graph.removeCells(selectedCells)
    })

    // Paper blank 클릭 시 선택 해제 또는 팬 시작
    paper.on('blank:pointerdown', (evt: any) => {
      if (evt.shiftKey) {
        selection.startSelecting(evt)
      } else {
        selection.collection.reset([])
        scroller.startPanning(evt)
        paper.removeTools()
      }
    })

    // Element 클릭 시 선택
    paper.on('element:pointerdown', (elementView: any, evt: any) => {
      if (evt.shiftKey) {
        elementView.preventDefaultInteraction(evt)
        selection.startSelecting(evt)
      } else if (evt.ctrlKey || evt.metaKey) {
        selection.collection.add(elementView.model)
      }
    })

    // Cell 클릭 시 선택
    paper.on('cell:pointerup', (cellView: any) => {
      const cell = cellView.model
      if (!selection.collection.includes(cell)) {
        selection.collection.reset([cell])
      }
    })

    // Selection 변경 시 도구 업데이트
    selection.collection.on('reset add remove', () => {
      onSelectionChange()
    })

    // Graph에서 삭제된 경우 selection에서도 제거
    graph.on('remove', (cell: any) => {
      if (selection.collection.has(cell)) {
        selection.collection.reset(selection.collection.models.filter((c: any) => c !== cell))
      }
    })

    console.log('Selection 초기화 완료')
  } catch (error) {
    console.error('Selection 초기화 오류:', error)
  }
}

// Selection 변경 시 호출
const onSelectionChange = () => {
  if (!paper || !selection || !jointPlusModule) return

  paper.removeTools()
  jointPlusModule.ui.FreeTransform?.clear(paper)

  const selectedCells = selection.collection.toArray()

  if (selectedCells.length === 1) {
    const cell = selectedCells[0]
    const cellView = paper.findViewByModel(cell)

    if (cell.isElement()) {
      // Element 선택 시 FreeTransform 표시
      try {
        const freeTransform = new jointPlusModule.ui.FreeTransform({
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

// Link 도구 추가
const addLinkTools = (linkView: any) => {
  if (!jointCoreModule) return

  try {
    const tools = new jointCoreModule.dia.ToolsView({
      tools: [
        new jointCoreModule.linkTools.Vertices(),
        new jointCoreModule.linkTools.SourceAnchor(),
        new jointCoreModule.linkTools.TargetAnchor(),
        new jointCoreModule.linkTools.SourceArrowhead(),
        new jointCoreModule.linkTools.TargetArrowhead(),
        new jointCoreModule.linkTools.Boundary({ padding: 15 }),
        new jointCoreModule.linkTools.Remove({ offset: -20, distance: 40 })
      ]
    })

    linkView.addTools(tools)
  } catch (error) {
    console.warn('Link 도구 추가 실패:', error)
  }
}

// Link hover 이벤트 초기화
const initializeLinkTools = () => {
  if (!paper || !jointCoreModule) return

  try {
    // Link에 마우스 올렸을 때 도구 표시
    paper.on('link:mouseenter', (linkView: any) => {
      if (linkView.hasTools()) return

      const tools = new jointCoreModule.dia.ToolsView({
        name: 'link-hover',
        tools: [
          new jointCoreModule.linkTools.Vertices({ vertexAdding: false }),
          new jointCoreModule.linkTools.SourceArrowhead(),
          new jointCoreModule.linkTools.TargetArrowhead()
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

    console.log('Link 도구 초기화 완료')
  } catch (error) {
    console.error('Link 도구 초기화 오류:', error)
  }
}

// Navigator 생성 함수 (KitchenSink의 NavigatorService 참고)
const createNavigator = () => {
  if (!navigatorContainer.value || !navigatorToolbar.value || !scroller || !jointPlusModule) {
    console.error('Navigator 생성 실패: 필요한 요소들이 초기화되지 않음')
    return
  }

  try {
    console.log('Navigator 생성 시작...')

    // Toolbar 생성
    toolbar = new jointPlusModule.ui.Toolbar({
      autoToggle: false,
      references: {
        paperScroller: scroller
      },
      tools: [
        {
          type: 'button',
          name: 'fit-to-screen',
          text: '화면 맞춤',
          attrs: {
            button: {
              'data-tooltip': 'Fit to screen',
              'data-tooltip-position': 'bottom'
            }
          }
        },
        {
          type: 'zoom-slider',
          name: 'zoom-slider',
          min: ZOOM_SETTINGS.min * 100,
          max: ZOOM_SETTINGS.max * 100,
          step: 10,
          value: 100,
          attrs: {
            input: {
              'data-tooltip': 'Zoom',
              'data-tooltip-position': 'bottom'
            }
          }
        },
        { type: 'separator' },
        {
          type: 'button',
          name: 'toggle-minimap',
          text: '미니맵',
          attrs: {
            button: {
              'data-tooltip': 'Toggle minimap',
              'data-tooltip-position': 'bottom'
            }
          }
        }
      ]
    })

    toolbar.render()
    navigatorToolbar.value.appendChild(toolbar.el)

    // Toolbar 이벤트 리스너
    toolbar.on('fit-to-screen:pointerclick', () => {
      scroller.zoomToFit({ useModelGeometry: true, padding: 20 })
    })

    toolbar.on('toggle-minimap:pointerclick', () => {
      toggleNavigatorVisibility()
    })

    console.log('Toolbar 생성 완료')

    // Navigator (미니맵) 생성
    navigator = new jointPlusModule.ui.Navigator({
      paperScroller: scroller,
      width: 300,
      height: 200,
      padding: 10,
      zoom: false,
      useContentBBox: true,
      paperOptions: {
        async: true,
        sorting: jointCoreModule.dia.Paper.sorting.APPROX,
        cellViewNamespace: {},
        // 링크는 미니맵에 표시하지 않음
        viewport: (view: any) => !view.model.isLink(),
        background: {
          color: '#f8f9fa'
        },
        interactive: false
      }
    })

    navigatorContainer.value.appendChild(navigator.el)
    navigator.render()

    console.log('Navigator 생성 완료')
    minimapStatus.value = 'Navigator 활성화'

  } catch (error) {
    console.error('Navigator 생성 오류:', error)
    minimapStatus.value = '오류'
  }
}

// Navigator 표시/숨김 토글
const toggleNavigatorVisibility = () => {
  if (!navigator) return

  const isHidden = navigator.el.classList.contains('hidden')

  if (isHidden) {
    navigator.el.classList.remove('hidden')
    minimapStatus.value = 'Navigator 활성화'
  } else {
    navigator.el.classList.add('hidden')
    minimapStatus.value = 'Navigator 숨김'
  }
}

// 화면 맞춤 함수
const fitToScreen = () => {
  if (!scroller) {
    console.error('Scroller가 초기화되지 않음')
    return
  }

  try {
    scroller.zoomToFit({ useModelGeometry: true, padding: 20 })
    console.log('화면 맞춤 완료')
  } catch (error) {
    console.error('화면 맞춤 실패:', error)
  }
}

const addBasicShape = () => {
  if (!graph || !jointCoreModule) {
    console.error('Graph가 초기화되지 않음')
    return
  }

  try {
    const circle = new jointCoreModule.shapes.standard.Circle({
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100
      },
      size: { width: 80, height: 80 },
      attrs: {
        label: {
          text: 'Core 원',
          fill: '#1f2937'
        },
        body: {
          fill: '#dcfce7',
          stroke: '#22c55e',
          strokeWidth: 2
        }
      }
    })

    graph.addCell(circle)
    console.log('기본 도형 추가됨')

  } catch (error) {
    console.error('기본 도형 추가 실패:', error)
  }
}

const addPlusShape = () => {
  if (!graph || !jointPlusModule || !jointCoreModule) {
    console.error('Graph 또는 JointJS+ 모듈이 초기화되지 않음')
    return
  }

  try {
    // JointJS+의 고급 도형 사용 시도
    if (jointPlusModule.shapes && jointPlusModule.shapes.standard && jointPlusModule.shapes.standard.Polygon) {
      const polygon = new jointPlusModule.shapes.standard.Polygon({
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100
        },
        size: { width: 100, height: 100 },
        attrs: {
          label: {
            text: 'Polygon',
            fill: '#1f2937'
          },
          body: {
            fill: '#fce7f3',
            stroke: '#ec4899',
            strokeWidth: 2,
            refPoints: '0,10 10,0 20,10 15,20 5,20'
          }
        }
      })

      graph.addCell(polygon)
      console.log('JointJS+ Polygon 추가됨')
    } else {
      // 대체 도형 추가
      const customRect = new jointCoreModule.shapes.standard.Rectangle({
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100
        },
        size: { width: 120, height: 80 },
        attrs: {
          label: {
            text: 'Plus 기능',
            fill: '#1f2937'
          },
          body: {
            fill: '#fce7f3',
            stroke: '#ec4899',
            strokeWidth: 2
          }
        }
      })

      graph.addCell(customRect)
      console.log('Plus 스타일 도형 추가됨')
    }

  } catch (error) {
    console.error('Plus 도형 추가 실패:', error)
  }
}

// 키보드 단축키 초기화
const initializeKeyboardShortcuts = () => {
  if (!graph || !clipboard || !selection || !commandManager) return

  try {
    // Ctrl+C: 복사
    document.addEventListener('keydown', (evt: KeyboardEvent) => {
      if ((evt.ctrlKey || evt.metaKey) && evt.key === 'c' && !evt.shiftKey) {
        const selectedCells = selection.collection.toArray()
        if (selectedCells.length > 0) {
          clipboard.copyElements(selectedCells, graph)
          console.log('복사됨:', selectedCells.length, '개 요소')
        }
      }
    })

    // Ctrl+V: 붙여넣기
    document.addEventListener('keydown', (evt: KeyboardEvent) => {
      if ((evt.ctrlKey || evt.metaKey) && evt.key === 'v' && !evt.shiftKey) {
        if (!clipboard.isEmpty()) {
          const center = { x: 100, y: 100 }
          const pastedCells = clipboard.pasteCellsAtPoint(graph, center)
          selection.collection.reset(pastedCells.filter((cell: any) => cell.isElement()))
          console.log('붙여넣기됨:', pastedCells.length, '개 요소')
        }
      }
    })

    // Delete 또는 Backspace: 삭제
    document.addEventListener('keydown', (evt: KeyboardEvent) => {
      if (evt.key === 'Delete' || evt.key === 'Backspace') {
        const selectedCells = selection.collection.toArray()
        if (selectedCells.length > 0) {
          graph.removeCells(selectedCells)
          console.log('삭제됨:', selectedCells.length, '개 요소')
        }
      }
    })

    // Ctrl+Z: 실행 취소
    document.addEventListener('keydown', (evt: KeyboardEvent) => {
      if ((evt.ctrlKey || evt.metaKey) && evt.key === 'z' && !evt.shiftKey) {
        if (commandManager.hasUndo()) {
          commandManager.undo()
          console.log('실행 취소')
        }
      }
    })

    // Ctrl+Shift+Z 또는 Ctrl+Y: 다시 실행
    document.addEventListener('keydown', (evt: KeyboardEvent) => {
      if ((evt.ctrlKey || evt.metaKey) && (evt.key === 'y' || (evt.key === 'z' && evt.shiftKey))) {
        if (commandManager.hasRedo()) {
          commandManager.redo()
          console.log('다시 실행')
        }
      }
    })

    // Ctrl+A: 전체 선택
    document.addEventListener('keydown', (evt: KeyboardEvent) => {
      if ((evt.ctrlKey || evt.metaKey) && evt.key === 'a') {
        evt.preventDefault()
        const allElements = graph.getElements()
        selection.collection.reset(allElements)
        console.log('전체 선택:', allElements.length, '개 요소')
      }
    })

    console.log('키보드 단축키 초기화 완료')
  } catch (error) {
    console.error('키보드 단축키 초기화 오류:', error)
  }
}

const enableSelection = () => {
  console.log('Selection은 이미 초기화 시 활성화되었습니다.')
  console.log('사용 방법:')
  console.log('- Shift + 드래그: 영역 선택')
  console.log('- Ctrl/Cmd + 클릭: 다중 선택')
  console.log('- 요소 클릭: 단일 선택 (크기 조절 핸들 표시)')
}

const clearAll = () => {
  if (!graph) {
    console.error('Graph가 초기화되지 않음')
    return
  }

  try {
    graph.clear()
    console.log('모든 도형이 삭제됨')
  } catch (error) {
    console.error('삭제 실패:', error)
  }
}

onUnmounted(() => {
  console.log('컴포넌트 언마운트 시작 - 리소스 정리 중...')

  // 1. Tooltip 정리
  if (tooltip) {
    try {
      tooltip.remove()
      console.log('Tooltip 정리 완료')
    } catch (error) {
      console.error('Tooltip 제거 오류:', error)
    }
  }

  // 2. Navigator 정리
  if (navigator) {
    try {
      navigator.remove()
      console.log('Navigator 정리 완료')
    } catch (error) {
      console.error('Navigator 제거 오류:', error)
    }
  }

  // 3. Toolbar 정리
  if (toolbar) {
    try {
      toolbar.remove()
      console.log('Toolbar 정리 완료')
    } catch (error) {
      console.error('Toolbar 제거 오류:', error)
    }
  }

  // 4. Selection 정리
  if (selection) {
    try {
      selection.remove()
      console.log('Selection 정리 완료')
    } catch (error) {
      console.error('Selection 제거 오류:', error)
    }
  }

  // 5. Snaplines 정리
  if (snaplines) {
    try {
      snaplines.remove()
      console.log('Snaplines 정리 완료')
    } catch (error) {
      console.error('Snaplines 제거 오류:', error)
    }
  }

  // 6. CommandManager 정리
  if (commandManager) {
    try {
      commandManager.reset()
      console.log('CommandManager 정리 완료')
    } catch (error) {
      console.error('CommandManager 정리 오류:', error)
    }
  }

  // 7. Clipboard 정리
  if (clipboard) {
    try {
      clipboard.clear()
      console.log('Clipboard 정리 완료')
    } catch (error) {
      console.error('Clipboard 정리 오류:', error)
    }
  }

  // 8. Scroller 정리
  if (scroller) {
    try {
      scroller.remove()
      console.log('Scroller 정리 완료')
    } catch (error) {
      console.error('Scroller 제거 오류:', error)
    }
  }

  // 9. Paper 정리 (이벤트 리스너 제거)
  if (paper) {
    try {
      paper.off()
      paper.remove()
      console.log('Paper 정리 완료')
    } catch (error) {
      console.error('Paper 제거 오류:', error)
    }
  }

  // 10. Graph 정리 (이벤트 리스너 제거)
  if (graph) {
    try {
      graph.off()
      graph.clear()
      console.log('Graph 정리 완료')
    } catch (error) {
      console.error('Graph 정리 오류:', error)
    }
  }

  console.log('모든 리소스 정리 완료')
})
</script>

<style scoped>
/* JointJS+ 전용 스타일 */
:deep(.joint-paper-scroller) {
  position: relative;
  overflow: auto;
}

:deep(.joint-paper) {
  border: none;
}

:deep(.joint-element) {
  cursor: pointer;
}

:deep(.joint-element:hover) {
  filter: brightness(1.05);
}

/* Navigator 패널 스타일 */
.navigator-panel {
  min-width: 340px;
  max-width: 340px;
}

/* Navigator 툴바 스타일 */
.navigator-toolbar {
  padding: 8px;
  background: #f8f9fa;
}

:deep(.joint-toolbar) {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

:deep(.joint-widget) {
  margin: 0;
}

:deep(.joint-widget.joint-button) {
  padding: 6px 12px;
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

:deep(.joint-widget.joint-button:hover) {
  background: #e9ecef;
  border-color: #adb5bd;
}

:deep(.joint-widget.joint-button:active) {
  background: #dee2e6;
}

:deep(.joint-widget.joint-zoom-slider) {
  flex: 1;
  min-width: 100px;
}

:deep(.joint-widget.joint-separator) {
  width: 1px;
  height: 20px;
  background: #dee2e6;
  margin: 0 4px;
}

/* Navigator (미니맵) 스타일 */
:deep(.joint-navigator) {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: #ffffff;
  overflow: hidden;
  transition: opacity 0.3s ease;
}

:deep(.joint-navigator.hidden) {
  opacity: 0;
  pointer-events: none;
  height: 0;
  overflow: hidden;
}

:deep(.joint-navigator .joint-paper) {
  background: #f8f9fa;
}

/* Navigator 뷰포트 (현재 보이는 영역 표시) */
:deep(.joint-navigator-viewport) {
  border: 2px solid #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  cursor: move;
}

:deep(.joint-navigator-viewport:hover) {
  background: rgba(59, 130, 246, 0.15);
}

/* Selection 도구 스타일 */
:deep(.joint-selection) {
  border: 2px dashed #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

:deep(.joint-selection-box) {
  border: 1px solid #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

:deep(.joint-selection .handle) {
  fill: #3b82f6;
  stroke: #ffffff;
  stroke-width: 2;
  cursor: pointer;
}

:deep(.joint-selection .handle:hover) {
  fill: #2563eb;
}

/* FreeTransform 스타일 */
:deep(.joint-free-transform) {
  border: 1px solid #3b82f6;
}

:deep(.joint-free-transform .resize) {
  fill: #3b82f6;
  stroke: #ffffff;
  stroke-width: 2;
  cursor: nwse-resize;
}

:deep(.joint-free-transform .resize:hover) {
  fill: #2563eb;
}

:deep(.joint-free-transform .rotate) {
  fill: #10b981;
  stroke: #ffffff;
  stroke-width: 2;
  cursor: crosshair;
}

:deep(.joint-free-transform .rotate:hover) {
  fill: #059669;
}

/* Snaplines 스타일 */
:deep(.joint-snapline) {
  stroke: #ec4899;
  stroke-width: 1;
  stroke-dasharray: 5, 5;
  pointer-events: none;
}

:deep(.joint-snapline.horizontal) {
  stroke: #ec4899;
}

:deep(.joint-snapline.vertical) {
  stroke: #8b5cf6;
}

/* Link 도구 스타일 */
:deep(.joint-link-tools) {
  opacity: 0;
  transition: opacity 0.2s;
}

:deep(.joint-link:hover .joint-link-tools) {
  opacity: 1;
}

:deep(.link-tool) {
  fill: #3b82f6;
  stroke: #ffffff;
  stroke-width: 2;
  cursor: pointer;
}

:deep(.link-tool:hover) {
  fill: #2563eb;
}

:deep(.link-tool.tool-remove) {
  fill: #ef4444;
}

:deep(.link-tool.tool-remove:hover) {
  fill: #dc2626;
}

/* Tooltip 스타일 */
:deep([data-tooltip]) {
  position: relative;
}

:deep([data-tooltip]:hover::after) {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  white-space: nowrap;
  border-radius: 4px;
  margin-bottom: 4px;
  z-index: 1000;
}
</style>