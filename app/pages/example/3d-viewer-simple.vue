<template>
  <div class="viewer-page">
    <div class="header">
      <h1>Simple 3D Viewer</h1>
      <p class="subtitle">Powered by Babylon.js</p>
    </div>

    <Card>
      <template #content>
        <div ref="canvasContainer" class="canvas-container">
          <canvas ref="renderCanvas" class="render-canvas"></canvas>
        </div>
      </template>

      <template #footer>
        <div class="controls">
          <Button label="Box" icon="pi pi-box" @click="createBox" />
          <Button label="Sphere" icon="pi pi-circle" @click="createSphere" severity="secondary" />
          <Button label="Cylinder" icon="pi pi-cog" @click="createCylinder" severity="info" />
          <Button label="Clear" icon="pi pi-trash" @click="clearScene" severity="danger" />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import * as BABYLON from '@babylonjs/core'

const renderCanvas = ref<HTMLCanvasElement | null>(null)
const canvasContainer = ref<HTMLElement | null>(null)

let engine: BABYLON.Engine | null = null
let scene: BABYLON.Scene | null = null
let camera: BABYLON.ArcRotateCamera | null = null
let currentMesh: BABYLON.Mesh | null = null

onMounted(() => {
  if (renderCanvas.value) {
    // Babylon.js 엔진 생성
    engine = new BABYLON.Engine(renderCanvas.value, true)

    // 씬 생성
    scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color4(0.9, 0.9, 0.95, 1)

    // 카메라 설정
    camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI / 4,
      Math.PI / 3,
      10,
      BABYLON.Vector3.Zero(),
      scene
    )
    camera.attachControl(renderCanvas.value, true)

    // 조명 추가
    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0),
      scene
    )
    light.intensity = 0.7

    const light2 = new BABYLON.DirectionalLight(
      'dirLight',
      new BABYLON.Vector3(-1, -2, -1),
      scene
    )
    light2.intensity = 0.5

    // 기본 구체 생성
    createSphere()

    // 렌더링 루프
    engine.runRenderLoop(() => {
      if (scene) {
        scene.render()
      }
    })

    // 리사이즈 핸들러
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (engine) {
    engine.dispose()
  }
})

function handleResize() {
  if (engine) {
    engine.resize()
  }
}

function createBox() {
  clearScene()
  if (scene) {
    currentMesh = BABYLON.MeshBuilder.CreateBox('box', { size: 2 }, scene)

    // 머티리얼 적용
    const material = new BABYLON.StandardMaterial('boxMat', scene)
    material.diffuseColor = new BABYLON.Color3(0.4, 0.6, 1)
    material.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3)
    currentMesh.material = material
  }
}

function createSphere() {
  clearScene()
  if (scene) {
    currentMesh = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2 }, scene)

    // 머티리얼 적용
    const material = new BABYLON.StandardMaterial('sphereMat', scene)
    material.diffuseColor = new BABYLON.Color3(1, 0.5, 0.4)
    material.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3)
    currentMesh.material = material
  }
}

function createCylinder() {
  clearScene()
  if (scene) {
    currentMesh = BABYLON.MeshBuilder.CreateCylinder('cylinder', { height: 3, diameter: 1.5 }, scene)

    // 머티리얼 적용
    const material = new BABYLON.StandardMaterial('cylinderMat', scene)
    material.diffuseColor = new BABYLON.Color3(0.5, 1, 0.5)
    material.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3)
    currentMesh.material = material
  }
}

function clearScene() {
  if (currentMesh) {
    currentMesh.dispose()
    currentMesh = null
  }
}
</script>

<style scoped>
.viewer-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.25rem;
  color: #718096;
}

.canvas-container {
  position: relative;
  width: 100%;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
}

.render-canvas {
  width: 100%;
  height: 100%;
  display: block;
  outline: none;
}

.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
