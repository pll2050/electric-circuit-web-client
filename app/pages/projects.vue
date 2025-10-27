<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">내 프로젝트</h1>
          <p class="text-gray-600">저장된 회로 설계 프로젝트를 관리합니다</p>
        </div>
        <NuxtLink
          to="/editor"
          class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          새 프로젝트
        </NuxtLink>
      </div>

      <!-- Project Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Sample Project Cards -->
        <div
          v-for="project in sampleProjects"
          :key="project.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
        >
          <div class="h-48 bg-gray-100 flex items-center justify-center">
            <svg class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ project.name }}</h3>
            <p class="text-sm text-gray-600 mb-3">{{ project.description }}</p>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ project.updatedAt }}</span>
              <div class="flex gap-2">
                <button class="text-primary-600 hover:text-primary-700">
                  열기
                </button>
                <button class="text-red-600 hover:text-red-700">
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="sampleProjects.length === 0"
          class="col-span-full flex flex-col items-center justify-center py-12"
        >
          <svg class="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">프로젝트가 없습니다</h3>
          <p class="text-gray-600 mb-6">새 프로젝트를 만들어 회로 설계를 시작하세요</p>
          <NuxtLink
            to="/editor"
            class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            첫 프로젝트 만들기
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// Sample projects data
const sampleProjects = ref([
  {
    id: 1,
    name: '배전반 설계 A',
    description: 'Main distribution panel design',
    updatedAt: '2024-10-27',
  },
  {
    id: 2,
    name: '제어 회로 B',
    description: 'Control circuit for motor system',
    updatedAt: '2024-10-26',
  },
  {
    id: 3,
    name: '전원 공급 장치',
    description: 'Power supply unit design',
    updatedAt: '2024-10-25',
  },
])
</script>
