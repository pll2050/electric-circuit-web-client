<template>
  <div class="opencascade-sample">
    <div class="header">
      <h1>OpenCascade.js Sample</h1>
      <p class="subtitle">3D CAD Kernel for the Web</p>
    </div>

    <Card class="viewer-card">
      <template #header>
        <div class="card-header">
          <img
            class="logo"
            src="https://github.com/donalffons/opencascade.js/raw/master/images/logo.svg"
            alt="OpenCascade.js Logo"
          />
        </div>
      </template>

      <template #content>
        <div v-if="loading" class="loading-state">
          <ProgressSpinner />
          <p>Loading OpenCascade.js...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <Message severity="error">
            Failed to initialize OpenCascade.js: {{ error }}
          </Message>
        </div>

        <div v-else class="viewer-container">
          <div class="renderer-selector">
            <label class="selector-label">Select Renderer:</label>
            <div class="toggle-group">
              <Button
                :label="'Three.js'"
                :severity="selectedRenderer === 'threejs' ? 'primary' : 'secondary'"
                @click="selectedRenderer = 'threejs'"
                :outlined="selectedRenderer !== 'threejs'"
              />
              <Button
                :label="'Babylon.js'"
                :severity="selectedRenderer === 'babylonjs' ? 'primary' : 'secondary'"
                @click="selectedRenderer = 'babylonjs'"
                :outlined="selectedRenderer !== 'babylonjs'"
              />
            </div>
          </div>

          <div v-if="selectedRenderer === 'threejs'" class="viewer-section">
            <h3 class="viewer-title">Three.js Renderer</h3>
            <div id="oc-viewer" ref="viewerRef" class="three-viewer"></div>
          </div>

          <div v-if="selectedRenderer === 'babylonjs'" class="viewer-section">
            <h3 class="viewer-title">Babylon.js Renderer</h3>
            <canvas ref="babylonCanvas" class="babylon-viewer"></canvas>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="controls">
          <Button
            label="Generate Sphere"
            icon="pi pi-circle"
            @click="generateSphere"
            severity="secondary"
          />
          <Button
            label="Generate Box"
            icon="pi pi-stop"
            @click="generateBox"
            severity="success"
          />
          <Button
            label="Generate Cylinder"
            icon="pi pi-ellipsis-v"
            @click="generateCylinder"
            severity="info"
          />
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as BABYLON from '@babylonjs/core'
import '@babylonjs/loaders'

// opencascade.js 타입 선언
declare module 'opencascade.js' {
  export function initOpenCascade(): Promise<any>
}

// OpenCascade.js 인스턴스
let oc: any = null

// Three.js 변수
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let controls: OrbitControls | null = null
let animationId: number | null = null

// Babylon.js 변수
let babylonEngine: BABYLON.Engine | undefined = undefined
let babylonScene: BABYLON.Scene | undefined = undefined

const loading = ref(true)
const error = ref<string | null>(null)
const viewerRef = ref<HTMLElement | null>(null)
const babylonCanvas = ref<HTMLCanvasElement | null>(null)
const selectedRenderer = ref<'threejs' | 'babylonjs'>('threejs')

