<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- 페이지 헤더 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">설정</h1>
      <p class="text-gray-600">애플리케이션 설정을 관리하세요.</p>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="authStore.isLoading" class="flex justify-center py-12">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" />
    </div>

    <!-- 설정 패널 -->
    <div v-else-if="authStore.user" class="space-y-6">
      <!-- 일반 설정 -->
      <Card class="shadow-md">
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-cog text-primary"></i>
            <h3>일반 설정</h3>
          </div>
        </template>
        <template #content>
          <div class="space-y-6">
            <!-- 언어 설정 -->
            <div class="field">
              <label for="language" class="block text-sm font-medium mb-2">언어</label>
              <Select
                id="language"
                v-model="settings.language"
                :options="languages"
                option-label="label"
                option-value="value"
                placeholder="언어를 선택하세요"
                fluid
                @change="saveSettings"
              />
            </div>

            <!-- 테마 설정 -->
            <div class="field">
              <label class="block text-sm font-medium mb-4">테마</label>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  v-for="theme in themes"
                  :key="theme.value"
                  class="theme-option"
                >
                  <div 
                    :class="[
                      'border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md',
                      settings.theme === theme.value 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                    @click="setTheme(theme.value)"
                  >
                    <div class="flex items-center gap-3">
                      <div :class="theme.iconClass"></div>
                      <div class="flex-1">
                        <div class="font-medium">{{ theme.label }}</div>
                        <div class="text-sm text-gray-500">{{ theme.description }}</div>
                      </div>
                      <RadioButton
                        :value="theme.value"
                        v-model="settings.theme"
                        :input-id="theme.value"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 알림 설정 -->
            <div class="field">
              <label class="block text-sm font-medium mb-4">알림 설정</label>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div class="font-medium">이메일 알림</div>
                    <div class="text-sm text-muted-color">중요한 업데이트를 이메일로 받습니다</div>
                  </div>
                  <ToggleSwitch
                    v-model="settings.notifications.email"
                    @change="saveSettings"
                  />
                </div>
                
                <div class="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div class="font-medium">푸시 알림</div>
                    <div class="text-sm text-muted-color">브라우저 푸시 알림을 받습니다</div>
                  </div>
                  <ToggleSwitch
                    v-model="settings.notifications.push"
                    @change="saveSettings"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 계정 설정 -->
      <Card class="shadow-md">
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-user text-primary"></i>
            <h3>계정 설정</h3>
          </div>
        </template>
        <template #content>
          <div class="space-y-6">
            <!-- 프로필 정보 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="field">
                <label for="displayName" class="block text-sm font-medium mb-2">표시 이름</label>
                <InputText
                  id="displayName"
                  v-model="profileData.displayName"
                  placeholder="표시 이름을 입력하세요"
                  fluid
                />
              </div>

              <div class="field">
                <label for="email" class="block text-sm font-medium mb-2">이메일</label>
                <InputText
                  id="email"
                  v-model="profileData.email"
                  disabled
                  fluid
                />
              </div>
            </div>

            <!-- 비밀번호 변경 -->
            <Divider align="left">
              <div class="inline-flex items-center gap-2">
                <i class="pi pi-key"></i>
                <b>비밀번호 변경</b>
              </div>
            </Divider>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="field">
                <label for="currentPassword" class="block text-sm font-medium mb-2">현재 비밀번호</label>
                <Password
                  id="currentPassword"
                  v-model="passwordData.current"
                  placeholder="현재 비밀번호"
                  toggle-mask
                  fluid
                  :feedback="false"
                />
              </div>

              <div class="field">
                <label for="newPassword" class="block text-sm font-medium mb-2">새 비밀번호</label>
                <Password
                  id="newPassword"
                  v-model="passwordData.new"
                  placeholder="새 비밀번호"
                  toggle-mask
                  fluid
                />
              </div>

              <div class="field">
                <label for="confirmPassword" class="block text-sm font-medium mb-2">비밀번호 확인</label>
                <Password
                  id="confirmPassword"
                  v-model="passwordData.confirm"
                  placeholder="비밀번호 확인"
                  toggle-mask
                  :feedback="false"
                  fluid
                />
              </div>
            </div>

            <div class="flex gap-3 pt-4">
              <Button
                label="프로필 업데이트"
                icon="pi pi-save"
                @click="updateProfile"
                :loading="isUpdatingProfile"
                size="small"
              />
              <Button
                label="비밀번호 변경"
                icon="pi pi-key"
                severity="secondary"
                @click="changePassword"
                :loading="isChangingPassword"
                size="small"
              />
            </div>
          </div>
        </template>
      </Card>

      <!-- 에디터 설정 -->
      <Card class="shadow-md">
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-palette text-primary"></i>
            <h3>에디터 설정</h3>
          </div>
        </template>
        <template #content>
          <div class="space-y-6">
            <!-- 그리드 설정 -->
            <div class="field">
              <label class="block text-sm font-medium mb-4">그리드 크기: {{ settings.editor.gridSize }}px</label>
              <Slider
                v-model="settings.editor.gridSize"
                :min="10"
                :max="50"
                :step="5"
                @slideend="saveSettings"
                class="w-full"
              />
            </div>

            <!-- 에디터 옵션 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div class="font-medium">그리드에 스냅</div>
                  <div class="text-sm text-muted-color">요소를 그리드에 자동으로 정렬</div>
                </div>
                <ToggleSwitch
                  v-model="settings.editor.snapToGrid"
                  @change="saveSettings"
                />
              </div>

              <div class="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div class="font-medium">자동 저장</div>
                  <div class="text-sm text-muted-color">변경사항을 자동으로 저장</div>
                </div>
                <ToggleSwitch
                  v-model="settings.editor.autoSave"
                  @change="saveSettings"
                />
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 위험 영역 -->
      <Card class="shadow-md border-l-4 border-l-red-500">
        <template #title>
          <div class="flex items-center gap-2 text-red-600">
            <i class="pi pi-exclamation-triangle"></i>
            <h3>위험 영역</h3>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">계정 삭제</h4>
              <p class="text-sm text-gray-600 mb-4">
                계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
              </p>
              <Button
                label="계정 삭제"
                icon="pi pi-trash"
                severity="danger"
                variant="outlined"
                @click="confirmDeleteAccount = true"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- 로그인되지 않은 상태 -->
    <div v-else class="text-center py-12">
      <i class="pi pi-lock text-6xl text-gray-400 mb-4"></i>
      <div class="text-gray-500 mb-4">설정에 접근하려면 로그인이 필요합니다.</div>
      <Button
        label="로그인하기"
        icon="pi pi-sign-in"
        severity="info"
        @click="$router.push('/login')"
      />
    </div>

    <!-- 계정 삭제 확인 다이얼로그 -->
    <Dialog
      v-model:visible="confirmDeleteAccount"
      modal
      header="계정 삭제 확인"
      :style="{ width: '450px' }"
      class="mx-4"
      :draggable="false"
      :closable="false"
    >
      <div class="text-center">
        <i class="pi pi-exclamation-triangle text-4xl text-red-500 mb-4"></i>
        <p class="mb-4 text-lg font-medium">정말로 계정을 삭제하시겠습니까?</p>
        <p class="text-sm text-muted-color mb-6">
          이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <Button
            label="취소"
            icon="pi pi-times"
            severity="secondary"
            variant="outlined"
            @click="confirmDeleteAccount = false"
          />
          <Button
            label="삭제"
            icon="pi pi-trash"
            severity="danger"
            @click="deleteAccount"
            :loading="isDeletingAccount"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
