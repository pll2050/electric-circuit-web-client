<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="text-xl font-bold text-primary-600">
          Electric Circuit Web
        </NuxtLink>
        <div class="flex gap-4">
          <NuxtLink to="/editor" class="text-gray-700 hover:text-primary-600">
            에디터
          </NuxtLink>
          <NuxtLink to="/projects" class="text-gray-700 hover:text-primary-600">
            프로젝트
          </NuxtLink>
        </div>
      </nav>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="bg-gray-100 border-t border-gray-200 py-6">
      <div class="container mx-auto px-4 text-center text-gray-600 text-sm">
        © 2024 Electric Circuit Web. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Default layout
</script>