// OpenCascade.js 초기화
onMounted(async () => {
  try {
    // 클라이언트 사이드에서만 실행
    if (process.client) {
      // OpenCascade.js 동적 임포트
      console.log('Loading OpenCascade.js...')
      const { initOpenCascade } = await import('opencascade.js')

      console.log('Initializing OpenCascade...')
      oc = await initOpenCascade()
      console.log('OpenCascade initialized successfully')

      // loading을 false로 설정하여 viewer DOM이 렌더링되도록 함
      loading.value = false

      // DOM이 렌더링될 때까지 대기
      await nextTick()

      // Three.js 씬 초기화
      console.log('Initializing Three.js scene...')
      initThreeJS()
      console.log('Three.js scene initialized')

      // Babylon.js 씬 초기화
      console.log('Initializing Babylon.js scene...')
      initBabylonJS()
      console.log('Babylon.js scene initialized')

      // 기본 구체 생성
      console.log('Generating initial sphere...')
      await generateSphere()
      console.log('Initial sphere generated')

      console.log('Loading complete, viewer should be visible')
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to initialize'
    loading.value = false
    console.error('OpenCascade.js initialization error:', err)
  }
})

onBeforeUnmount(() => {
  // Three.js cleanup
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
  if (controls) {
    controls.dispose()
  }

  // Babylon.js cleanup
  if (babylonScene) {
    babylonScene.dispose()
  }
  if (babylonEngine) {
    babylonEngine.dispose()
  }
})

// 렌더러 전환 시 초기화
watch(selectedRenderer, async (newRenderer) => {
  console.log('Renderer changed to:', newRenderer)

  await nextTick()

  if (newRenderer === 'threejs' && !scene) {
    initThreeJS()
  } else if (newRenderer === 'babylonjs' && !babylonScene) {
    initBabylonJS()
  }
})

// Three.js 초기화
function initThreeJS() {
  if (!viewerRef.value) return

  // 씬 생성
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  // 카메라 생성
  const width = viewerRef.value.clientWidth
  const height = viewerRef.value.clientHeight
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.set(5, 5, 5)
  camera.lookAt(0, 0, 0)

  // 렌더러 생성
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.shadowMap.enabled = true
  viewerRef.value.appendChild(renderer.domElement)

  // 컨트롤 추가
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05

  // 조명 추가
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 10, 10)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // 그리드 헬퍼 추가
  const gridHelper = new THREE.GridHelper(10, 10)
  scene.add(gridHelper)

  // XYZ 축 화살표 추가
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // 애니메이션 루프
  animate()
}

function animate() {
  if (!scene || !camera || !renderer || !controls) return

  animationId = requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

// Babylon.js 초기화
function initBabylonJS() {
  if (!babylonCanvas.value) return

  // 엔진 생성
  babylonEngine = new BABYLON.Engine(babylonCanvas.value, true)

  // 씬 생성
  babylonScene = new BABYLON.Scene(babylonEngine)
  babylonScene.clearColor = new BABYLON.Color4(0.94, 0.94, 0.94, 1)

  // 카메라 생성
  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    Math.PI / 4,
    Math.PI / 3,
    10,
    BABYLON.Vector3.Zero(),
    babylonScene
  )
  camera.attachControl(babylonCanvas.value, true)
  camera.lowerRadiusLimit = 2
  camera.upperRadiusLimit = 20

  // 조명 추가
  const light1 = new BABYLON.HemisphericLight(
    'light1',
    new BABYLON.Vector3(0, 1, 0),
    babylonScene
  )
  light1.intensity = 0.6

  const light2 = new BABYLON.DirectionalLight(
    'light2',
    new BABYLON.Vector3(-1, -2, -1),
    babylonScene
  )
  light2.position = new BABYLON.Vector3(10, 10, 10)
  light2.intensity = 0.8

  // 그리드 추가
  const ground = BABYLON.MeshBuilder.CreateGround(
    'ground',
    { width: 10, height: 10, subdivisions: 10 },
    babylonScene
  )
  const groundMaterial = new BABYLON.StandardMaterial('groundMat', babylonScene)
  groundMaterial.wireframe = true
  groundMaterial.alpha = 0.3
  ground.material = groundMaterial

  // XYZ 축 화살표 추가
  const axisSize = 5

  // X축 (빨간색)
  const xAxis = BABYLON.MeshBuilder.CreateLines(
    'xAxis',
    {
      points: [
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(axisSize, 0, 0),
      ],
    },
    babylonScene
  )
  xAxis.color = new BABYLON.Color3(1, 0, 0)

  const xCone = BABYLON.MeshBuilder.CreateCylinder(
    'xCone',
    { diameterTop: 0, diameterBottom: 0.1, height: 0.3 },
    babylonScene
  )
  xCone.position = new BABYLON.Vector3(axisSize, 0, 0)
  xCone.rotation.z = -Math.PI / 2
  const xConeMat = new BABYLON.StandardMaterial('xConeMat', babylonScene)
  xConeMat.diffuseColor = new BABYLON.Color3(1, 0, 0)
  xCone.material = xConeMat

  // Y축 (초록색)
  const yAxis = BABYLON.MeshBuilder.CreateLines(
    'yAxis',
    {
      points: [
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, axisSize, 0),
      ],
    },
    babylonScene
  )
  yAxis.color = new BABYLON.Color3(0, 1, 0)

  const yCone = BABYLON.MeshBuilder.CreateCylinder(
    'yCone',
    { diameterTop: 0, diameterBottom: 0.1, height: 0.3 },
    babylonScene
  )
  yCone.position = new BABYLON.Vector3(0, axisSize, 0)
  const yConeMat = new BABYLON.StandardMaterial('yConeMat', babylonScene)
  yConeMat.diffuseColor = new BABYLON.Color3(0, 1, 0)
  yCone.material = yConeMat

  // Z축 (파란색)
  const zAxis = BABYLON.MeshBuilder.CreateLines(
    'zAxis',
    {
      points: [
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, 0, axisSize),
      ],
    },
    babylonScene
  )
  zAxis.color = new BABYLON.Color3(0, 0, 1)

  const zCone = BABYLON.MeshBuilder.CreateCylinder(
    'zCone',
    { diameterTop: 0, diameterBottom: 0.1, height: 0.3 },
    babylonScene
  )
  zCone.position = new BABYLON.Vector3(0, 0, axisSize)
  zCone.rotation.x = Math.PI / 2
  const zConeMat = new BABYLON.StandardMaterial('zConeMat', babylonScene)
  zConeMat.diffuseColor = new BABYLON.Color3(0, 0, 1)
  zCone.material = zConeMat

  // 렌더링 루프
  babylonEngine.runRenderLoop(() => {
    if (babylonScene) {
      babylonScene.render()
    }
  })

  // 리사이즈 핸들러
  window.addEventListener('resize', () => {
    babylonEngine?.resize()
  })
}

