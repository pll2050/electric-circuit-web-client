<template>
  <div class="bg-gray-800 border-b border-gray-700">
    <!-- Main Menu -->
    <div class="flex items-center px-2 py-1 text-xs">
      <button 
        @click="handleExit" 
        class="px-3 py-1 text-gray-300 hover:bg-gray-700 rounded"
      >
        나가기
      </button>
      
      <!-- File Menu with Dropdown -->
      <div class="relative" @mouseenter="showFileMenu = true" @mouseleave="showFileMenu = false">
        <button class="px-3 py-1 text-gray-300 hover:bg-gray-700 rounded">파일</button>
        <div v-if="showFileMenu" class="absolute top-full left-0 bg-gray-700 border border-gray-600 rounded-md shadow-lg py-1 z-50 min-w-40">
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">새 프로젝트</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">열기</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">저장</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">다른 이름으로 저장</button>
          <div class="border-t border-gray-600 my-1"></div>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">가져오기</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">내보내기</button>
        </div>
      </div>
      
      <!-- Edit Menu with Dropdown -->
      <div class="relative" @mouseenter="showEditMenu = true" @mouseleave="showEditMenu = false">
        <button class="px-3 py-1 text-gray-300 hover:bg-gray-700 rounded">편집</button>
        <div v-if="showEditMenu" class="absolute top-full left-0 bg-gray-700 border border-gray-600 rounded-md shadow-lg py-1 z-50 min-w-40">
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">실행 취소</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">다시 실행</button>
          <div class="border-t border-gray-600 my-1"></div>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">잘라내기</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">복사</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">붙여넣기</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">삭제</button>
          <div class="border-t border-gray-600 my-1"></div>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">모두 선택</button>
        </div>
      </div>
      
      <!-- View Menu with Dropdown -->
      <div class="relative" @mouseenter="showViewMenu = true" @mouseleave="showViewMenu = false">
        <button class="px-3 py-1 text-gray-300 hover:bg-gray-700 rounded">보기</button>
        <div v-if="showViewMenu" class="absolute top-full left-0 bg-gray-700 border border-gray-600 rounded-md shadow-lg py-1 z-50 min-w-40">
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">전체 화면</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">확대</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">축소</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">실제 크기</button>
          <div class="border-t border-gray-600 my-1"></div>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">격자 표시</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">눈금자 표시</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">가이드 표시</button>
        </div>
      </div>
      
      <!-- Insert Menu with Dropdown -->
      <div class="relative" @mouseenter="showInsertMenu = true" @mouseleave="showInsertMenu = false">
        <button class="px-3 py-1 text-gray-300 hover:bg-gray-700 rounded">삽입</button>
        <div v-if="showInsertMenu" class="absolute top-full left-0 bg-gray-700 border border-gray-600 rounded-md shadow-lg py-1 z-50 min-w-40">
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">전원 공급장치</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">저항</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">커패시터</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">인덕터</button>
          <div class="border-t border-gray-600 my-1"></div>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">다이오드</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">트랜지스터</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">IC</button>
          <div class="border-t border-gray-600 my-1"></div>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">텍스트</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">라벨</button>
        </div>
      </div>
      
      <!-- Project Menu with Dropdown -->
      <div class="relative" @mouseenter="showProjectMenu = true" @mouseleave="showProjectMenu = false">
        <button class="px-3 py-1 text-gray-300 hover:bg-gray-700 rounded">프로젝트</button>
        <div v-if="showProjectMenu" class="absolute top-full left-0 bg-gray-700 border border-gray-600 rounded-md shadow-lg py-1 z-50 min-w-40">
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">프로젝트 설정</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">구성 요소 라이브러리</button>
          <div class="border-t border-gray-600 my-1"></div>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">시뮬레이션 설정</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">보고서 생성</button>
          <div class="border-t border-gray-600 my-1"></div>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">프로젝트 정보</button>
        </div>
      </div>
      
      <!-- Tools Menu with Dropdown -->
      <div class="relative" @mouseenter="showToolsMenu = true" @mouseleave="showToolsMenu = false">
        <button class="px-3 py-1 text-gray-300 hover:bg-gray-700 rounded">도구</button>
        <div v-if="showToolsMenu" class="absolute top-full left-0 bg-gray-700 border border-gray-600 rounded-md shadow-lg py-1 z-50 min-w-40">
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">회로 검증</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">DC 분석</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">AC 분석</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">과도 분석</button>
          <div class="border-t border-gray-600 my-1"></div>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">옵션</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">플러그인 관리</button>
        </div>
      </div>
      
      <!-- Help Menu with Dropdown -->
      <div class="relative" @mouseenter="showHelpMenu = true" @mouseleave="showHelpMenu = false">
        <button class="px-3 py-1 text-gray-300 hover:bg-gray-700 rounded">도움말</button>
        <div v-if="showHelpMenu" class="absolute top-full left-0 bg-gray-700 border border-gray-600 rounded-md shadow-lg py-1 z-50 min-w-40">
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">사용자 가이드</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">튜토리얼</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">키보드 단축키</button>
          <div class="border-t border-gray-600 my-1"></div>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">온라인 도움말</button>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">포럼</button>
          <div class="border-t border-gray-600 my-1"></div>
          <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">정보</button>
        </div>
      </div>

      <!-- 사용자 메뉴 -->
      <div class="ml-auto flex items-center">
        <div class="relative" @mouseenter="showUserMenu = true" @mouseleave="showUserMenu = false">
          <button class="flex items-center px-3 py-1 text-gray-300 hover:bg-gray-700 rounded">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span v-if="authStore.user">{{ authStore.user.displayName }}</span>
            <span v-else>사용자</span>
          </button>
          <div v-if="showUserMenu" class="absolute top-full right-0 bg-gray-700 border border-gray-600 rounded-md shadow-lg py-1 z-50 min-w-40">
            <div class="px-3 py-2 text-xs text-gray-400 border-b border-gray-600">
              <div v-if="authStore.user">{{ authStore.user.email }}</div>
            </div>
            <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">프로필</button>
            <button class="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-600 text-xs">설정</button>
            <div class="border-t border-gray-600 my-1"></div>
            <button
              @click="handleLogout"
              class="w-full px-3 py-2 text-left text-red-400 hover:bg-gray-600 text-xs"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 나가기 확인 모달 -->
  <ConfirmModal
    :is-visible="showExitModal"
    title="나가기 확인"
    message="작업 중인 내용이 저장되지 않을 수 있습니다.&#10;정말로 나가시겠습니까?"
    confirm-text="나가기"
    cancel-text="취소"
    @confirm="confirmExit"
    @cancel="cancelExit"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ConfirmModal from '~/components/ui/ConfirmModal.vue'
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()

const showFileMenu = ref(false)
const showEditMenu = ref(false)
const showViewMenu = ref(false)
const showInsertMenu = ref(false)
const showProjectMenu = ref(false)
const showToolsMenu = ref(false)
const showHelpMenu = ref(false)
const showUserMenu = ref(false)
const showExitModal = ref(false)

const handleExit = () => {
  // 커스텀 확인 모달 표시
  showExitModal.value = true
}

const confirmExit = () => {
  // 확인을 클릭한 경우 홈페이지로 이동
  showExitModal.value = false
  navigateTo('/')
}

const cancelExit = () => {
  // 취소를 클릭한 경우 모달만 닫기
  showExitModal.value = false
}

const handleLogout = async () => {
  await authStore.logout()
  navigateTo('/login')
}
</script>
