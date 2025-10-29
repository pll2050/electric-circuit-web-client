# 로그인 시스템 구현

## 개요
클라이언트에 로그인 및 회원가입 기능이 구현되었습니다.

## 구현된 파일

### 1. Pinia Store - 인증 상태 관리
- **위치**: `client/app/store/auth.ts`
- **기능**:
  - 사용자 로그인/로그아웃
  - 인증 상태 관리
  - 토큰 저장 및 검증
  - 에러 처리

### 2. 페이지
- **로그인 페이지**: `client/app/pages/login.vue`
  - 이메일/비밀번호 입력
  - 폼 유효성 검증
  - 에러 메시지 표시
  - 로그인 상태 유지 옵션
  - 소셜 로그인 UI (Google, GitHub)

- **회원가입 페이지**: `client/app/pages/register.vue`
  - 이름, 이메일, 비밀번호 입력
  - 비밀번호 확인
  - 약관 동의
  - 폼 유효성 검증

### 3. Composables
- **위치**: `client/app/composables/useApi.ts`
- **기능**:
  - REST API 통신을 위한 헬퍼 함수
  - GET, POST, PUT, PATCH, DELETE 메서드
  - 자동 토큰 주입
  - 에러 처리

### 4. 인증 보호
- **프로젝트 페이지**: `client/app/pages/projects.vue`
- **에디터 페이지**: `client/app/pages/editor.vue`
- 두 페이지 모두 로그인하지 않은 사용자는 자동으로 로그인 페이지로 리다이렉트됩니다.

### 5. 사용자 메뉴
- **에디터 메뉴바**: `client/app/components/editor/EditorMenuBar.vue`
  - 사용자 이름 및 이메일 표시
  - 로그아웃 버튼

- **프로젝트 페이지**: 헤더에 사용자 정보 및 로그아웃 버튼 추가

## 사용 방법

### 1. 로그인
1. `/login` 페이지로 이동
2. 이메일과 비밀번호 입력
3. 로그인 버튼 클릭
4. 성공 시 `/projects` 페이지로 자동 이동

### 2. 회원가입
1. 로그인 페이지에서 "회원가입" 링크 클릭
2. `/register` 페이지에서 정보 입력
3. 약관 동의 후 회원가입 버튼 클릭
4. 성공 시 로그인 페이지로 이동

### 3. 로그아웃
- 에디터: 상단 메뉴바의 사용자 메뉴에서 "로그아웃" 클릭
- 프로젝트 페이지: 헤더의 "로그아웃" 버튼 클릭

## API 엔드포인트

백엔드 서버에서 다음 엔드포인트를 구현해야 합니다:

### 로그인
```
POST /api/auth/login
Request Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "사용자 이름"
  },
  "token": "jwt-token"
}
```

### 회원가입
```
POST /api/auth/register
Request Body:
{
  "name": "사용자 이름",
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "사용자 이름"
  }
}
```

### 토큰 검증 (선택사항)
```
GET /api/auth/me
Headers:
Authorization: Bearer <token>

Response:
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "사용자 이름"
  }
}
```

## 환경 설정

`nuxt.config.ts`에 API 기본 URL을 설정할 수 있습니다:

```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8080/api'
    }
  }
})
```

## 보안 고려사항

1. **토큰 저장**: 현재는 localStorage를 사용하지만, 프로덕션에서는 httpOnly 쿠키 사용 권장
2. **HTTPS**: 프로덕션 환경에서는 반드시 HTTPS 사용
3. **비밀번호**: 최소 8자 이상 권장
4. **CSRF**: 필요시 CSRF 토큰 구현
5. **Rate Limiting**: 로그인 시도 횟수 제한 구현 권장

## 다음 단계

1. 백엔드 API 구현
2. 토큰 갱신 로직 구현
3. 비밀번호 재설정 기능 추가
4. 소셜 로그인 통합 (Google, GitHub)
5. 이메일 인증 기능 추가
6. 2단계 인증 (2FA) 구현
