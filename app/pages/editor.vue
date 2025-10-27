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
            <ProjectExplorer
              :project-name="projectName"
              @select-file="handleFileSelect"
            />
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

// Panel visibility state
const leftPanelVisible = ref(true)
const rightPanelVisible = ref(true)
const leftPanelCollapsedWidth = 40 // collapsed width for icon bar
const rightPanelCollapsedWidth = 40

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
  const {
    initialize,
    cleanup,
    addComponent: addComponentToCanvas,
    zoomIn: zoomInCanvas,
    zoomOut: zoomOutCanvas,
    setZoom: setZoomCanvas,
    fitToScreen: fitToScreenCanvas,
    deleteSelected: deleteSelectedCanvas,
    setupEventHandlers,
    updatePageSize: updatePageSizeCanvas,
    updateProjectInfo: updateProjectInfoCanvas
  } = useCircuitEditor(canvasContainer, projectSettings.value)

  editorComposable = {
    cleanup,
    addComponent: addComponentToCanvas,
    zoomIn: zoomInCanvas,
    zoomOut: zoomOutCanvas,
    setZoom: setZoomCanvas,
    fitToScreen: fitToScreenCanvas,
    deleteSelected: deleteSelectedCanvas,
    updatePageSize: updatePageSizeCanvas,
    updateProjectInfo: updateProjectInfoCanvas
  }

  await initialize()
  setupEventHandlers()
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

const handleSaveProjectSettings = (settings: ProjectSettings) => {
  console.log('Saving project settings:', settings)
  projectSettings.value = { ...settings }
  projectName.value = settings.name

  // Update drawing template with new project info
  if (editorComposable && editorComposable.updateProjectInfo) {
    editorComposable.updateProjectInfo(settings)
  }
  // TODO: Save to backend/localStorage
}

const handlePageSizeChange = (size: string) => {
  console.log('Page size changed:', size)

  // Update canvas size and redraw template
  if (editorComposable && editorComposable.updatePageSize) {
    editorComposable.updatePageSize(size, projectSettings.value)
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
  }
}

const stopResize = () => {
  if (isResizingLeft.value || isResizingRight.value) {
    document.body.classList.remove('resizing')
  }
  isResizingLeft.value = false
  isResizingRight.value = false
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

/* Prevent text selection during resize */
body.resizing {
  user-select: none;
}
</style>
