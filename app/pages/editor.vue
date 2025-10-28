<template>
  <div class="h-screen flex flex-col bg-gray-900">
    <!-- Menu Bar & Toolbar -->
    <div>
      <EditorMenuBar />
      <EditorToolbar
        @delete="deleteSelected"
        @zoom-in="zoomIn"
        @zoom-out="zoomOut"
        @fit-to-screen="fitToScreen"
        @toggle-grid="toggleGrid"
        @open-library="showComponentLibrary = true"
        @open-project-settings="showProjectSettings = true"
        @toggle-left-panel="toggleLeftPanel"
        @toggle-right-panel="toggleRightPanel"
        @simulate="runSimulation"
      />
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar - Project Explorer -->
      <div class="flex">
        <div 
          :style="{ width: leftPanelVisible ? leftPanelWidth + 'px' : leftPanelCollapsedWidth + 'px' }" 
          class="bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300"
        >
          <!-- Collapsed state -->
          <div v-if="!leftPanelVisible" class="h-full flex flex-col items-center py-2">
            <button
              @click="toggleLeftPanel"
              class="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
              title="프로젝트 탐색기 펼치기"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <!-- Expanded state -->
          <div v-else class="h-full flex flex-col">
            <!-- 프로젝트 탐색기 섹션 -->
            <div class="flex-1 flex flex-col min-h-0">
              <div class="px-3 py-2 bg-gray-750 border-b border-gray-700 flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-300">프로젝트 탐색기</span>
                <button
                  @click="toggleLeftPanel"
                  class="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
                  title="프로젝트 탐색기 숨기기"
                >
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              <div class="flex-1 overflow-y-auto">
                <ProjectExplorer
                  :project-name="projectName"
                  @select-file="handleFileSelect"
                />
              </div>
            </div>

            <!-- 수평 구분선 (리사이저) -->
            <div
              @mousedown="startResizeNavigator"
              class="h-1 bg-gray-600 hover:bg-blue-500 cursor-row-resize transition-colors"
              :class="{ 'bg-blue-500': isResizingNavigator }"
            ></div>

            <!-- 화면 내비게이터 섹션 -->
            <div
              :style="{ height: navigatorHeight + 'px' }"
              class="flex flex-col border-t border-gray-700 bg-gray-750"
            >
              <div class="px-3 py-2 bg-gray-750 border-b border-gray-700 flex items-center justify-between">
                <span class="text-xs font-semibold text-gray-300">화면 내비게이터</span>
                <div class="flex gap-1">
                  <button
                    @click="toggleNavigatorVisibility"
                    class="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
                    :title="navigatorVisible ? '미니맵 숨기기' : '미니맵 표시'"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="navigatorVisible" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    @click="fitNavigatorToScreen"
                    class="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
                    title="화면 맞춤"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </button>
                </div>
              </div>
              <div
                ref="navigatorContainerRef"
                class="flex-1 bg-gray-800 p-2 overflow-hidden"
                :class="{ 'opacity-50': !navigatorVisible }"
              ></div>
            </div>
          </div>
        </div>
        <!-- Left Resizer -->
        <div
          v-if="leftPanelVisible"
          @mousedown="startResizeLeft"
          class="w-1 bg-gray-600 hover:bg-blue-500 cursor-col-resize transition-colors"
          :class="{ 'bg-blue-500': isResizingLeft }"
        ></div>
      </div>

      <!-- Center - Canvas and Symbols -->
      <div class="flex-1 flex flex-col bg-gray-850">
        <!-- Symbol Library Toolbar -->
        <SymbolLibraryToolbar
          @change-standard="handleStandardChange"
          @change-page-size="handlePageSizeChange"
        />

        <!-- Component Palette -->
        <ComponentPalette @add-component="addComponent" />

        <!-- Canvas Area -->
        <CircuitCanvas
          ref="canvasComponent"
          @initialized="handleCanvasInitialized"
        />

        <!-- Status Bar -->
        <StatusBar
          :coordinates="coordinates"
          :zoom-level="zoomLevel"
          :grid-size="gridSize"
          :component-count="componentCount"
          :connection-count="connectionCount"
        />
      </div>

      <!-- Right Sidebar - Properties -->
      <div class="flex">
        <!-- Right Resizer -->
        <div
          v-if="rightPanelVisible"
          @mousedown="startResizeRight"
          class="w-1 bg-gray-600 hover:bg-blue-500 cursor-col-resize transition-colors"
          :class="{ 'bg-blue-500': isResizingRight }"
        ></div>
        <div 
          :style="{ width: rightPanelVisible ? rightPanelWidth + 'px' : rightPanelCollapsedWidth + 'px' }" 
          class="bg-gray-800 border-l border-gray-700 transition-all duration-300"
        >
          <!-- Collapsed state -->
          <div v-if="!rightPanelVisible" class="h-full flex flex-col items-center py-2">
            <button
              @click="toggleRightPanel"
              class="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
              title="속성 패널 펼치기"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          <!-- Expanded state -->
          <div v-else class="h-full flex flex-col">
            <div class="px-3 py-2 bg-gray-750 border-b border-gray-700 flex items-center justify-between">
              <span class="text-xs font-semibold text-gray-300">속성</span>
              <button
                @click="toggleRightPanel"
                class="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
                title="속성 패널 숨기기"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <PropertiesPanel :selected-component="selectedComponent" />
          </div>
        </div>
      </div>
    </div>

    <!-- Component Library Modal -->
    <ComponentLibraryModal
      v-model="showComponentLibrary"
      @add-component="addComponent"
    />

    <!-- Project Settings Modal -->
    <ProjectSettingsModal
      :is-open="showProjectSettings"
      :settings="projectSettings"
      @close="showProjectSettings = false"
      @save="handleSaveProjectSettings"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import EditorMenuBar from '~/components/editor/EditorMenuBar.vue'
