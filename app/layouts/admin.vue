<template>
  <div class="admin-layout">
    <!-- <AdminHeader /> -->
    <AdminSidebar />
    <main class="content">
      <section class="main-content">
        <nuxt-page />
      </section>
    </main>
  </div>
</template>

<script setup>
import AdminHeader from '~/components/AdminHeader.vue';
import AdminSidebar from '~/components/AdminSidebar.vue';
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 1rem;
  margin-left: 250px;
}

.main-content {
  padding: 1rem;
}
</style>