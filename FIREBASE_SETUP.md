# Firebase Authentication 설정 가이드

## 개요

이 프로젝트는 Firebase Authentication을 사용하여 사용자 인증을 처리합니다.

## Firebase 프로젝트 설정

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/)에 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: "electric-circuit-web")
4. Google Analytics 설정 (선택사항)
5. 프로젝트 생성 완료

### 2. 웹 앱 추가

1. Firebase 프로젝트 콘솔에서 "웹" 아이콘 클릭
2. 앱 닉네임 입력 (예: "electric-circuit-web-client")
3. Firebase Hosting 설정 (선택사항)
4. 앱 등록
5. Firebase SDK 구성 정보 복사

### 3. Authentication 활성화

1. 왼쪽 메뉴에서 "Authentication" 클릭
2. "시작하기" 클릭
3. "Sign-in method" 탭 선택
4. "이메일/비밀번호" 활성화
5. 저장

## 환경 변수 설정

### 1. .env 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 Firebase 설정 정보를 입력합니다:

```bash
# .env 파일 생성
cp .env.example .env
```

### 2. Firebase 설정 정보 입력

Firebase Console에서 복사한 설정 정보를 `.env` 파일에 입력합니다:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id

# API Configuration
API_BASE_URL=http://localhost:8080/api
```

### 3. Nuxt 설정 업데이트

`nuxt.config.ts` 파일에 환경 변수를 추가합니다:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8080/api',
    },
  },
})
```

## 사용 방법

### 1. 회원가입

```typescript
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()

// 회원가입
await authStore.register(
  'user@example.com',
  'password123',
  'User Name'
)
```

### 2. 로그인

```typescript
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()

// 로그인
await authStore.login(
  'user@example.com',
  'password123'
)
```

### 3. 로그아웃

```typescript
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()

// 로그아웃
await authStore.logout()
```

### 4. 인증 상태 확인

```vue
<template>
  <div v-if="authStore.isLoggedIn">
    <p>환영합니다, {{ authStore.user?.displayName }}님!</p>
  </div>
  <div v-else>
    <p>로그인이 필요합니다.</p>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
</script>
```

### 5. ID 토큰 사용

Firebase ID 토큰은 자동으로 `authStore.token`에 저장되며, API 요청 시 자동으로 헤더에 포함됩니다.

```typescript
import { useApi } from '~/composables/useApi'

const api = useApi()

// API 요청 (자동으로 토큰이 포함됩니다)
const projects = await api.get('/projects')
```

## 구조

### 파일 구조

```
client/
├── app/
│   ├── plugins/
│   │   ├── firebase.client.ts          # Firebase 초기화
│   │   └── auth-init.client.ts         # Auth 리스너 초기화
│   ├── composables/
│   │   ├── useFirebaseAuth.ts          # Firebase Auth composable
│   │   └── useApi.ts                   # API 통신 composable
│   ├── store/
│   │   └── auth.ts                     # 인증 상태 관리
│   └── pages/
│       ├── login.vue                   # 로그인 페이지
│       ├── register.vue                # 회원가입 페이지
│       └── projects.vue                # 보호된 페이지 예시
└── .env                                # 환경 변수
```

### 인증 흐름

1. 사용자가 로그인/회원가입 페이지에서 이메일과 비밀번호 입력
2. Firebase Authentication으로 인증 요청
3. 성공 시 Firebase ID Token 발급
4. ID Token을 로컬 스토리지와 Pinia store에 저장
5. 이후 모든 API 요청에 ID Token을 Authorization 헤더에 포함
6. 서버는 Firebase Admin SDK로 토큰 검증

## 보안 고려사항

### 1. 환경 변수 보호

- `.env` 파일을 `.gitignore`에 추가 (이미 추가됨)
- 프로덕션 환경에서는 환경 변수를 안전하게 관리

### 2. 토큰 갱신

Firebase ID Token은 1시간마다 자동으로 갱신됩니다. `onAuthStateChanged` 리스너가 이를 처리합니다.

### 3. HTTPS 사용

프로덕션 환경에서는 반드시 HTTPS를 사용하세요.

### 4. CORS 설정

서버에서 적절한 CORS 설정을 확인하세요.

## 트러블슈팅

### Firebase 초기화 오류

**문제:** `Firebase: Error (auth/invalid-api-key)`

**해결:** `.env` 파일의 `FIREBASE_API_KEY`가 올바른지 확인하세요.

### 로그인 실패

**문제:** `Firebase: Error (auth/user-not-found)`

**해결:**
1. Firebase Console에서 사용자가 생성되었는지 확인
2. 이메일/비밀번호 로그인이 활성화되었는지 확인

### 토큰 만료

**문제:** API 요청 시 401 Unauthorized

**해결:**
1. `authStore.initAuthListener()`가 호출되었는지 확인
2. 로그아웃 후 다시 로그인

## 추가 기능

### 소셜 로그인 추가 (선택사항)

Google, GitHub 등의 소셜 로그인을 추가하려면:

1. Firebase Console에서 해당 제공업체 활성화
2. `useFirebaseAuth.ts`에 소셜 로그인 함수 추가
3. 로그인 페이지에 소셜 로그인 버튼 추가

### 이메일 인증 (선택사항)

이메일 인증을 추가하려면:

1. Firebase Console에서 이메일 인증 템플릿 설정
2. `sendEmailVerification()` 함수 사용
3. 회원가입 후 이메일 인증 링크 전송

## 참고 자료

- [Firebase Authentication 문서](https://firebase.google.com/docs/auth)
- [Firebase JavaScript SDK](https://firebase.google.com/docs/web/setup)
- [Nuxt 3 문서](https://nuxt.com)
