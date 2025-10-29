<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- 페이지 헤더 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">설정</h1>
      <p class="text-gray-600">애플리케이션 설정을 관리하세요.</p>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="authStore.isLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- 설정 패널 -->
    <div v-else-if="authStore.user" class="space-y-6">
      <!-- 일반 설정 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">일반 설정</h3>
        
        <div class="space-y-6">
          <!-- 언어 설정 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">언어</label>
            <select
              v-model="settings.language"
              @change="saveSettings"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </select>
          </div>

          <!-- 테마 설정 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">테마</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="theme in themes"
                :key="theme.value"
                @click="setTheme(theme.value)"
                :class="[
                  'p-4 border rounded-lg text-left transition-colors',
                  settings.theme === theme.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                ]"
              >
                <div class="flex items-center gap-3 mb-2">
                  <div :class="theme.iconClass"></div>
                  <span class="font-medium text-gray-900">{{ theme.name }}</span>
                </div>
                <p class="text-sm text-gray-600">{{ theme.description }}</p>
              </button>
            </div>
          </div>

          <!-- 시간대 설정 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">시간대</label>
            <select
              v-model="settings.timezone"
              @change="saveSettings"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            >
              <option value="Asia/Seoul">Asia/Seoul (GMT+9)</option>
              <option value="UTC">UTC (GMT+0)</option>
              <option value="America/New_York">America/New_York (GMT-5)</option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 에디터 설정 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">에디터 설정</h3>
        
        <div class="space-y-6">
          <!-- 자동 저장 -->
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">자동 저장</label>
              <p class="text-xs text-gray-500">변경사항을 자동으로 저장합니다</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.autoSave"
                @change="saveSettings"
                class="sr-only"
              >
              <div :class="[
                'w-11 h-6 rounded-full transition-colors',
                settings.autoSave ? 'bg-primary-600' : 'bg-gray-200'
              ]">
                <div :class="[
                  'w-5 h-5 bg-white rounded-full shadow transform transition-transform',
                  settings.autoSave ? 'translate-x-5' : 'translate-x-0'
                ]"></div>
              </div>
            </label>
          </div>

          <!-- 그리드 표시 -->
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">그리드 표시</label>
              <p class="text-xs text-gray-500">에디터에서 그리드를 표시합니다</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.showGrid"
                @change="saveSettings"
                class="sr-only"
              >
              <div :class="[
                'w-11 h-6 rounded-full transition-colors',
                settings.showGrid ? 'bg-primary-600' : 'bg-gray-200'
              ]">
                <div :class="[
                  'w-5 h-5 bg-white rounded-full shadow transform transition-transform',
                  settings.showGrid ? 'translate-x-5' : 'translate-x-0'
                ]"></div>
              </div>
            </label>
          </div>

          <!-- 스냅 투 그리드 -->
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">스냅 투 그리드</label>
              <p class="text-xs text-gray-500">요소를 그리드에 맞춰 정렬합니다</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.snapToGrid"
                @change="saveSettings"
                class="sr-only"
              >
              <div :class="[
                'w-11 h-6 rounded-full transition-colors',
                settings.snapToGrid ? 'bg-primary-600' : 'bg-gray-200'
              ]">
                <div :class="[
                  'w-5 h-5 bg-white rounded-full shadow transform transition-transform',
                  settings.snapToGrid ? 'translate-x-5' : 'translate-x-0'
                ]"></div>
              </div>
            </label>
          </div>

          <!-- 그리드 크기 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">그리드 크기</label>
            <div class="flex items-center gap-4">
              <input
                type="range"
                v-model="settings.gridSize"
                @input="saveSettings"
                min="10"
                max="50"
                step="5"
                class="flex-1"
              >
              <span class="text-sm text-gray-600 min-w-12">{{ settings.gridSize }}px</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 알림 설정 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">알림 설정</h3>
        
        <div class="space-y-6">
          <!-- 이메일 알림 -->
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">이메일 알림</label>
              <p class="text-xs text-gray-500">중요한 업데이트를 이메일로 받습니다</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.emailNotifications"
                @change="saveSettings"
                class="sr-only"
              >
              <div :class="[
                'w-11 h-6 rounded-full transition-colors',
                settings.emailNotifications ? 'bg-primary-600' : 'bg-gray-200'
              ]">
                <div :class="[
                  'w-5 h-5 bg-white rounded-full shadow transform transition-transform',
                  settings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                ]"></div>
              </div>
            </label>
          </div>

          <!-- 브라우저 알림 -->
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">브라우저 알림</label>
              <p class="text-xs text-gray-500">브라우저에서 푸시 알림을 받습니다</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.pushNotifications"
                @change="saveSettings"
                class="sr-only"
              >
              <div :class="[
                'w-11 h-6 rounded-full transition-colors',
                settings.pushNotifications ? 'bg-primary-600' : 'bg-gray-200'
              ]">
                <div :class="[
                  'w-5 h-5 bg-white rounded-full shadow transform transition-transform',
                  settings.pushNotifications ? 'translate-x-5' : 'translate-x-0'
                ]"></div>
              </div>
            </label>
          </div>

          <!-- 마케팅 이메일 -->
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">마케팅 이메일</label>
              <p class="text-xs text-gray-500">새로운 기능과 팁을 이메일로 받습니다</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.marketingEmails"
                @change="saveSettings"
                class="sr-only"
              >
              <div :class="[
                'w-11 h-6 rounded-full transition-colors',
                settings.marketingEmails ? 'bg-primary-600' : 'bg-gray-200'
              ]">
                <div :class="[
                  'w-5 h-5 bg-white rounded-full shadow transform transition-transform',
                  settings.marketingEmails ? 'translate-x-5' : 'translate-x-0'
                ]"></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- 고급 설정 -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-6">고급 설정</h3>
        
        <div class="space-y-6">
          <!-- 디버그 모드 -->
          <div class="flex items-center justify-between">
            <div>
              <label class="text-sm font-medium text-gray-700">디버그 모드</label>
              <p class="text-xs text-gray-500">개발자 도구와 디버그 정보를 표시합니다</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="settings.debugMode"
                @change="saveSettings"
                class="sr-only"
              >
              <div :class="[
                'w-11 h-6 rounded-full transition-colors',
                settings.debugMode ? 'bg-primary-600' : 'bg-gray-200'
              ]">
                <div :class="[
                  'w-5 h-5 bg-white rounded-full shadow transform transition-transform',
                  settings.debugMode ? 'translate-x-5' : 'translate-x-0'
                ]"></div>
              </div>
            </label>
          </div>

          <!-- 데이터 내보내기 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">데이터 관리</label>
            <div class="flex gap-3">
              <button
                @click="exportData"
                class="px-4 py-2 text-sm text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
              >
                데이터 내보내기
              </button>
              <button
                @click="resetSettings"
                class="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                설정 초기화
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 로그인 안내 -->
    <div v-else class="text-center py-12">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <h2 class="text-xl font-semibold text-gray-900 mb-2">로그인이 필요합니다</h2>
      <p class="text-gray-600 mb-4">설정을 변경하려면 로그인해주세요.</p>
      <NuxtLink
        to="/login"
        class="inline-flex items-center px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
      >
        로그인하기
      </NuxtLink>
    </div>

    <!-- 토스트 메시지 -->
    <div v-if="toastMessage" class="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const toastMessage = ref('')

