<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black bg-opacity-50"
          @click="$emit('close')"
        ></div>

        <!-- Modal -->
        <div class="relative bg-gray-800 rounded-lg shadow-2xl w-[700px] max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 class="text-lg font-semibold text-gray-100">프로젝트 속성</h2>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-200 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <form @submit.prevent="handleSave" class="space-y-6">
          <!-- 탭 메뉴 -->
          <div class="border-b border-gray-700">
            <nav class="-mb-px flex space-x-8">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                type="button"
                :class="[
                  'py-2 px-1 border-b-2 font-medium text-sm',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                ]"
              >
                {{ tab.name }}
              </button>
            </nav>
          </div>

          <!-- 기본 정보 탭 -->
          <div v-show="activeTab === 'basic'" class="space-y-6">
            <!-- 프로젝트 이름 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                프로젝트 이름 <span class="text-red-400">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="프로젝트 이름을 입력하세요"
              />
            </div>

            <!-- 프로젝트 설명 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                프로젝트 설명
              </label>
              <textarea
                v-model="formData.description"
                rows="4"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="프로젝트에 대한 설명을 입력하세요"
              ></textarea>
            </div>

            <!-- 프로젝트 번호와 버전 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  프로젝트 번호
                </label>
                <input
                  v-model="formData.projectNumber"
                  type="text"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: PRJ-2025-001"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  버전
                </label>
                <input
                  v-model="formData.version"
                  type="text"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 1.0.0"
                />
              </div>
            </div>
          </div>

          <!-- 설계자 정보 탭 -->
          <div v-show="activeTab === 'designer'" class="space-y-6">
            <!-- 설계자 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                설계자 <span class="text-red-400">*</span>
              </label>
              <input
                v-model="formData.designer"
                type="text"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="설계자 이름을 입력하세요"
              />
            </div>

            <!-- 회사/조직과 부서 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  회사/조직
                </label>
                <input
                  v-model="formData.company"
                  type="text"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="회사 또는 조직명을 입력하세요"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  부서
                </label>
                <input
                  v-model="formData.department"
                  type="text"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="부서명을 입력하세요"
                />
              </div>
            </div>

            <!-- 연락처 정보 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  이메일
                </label>
                <input
                  v-model="formData.email"
                  type="email"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@company.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  전화번호
                </label>
                <input
                  v-model="formData.phone"
                  type="tel"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="010-1234-5678"
                />
              </div>
            </div>

            <!-- 검토자와 승인자 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  검토자
                </label>
                <input
                  v-model="formData.reviewer"
                  type="text"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="검토자 이름"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  승인자
                </label>
                <input
                  v-model="formData.approver"
                  type="text"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="승인자 이름"
                />
              </div>
            </div>
          </div>

          <!-- 기술 사양 탭 -->
          <div v-show="activeTab === 'technical'" class="space-y-6">
            <!-- 전기 표준 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                전기 표준
              </label>
              <select
                v-model="formData.electricalStandard"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="IEC">IEC (International Electrotechnical Commission)</option>
                <option value="KEC">KEC (Korean Electrical Code)</option>
                <option value="ANSI">ANSI (American National Standards Institute)</option>
                <option value="UL">UL (Underwriters Laboratories)</option>
                <option value="GB">GB (Chinese National Standards)</option>
              </select>
            </div>

            <!-- 전압 레벨과 주파수 -->
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  주전압 (V)
                </label>
                <select
                  v-model="formData.mainVoltage"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="110">110V</option>
                  <option value="220">220V</option>
                  <option value="380">380V</option>
                  <option value="440">440V</option>
                  <option value="6600">6.6kV</option>
                  <option value="22900">22.9kV</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  제어전압 (V)
                </label>
                <select
                  v-model="formData.controlVoltage"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="12">12V</option>
                  <option value="24">24V</option>
                  <option value="48">48V</option>
                  <option value="110">110V</option>
                  <option value="220">220V</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  주파수 (Hz)
                </label>
                <select
                  v-model="formData.frequency"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="50">50Hz</option>
                  <option value="60">60Hz</option>
                </select>
              </div>
            </div>

            <!-- 환경 조건 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  설치 환경
                </label>
                <select
                  v-model="formData.environment"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="indoor">실내</option>
                  <option value="outdoor">실외</option>
                  <option value="underground">지하</option>
                  <option value="marine">해상</option>
                  <option value="explosive">폭발위험지역</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  보호등급
                </label>
                <select
                  v-model="formData.protectionClass"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="IP20">IP20</option>
                  <option value="IP54">IP54</option>
                  <option value="IP55">IP55</option>
                  <option value="IP65">IP65</option>
                  <option value="IP67">IP67</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 기타 정보 탭 -->
          <div v-show="activeTab === 'misc'" class="space-y-6">
            <!-- 날짜 정보 -->
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  작성일
                </label>
                <input
                  v-model="formData.createdDate"
                  type="date"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  수정일
                </label>
                <input
                  v-model="formData.modifiedDate"
                  type="date"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  완료 예정일
                </label>
                <input
                  v-model="formData.dueDate"
                  type="date"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <!-- 상태와 진행률 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  프로젝트 상태
                </label>
                <select
                  v-model="formData.status"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="planning">계획 중</option>
                  <option value="in-progress">진행 중</option>
                  <option value="review">검토 중</option>
                  <option value="completed">완료</option>
                  <option value="on-hold">보류</option>
                  <option value="cancelled">취소</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  진행률 (%)
                </label>
                <input
                  v-model.number="formData.progress"
                  type="number"
                  min="0"
                  max="100"
                  class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0-100"
                />
              </div>
            </div>

            <!-- 키워드/태그 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                키워드/태그
              </label>
              <input
                v-model="formData.tags"
                type="text"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="키워드를 쉼표로 구분하여 입력 (예: 모터제어, PLC, 자동화)"
              />
            </div>

            <!-- 비고 -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                비고
              </label>
              <textarea
                v-model="formData.notes"
                rows="4"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="추가 메모를 입력하세요"
              ></textarea>
            </div>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-700 bg-gray-850">
        <button
          @click="$emit('close')"
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-gray-100 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
        >
          취소
        </button>
        <button
          @click="handleSave"
          type="button"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          저장
        </button>
      </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

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

const props = defineProps<{
  isOpen: boolean
  settings?: ProjectSettings
}>()

const emit = defineEmits<{
  'close': []
  'save': [settings: ProjectSettings]
}>()

const activeTab = ref('basic')

const tabs = ref([
  { id: 'basic', name: '기본 정보' },
  { id: 'designer', name: '설계자 정보' },
  { id: 'technical', name: '기술 사양' },
  { id: 'misc', name: '기타 정보' }
])

const formData = ref<ProjectSettings>({
  // 기본 정보
  name: '',
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

// Initialize form data when modal opens or settings change
watch(
  () => props.settings,
  (newSettings) => {
    if (newSettings) {
      formData.value = { ...formData.value, ...newSettings }
    }
  },
  { immediate: true, deep: true }
)

const handleSave = () => {
  if (!formData.value.name || !formData.value.designer) {
    alert('프로젝트 이름과 설계자는 필수 입력 항목입니다.')
    return
  }

  // 수정일 자동 업데이트
  formData.value.modifiedDate = new Date().toISOString().split('T')[0]

  emit('save', { ...formData.value })
  emit('close')
}
</script>
