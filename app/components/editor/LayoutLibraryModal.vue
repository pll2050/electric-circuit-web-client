<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
      @click="close"
    ></div>
    
    <!-- Modal -->
    <div class="relative bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-700">
        <h2 class="text-xl font-semibold text-white">레이아웃 라이브러리</h2>
        <button
          @click="close"
          class="text-gray-400 hover:text-gray-200 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Search and Filter -->
      <div class="p-6 border-b border-gray-700">
        <div class="flex gap-4 mb-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="레이아웃 검색..."
              class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            v-model="selectedSize"
            class="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">모든 크기</option>
            <option value="A3">A3</option>
            <option value="A4">A4</option>
          </select>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 overflow-y-auto max-h-[60vh]">
          <div
            v-for="layout in filteredLayouts"
            :key="layout.id"
            class="bg-gray-700 rounded-lg border border-gray-600 hover:border-blue-500 transition-colors cursor-pointer"
            @click="selectLayout(layout)"
          >
            <!-- Preview -->
            <div class="p-4 h-48 flex items-center justify-center bg-gray-750 rounded-t-lg">
              <div 
                class="relative bg-white rounded shadow-md"
                :style="getPreviewStyle(layout.pageInfo)"
              >
                <!-- Page outline -->
                <div class="absolute inset-1 border border-gray-300 rounded"></div>
                <!-- Title block representation -->
                <div class="absolute bottom-2 right-2 w-8 h-6 bg-gray-200 border border-gray-400 rounded text-xs"></div>
              </div>
            </div>
            
            <!-- Info -->
            <div class="p-4">
              <h3 class="font-semibold text-white mb-2">{{ layout.name }}</h3>
              <div class="text-sm text-gray-300 space-y-1">
                <div class="flex justify-between">
                  <span>크기:</span>
                  <span>{{ layout.pageInfo.size }}</span>
                </div>
                <div class="flex justify-between">
                  <span>치수:</span>
                  <span>{{ layout.pageInfo.width }} × {{ layout.pageInfo.height }}</span>
                </div>
                <div class="flex justify-between">
                  <span>여백:</span>
                  <span>{{ layout.pageInfo.margin }}px</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredLayouts.length === 0" class="flex flex-col items-center justify-center h-48 text-gray-400">
          <svg class="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-lg font-medium mb-2">레이아웃이 없습니다</p>
          <p class="text-sm">검색 조건을 변경해보세요</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between items-center p-6 border-t border-gray-700">
        <div class="text-sm text-gray-400">
          {{ filteredLayouts.length }}개의 레이아웃
        </div>
        <div class="flex gap-3">
          <button
            @click="close"
            class="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface LayoutInfo {
  id: string
  name: string
  filename: string
  pageInfo: {
    size: string
    width: number
    height: number
    margin: number
  }
  xmlContent?: string
}

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'select-layout', layout: LayoutInfo): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const searchQuery = ref('')
const selectedSize = ref('')
const layouts = ref<LayoutInfo[]>([])
const loading = ref(false)

// Computed
const filteredLayouts = computed(() => {
  let filtered = layouts.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(layout => 
      layout.name.toLowerCase().includes(query) ||
      layout.pageInfo.size.toLowerCase().includes(query)
    )
  }

  if (selectedSize.value) {
    filtered = filtered.filter(layout => layout.pageInfo.size === selectedSize.value)
  }

  return filtered
})

// Methods
const close = () => {
  emit('update:modelValue', false)
}

const selectLayout = (layout: LayoutInfo) => {
  emit('select-layout', layout)
  close()
}

const getPreviewStyle = (pageInfo: LayoutInfo['pageInfo']) => {
  // Calculate aspect ratio and scale for preview
  const maxWidth = 120
  const maxHeight = 100
  
  const aspectRatio = pageInfo.width / pageInfo.height
  let width = maxWidth
  let height = maxWidth / aspectRatio
  
  if (height > maxHeight) {
    height = maxHeight
    width = maxHeight * aspectRatio
  }
  
  return {
    width: `${width}px`,
    height: `${height}px`
  }
}

const parseXMLLayout = async (filename: string): Promise<LayoutInfo | null> => {
  try {
    // Use fetch to load XML file from assets
    const response = await fetch(`/assets/layouts/${filename}`)
    if (!response.ok) throw new Error(`Failed to load ${filename}`)
    
    const xmlText = await response.text()
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')
    
    // Parse page info
    const pageInfoElement = xmlDoc.querySelector('page-info')
    if (!pageInfoElement) throw new Error('Invalid XML structure')
    
    const size = pageInfoElement.querySelector('size')?.textContent || ''
    const width = parseInt(pageInfoElement.querySelector('width')?.textContent || '0')
    const height = parseInt(pageInfoElement.querySelector('height')?.textContent || '0')
    const margin = parseInt(pageInfoElement.querySelector('margin')?.textContent || '0')
    
    return {
      id: filename.replace('.xml', ''),
      name: `${size} 템플릿`,
      filename,
      pageInfo: {
        size,
        width,
        height,
        margin
      },
      xmlContent: xmlText
    }
  } catch (error) {
    console.error(`Error parsing ${filename}:`, error)
    return null
  }
}

const loadLayouts = async () => {
  loading.value = true
  try {
    // List of available layout files
    const layoutFiles = ['a3-template.xml', 'a4-template.xml']
    
    const layoutPromises = layoutFiles.map(file => parseXMLLayout(file))
    const results = await Promise.all(layoutPromises)
    
    layouts.value = results.filter(layout => layout !== null) as LayoutInfo[]
  } catch (error) {
    console.error('Error loading layouts:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadLayouts()
})
</script>

<style scoped>
.bg-gray-750 {
  background-color: #2d3748;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>