// 테마 옵션
const themes = [
  {
    value: 'light',
    name: '라이트',
    description: '밝은 테마',
    iconClass: 'w-4 h-4 bg-yellow-400 rounded-full'
  },
  {
    value: 'dark',
    name: '다크',
    description: '어두운 테마',
    iconClass: 'w-4 h-4 bg-gray-800 rounded-full'
  },
  {
    value: 'auto',
    name: '자동',
    description: '시스템 설정에 따라',
    iconClass: 'w-4 h-4 bg-gradient-to-r from-yellow-400 to-gray-800 rounded-full'
  }
]

// 설정값들
const settings = reactive({
  language: 'ko',
  theme: 'light',
  timezone: 'Asia/Seoul',
  autoSave: true,
  showGrid: true,
  snapToGrid: false,
  gridSize: 20,
  emailNotifications: true,
  pushNotifications: false,
  marketingEmails: false,
  debugMode: false
})

// 컴포넌트 마운트 시 설정 로드
onMounted(() => {
  loadSettings()
})

// 설정 로드
const loadSettings = () => {
  if (process.client) {
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      Object.assign(settings, JSON.parse(savedSettings))
    }
  }
}

// 설정 저장
const saveSettings = () => {
  if (process.client) {
    localStorage.setItem('userSettings', JSON.stringify(settings))
    showToast('설정이 저장되었습니다.')
  }
}

// 테마 설정
const setTheme = (theme: string) => {
  settings.theme = theme
  saveSettings()
  
  // 실제 테마 적용 로직을 여기에 추가
  if (process.client) {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

// 데이터 내보내기
const exportData = () => {
  if (process.client) {
    const data = {
      settings: settings,
      exportDate: new Date().toISOString(),
      userId: authStore.user?.uid
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `electric-circuit-settings-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    showToast('설정 데이터가 내보내졌습니다.')
  }
}

// 설정 초기화
const resetSettings = () => {
  if (confirm('모든 설정을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    if (process.client) {
      localStorage.removeItem('userSettings')
      
      // 기본값으로 초기화
      Object.assign(settings, {
        language: 'ko',
        theme: 'light',
        timezone: 'Asia/Seoul',
        autoSave: true,
        showGrid: true,
        snapToGrid: false,
        gridSize: 20,
        emailNotifications: true,
        pushNotifications: false,
        marketingEmails: false,
        debugMode: false
      })
      
      showToast('설정이 초기화되었습니다.')
    }
  }
}

// 토스트 메시지 표시
const showToast = (message: string) => {
  toastMessage.value = message
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

// 페이지 타이틀 설정
useHead({
  title: '설정 - Electric Circuit Web'
})
</script>