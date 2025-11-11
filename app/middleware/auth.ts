import { useAuthStore } from '~/store/auth'

/**
 * 인증 미들웨어
 * 로그인하지 않은 사용자의 접근을 차단합니다.
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // 클라이언트 사이드에서만 실행
  if (process.client) {
    // 인증 상태 확인
    if (!authStore.isLoggedIn) {
      // 토큰이 있는지 확인
      const token = localStorage.getItem('auth_token')
      if (!token) {
        // 로그인 페이지로 리다이렉트
        return navigateTo('/auth/login')
      }
    }
  }
})
