<template>
  <div class="flex-1 relative overflow-hidden bg-white min-h-0">
    <div ref="canvasContainer" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvasContainer = ref<HTMLDivElement | null>(null)

const emit = defineEmits<{
  'initialized': [container: HTMLDivElement]
}>()

onMounted(() => {
  if (canvasContainer.value) {
    emit('initialized', canvasContainer.value)
  }
})

defineExpose({
  canvasContainer
})
</script>
