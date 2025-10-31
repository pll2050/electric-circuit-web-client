<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <!-- 로고 및 타이틀 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          전기회로 설계 시스템
        </h1>
        <p class="text-gray-600">로그인하여 계속하세요</p>
      </div>

      <!-- 에러 메시지 -->
      <div
        v-if="authStore.error"
        class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span class="block sm:inline">{{ authStore.error }}</span>
        <button
          @click="authStore.clearError"
          class="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          <span class="text-red-700">&times;</span>
        </button>
      </div>

      <!-- 로그인 폼 -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- 이메일 입력 -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            이메일
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            :class="{ 'border-red-500': errors.email }"
            placeholder="example@email.com"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">
            {{ errors.email }}
          </p>
        </div>

        <!-- 비밀번호 입력 -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            비밀번호
          </label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            :class="{ 'border-red-500': errors.password }"
            placeholder="비밀번호를 입력하세요"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <!-- 로그인 유지 체크박스 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember"
              v-model="formData.remember"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember" class="ml-2 block text-sm text-gray-700">
              로그인 상태 유지
            </label>
          </div>
          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
              비밀번호 찾기
            </a>
          </div>
        </div>

        <!-- 로그인 버튼 -->
        <button
          type="submit"
          :disabled="authStore.isLoading"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <span v-if="!authStore.isLoading">로그인</span>
          <span v-else class="flex items-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            로그인 중...
          </span>
        </button>
      </form>

      <!-- 회원가입 링크 -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          계정이 없으신가요?
          <NuxtLink to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            회원가입
          </NuxtLink>
        </p>
      </div>

      <!-- 소셜 로그인 (선택사항) -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-3">
          <button
            type="button"
            @click="handleGoogleLogin"
            :disabled="authStore.isLoading"
            class="w-full inline-flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google로 로그인</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '~/store/auth'
import { useRouter } from 'vue-router'

// 페이지 메타데이터
definePageMeta({
  layout: false,
  title: '로그인'
})

const authStore = useAuthStore()
const router = useRouter()

// 폼 데이터
const formData = reactive({
  email: '',
  password: '',
  remember: false,
})

// 에러 상태
const errors = reactive({
  email: '',
  password: '',
})

// 폼 유효성 검증
const validateForm = (): boolean => {
  errors.email = ''
  errors.password = ''

  let isValid = true

  // 이메일 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email) {
    errors.email = '이메일을 입력해주세요.'
    isValid = false
  } else if (!emailRegex.test(formData.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.'
    isValid = false
  }

  // 비밀번호 검증
  if (!formData.password) {
    errors.password = '비밀번호를 입력해주세요.'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = '비밀번호는 최소 6자 이상이어야 합니다.'
    isValid = false
  }

  return isValid
}

// 로그인 처리
const handleLogin = async () => {
  // 폼 유효성 검증
  if (!validateForm()) {
    return
  }

  try {
    await authStore.login(formData.email, formData.password)

    // 로그인 성공 시 프로젝트 페이지로 이동
    router.push('/projects')
  } catch (error) {
    // 에러는 store에서 처리됨
    console.error('로그인 실패:', error)
  }
}

// Google 로그인 처리
const handleGoogleLogin = async () => {
  try {
    const result = await authStore.signInWithGoogle()

    // 로그인 성공 시 프로젝트 페이지로 이동
    if (result?.isNewUser) {
      console.log('신규 사용자 가입 완료!')
    }
    router.push('/projects')
  } catch (error) {
    // 에러는 store에서 처리됨
    console.error('Google 로그인 실패:', error)
  }
}

// 페이지 로드 시 이미 로그인되어 있으면 리다이렉트
onMounted(async () => {
  await authStore.checkAuth()
  if (authStore.isLoggedIn) {
    router.push('/projects')
  }
})
</script>

<style scoped>
/* 추가적인 커스텀 스타일이 필요한 경우 여기에 작성 */
</style>
