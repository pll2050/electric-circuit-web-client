<template>
  <BaseLayout title="관리자 대시보드 - Electric Circuit Web">
    <section class="main-content">
      <p>This is the admin main page. Customize it as needed.</p>
    </section>
  </BaseLayout>
</template>

<script setup>
import BaseLayout from '@/components/BaseLayout.vue';

definePageMeta({
  layout: 'admin',
  title: '관리자 대시보드 - Electric Circuit Web'
});
</script>

<style scoped>
.main-content {
  padding: 1rem;
}
</style>