import { useToast } from 'primevue/usetoast'

// 인증 체크
definePageMeta({
  title: '설정',
  middleware: 'auth'
})

const authStore = useAuthStore()
const toast = useToast()

// 반응형 데이터
const settings = ref({
  language: 'ko',
  theme: 'light',
  notifications: {
    email: true,
    push: false
  },
  editor: {
    gridSize: 20,
    snapToGrid: true,
    autoSave: true
  }
})

const profileData = ref({
  displayName: '',
  email: ''
})

const passwordData = ref({
  current: '',
  new: '',
  confirm: ''
})

const isUpdatingProfile = ref(false)
const isChangingPassword = ref(false)
const isDeletingAccount = ref(false)
const confirmDeleteAccount = ref(false)

// 옵션 데이터
const languages = [
  { label: '한국어', value: 'ko' },
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' },
  { label: '中文', value: 'zh' }
]

const themes = [
  {
    value: 'light',
    label: '라이트',
    description: '밝은 테마',
    iconClass: 'w-6 h-6 bg-white border-2 border-gray-300 rounded-full'
  },
  {
    value: 'dark',
    label: '다크',
    description: '어두운 테마',
    iconClass: 'w-6 h-6 bg-gray-800 rounded-full'
  },
  {
    value: 'auto',
    label: '자동',
    description: '시스템 설정에 따름',
    iconClass: 'w-6 h-6 bg-gradient-to-r from-white to-gray-800 rounded-full border border-gray-300'
  }
]

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  loadUserData()
  loadSettings()
})

