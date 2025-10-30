<template>
  <div class="container mx-auto p-8">
    <Card class="mb-8">
      <template #title>PrimeVue 컴포넌트 테스트</template>
      <template #content>
        <p class="mb-4">PrimeVue가 제대로 로드되고 있는지 테스트하는 페이지입니다.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 버튼 테스트 -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Button 컴포넌트</h3>
            <div class="flex flex-col gap-2">
              <Button label="기본 버튼" @click="showToast('기본 버튼 클릭!')" />
              <Button label="보조 버튼" severity="secondary" @click="showToast('보조 버튼 클릭!')" />
              <Button label="위험 버튼" severity="danger" variant="outlined" @click="showToast('위험 버튼 클릭!')" />
              <Button label="정보 버튼" severity="info" size="small" @click="showToast('정보 버튼 클릭!')" />
            </div>
          </div>

          <!-- 입력 컴포넌트 테스트 -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Input 컴포넌트</h3>
            <div class="flex flex-col gap-3">
              <InputText v-model="testText" placeholder="텍스트 입력" fluid />
              <Password v-model="testPassword" placeholder="비밀번호 입력" fluid />
              <Select v-model="selectedOption" :options="options" optionLabel="label" placeholder="옵션 선택" fluid />
            </div>
          </div>

          <!-- 토글 컴포넌트 테스트 -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Toggle 컴포넌트</h3>
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-2">
                <ToggleSwitch v-model="toggleValue" />
                <label>토글 스위치: {{ toggleValue ? 'ON' : 'OFF' }}</label>
              </div>
              <div class="flex items-center gap-2">
                <Checkbox v-model="checkboxValue" binary />
                <label>체크박스: {{ checkboxValue ? '선택됨' : '선택안됨' }}</label>
              </div>
            </div>
          </div>

          <!-- 메시지 컴포넌트 테스트 -->
          <div>
            <h3 class="text-lg font-semibold mb-3">Message 컴포넌트</h3>
            <div class="flex flex-col gap-2">
              <Message severity="success" :closable="false">성공 메시지</Message>
              <Message severity="info" :closable="false">정보 메시지</Message>
              <Message severity="warn" :closable="false">경고 메시지</Message>
              <Message severity="error" :closable="false">오류 메시지</Message>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <Button label="다이얼로그 열기" @click="showDialog = true" />
        </div>
      </template>
    </Card>

    <!-- 다이얼로그 테스트 -->
    <Dialog v-model:visible="showDialog" modal header="테스트 다이얼로그" :style="{ width: '450px' }">
      <p>이것은 PrimeVue Dialog 컴포넌트 테스트입니다.</p>
      <template #footer>
        <Button label="취소" severity="secondary" @click="showDialog = false" />
        <Button label="확인" @click="handleConfirm" />
      </template>
    </Dialog>

    <!-- Toast 컴포넌트 -->
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'

// 페이지 메타데이터
definePageMeta({
  title: 'PrimeVue 테스트'
})

// Toast 컴포저블
const toast = useToast()

// 반응형 데이터
const testText = ref('')
const testPassword = ref('')
const selectedOption = ref(null)
const toggleValue = ref(false)
const checkboxValue = ref(false)
const showDialog = ref(false)

// 옵션 데이터
const options = ref([
  { label: '옵션 1', value: 'option1' },
  { label: '옵션 2', value: 'option2' },
  { label: '옵션 3', value: 'option3' }
])

// 메서드
const showToast = (message: string) => {
  toast.add({
    severity: 'success',
    summary: '알림',
    detail: message,
    life: 3000
  })
}

const handleConfirm = () => {
  showDialog.value = false
  showToast('다이얼로그에서 확인 버튼을 클릭했습니다!')
}
</script>