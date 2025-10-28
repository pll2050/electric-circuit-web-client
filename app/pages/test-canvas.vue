<template>
  <div class="h-screen w-screen flex flex-col p-4 bg-gray-100">
    <div class="mb-4 bg-white p-4 rounded shadow">
      <h1 class="text-2xl font-bold mb-2">@joint/core Grid Test Canvas</h1>
      <p class="text-gray-600">Testing @joint/core default grid display</p>
    </div>
    <div class="flex-1 bg-white rounded shadow overflow-hidden">
      <div ref="canvasContainer" class="w-full h-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const canvasContainer = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  if (!canvasContainer.value) return

  try {
    // Import @joint/core
    const joint = await import('@joint/core')
    console.log('JointJS loaded:', joint)

    // Create graph
    const graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes })

    // Create paper with grid
    const paper = new joint.dia.Paper({
      el: canvasContainer.value,
      model: graph,
      width: 1200,
      height: 800,
      gridSize: 10,
      background: { color: '#F5F5F5' },
      cellViewNamespace: joint.shapes
    })

    console.log('Paper created with grid')

    // Add a test rectangle to verify the canvas is working
    const rect = new joint.shapes.standard.Rectangle({
      position: { x: 100, y: 100 },
      size: { width: 100, height: 60 },
      attrs: {
        label: {
          text: 'Test Element',
          fill: '#1f2937'
        },
        body: {
          fill: '#dbeafe',
          stroke: '#3b82f6',
          strokeWidth: 2
        }
      }
    })

    graph.addCell(rect)
    console.log('Test element added')

  } catch (error) {
    console.error('Failed to initialize JointJS:', error)
  }
})
</script>
