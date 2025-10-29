import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export default defineNuxtPlugin(() => {
  // Firebase 설정
  // 실제 프로젝트에서는 환경 변수에서 가져와야 합니다
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || 'YOUR_API_KEY',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN',
    projectId: process.env.FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'YOUR_STORAGE_BUCKET',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
    appId: process.env.FIREBASE_APP_ID || 'YOUR_APP_ID',
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
