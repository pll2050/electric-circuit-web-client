<template>
  <div class="babylon-container">
    <canvas ref="babylonCanvas" class="babylon-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const babylonCanvas = ref<HTMLCanvasElement | null>(null)

onMounted(async () => {
  const BABYLON = await import('babylonjs')
  const canvas = babylonCanvas.value
  if (!canvas) return

  // 기본 엔진 및 씬 생성
  const engine = new BABYLON.Engine(canvas, true)
  const scene = new BABYLON.Scene(engine)

  // 카메라 생성
  const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 4, 4, BABYLON.Vector3.Zero(), scene)
  camera.attachControl(canvas, true)

  // 라이트 생성
  const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene)

  // 샘플 구체 생성
  const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene)
  sphere.position.y = 1

  // 바닥 생성
  const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene)

  engine.runRenderLoop(() => {
    scene.render()
  })

  window.addEventListener('resize', () => {
    engine.resize()
  })
})
</script>

<style scoped>
.babylon-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.babylon-canvas {
  width: 100vw;
  height: 100vh;
  display: block;
}
</style>
