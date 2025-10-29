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

      <!-- 로그인 링크 -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          이미 계정이 있으신가요?
          <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500">
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

// 페이지 메타데이터
definePageMeta({
  layout: false,
})

const router = useRouter()

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
    const api = useApi()
    const data = await api.post('/auth/register', {
      display_name: formData.name,
      email: formData.email,
      password: formData.password,
    })

    // 회원가입 성공 시 로그인 페이지로 이동
    router.push('/login')
  } catch (error: any) {
    errorMessage.value = error.message || '회원가입 중 오류가 발생했습니다.'
    console.error('회원가입 실패:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* 추가적인 커스텀 스타일이 필요한 경우 여기에 작성 */
</style>
