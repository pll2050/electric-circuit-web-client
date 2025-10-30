<template>
  <header class="bg-gradient-to-r from-blue-500 to-purple-600 shadow-md">
    <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2">
        <img src="@/assets/icons/logo.svg" alt="Service Logo" class="w-8 h-8" />
        <span class="text-2xl font-bold text-white hover:text-gray-200">CircuitFlow</span>
      </NuxtLink>
      <div class="flex items-center gap-6">
        <div class="flex gap-4">
          <NuxtLink to="/editor" class="text-white hover:text-gray-200 transition-colors">에디터</NuxtLink>
          <NuxtLink to="/projects" class="text-white hover:text-gray-200 transition-colors">프로젝트</NuxtLink>
        </div>
        <div class="flex items-center gap-4">
          <template v-if="authStore.isLoggedIn">
            <UiUserDropdown :user="authStore.user" @logout="handleLogout" />
          </template>
          <template v-else>
            <NuxtLink to="/login" class="px-4 py-2 text-sm text-blue-600 bg-white rounded-lg hover:bg-gray-100 transition-colors">로그인</NuxtLink>
            <NuxtLink to="/register" class="px-4 py-2 text-sm text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors">회원가입</NuxtLink>
          </template>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (process.client) {
    authStore.initAuthListener()
  }
})

const handleLogout = async () => {
  try {
    router.push('/')
  } catch (error) {
    console.error('로그아웃 오류:', error)
  }
}
</script>
