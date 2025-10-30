<template>
  <div class="base-layout">
    <main class="content">
      <div class="menu-title">{{ title }}</div>
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.base-layout {
  padding: 1rem;
}

.menu-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.content {
  font-size: 1rem;
}
</style>