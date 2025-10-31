<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <!-- 페이지 헤더 -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">사용자 정보</h1>
      <p class="text-gray-600">계정 정보를 확인하고 관리하세요.</p>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="authStore.isLoading" class="flex justify-center py-12">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <!-- 프로필 정보 -->
    <div v-else-if="authStore.user" class="space-y-6">
      <!-- 프로필 카드 -->
      <Card class="overflow-hidden">
        <template #header>
          <div class="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
            <div class="flex items-center gap-6">
              <!-- 프로필 이미지 -->
              <div class="relative">
                <Avatar
                  v-if="authStore.user.photoURL"
                  :image="authStore.user.photoURL"
                  size="xlarge"
                  shape="circle"
                  class="border-4 border-white shadow-lg"
                />
                <Avatar
                  v-else
                  :label="getUserInitial"
                  size="xlarge"
                  shape="circle"
                  class="border-4 border-white shadow-lg bg-white text-primary-600"
                />
                
                <!-- 편집 버튼 -->
                <Button
                  icon="pi pi-camera"
                  severity="secondary"
                  size="small"
                  rounded
                  class="absolute bottom-0 right-0 shadow-lg"
                />
              </div>

              <!-- 사용자 정보 -->
              <div class="text-white">
                <h2 class="text-2xl font-bold mb-1">{{ authStore.user.displayName || '사용자' }}</h2>
                <p class="text-primary-100 mb-2">{{ authStore.user.email }}</p>
                <div class="flex items-center gap-2 text-sm text-primary-100">
                  <i class="pi pi-clock"></i>
                  가입일: {{ formatDate(new Date()) }}
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #content>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">계정 정보</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 사용자 ID -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">사용자 ID</label>
              <div class="flex gap-2">
                <InputText
                  :value="authStore.user.uid"
                  readonly
                  fluid
                  class="flex-1 bg-gray-50"
                />
                <Button
                  icon="pi pi-copy"
                  severity="secondary"
                  @click="copyToClipboard(authStore.user.uid)"
                  v-tooltip="'복사'"
                />
              </div>
            </div>

            <!-- 이메일 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">이메일</label>
              <InputText
                :value="authStore.user.email"
                readonly
                fluid
                class="bg-gray-50"
              />
            </div>

            <!-- 표시 이름 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">표시 이름</label>
              <InputText
                v-model="editedDisplayName"
                :readonly="!isEditing"
                fluid
                :class="{ 'bg-gray-50': !isEditing }"
              />
            </div>

            <!-- 프로필 URL -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">프로필 이미지 URL</label>
              <InputText
                v-model="editedPhotoURL"
                :readonly="!isEditing"
                fluid
                :class="{ 'bg-gray-50': !isEditing }"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>

          <!-- 편집 버튼 -->
          <div class="flex justify-end gap-3 mt-6">
            <template v-if="isEditing">
              <Button
                label="취소"
                severity="secondary"
                @click="cancelEdit"
              />
              <Button
                label="저장"
                :loading="isSaving"
                @click="saveProfile"
              />
            </template>
            <template v-else>
              <Button
                label="편집"
                @click="startEdit"
              />
            </template>
          </div>
        </template>
      </Card>

      <!-- 계정 활동 -->
      <Card>
        <template #title>계정 활동</template>
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <Avatar
                  icon="pi pi-check"
                  size="small"
                  class="bg-green-100 text-green-600"
                />
                <div>
                  <p class="text-sm font-medium text-gray-900">계정 생성</p>
                  <p class="text-xs text-gray-500">계정이 성공적으로 생성되었습니다</p>
                </div>
              </div>
              <Badge :value="formatDate(new Date())" severity="info" />
            </div>

            <div class="flex items-center justify-between py-3 border-b border-gray-100">
              <div class="flex items-center gap-3">
                <Avatar
                  icon="pi pi-sign-in"
                  size="small"
                  class="bg-blue-100 text-blue-600"
                />
                <div>
                  <p class="text-sm font-medium text-gray-900">최근 로그인</p>
                  <p class="text-xs text-gray-500">마지막 로그인 활동</p>
                </div>
              </div>
              <Badge :value="formatDate(new Date())" severity="info" />
            </div>
          </div>
        </template>
      </Card>

      <!-- 위험 영역 -->
      <Card class="border-red-200">
        <template #title>
          <span class="text-red-600">위험 영역</span>
        </template>
        <template #content>
          <Message severity="error" :closable="false">
            <div class="space-y-4">
              <div>
                <h4 class="text-sm font-medium text-red-800 mb-2">계정 삭제</h4>
                <p class="text-sm text-red-700 mb-3">
                  계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                </p>
                <Button
                  label="계정 삭제"
                  severity="danger"
                  variant="outlined"
                  @click="showDeleteAccount = true"
                />
              </div>
            </div>
          </Message>
        </template>
      </Card>
    </div>

    <!-- 로그인 안내 -->
    <Card v-else class="text-center">
      <template #content>
        <div class="py-12">
          <Avatar
            icon="pi pi-user"
            size="xlarge"
            class="mx-auto mb-4 text-gray-400"
          />
          <h2 class="text-xl font-semibold text-gray-900 mb-2">로그인이 필요합니다</h2>
          <p class="text-gray-600 mb-4">사용자 정보를 확인하려면 로그인해주세요.</p>
          <Button
            label="로그인하기"
            @click="$router.push('/login')"
          />
        </div>
      </template>
    </Card>

    <!-- 계정 삭제 확인 다이얼로그 -->
    <Dialog
      v-model:visible="showDeleteAccount"
      modal
      header="계정 삭제 확인"
      :style="{ width: '450px' }"
      class="mx-4"
      :draggable="false"
      :closable="false"
    >
      <div class="flex items-start gap-3 mb-4">
        <Avatar
          icon="pi pi-exclamation-triangle"
          size="large"
          class="bg-red-100 text-red-600"
        />
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">정말로 계정을 삭제하시겠습니까?</h3>
          <p class="text-sm text-gray-700">
            계정을 삭제하면 모든 프로젝트, 회로 설계, 개인 설정이 영구적으로 삭제됩니다. 
            이 작업은 되돌릴 수 없습니다.
          </p>
        </div>
      </div>

      <template #footer>
        <Button
          label="취소"
          severity="secondary"
          @click="showDeleteAccount = false"
        />
        <Button
          label="삭제"
          severity="danger"
          @click="deleteAccount"
        />
      </template>
    </Dialog>

    <!-- 토스트 컴포넌트 -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  title: '사용자 정보'
})

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

