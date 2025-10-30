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
  margin-left: 250px;
  background-color: #f5f5f5;
}

.main-content {
  padding: 0;
  max-width: 100%;
}
</style>