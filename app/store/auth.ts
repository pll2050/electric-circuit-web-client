import { defineStore } from 'pinia'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'

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
    /**
     * Firebase를 사용한 로그인
     */
    async login(email: string, password: string) {
      this.isLoading = true
      this.error = null

      try {
        const { login: firebaseLogin, getIdToken } = useFirebaseAuth()

        // Firebase로 로그인
        const userCredential = await firebaseLogin(email, password)
        const firebaseUser = userCredential.user

        // ID 토큰 가져오기
        const idToken = await getIdToken(firebaseUser)

        // 사용자 정보 저장
        this.user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || undefined,
        }
        this.token = idToken
        this.isAuthenticated = true

        // 토큰을 로컬 스토리지에 저장
        if (process.client) {
          localStorage.setItem('auth_token', idToken)
          localStorage.setItem('user_data', JSON.stringify(this.user))
        }

        return { user: this.user, token: idToken }
      } catch (error: any) {
        this.error = error.message || '로그인 중 오류가 발생했습니다.'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Firebase를 사용한 회원가입
     */
    async register(email: string, password: string, displayName: string) {
      this.isLoading = true
      this.error = null

      try {
        const { register: firebaseRegister, getIdToken } = useFirebaseAuth()

        // Firebase로 회원가입
        const userCredential = await firebaseRegister(email, password, displayName)
        const firebaseUser = userCredential.user

        // ID 토큰 가져오기
        const idToken = await getIdToken(firebaseUser)

        // 사용자 정보 저장
        this.user = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || displayName,
          photoURL: firebaseUser.photoURL || undefined,
        }
        this.token = idToken
        this.isAuthenticated = true

        // 토큰을 로컬 스토리지에 저장
        if (process.client) {
          localStorage.setItem('auth_token', idToken)
          localStorage.setItem('user_data', JSON.stringify(this.user))
        }

        return { user: this.user, token: idToken }
      } catch (error: any) {
        this.error = error.message || '회원가입 중 오류가 발생했습니다.'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 로그아웃
     */
    async logout() {
      try {
        const { logout: firebaseLogout } = useFirebaseAuth()
        await firebaseLogout()

        this.user = null
        this.token = null
        this.isAuthenticated = false

        // 로컬 스토리지에서 토큰 및 사용자 데이터 제거
        if (process.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_data')
        }
      } catch (error: any) {
        console.error('로그아웃 오류:', error)
      }
    },

    /**
     * Firebase Auth 상태 리스너 초기화
     */
    initAuthListener() {
      if (process.client) {
        const { $firebaseAuth } = useNuxtApp()

        onAuthStateChanged($firebaseAuth, async (firebaseUser: FirebaseUser | null) => {
          if (firebaseUser) {
            // 사용자가 로그인되어 있음
            const idToken = await firebaseUser.getIdToken()

            this.user = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              photoURL: firebaseUser.photoURL || undefined,
            }
            this.token = idToken
            this.isAuthenticated = true

            // 로컬 스토리지에 저장
            localStorage.setItem('auth_token', idToken)
            localStorage.setItem('user_data', JSON.stringify(this.user))
          } else {
            // 사용자가 로그아웃됨
            this.user = null
            this.token = null
            this.isAuthenticated = false

            // 로컬 스토리지에서 제거
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user_data')
          }
        })
      }
    },

    /**
     * 인증 상태 확인
     */
    async checkAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('user_data')

        if (token && userData) {
          try {
            this.token = token
            this.user = JSON.parse(userData)
            this.isAuthenticated = true
          } catch (error) {
            console.error('사용자 데이터 파싱 오류:', error)
            this.logout()
          }
        }
      }
    },

    /**
     * 에러 메시지 초기화
     */
    clearError() {
      this.error = null
    },
  },
})
