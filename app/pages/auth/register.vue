<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <!-- 로고 및 타이틀 -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          회원가입
        </h1>
        <p class="text-gray-600">새로운 계정을 만들어보세요</p>
      </div>

      <!-- 에러 메시지 -->
      <div
        v-if="errorMessage"
        class="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span class="block sm:inline">{{ errorMessage }}</span>
        <button
          @click="errorMessage = ''"
          class="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          <span class="text-red-700">&times;</span>
        </button>
      </div>

      <!-- 회원가입 폼 -->
      <form @submit.prevent="handleRegister" class="space-y-6">
        <!-- 이름 입력 -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            이름
          </label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            autocomplete="name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            :class="{ 'border-red-500': errors.name }"
            placeholder="홍길동"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">
            {{ errors.name }}
          </p>
        </div>

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
            autocomplete="new-password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            :class="{ 'border-red-500': errors.password }"
            placeholder="최소 8자 이상"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">
            {{ errors.password }}
          </p>
        </div>

        <!-- 비밀번호 확인 -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
            비밀번호 확인
          </label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            type="password"
            required
            autocomplete="new-password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            :class="{ 'border-red-500': errors.confirmPassword }"
            placeholder="비밀번호를 다시 입력하세요"
          />
          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- 약관 동의 -->
        <div class="flex items-start">
          <input
            id="terms"
            v-model="formData.agreeTerms"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
          />
          <label for="terms" class="ml-2 block text-sm text-gray-700">
            <a href="#" class="text-blue-600 hover:text-blue-500">이용약관</a> 및
            <a href="#" class="text-blue-600 hover:text-blue-500">개인정보처리방침</a>에 동의합니다.
          </label>
        </div>
        <p v-if="errors.agreeTerms" class="mt-1 text-sm text-red-600">
          {{ errors.agreeTerms }}
        </p>

        <!-- 회원가입 버튼 -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <span v-if="!isLoading">회원가입</span>
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
            가입 중...
          </span>
        </button>
      </form>

      <!-- 구분선 -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>
      </div>

      <!-- Google 회원가입 버튼 -->
      <div class="mt-6">
        <button
          type="button"
          @click="handleGoogleSignup"
          :disabled="isLoading"
          class="w-full inline-flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Google로 계속하기</span>
        </button>
      </div>

      <!-- 로그인 링크 -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          이미 계정이 있으신가요?
          <NuxtLink to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
            로그인
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/store/auth'

// 페이지 메타데이터
definePageMeta({
  title: '회원가입',
  layout: false,
})

const router = useRouter()
const authStore = useAuthStore()

// 폼 데이터
const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
})

// 에러 상태
const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: '',
})

const isLoading = ref(false)
const errorMessage = ref('')

// 폼 유효성 검증
const validateForm = (): boolean => {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.agreeTerms = ''

  let isValid = true

  // 이름 검증
  if (!formData.name) {
    errors.name = '이름을 입력해주세요.'
    isValid = false
  } else if (formData.name.length < 2) {
    errors.name = '이름은 최소 2자 이상이어야 합니다.'
    isValid = false
  }

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
  } else if (formData.password.length < 8) {
    errors.password = '비밀번호는 최소 8자 이상이어야 합니다.'
    isValid = false
  }

  // 비밀번호 확인 검증
  if (!formData.confirmPassword) {
    errors.confirmPassword = '비밀번호 확인을 입력해주세요.'
    isValid = false
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    isValid = false
  }

  // 약관 동의 검증
  if (!formData.agreeTerms) {
    errors.agreeTerms = '이용약관에 동의해주세요.'
    isValid = false
  }

  return isValid
}

// 회원가입 처리
const handleRegister = async () => {
  // 폼 유효성 검증
  if (!validateForm()) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Firebase를 통한 회원가입
    await authStore.register(formData.email, formData.password, formData.name)

    // 회원가입 성공 시 프로젝트 페이지로 이동
    router.push('/projects')
  } catch (error: any) {
    errorMessage.value = error.message || '회원가입 중 오류가 발생했습니다.'
    console.error('회원가입 실패:', error)
  } finally {
    isLoading.value = false
  }
}

// Google 회원가입 처리
const handleGoogleSignup = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await authStore.signInWithGoogle()

    // 로그인 성공 시 프로젝트 페이지로 이동
    if (result?.isNewUser) {
      console.log('Google 계정으로 신규 가입 완료!')
    } else {
      console.log('기존 Google 계정으로 로그인!')
    }
    router.push('/projects')
  } catch (error: any) {
    errorMessage.value = error.message || 'Google 회원가입 중 오류가 발생했습니다.'
    console.error('Google 회원가입 실패:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 추가적인 커스텀 스타일이 필요한 경우 여기에 작성 */
</style>
