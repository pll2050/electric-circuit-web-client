<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black bg-opacity-50"
          @click="closeModal"
        ></div>

        <!-- Modal -->
        <div class="relative w-[1000px] h-[700px] bg-gray-800 rounded-lg shadow-2xl flex flex-col">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-4 py-3 bg-gray-750 border-b border-gray-700 rounded-t-lg">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h2 class="text-lg font-semibold text-gray-200">부품 라이브러리</h2>
            </div>
            <button
              @click="closeModal"
              class="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Search Bar -->
          <div class="px-4 py-3 bg-gray-800 border-b border-gray-700">
            <div class="relative">
              <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="부품 검색... (예: 저항, 릴레이, 모터)"
                class="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-200 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              >
            </div>
          </div>

          <!-- Modal Body -->
          <div class="flex-1 flex overflow-hidden">
            <!-- Left Sidebar - Categories -->
            <div class="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
              <div class="p-2">
                <div
                  v-for="category in categories"
                  :key="category.id"
                  @click="selectedCategory = category.id"
                  :class="[
                    'flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors',
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  ]"
                >
                  <span class="text-sm">{{ category.icon }}</span>
                  <span class="text-sm font-medium">{{ category.name }}</span>
                  <span class="ml-auto text-xs opacity-75">({{ category.count }})</span>
                </div>
              </div>
            </div>

            <!-- Center - Component Grid -->
            <div class="flex-1 flex flex-col">
              <div class="flex-1 overflow-y-auto p-4">
                <div class="grid grid-cols-4 gap-3">
                  <div
                    v-for="component in filteredComponents"
                    :key="component.id"
                    @click="selectComponent(component)"
                    :class="[
                      'p-4 border rounded-lg cursor-pointer transition-all hover:scale-105',
                      selectedComponentId === component.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                    ]"
                  >
                    <div class="text-center">
                      <div class="text-2xl mb-2">{{ component.symbol }}</div>
                      <div class="text-sm font-medium text-gray-200">{{ component.name }}</div>
                      <div class="text-xs text-gray-400 mt-1">{{ component.description }}</div>
                      <div class="text-xs text-blue-400 mt-1">{{ component.standard }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="px-4 py-3 bg-gray-750 border-t border-gray-700 flex items-center justify-between">
                <div class="text-sm text-gray-400">
                  {{ selectedComponentId ? `선택됨: ${getSelectedComponentName()}` : '부품을 선택하세요' }}
                </div>
                <button
                  @click="addSelectedComponent"
                  :disabled="!selectedComponentId"
                  :class="[
                    'px-4 py-2 rounded text-sm font-medium transition-colors',
                    selectedComponentId
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-600 cursor-not-allowed text-gray-400'
                  ]"
                >
                  추가
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'add-component': [componentType: string]
}>()

const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedComponentId = ref<string | null>(null)

const categories = [
  { id: 'all', name: '전체', icon: '📦', count: 45 },
  { id: 'power', name: '전원 공급', icon: '⚡', count: 8 },
  { id: 'passive', name: '수동 소자', icon: '⚊', count: 12 },
  { id: 'switches', name: '스위치/릴레이', icon: '⚬', count: 10 },
  { id: 'protection', name: '보호 장치', icon: '🛡️', count: 7 },
  { id: 'motors', name: '모터/구동기', icon: '⚙️', count: 6 },
  { id: 'sensors', name: '센서/계측', icon: '📊', count: 8 },
  { id: 'controllers', name: '제어기/PLC', icon: '🖥️', count: 5 },
  { id: 'connectors', name: '커넥터/단자', icon: '🔌', count: 9 }
]