// 편집 상태
const isEditing = ref(false)
const isSaving = ref(false)
const showDeleteAccount = ref(false)

// 편집 가능한 필드들
const editedDisplayName = ref('')
const editedPhotoURL = ref('')

// 사용자 이름의 첫 글자 가져오기
const getUserInitial = computed(() => {
  const name = authStore.user?.displayName || authStore.user?.email || 'U'
  return name.charAt(0).toUpperCase()
})

// 편집 시작
const startEdit = () => {
  editedDisplayName.value = authStore.user?.displayName || ''
  editedPhotoURL.value = authStore.user?.photoURL || ''
  isEditing.value = true
}

// 편집 취소
const cancelEdit = () => {
  isEditing.value = false
  editedDisplayName.value = ''
  editedPhotoURL.value = ''
}

// 프로필 저장
const saveProfile = async () => {
  if (!authStore.user) return

  isSaving.value = true
  try {
    // Firebase 프로필 업데이트 로직을 여기에 추가
    // await updateProfile(authStore.user, {
    //   displayName: editedDisplayName.value,
    //   photoURL: editedPhotoURL.value || undefined
    // })

    // 임시로 성공 메시지만 표시
    toast.add({
      severity: 'success',
      summary: '성공',
      detail: '프로필이 성공적으로 업데이트되었습니다.',
      life: 3000
    })
    isEditing.value = false
  } catch (error) {
    console.error('프로필 업데이트 오류:', error)
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '프로필 업데이트에 실패했습니다.',
      life: 3000
    })
  } finally {
    isSaving.value = false
  }
}

// 계정 삭제
const deleteAccount = async () => {
  try {
    // 계정 삭제 로직을 여기에 추가
    toast.add({
      severity: 'warn',
      summary: '알림',
      detail: '계정 삭제 기능은 아직 구현되지 않았습니다.',
      life: 3000
    })
    showDeleteAccount.value = false
  } catch (error) {
    console.error('계정 삭제 오류:', error)
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: '계정 삭제에 실패했습니다.',
      life: 3000
    })
  }
}

// 클립보드에 복사
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.add({
      severity: 'success',
      summary: '복사 완료',
      detail: '클립보드에 복사되었습니다.',
      life: 3000
    })
  } catch (error) {
    console.error('복사 실패:', error)
    toast.add({
      severity: 'error',
      summary: '복사 실패',
      detail: '복사에 실패했습니다.',
      life: 3000
    })
  }
}

// 날짜 포맷
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

// 페이지 타이틀 설정
useHead({
  title: '사용자 정보'
})
</script>