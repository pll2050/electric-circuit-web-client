<template>
  <header class="bg-dark shadow-md">
    <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <img src="@/assets/icons/admin-logo.svg" alt="Admin Logo" class="w-8 h-8" />
        <span class="text-2xl font-bold text-white">Admin Panel</span>
      </div>
      <div class="flex items-center gap-4">
        <button class="text-white hover:text-gray-300">Profile</button>
        <button class="text-white hover:text-gray-300">Logout</button>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
// 관리자 헤더에 필요한 추가 로직을 여기에 작성합니다.
</script>

<style scoped>
.bg-dark {
  background-color: #343a40;
}
</style>