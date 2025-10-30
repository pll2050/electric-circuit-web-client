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

  // Babylon.js 엔진 및 씬 생성
  const engine = new BABYLON.Engine(canvas, true)
  const scene = new BABYLON.Scene(engine)
  const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 4, 4, BABYLON.Vector3.Zero(), scene)
  camera.attachControl(canvas, true)
  const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene)

  // 샘플: 박스와 구체 생성
  const box = BABYLON.MeshBuilder.CreateBox('box', { size: 1 }, scene)
  box.position.x = -1.2
  const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene)
  sphere.position.x = 1.2

  // 머티리얼 적용
  const boxMat = new BABYLON.StandardMaterial('boxMat', scene)
  boxMat.diffuseColor = new BABYLON.Color3(0.2, 0.6, 1)
  box.material = boxMat
  const sphereMat = new BABYLON.StandardMaterial('sphereMat', scene)
  sphereMat.diffuseColor = new BABYLON.Color3(1, 0.6, 0.2)
  sphere.material = sphereMat

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