import EditorToolbar from '~/components/editor/EditorToolbar.vue'
import ProjectExplorer from '~/components/editor/ProjectExplorer.vue'
import SymbolLibraryToolbar from '~/components/editor/SymbolLibraryToolbar.vue'
import ComponentPalette from '~/components/editor/ComponentPalette.vue'
import CircuitCanvas from '~/components/editor/CircuitCanvas.vue'
import StatusBar from '~/components/editor/StatusBar.vue'
import PropertiesPanel from '~/components/editor/PropertiesPanel.vue'
import ComponentLibraryModal from '~/components/ComponentLibraryModal.vue'
import ProjectSettingsModal from '~/components/ProjectSettingsModal.vue'

definePageMeta({
  layout: false
})

// State
const canvasComponent = ref<any>(null)
const selectedComponent = ref<any>(null)
const componentCount = ref(0)
const connectionCount = ref(0)
const showComponentLibrary = ref(false)
const showProjectSettings = ref(false)

// Resizer state
const leftPanelWidth = ref(256) // 16rem = 256px
const rightPanelWidth = ref(320) // 20rem = 320px
const isResizingLeft = ref(false)
const isResizingRight = ref(false)
const isResizingNavigator = ref(false)

// Panel visibility state
const leftPanelVisible = ref(true)
const rightPanelVisible = ref(true)
const leftPanelCollapsedWidth = 40 // collapsed width for icon bar
const rightPanelCollapsedWidth = 40

// Navigator state
const navigatorContainerRef = ref<HTMLDivElement | null>(null)
const navigatorHeight = ref(250) // 내비게이터 높이
const navigatorVisible = ref(true)
const minimapStatus = ref('대기 중')
let navigatorInstance: any = null

// Project settings
interface ProjectSettings {
  // 기본 정보
  name: string
  description: string
  projectNumber: string
  version: string
  
  // 설계자 정보
  designer: string
  company: string
  department: string
  email: string
  phone: string
  reviewer: string
  approver: string
  
  // 기술 사양
  electricalStandard: string
  mainVoltage: string
  controlVoltage: string
  frequency: string
  environment: string
  protectionClass: string
  
  // 기타 정보
  createdDate: string
  modifiedDate: string
  dueDate: string
  status: string
  progress: number
  tags: string
  notes: string
}

const projectSettings = ref<ProjectSettings>({
  // 기본 정보
  name: '새 프로젝트',
  description: '',
  projectNumber: '',
  version: '1.0.0',
  
  // 설계자 정보
  designer: '',
  company: '',
  department: '',
  email: '',
  phone: '',
  reviewer: '',
  approver: '',
  
  // 기술 사양
  electricalStandard: 'IEC',
  mainVoltage: '380',
  controlVoltage: '24',
  frequency: '60',
  environment: 'indoor',
  protectionClass: 'IP54',
  
  // 기타 정보
  createdDate: new Date().toISOString().split('T')[0],
  modifiedDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  status: 'planning',
  progress: 0,
  tags: '',
  notes: ''
})

const projectName = ref('프로젝트 A')

// Status bar state
const coordinates = ref({ x: 0, y: 0 })
const zoomLevel = ref(100)
const gridSize = ref(10)

// Use circuit editor composable
let editorComposable: any = null

onMounted(async () => {
  // Wait for canvas to be initialized
})

