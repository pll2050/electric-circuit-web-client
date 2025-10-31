<template>
  <div class="admin-layout">
    <div class="admin-header">
      <h1 class="header-title">{{ route.meta.title }}</h1>
    </div>
    <AdminSidebar />
    <main class="content">
      <section class="main-content">
        <nuxt-page />
      </section>
    </main>
  </div>
</template>

<script setup>
import AdminSidebar from '~/components/layout/admin/Sidebar.vue';
import { useHead } from '@unhead/vue';
import { useRoute } from '#app';

defineProps({
  title: {
    type: String,
    required: true,
  },
});

const route = useRoute();

useHead({
  title: `${route.meta.title || title} - Electric Circuit Web`,
});
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.admin-header {
  background-color: #343a40;
  color: white;
  padding: 1rem;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.content {
  flex: 1;
  display: flex;
  margin-left: 250px;
  background-color: #f5f5f5;
}

.main-content {
  padding: 0;
  max-width: 100%;
}
</style>