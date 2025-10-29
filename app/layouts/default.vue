<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold text-primary-600">
          Electric Circuit Web
        </NuxtLink>

        <div class="flex items-center gap-6">
          <!-- 메인 네비게이션 -->
          <div class="flex gap-4">
            <NuxtLink to="/editor" class="text-gray-700 hover:text-primary-600">
              에디터
            </NuxtLink>
            <NuxtLink to="/projects" class="text-gray-700 hover:text-primary-600">
              프로젝트
            </NuxtLink>
          </div>

          <!-- 로그인 상태에 따른 메뉴 -->
          <div class="flex items-center gap-4">
            <template v-if="authStore.isLoggedIn">
              <!-- 로그인된 사용자 드롭다운 -->
              <UiUserDropdown :user="authStore.user" @logout="handleLogout" />
            </template>

            <template v-else>
              <!-- 로그인/회원가입 버튼 -->
              <NuxtLink
                to="/login"
                class="px-4 py-2 text-sm text-gray-700 hover:text-primary-600 border border-gray-300 rounded-lg hover:border-primary-600 transition-colors"
              >
                로그인
              </NuxtLink>
              <NuxtLink
                to="/register"
                class="px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
              >
                회원가입
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="bg-gray-100 border-t border-gray-200 py-6">
      <div class="container mx-auto px-4 text-center text-gray-600 text-sm">
        © 2024 Electric Circuit Web. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
const router = useRouter()

// 컴포넌트 마운트 시 인증 리스너 초기화 (클라이언트 사이드에서만)
onMounted(() => {
  if (process.client) {
    authStore.initAuthListener()
  }
})

// 로그아웃 처리
const handleLogout = async () => {
  try {
    router.push('/')
  } catch (error) {
    console.error('로그아웃 오류:', error)
  }
}
</script>
