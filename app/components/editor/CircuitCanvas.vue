<template>
  <div class="flex-1 relative overflow-hidden bg-white min-h-0">
    <div ref="canvasContainer" class="absolute inset-0 canvas-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

<style scoped>
.canvas-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

/* JointJS Paper Scroller 스타일 */
:deep(.joint-paper-scroller) {
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: auto;
  background: #f5f5f5;
}

:deep(.joint-paper) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.joint-paper-background) {
  fill: #ffffff;
}

/* Selection 스타일 */
:deep(.joint-selection) {
  border: 2px dashed #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

:deep(.joint-selection .handle) {
  fill: #3b82f6;
  stroke: #ffffff;
  stroke-width: 2;
  cursor: pointer;
}

/* FreeTransform 스타일 */
:deep(.joint-free-transform) {
  border: 1px solid #3b82f6;
}

:deep(.joint-free-transform .resize) {
  fill: #3b82f6;
  stroke: #ffffff;
  stroke-width: 2;
}

:deep(.joint-free-transform .rotate) {
  fill: #10b981;
  stroke: #ffffff;
  stroke-width: 2;
}

/* Snaplines 스타일 */
:deep(.joint-snapline) {
  stroke: #ec4899;
  stroke-width: 1;
  stroke-dasharray: 5, 5;
}

/* Link 도구 스타일 */
:deep(.link-tool) {
  fill: #3b82f6;
  stroke: #ffffff;
  stroke-width: 2;
}

:deep(.link-tool.tool-remove) {
  fill: #ef4444;
}
</style>