// 사용자 데이터 로드
const loadUserData = () => {
  if (authStore.user) {
    profileData.value = {
      displayName: authStore.user.displayName || '',
      email: authStore.user.email || ''
    }
  }
}

// 설정 로드
const loadSettings = () => {
  const savedSettings = localStorage.getItem('app_settings')
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings)
      settings.value = { ...settings.value, ...parsed }
    } catch (error) {
      console.error('설정 로드 오류:', error)
    }
  }
}

// 설정 저장
const saveSettings = () => {
  try {
    localStorage.setItem('app_settings', JSON.stringify(settings.value))
    toast.add({
      severity: 'success',
      summary: '설정 저장됨',
      detail: '설정이 성공적으로 저장되었습니다.',
      life: 3000
    })
  } catch (error) {
    console.error('설정 저장 오류:', error)
    toast.add({
      severity: 'error',
      summary: '저장 실패',
      detail: '설정 저장 중 오류가 발생했습니다.',
      life: 3000
    })
  }
}

// 테마 설정
const setTheme = (theme: string) => {
  settings.value.theme = theme
  saveSettings()
  // 실제 테마 적용 로직은 여기에 구현
}

// 프로필 업데이트
const updateProfile = async () => {
  isUpdatingProfile.value = true
  try {
    // 실제 프로필 업데이트 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000)) // 시뮬레이션
    
    toast.add({
      severity: 'success',
      summary: '프로필 업데이트 완료',
      detail: '프로필이 성공적으로 업데이트되었습니다.',
      life: 3000
    })
  } catch (error) {
    console.error('프로필 업데이트 오류:', error)
    toast.add({
      severity: 'error',
      summary: '업데이트 실패',
      detail: '프로필 업데이트 중 오류가 발생했습니다.',
      life: 3000
    })
  } finally {
    isUpdatingProfile.value = false
  }
}

// 비밀번호 변경
const changePassword = async () => {
  if (passwordData.value.new !== passwordData.value.confirm) {
    toast.add({
      severity: 'warn',
      summary: '비밀번호 불일치',
      detail: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.',
      life: 3000
    })
    return
  }

  isChangingPassword.value = true
  try {
    // 실제 비밀번호 변경 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000)) // 시뮬레이션
    
    passwordData.value = { current: '', new: '', confirm: '' }
    toast.add({
      severity: 'success',
      summary: '비밀번호 변경 완료',
      detail: '비밀번호가 성공적으로 변경되었습니다.',
      life: 3000
    })
  } catch (error) {
    console.error('비밀번호 변경 오류:', error)
    toast.add({
      severity: 'error',
      summary: '변경 실패',
      detail: '비밀번호 변경 중 오류가 발생했습니다.',
      life: 3000
    })
  } finally {
    isChangingPassword.value = false
  }
}

// 계정 삭제
const deleteAccount = async () => {
  isDeletingAccount.value = true
  try {
    // 실제 계정 삭제 API 호출
    await new Promise(resolve => setTimeout(resolve, 2000)) // 시뮬레이션
    
    await authStore.logout()
    navigateTo('/login')
  } catch (error) {
    console.error('계정 삭제 오류:', error)
    toast.add({
      severity: 'error',
      summary: '삭제 실패',
      detail: '계정 삭제 중 오류가 발생했습니다.',
      life: 3000
    })
  } finally {
    isDeletingAccount.value = false
    confirmDeleteAccount.value = false
  }
}
</script>

<style scoped>
.field {
  margin-bottom: 1.5rem;
}

.theme-option .border-primary {
  border-color: rgb(var(--p-primary-500));
}

.theme-option .bg-primary\/5 {
  background-color: rgb(var(--p-primary-500) / 0.05);
}
</style>