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
     * 백엔드에 사용자 정보 동기화
     */
    async syncUserToBackend(idToken: string, email: string, displayName: string, provider: string = 'email') {
      const config = useRuntimeConfig()

      try {
        await $fetch(`${config.public.apiBaseUrl}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            idToken: idToken,
            email: email,
            displayName: displayName,
            provider: provider,
          },
        })
        console.log('사용자 정보가 PostgreSQL에 저장되었습니다.')
      } catch (error: any) {
        // 이미 존재하는 사용자인 경우는 에러가 아님
        if (error?.data?.error === 'User already exists') {
          console.log('이미 등록된 사용자입니다.')
          return
        }
        console.error('백엔드 동기화 오류:', error)
        // 동기화 실패는 로그만 남기고 계속 진행
      }
    },

    /**
     * Firebase를 사용한 로그인
     */
    async login(email: string, password: string) {
      this.isLoading = true
      this.error = null

      try {
        const { login: firebaseLogin, getIdToken } = useFirebaseAuth()
        const { trackAuthEvent, setAnalyticsUserId } = useAnalytics()

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

        // Analytics 이벤트 추적
        trackAuthEvent('login', 'email')
        setAnalyticsUserId(firebaseUser.uid)

        // 백엔드에 사용자 정보 동기화 (Firebase Auth → PostgreSQL)
        await this.syncUserToBackend(idToken, firebaseUser.email || '', firebaseUser.displayName || '', 'email')

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
        const { trackAuthEvent, setAnalyticsUserId, setAnalyticsUserProperties } = useAnalytics()

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

        // Analytics 이벤트 추적
        trackAuthEvent('signup', 'email')
        setAnalyticsUserId(firebaseUser.uid)
        setAnalyticsUserProperties({
          display_name: displayName,
          email_verified: firebaseUser.emailVerified,
        })

        // 백엔드에 사용자 정보 동기화 (Firebase Auth → PostgreSQL)
        await this.syncUserToBackend(idToken, email, displayName, 'email')

        return { user: this.user, token: idToken }
      } catch (error: any) {
        this.error = error.message || '회원가입 중 오류가 발생했습니다.'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Google 로그인/회원가입
     */
    async signInWithGoogle() {
      this.isLoading = true
      this.error = null

      try {
        const { signInWithGoogle: firebaseGoogleSignIn, getIdToken } = useFirebaseAuth()
        const { trackAuthEvent, setAnalyticsUserId, setAnalyticsUserProperties } = useAnalytics()

        // Google로 로그인
        const userCredential = await firebaseGoogleSignIn()
        if (!userCredential) {
          // 팝업 닫힘 등으로 인증 실패 시 이후 로직 실행 중단
          return
        }
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

        // 신규 사용자인지 확인 (additionalUserInfo를 통해)
        const additionalUserInfo = (userCredential as any).additionalUserInfo
        const isNewUser = additionalUserInfo?.isNewUser || false

        // Analytics 이벤트 추적
        if (isNewUser) {
          trackAuthEvent('signup', 'google')
        } else {
          trackAuthEvent('login', 'google')
        }
        setAnalyticsUserId(firebaseUser.uid)
        setAnalyticsUserProperties({
          display_name: firebaseUser.displayName || '',
          email_verified: firebaseUser.emailVerified,
          provider: 'google',
        })

        // 백엔드에 사용자 정보 동기화 (Firebase Auth → PostgreSQL)
        await this.syncUserToBackend(idToken, firebaseUser.email || '', firebaseUser.displayName || '', 'google')

        return { user: this.user, token: idToken, isNewUser }
      } catch (error: any) {
        if (error.code === 'auth/popup-closed-by-user') {
          // 팝업 닫힘은 사용자 알림에서 제외, 콘솔에만 남김
          console.warn('Google 로그인 창이 닫혔습니다.')
          this.error = null
          return
        }
        this.error = error.message || 'Google 로그인 중 오류가 발생했습니다.'
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
        const { trackAuthEvent } = useAnalytics()

        await firebaseLogout()

        this.user = null
        this.token = null
        this.isAuthenticated = false

        // 로컬 스토리지에서 토큰 및 사용자 데이터 제거
        if (process.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_data')
        }

        // Analytics 이벤트 추적
        trackAuthEvent('logout')
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

        // Firebase Auth가 초기화되지 않았으면 리턴
        if (!$firebaseAuth) {
          console.warn('Firebase Auth is not initialized yet')
          return
        }

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
