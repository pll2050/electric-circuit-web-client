<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-4">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-primary-600 mb-4">
        Electric Circuit Web
      </h1>
      <p class="text-lg text-gray-600 mb-8">
        웹 기반 전기회로 설계 및 시뮬레이터
      </p>
      <div class="flex gap-4 justify-center">
        <NuxtLink
          to="/editor"
          class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          회로 설계 시작하기
        </NuxtLink>
        <NuxtLink
          to="/projects"
          class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          프로젝트 보기
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>