const components = [
  // Power Supply
  { id: 'battery', name: 'DC 전원', symbol: '⎓', description: 'DC 전압원', standard: 'IEC', category: 'power', type: 'battery' },
  { id: 'ac-source', name: 'AC 전원', symbol: '∿', description: 'AC 전압원', standard: 'IEC', category: 'power', type: 'ac-source' },
  { id: 'power-supply', name: '전원 공급 장치', symbol: '⏚', description: 'PSU', standard: 'IEC', category: 'power', type: 'power-supply' },
  { id: 'transformer', name: '변압기', symbol: '⊓⊔', description: 'Transformer', standard: 'IEC', category: 'power', type: 'transformer' },

  // Passive Components
  { id: 'resistor', name: '저항', symbol: '▭', description: 'Resistor', standard: 'IEC', category: 'passive', type: 'resistor' },
  { id: 'capacitor', name: '커패시터', symbol: '⊥⊥', description: 'Capacitor', standard: 'IEC', category: 'passive', type: 'capacitor' },
  { id: 'inductor', name: '인덕터', symbol: '∾', description: 'Inductor', standard: 'IEC', category: 'passive', type: 'inductor' },
  { id: 'diode', name: '다이오드', symbol: '▷|', description: 'Diode', standard: 'IEC', category: 'passive', type: 'diode' },
  { id: 'led', name: 'LED', symbol: '▷|💡', description: 'Light Emitting Diode', standard: 'IEC', category: 'passive', type: 'led' },

  // Switches & Relays
  { id: 'switch', name: '스위치', symbol: '⚬—', description: 'Switch', standard: 'IEC', category: 'switches', type: 'switch' },
  { id: 'relay', name: '릴레이', symbol: '⊏⊐', description: 'Relay', standard: 'IEC', category: 'switches', type: 'relay' },
  { id: 'contactor', name: '전자접촉기', symbol: '⊏K⊐', description: 'Contactor', standard: 'IEC', category: 'switches', type: 'contactor' },
  { id: 'push-button', name: '푸시버튼', symbol: '⊙—', description: 'Push Button', standard: 'IEC', category: 'switches', type: 'push-button' },
  { id: 'selector', name: '셀렉터 스위치', symbol: '⊕', description: 'Selector Switch', standard: 'IEC', category: 'switches', type: 'selector' },

  // Protection Devices
  { id: 'breaker', name: '차단기', symbol: '⊟', description: 'Circuit Breaker', standard: 'IEC', category: 'protection', type: 'breaker' },
  { id: 'fuse', name: '퓨즈', symbol: '—□—', description: 'Fuse', standard: 'IEC', category: 'protection', type: 'fuse' },
  { id: 'mccb', name: 'MCCB', symbol: '⊟M', description: 'Molded Case CB', standard: 'IEC', category: 'protection', type: 'mccb' },
  { id: 'elcb', name: 'ELCB', symbol: '⊟E', description: 'Earth Leakage CB', standard: 'IEC', category: 'protection', type: 'elcb' },
  { id: 'surge-protector', name: '서지 보호기', symbol: '⚡🛡️', description: 'Surge Protector', standard: 'IEC', category: 'protection', type: 'surge-protector' },

  // Motors & Actuators
  { id: 'motor-3phase', name: '3상 모터', symbol: '⚙M3', description: '3-Phase Motor', standard: 'IEC', category: 'motors', type: 'motor-3phase' },
  { id: 'motor-1phase', name: '단상 모터', symbol: '⚙M', description: 'Single Phase Motor', standard: 'IEC', category: 'motors', type: 'motor-1phase' },
  { id: 'servo-motor', name: '서보 모터', symbol: '⚙S', description: 'Servo Motor', standard: 'IEC', category: 'motors', type: 'servo-motor' },
  { id: 'solenoid', name: '솔레노이드', symbol: '⊏Y⊐', description: 'Solenoid', standard: 'IEC', category: 'motors', type: 'solenoid' },

  // Sensors & Instruments
  { id: 'sensor-proximity', name: '근접 센서', symbol: '⊏◉⊐', description: 'Proximity Sensor', standard: 'IEC', category: 'sensors', type: 'sensor-proximity' },
  { id: 'sensor-photo', name: '광전 센서', symbol: '⊏◎⊐', description: 'Photo Sensor', standard: 'IEC', category: 'sensors', type: 'sensor-photo' },
  { id: 'temperature', name: '온도 센서', symbol: '🌡️', description: 'Temperature Sensor', standard: 'IEC', category: 'sensors', type: 'temperature' },
  { id: 'ammeter', name: '전류계', symbol: 'A', description: 'Ammeter', standard: 'IEC', category: 'sensors', type: 'ammeter' },
  { id: 'voltmeter', name: '전압계', symbol: 'V', description: 'Voltmeter', standard: 'IEC', category: 'sensors', type: 'voltmeter' },

  // Controllers & PLC
  { id: 'plc', name: 'PLC', symbol: '⊏PLC⊐', description: 'Programmable Logic Controller', standard: 'IEC', category: 'controllers', type: 'plc' },
  { id: 'hmi', name: 'HMI', symbol: '🖥️', description: 'Human Machine Interface', standard: 'IEC', category: 'controllers', type: 'hmi' },
  { id: 'inverter', name: '인버터', symbol: '⊏INV⊐', description: 'Inverter', standard: 'IEC', category: 'controllers', type: 'inverter' },

  // Connectors & Terminals
  { id: 'terminal', name: '단자대', symbol: '⊢⊣', description: 'Terminal Block', standard: 'IEC', category: 'connectors', type: 'terminal' },
  { id: 'connector', name: '커넥터', symbol: '⊢◯⊣', description: 'Connector', standard: 'IEC', category: 'connectors', type: 'connector' },
  { id: 'plug', name: '플러그', symbol: '🔌', description: 'Plug', standard: 'IEC', category: 'connectors', type: 'plug' },
  { id: 'socket', name: '소켓', symbol: '⊙', description: 'Socket', standard: 'IEC', category: 'connectors', type: 'socket' }
]

const filteredComponents = computed(() => {
  let filtered = components

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(c => c.category === selectedCategory.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.type.toLowerCase().includes(query)
    )
  }

  return filtered
})

const getSelectedComponentName = () => {
  const component = components.find(c => c.id === selectedComponentId.value)
  return component ? component.name : ''
}

const selectComponent = (component: any) => {
  selectedComponentId.value = component.id
}

const addSelectedComponent = () => {
  if (selectedComponentId.value) {
    const component = components.find(c => c.id === selectedComponentId.value)
    if (component) {
      emit('add-component', component.type)
      closeModal()
    }
  }
}

const closeModal = () => {
  emit('update:modelValue', false)
  // Reset state
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedComponentId.value = null
}
</script>