onUnmounted(() => {
  if (editorComposable) {
    editorComposable.cleanup()
  }
})

const handleCanvasInitialized = async (container: HTMLDivElement) => {
  console.log('Canvas initialized')
  const canvasContainer = ref(container)

  // Initialize circuit editor with project info
  const circuitEditorResult = useCircuitEditor(canvasContainer, projectSettings.value)

  // 모든 함수를 추출
  const {
    initialize,
    cleanup,
    addComponent: addComponentToCanvas,
    zoomIn: zoomInCanvas,
    zoomOut: zoomOutCanvas,
    setZoom: setZoomCanvas,
    fitToScreen: fitToScreenCanvas,
    deleteSelected: deleteSelectedCanvas,
    clearSelection: clearSelectionCanvas,
    toggleGrid: toggleGridCanvas,
    setupEventHandlers,
    updatePageSize: updatePageSizeCanvas,
    updateProjectInfo: updateProjectInfoCanvas,
    getScroller,
    getGraph,
    getPaper,
    getJoint
  } = circuitEditorResult

  // editorComposable에 모든 API 할당
  editorComposable = {
    cleanup,
    addComponent: addComponentToCanvas,
    zoomIn: zoomInCanvas,
    zoomOut: zoomOutCanvas,
    setZoom: setZoomCanvas,
    fitToScreen: fitToScreenCanvas,
    deleteSelected: deleteSelectedCanvas,
    clearSelection: clearSelectionCanvas,
    toggleGrid: toggleGridCanvas,
    updatePageSize: updatePageSizeCanvas,
    updateProjectInfo: updateProjectInfoCanvas,
    getScroller,
    getGraph,
    getPaper,
    getJoint
  }

  await initialize()
  setupEventHandlers()

  console.log('✅ Circuit editor initialized, preparing Navigator...')
  console.log('📊 Editor state after init:', {
    hasScroller: !!editorComposable.getScroller(),
    hasGraph: !!editorComposable.getGraph(),
    hasPaper: !!editorComposable.getPaper()
  })

  // Navigator 초기화 (Paper와 Scroller가 완전히 렌더링된 후)
  // nextTick을 사용하여 DOM이 완전히 업데이트된 후 실행
  await new Promise(resolve => setTimeout(resolve, 100))

  console.log('🔄 Checking if Navigator container is ready...')
  console.log('   Navigator container ref:', navigatorContainerRef.value)

  if (navigatorContainerRef.value) {
    console.log('✅ Navigator container found, initializing...')
    initializeNavigator()
  } else {
    console.warn('⚠️ Navigator container not found yet, retrying...')
    setTimeout(() => {
      console.log('⏰ Navigator initialization retry triggered')
      initializeNavigator()
    }, 500)
  }
  
  // Setup keyboard shortcuts
  const { useEditorKeyboardShortcuts } = await import('~/composables/useKeyboardShortcuts')
  useEditorKeyboardShortcuts({
    deleteSelected: () => editorComposable?.deleteSelected(),
    clearSelection: () => editorComposable?.clearSelection(),
    undo: () => console.log('Undo - not implemented yet'),
    redo: () => console.log('Redo - not implemented yet'),
    selectAll: () => console.log('Select all - not implemented yet'),
    copy: () => console.log('Copy - not implemented yet'),
    paste: () => console.log('Paste - not implemented yet'),
    cut: () => console.log('Cut - not implemented yet'),
    save: () => console.log('Save - not implemented yet'),
    zoomIn: () => zoomIn(),
    zoomOut: () => zoomOut(),
    fitToScreen: () => fitToScreen()
  })
}

const addComponent = (type: string) => {
  console.log('Adding component:', type)
  if (editorComposable) {
    editorComposable.addComponent(type)
    componentCount.value++
  }
}

const zoomIn = () => {
  if (editorComposable) {
    const newScale = editorComposable.zoomIn()
    if (newScale) {
      zoomLevel.value = Math.round(newScale * 100)
    }
  }
}

const zoomOut = () => {
  if (editorComposable) {
    const newScale = editorComposable.zoomOut()
    if (newScale) {
      zoomLevel.value = Math.round(newScale * 100)
    }
  }
}

const fitToScreen = () => {
  if (editorComposable) {
    const newScale = editorComposable.fitToScreen()
    if (newScale) {
      zoomLevel.value = Math.round(newScale * 100)
    }
  }
}

const deleteSelected = () => {
  if (editorComposable) {
    editorComposable.deleteSelected()
  }
}

const toggleGrid = () => {
  if (editorComposable) {
    editorComposable.toggleGrid()
  }
}