// OpenCascade shape을 Three.js mesh로 변환
function shapeToThreeMesh(shape: any, color: number = 0x3498db): THREE.Mesh {
  // 메시 생성
  new oc.BRepMesh_IncrementalMesh_2(shape, 0.1, false, 0.5, false)

  // 삼각형 추출
  const vertices: number[] = []
  const indices: number[] = []
  const normals: number[] = []

  let vertexIndex = 0
  const explorer = new oc.TopExp_Explorer_2(
    shape,
    oc.TopAbs_ShapeEnum.TopAbs_FACE as any,
    oc.TopAbs_ShapeEnum.TopAbs_SHAPE as any
  )

  while (explorer.More()) {
    const face = oc.TopoDS.Face_1(explorer.Current())
    const location = new oc.TopLoc_Location_1()
    const triangulation = oc.BRep_Tool.Triangulation(face, location)

    if (!triangulation.IsNull()) {
      const trsf = location.Transformation()
      const nodeCount = triangulation.get().NbNodes()
      const triangleCount = triangulation.get().NbTriangles()

      // 정점 추출
      const faceVertices: number[] = []
      for (let i = 1; i <= nodeCount; i++) {
        const node = triangulation.get().Node(i)
        const transformed = node.Transformed(trsf)
        faceVertices.push(transformed.X(), transformed.Y(), transformed.Z())
      }

      // 삼각형 인덱스 추출
      const faceOrientation = face.Orientation_1()
      for (let i = 1; i <= triangleCount; i++) {
        const triangle = triangulation.get().Triangle(i)
        let i1 = triangle.Value(1) - 1
        let i2 = triangle.Value(2) - 1
        let i3 = triangle.Value(3) - 1

        // 방향에 따라 인덱스 순서 조정
        if (faceOrientation === oc.TopAbs_Orientation.TopAbs_REVERSED) {
          [i2, i3] = [i3, i2]
        }

        indices.push(vertexIndex + i1, vertexIndex + i2, vertexIndex + i3)

        // 법선 계산
        const v1 = new THREE.Vector3(
          faceVertices[i1 * 3],
          faceVertices[i1 * 3 + 1],
          faceVertices[i1 * 3 + 2]
        )
        const v2 = new THREE.Vector3(
          faceVertices[i2 * 3],
          faceVertices[i2 * 3 + 1],
          faceVertices[i2 * 3 + 2]
        )
        const v3 = new THREE.Vector3(
          faceVertices[i3 * 3],
          faceVertices[i3 * 3 + 1],
          faceVertices[i3 * 3 + 2]
        )

        const edge1 = v2.clone().sub(v1)
        const edge2 = v3.clone().sub(v1)
        const normal = edge1.cross(edge2).normalize()

        normals.push(normal.x, normal.y, normal.z)
        normals.push(normal.x, normal.y, normal.z)
        normals.push(normal.x, normal.y, normal.z)
      }

      vertices.push(...faceVertices)
      vertexIndex += nodeCount
    }

    explorer.Next()
  }

  // Three.js geometry 생성
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  // Material 생성
  const material = new THREE.MeshPhongMaterial({
    color,
    shininess: 30,
    side: THREE.DoubleSide,
  })

  return new THREE.Mesh(geometry, material)
}

