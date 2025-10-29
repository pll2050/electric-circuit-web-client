import { defineStore } from 'pinia'

export interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated,
  },

  actions: {
    async login(email: string, password: string) {
      this.isLoading = true
      this.error = null

      try {
        const api = useApi()
        const data = await api.post<{ user: User; token: string }>('/auth/login', {
          email,
          password,
        })

        this.user = data.user
        this.token = data.token
        this.isAuthenticated = true

        // 토큰을 로컬 스토리지에 저장
        if (process.client) {
          localStorage.setItem('auth_token', data.token)
        }

        return data
      } catch (error: any) {
        this.error = error.message || '로그인 중 오류가 발생했습니다.'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false

      // 로컬 스토리지에서 토큰 제거
      if (process.client) {
        localStorage.removeItem('auth_token')
      }
    },

    async checkAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        if (token) {
          this.token = token
          // TODO: 토큰 유효성 검증 API 호출
          // 임시로 토큰이 있으면 인증된 것으로 처리
          this.isAuthenticated = true
        }
      }
    },

    clearError() {
      this.error = null
    },
  },
})