const runSimulation = () => {
  console.log('Running simulation...')
  // TODO: Implement simulation
}

const handleFileSelect = (fileId: string) => {
  console.log('Selected file:', fileId)
  // TODO: Load file
}

const handleStandardChange = (standard: string) => {
  console.log('Standard changed:', standard)
  projectSettings.value.electricalStandard = standard
}

const handleSaveProjectSettings = async (settings: ProjectSettings) => {
  console.log('Saving project settings:', settings)
  projectSettings.value = { ...settings }
  projectName.value = settings.name

  // Update drawing template with new project info
  if (editorComposable && editorComposable.updateProjectInfo) {
    await editorComposable.updateProjectInfo(settings)
  }
  // TODO: Save to backend/localStorage
}

const handlePageSizeChange = async (size: string) => {
  console.log('Page size changed:', size)

  // Update canvas size and redraw template
  if (editorComposable && editorComposable.updatePageSize) {
    await editorComposable.updatePageSize(size, projectSettings.value)
  }
}

// Resizer functions
const startResizeLeft = (e: MouseEvent) => {
  isResizingLeft.value = true
  document.body.classList.add('resizing')
  e.preventDefault()
}

const startResizeRight = (e: MouseEvent) => {
  isResizingRight.value = true
  document.body.classList.add('resizing')
  e.preventDefault()
}

const handleMouseMove = (e: MouseEvent) => {
  if (isResizingLeft.value) {
    const newWidth = Math.max(200, Math.min(500, e.clientX))
    leftPanelWidth.value = newWidth
  } else if (isResizingRight.value) {
    const newWidth = Math.max(250, Math.min(600, window.innerWidth - e.clientX))
    rightPanelWidth.value = newWidth
  } else if (isResizingNavigator.value) {
    const rect = navigatorContainerRef.value?.parentElement?.parentElement?.getBoundingClientRect()
    if (rect) {
      const newHeight = Math.max(150, Math.min(500, rect.bottom - e.clientY))
      navigatorHeight.value = newHeight
    }
  }
}

const stopResize = () => {
  if (isResizingLeft.value || isResizingRight.value || isResizingNavigator.value) {
    document.body.classList.remove('resizing')
  }
  isResizingLeft.value = false
  isResizingRight.value = false
  isResizingNavigator.value = false
}

// Navigator 리사이저
const startResizeNavigator = (e: MouseEvent) => {
  isResizingNavigator.value = true
  document.body.classList.add('resizing')
  e.preventDefault()
}

// Navigator 관련 함수들
const toggleNavigatorVisibility = () => {
  navigatorVisible.value = !navigatorVisible.value
  if (navigatorInstance) {
    if (navigatorVisible.value) {
      navigatorInstance.el.classList.remove('hidden')
      // 다시 표시할 때 업데이트
      setTimeout(() => {
        if (navigatorInstance.updateCurrentView) {
          navigatorInstance.updateCurrentView()
        }
      }, 100)
    } else {
      navigatorInstance.el.classList.add('hidden')
    }
  }
}

const fitNavigatorToScreen = () => {
  if (editorComposable && editorComposable.fitToScreen) {
    editorComposable.fitToScreen()
  }
}

// Navigator 초기화 함수 (useNavigator composable 사용)
const { createNavigator, destroyNavigator, updateViewport } = useNavigator()

const initializeNavigator = async () => {
  console.log('🔄 Initializing Navigator (useNavigator composable)...')

  if (!navigatorContainerRef.value) {
    console.error('❌ Navigator container not found')
    return
  }

  if (!editorComposable) {
    console.error('❌ Editor composable not available')
    return
  }

  const scroller = editorComposable.getScroller?.()

  if (!scroller) {
    console.error('❌ Scroller not available')
    return
  }

  try {
    navigatorInstance = await createNavigator(navigatorContainerRef.value, scroller)
    minimapStatus.value = 'Navigator 활성화'
    console.log('✅ Navigator initialized successfully')
  } catch (error) {
    console.error('❌ Navigator initialization failed:', error)
    minimapStatus.value = '초기화 오류'
  }
}

// Panel toggle functions
const toggleLeftPanel = () => {
  leftPanelVisible.value = !leftPanelVisible.value
}

const toggleRightPanel = () => {
  rightPanelVisible.value = !rightPanelVisible.value
}

// Keyboard shortcuts for panel toggle
const handleKeydown = (e: KeyboardEvent) => {
  // Ctrl + B: Toggle left panel
  if (e.ctrlKey && e.key === 'b') {
    e.preventDefault()
    toggleLeftPanel()
  }
  // Ctrl + Shift + P: Toggle right panel
  if (e.ctrlKey && e.shiftKey && e.key === 'P') {
    e.preventDefault()
    toggleRightPanel()
  }
}

