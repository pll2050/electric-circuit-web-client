<template>
  <div class="relative" ref="dropdownRef">
    <!-- 사용자 정보 버튼 -->
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
      :class="{ 'bg-gray-50': isOpen }"
    >
      <!-- 프로필 이미지 또는 초기값 -->
      <div v-if="user?.photoURL" class="w-8 h-8 rounded-full overflow-hidden">
        <img :src="user.photoURL" :alt="user.displayName" class="w-full h-full object-cover">
      </div>
      <div v-else class="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm">
        {{ getUserInitial }}
      </div>
      
      <!-- 사용자 이름 -->
      <span class="text-sm font-medium text-gray-700 max-w-32 truncate">{{ user?.displayName || user?.email }}</span>
      
      <!-- 드롭다운 아이콘 -->
      <svg
        class="w-4 h-4 text-gray-500 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- 드롭다운 메뉴 -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white border border-gray-200 z-[9999]"
      >
        <div class="py-1">
          <!-- 사용자 정보 섹션 -->
          <div class="px-4 py-3 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div v-if="user?.photoURL" class="w-10 h-10 rounded-full overflow-hidden">
                <img :src="user.photoURL" :alt="user.displayName" class="w-full h-full object-cover">
              </div>
              <div v-else class="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                {{ getUserInitial }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ user?.displayName || '사용자' }}</p>
                <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
              </div>
            </div>
          </div>

          <!-- 메뉴 항목들 -->
          <div class="py-1">
            <button
              @click="navigateToProfile"
              class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              사용자 정보
            </button>

            <button
              @click="navigateToSettings"
              class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              설정
            </button>

            <div class="border-t border-gray-100 my-1"></div>

            <button
              @click="handleLogout"
              class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/store/auth'

interface Props {
  user: {
    uid: string
    email: string
    displayName: string
    photoURL?: string
  } | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  logout: []
}>()

const authStore = useAuthStore()
const router = useRouter()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

// 사용자 이름의 첫 글자 가져오기
const getUserInitial = computed(() => {
  const name = props.user?.displayName || props.user?.email || 'U'
  return name.charAt(0).toUpperCase()
})

// 드롭다운 토글
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 드롭다운 닫기
const closeDropdown = () => {
  isOpen.value = false
}

// 페이지 이동 함수
const navigateToProfile = () => {
  closeDropdown()
  router.push('/profile')
}

const navigateToSettings = () => {
  closeDropdown()
  router.push('/settings')
}

// 로그아웃 처리
const handleLogout = async () => {
  try {
    closeDropdown()
    await authStore.logout()
    emit('logout')
    router.push('/')
  } catch (error) {
    console.error('로그아웃 오류:', error)
  }
}

// 외부 클릭 시 드롭다운 닫기
const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  // 캡처 단계가 아닌 버블링 단계에서 이벤트 리스닝
  document.addEventListener('click', handleClickOutside, false)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, false)
})
</script>