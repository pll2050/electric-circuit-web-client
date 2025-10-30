<template>
  <div class="base-layout">
    <header class="title">{{ title }}</header>
    <main class="content">
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

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.content {
  font-size: 1rem;
}
</style>