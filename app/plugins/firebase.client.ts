import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics, isSupported } from 'firebase/analytics'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()

  // Firebase 설정
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId,
  }

  // Firebase 초기화
  const app = initializeApp(firebaseConfig)

  // Firebase Auth 인스턴스
  const auth = getAuth(app)

  // Firebase Analytics 인스턴스 (브라우저에서만 사용 가능)
  let analytics = null
  if (process.client) {
    const analyticsSupported = await isSupported()
    if (analyticsSupported) {
      analytics = getAnalytics(app)
      console.log('Firebase Analytics initialized')
    }
  }

  return {
    provide: {
      firebase: app,
      firebaseAuth: auth,
      firebaseAnalytics: analytics,
    },
  }
})
