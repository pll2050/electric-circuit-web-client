/**
 * Firebase Auth 상태 리스너 초기화 플러그인
 */
export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()

  // Firebase Auth 상태 변경 리스너 초기화
  authStore.initAuthListener()
})