// OpenCascade shape을 Babylon.js mesh로 변환
function shapeToBabylonMesh(shape: any, color: BABYLON.Color3, name: string): BABYLON.Mesh {
  if (!babylonScene) throw new Error('Babylon scene not initialized')

  // 메시 생성
  new oc.BRepMesh_IncrementalMesh_2(shape, 0.1, false, 0.5, false)

  // 삼각형 추출
  const positions: number[] = []
  const indices: number[] = []
  const normals: number[] = []

  let vertexIndex = 0
  const explorer = new oc.TopExp_Explorer_2(
    shape,
    oc.TopAbs_ShapeEnum.TopAbs_FACE as any,
    oc.TopAbs_ShapeEnum.TopAbs_SHAPE as any
  )

  while (explorer.More()) {
    const face = oc.TopoDS.Face_1(explorer.Current())
    const location = new oc.TopLoc_Location_1()
    const triangulation = oc.BRep_Tool.Triangulation(face, location)

    if (!triangulation.IsNull()) {
      const trsf = location.Transformation()
      const nodeCount = triangulation.get().NbNodes()
      const triangleCount = triangulation.get().NbTriangles()

      // 정점 추출
      const faceVertices: number[] = []
      for (let i = 1; i <= nodeCount; i++) {
        const node = triangulation.get().Node(i)
        const transformed = node.Transformed(trsf)
        faceVertices.push(transformed.X(), transformed.Y(), transformed.Z())
      }

      // 삼각형 인덱스 추출
      const faceOrientation = face.Orientation_1()
      for (let i = 1; i <= triangleCount; i++) {
        const triangle = triangulation.get().Triangle(i)
        let i1 = triangle.Value(1) - 1
        let i2 = triangle.Value(2) - 1
        let i3 = triangle.Value(3) - 1

        // 방향에 따라 인덱스 순서 조정
        if (faceOrientation === oc.TopAbs_Orientation.TopAbs_REVERSED) {
          [i2, i3] = [i3, i2]
        }

        indices.push(vertexIndex + i1, vertexIndex + i2, vertexIndex + i3)
      }

      positions.push(...faceVertices)
      vertexIndex += nodeCount
    }

    explorer.Next()
  }

  // Babylon.js mesh 생성
  const customMesh = new BABYLON.Mesh(name, babylonScene)
  const vertexData = new BABYLON.VertexData()

  vertexData.positions = positions
  vertexData.indices = indices

  // 법선 자동 계산
  BABYLON.VertexData.ComputeNormals(positions, indices, normals)
  vertexData.normals = normals

  vertexData.applyToMesh(customMesh)

  // Material 생성
  const material = new BABYLON.StandardMaterial(name + 'Mat', babylonScene)
  material.diffuseColor = color
  material.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3)
  material.backFaceCulling = false
  customMesh.material = material

  return customMesh
}

