<template>
  <div class="bg-gray-800 border-t border-gray-700 px-3 py-1 flex items-center justify-between text-xs text-gray-400">
    <div class="flex items-center gap-4">
      <span>좌표: X: {{ coordinates.x }}, Y: {{ coordinates.y }}</span>
      <span>배율: {{ zoomLevel }}%</span>
      <span>그리드: {{ gridSize }}mm</span>
    </div>
    <div class="flex items-center gap-4">
      <span>부품: {{ componentCount }}</span>
      <span>연결: {{ connectionCount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  coordinates?: { x: number; y: number }
  zoomLevel?: number
  gridSize?: number
  componentCount?: number
  connectionCount?: number
}>()
</script>
