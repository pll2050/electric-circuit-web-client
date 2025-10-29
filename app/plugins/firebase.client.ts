import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  // Firebase 설정
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  }

  // Firebase 초기화
  const app = initializeApp(firebaseConfig)

  // Firebase Auth 인스턴스
  const auth = getAuth(app)

  return {
    provide: {
      firebase: app,
      firebaseAuth: auth,
    },
  }
})
