<template>
  <main class="content">
    <header class="header">
      <h1>Welcome to Admin Panel</h1>
    </header>
    <section class="main-content">
      <p>This is the admin main page. Customize it as needed.</p>
    </section>
  </main>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  title: '관리자 대시보드 - Electric Circuit Web'
});
</script>

<style scoped>
.content {
  flex: 1;
  padding: 1rem;
}

.header {
  background-color: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.main-content {
  padding: 1rem;
}
</style>