<template>
  <div class="bg-gray-800 border-b border-gray-700">
    <!-- Main Menu -->
    <div class="flex items-center px-2 py-1 text-xs">
      <NuxtLink to="/" class="px-3 py-1 text-gray-300 hover:bg-gray-700 rounded">
        나가기
      </NuxtLink>
      
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showFileMenu = ref(false)
const showEditMenu = ref(false)
const showViewMenu = ref(false)
const showInsertMenu = ref(false)
const showProjectMenu = ref(false)
const showToolsMenu = ref(false)
const showHelpMenu = ref(false)
</script>