function clearScene() {
  // Three.js scene 정리
  if (scene) {
    const objectsToRemove = scene.children.filter(
      (obj: THREE.Object3D) => obj instanceof THREE.Mesh && obj.geometry
    )
    objectsToRemove.forEach((obj: THREE.Object3D) => {
      scene!.remove(obj)
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose()
        if (obj.material instanceof THREE.Material) {
          obj.material.dispose()
        }
      }
    })
  }

  // Babylon.js scene 정리
  if (babylonScene) {
    const meshes = babylonScene.meshes.filter(
      (mesh) => mesh.name.startsWith('shape-')
    )
    meshes.forEach((mesh) => {
      mesh.dispose()
    })
  }
}

async function generateSphere() {
  if (!oc || !scene) {
    console.error('Cannot generate sphere: oc or scene is null', { oc: !!oc, scene: !!scene })
    return
  }

  try {
    console.log('Generating sphere...')
    clearScene()

    console.log('Creating OpenCascade sphere primitive...')
    const sphere = new oc.BRepPrimAPI_MakeSphere_1(2)
    const shape = sphere.Shape()
    console.log('Sphere shape created')

    // Three.js 렌더링
    console.log('Converting shape to Three.js mesh...')
    const threeMesh = shapeToThreeMesh(shape, 0x3498db)
    console.log('Three.js mesh created, vertices:', threeMesh.geometry.attributes.position?.count || 0)
    scene.add(threeMesh)
    console.log('Three.js mesh added to scene')

    // Babylon.js 렌더링
    if (babylonScene) {
      console.log('Converting shape to Babylon.js mesh...')
      const babylonMesh = shapeToBabylonMesh(shape, new BABYLON.Color3(0.2, 0.6, 0.86), 'shape-sphere')
      console.log('Babylon.js mesh created')
    }

    console.log('Sphere generated successfully')
  } catch (err) {
    console.error('Error generating sphere:', err)
    error.value = 'Failed to generate sphere: ' + (err as Error).message
  }
}

async function generateBox() {
  if (!oc || !scene) return

  try {
    console.log('Generating box...')
    clearScene()

    const box = new oc.BRepPrimAPI_MakeBox_2(3, 2, 1)
    const shape = box.Shape()

    // Three.js 렌더링
    const threeMesh = shapeToThreeMesh(shape, 0x2ecc71)
    scene.add(threeMesh)

    // Babylon.js 렌더링
    if (babylonScene) {
      shapeToBabylonMesh(shape, new BABYLON.Color3(0.18, 0.8, 0.44), 'shape-box')
    }

    console.log('Box generated successfully')
  } catch (err) {
    console.error('Error generating box:', err)
    error.value = 'Failed to generate box'
  }
}

async function generateCylinder() {
  if (!oc || !scene) return

  try {
    console.log('Generating cylinder...')
    clearScene()

    const cylinder = new oc.BRepPrimAPI_MakeCylinder_1(1, 3)
    const shape = cylinder.Shape()

    // Three.js 렌더링
    const threeMesh = shapeToThreeMesh(shape, 0xe74c3c)
    scene.add(threeMesh)

    // Babylon.js 렌더링
    if (babylonScene) {
      shapeToBabylonMesh(shape, new BABYLON.Color3(0.91, 0.3, 0.24), 'shape-cylinder')
    }

    console.log('Cylinder generated successfully')
  } catch (err) {
    console.error('Error generating cylinder:', err)
    error.value = 'Failed to generate cylinder'
  }
}
</script>

<style scoped>
.opencascade-sample {
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
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
}

.viewer-card {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.logo {
  height: 80px;
  filter: brightness(0) invert(1);
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  min-height: 400px;
}

.loading-state p {
  margin-top: 1rem;
  color: #7f8c8d;
  font-size: 1.1rem;
}

.viewer-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

.renderer-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.selector-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.toggle-group {
  display: flex;
  gap: 0.5rem;
}

.viewer-section {
  width: 100%;
}

.viewer-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  padding-left: 0.5rem;
  border-left: 4px solid #667eea;
}

.three-viewer {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.babylon-viewer {
  width: 100%;
  height: 500px;
  border-radius: 8px;
  display: block;
  border: 1px solid #e0e0e0;
}

.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}
</style>