onMounted(async () => {
  // Wait for canvas to be initialized
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('keydown', handleKeydown)

  // Navigator 정리 (useNavigator composable 사용)
  destroyNavigator()

  if (editorComposable) {
    editorComposable.cleanup()
  }
})
</script>

<style scoped>
.bg-gray-750 {
  background-color: #2d3748;
}

.bg-gray-850 {
  background-color: #1a202c;
}

/* Custom scrollbar for dark theme */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1f2937;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* Resizer styles */
.cursor-col-resize {
  cursor: col-resize;
}

.cursor-row-resize {
  cursor: row-resize;
}

/* Prevent text selection during resize */
body.resizing {
  user-select: none;
}

/* Navigator 스타일 */
:deep(.joint-navigator) {
  position: relative !important;  /* current-view의 absolute positioning 기준 */
  border: 1px solid #374151;
  border-radius: 4px;
  background: #1f2937;
  overflow: visible !important;  /* viewport가 보이도록 */
  max-width: 100%;  /* 컨테이너에 맞게 조정 */
  max-height: 100%;
}

:deep(.joint-navigator .joint-paper) {
  background: #1f2937;
}

:deep(.joint-navigator svg.joint-paper-background),
:deep(.joint-navigator svg.joint-paper-grid) {
  width: 100%;
  height: 100%;
}

/* Navigator viewport (현재 보고 있는 영역 하이라이트) */
:deep(.joint-navigator .current-view) {
  position: absolute !important;  /* 중요: absolute positioning 필요 */
  border: 2px solid #3b82f6 !important;
  background: rgba(59, 130, 246, 0.2) !important;
  cursor: move !important;
  border-radius: 4px !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  transition: opacity 0.3s ease-in-out !important;
  box-sizing: border-box !important;
}

:deep(.joint-navigator .current-view:hover) {
  background: rgba(59, 130, 246, 0.3) !important;
}

/* hidden 상태가 아닐 때만 표시 */
:deep(.joint-navigator:not(.hidden) .current-view) {
  opacity: 1 !important;
  display: block !important;
}

/* 이전 클래스명도 지원 (혹시 몰라서) */
:deep(.joint-navigator-viewport) {
  border: 2px solid #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  cursor: move;
}

:deep(.joint-navigator-viewport:hover) {
  background: rgba(59, 130, 246, 0.15);
}

:deep(.joint-navigator.hidden) {
  display: none;
}

/* Toolbar 스타일 (KitchenSink 방식) */
:deep(.joint-toolbar) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #374151;
  border-top: 1px solid #4b5563;
  border-radius: 0 0 4px 4px;
}

:deep(.joint-widget) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.joint-widget.joint-widget-button),
:deep(.joint-widget.joint-widget-zoom-in),
:deep(.joint-widget.joint-widget-zoom-out) {
  padding: 4px 8px;
  background: #4b5563;
  border: 1px solid #6b7280;
  border-radius: 4px;
  cursor: pointer;
  color: #e5e7eb;
  font-size: 14px;
  transition: all 0.2s;
  min-width: 32px;
  height: 32px;
}

:deep(.joint-widget.joint-widget-button:hover),
:deep(.joint-widget.joint-widget-zoom-in:hover),
:deep(.joint-widget.joint-widget-zoom-out:hover) {
  background: #6b7280;
  border-color: #9ca3af;
}

:deep(.joint-widget.joint-widget-label) {
  padding: 4px 8px;
  color: #e5e7eb;
  font-size: 13px;
  font-weight: 500;
  min-width: 48px;
  text-align: center;
}

:deep(.joint-widget.joint-widget-zoom-slider) {
  flex: 1;
  padding: 0 8px;
  min-width: 100px;
}

:deep(.joint-widget-zoom-slider input[type="range"]) {
  width: 100%;
  height: 4px;
  background: #4b5563;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
}

:deep(.joint-widget-zoom-slider input[type="range"]::-webkit-slider-thumb) {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

:deep(.joint-widget-zoom-slider input[type="range"]::-webkit-slider-thumb:hover) {
  background: #60a5fa;
  transform: scale(1.1);
}

:deep(.joint-widget-zoom-slider input[type="range"]::-moz-range-thumb) {
  width: 16px;
  height: 16px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

:deep(.joint-widget-zoom-slider input[type="range"]::-moz-range-thumb:hover) {
  background: #60a5fa;
  transform: scale(1.1);
}
</style>
