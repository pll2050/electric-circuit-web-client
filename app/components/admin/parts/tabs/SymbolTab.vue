<template>
  <div class="tab-content">
    <h3>JointJS 심볼 정의</h3>
    <Message severity="info">
      JointJS 도형을 정의하여 회로도에서 사용할 심볼을 생성합니다.
    </Message>

    <!-- 도형 툴바 -->
    <div class="shape-toolbar">
      <h4>도형 추가</h4>
      <div class="shape-buttons">
        <Button
          v-for="shapeType in shapeTypes"
          :key="shapeType.value"
          :label="shapeType.label"
          :icon="shapeType.icon"
          @click="addShape(shapeType.value)"
          outlined
          size="small"
          class="shape-btn"
        />
      </div>
    </div>

    <div class="form-grid">
      <div class="form-field">
        <label for="symbolType">심볼 타입</label>
        <Dropdown
          id="symbolType"
          v-model="modelValue.type"
          :options="symbolTypes"
          placeholder="심볼 타입 선택"
        />
      </div>

      <div class="form-field">
        <label>심볼 크기</label>
        <div class="size-inputs">
          <InputNumber
            v-model="modelValue.size.width"
            placeholder="너비"
            suffix=" px"
          />
          <InputNumber
            v-model="modelValue.size.height"
            placeholder="높이"
            suffix=" px"
          />
        </div>
      </div>

      <div class="form-field full-width">
        <label for="symbolAttrs">속성 (JSON)</label>
        <Textarea
          id="symbolAttrs"
          v-model="symbolAttrsJson"
          rows="10"
          placeholder='{"body": {"fill": "#ffffff", "stroke": "#000000"}}'
          @blur="updateSymbolAttrs"
        />
        <small v-if="symbolAttrsError" class="error-text">{{ symbolAttrsError }}</small>
      </div>

      <div class="form-field full-width">
        <label>심볼 미리보기</label>
        <div class="symbol-preview">
          <div ref="symbolCanvas" class="canvas"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import Button from 'primevue/button'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Message from 'primevue/message'
import type { PartData } from '~/types/partXml'

interface Props {
  modelValue: PartData['symbol']
}

const props = defineProps<Props>()
const modelValue = defineModel<PartData['symbol']>({ required: true })

const symbolCanvas = ref<HTMLDivElement | null>(null)
const symbolAttrsJson = ref('{}')
const symbolAttrsError = ref('')

// 도형 타입 정의 (툴바용)
const shapeTypes = [
  { label: '사각형', value: 'standard.Rectangle', icon: 'pi pi-stop' },
  { label: '원', value: 'standard.Circle', icon: 'pi pi-circle' },
  { label: '타원', value: 'standard.Ellipse', icon: 'pi pi-circle' },
  { label: '다각형', value: 'standard.Polygon', icon: 'pi pi-star' },
  { label: '선', value: 'standard.Polyline', icon: 'pi pi-minus' },
  { label: '경로', value: 'standard.Path', icon: 'pi pi-pencil' }
]

// 사용 가능한 심볼 타입 (드롭다운용)
const symbolTypes = [
  'standard.Rectangle',
  'standard.Circle',
  'standard.Ellipse',
  'standard.Polygon',
  'standard.Polyline',
  'standard.Path'
]

// JointJS 변수들
let dia: any = null
let shapes: any = null
let graph: any = null
let paper: any = null

onMounted(async () => {
  symbolAttrsJson.value = JSON.stringify(modelValue.value.attrs, null, 2)

  // JointJS 초기화
  await initializeCanvas()
})

onUnmounted(() => {
  // 정리
  if (paper) {
    paper.remove()
  }
})

async function initializeCanvas() {
  if (!symbolCanvas.value) {
    console.error('Canvas container not found')
    return
  }

  try {
    // @joint/plus에서 필요한 모듈만 로드
    const joint = await import('@joint/plus')
    dia = joint.dia
    shapes = joint.shapes
    console.log('JointJS Plus loaded successfully')

    // Graph 생성
    graph = new dia.Graph({}, {
      cellNamespace: shapes
    })

    // Paper 생성
    paper = new dia.Paper({
      el: symbolCanvas.value,
      model: graph,
      width: symbolCanvas.value.clientWidth || 600,
      height: 400,
      gridSize: 10,
      drawGrid: {
        name: 'dot',
        args: { color: '#e5e7eb', thickness: 1 }
      },
      background: {
        color: '#ffffff'
      },
      cellViewNamespace: shapes,
      interactive: true // 편집 가능하도록 변경
    })

    console.log('Paper created successfully')

    // 초기 심볼 렌더링
    renderSymbol()
  } catch (error) {
    console.error('Failed to initialize JointJS canvas:', error)
  }
}

function renderSymbol() {
  if (!graph || !shapes) return

  // 기존 도형 제거
  graph.clear()

  try {
    const { type, size, attrs } = modelValue.value

    // 심볼 타입에 따라 도형 생성
    let shape: any

    if (type === 'standard.Rectangle' || !type) {
      shape = new shapes.standard.Rectangle({
        position: { x: 50, y: 50 },
        size: { width: size.width || 80, height: size.height || 60 },
        attrs: attrs || {
          body: {
            fill: '#ffffff',
            stroke: '#000000',
            strokeWidth: 2
          },
          label: {
            text: 'Symbol',
            fontSize: 14,
            fill: '#000000'
          }
        }
      })
    } else if (type === 'standard.Circle') {
      shape = new shapes.standard.Circle({
        position: { x: 50, y: 50 },
        size: { width: size.width || 80, height: size.height || 80 },
        attrs: attrs
      })
    } else if (type === 'standard.Ellipse') {
      shape = new shapes.standard.Ellipse({
        position: { x: 50, y: 50 },
        size: { width: size.width || 80, height: size.height || 60 },
        attrs: attrs
      })
    } else {
      // 기본값으로 Rectangle 사용
      shape = new shapes.standard.Rectangle({
        position: { x: 50, y: 50 },
        size: { width: size.width || 80, height: size.height || 60 },
        attrs: attrs
      })
    }

    graph.addCell(shape)

    // 중앙 정렬
    if (paper) {
      paper.scaleContentToFit({ padding: 20 })
    }
  } catch (error) {
    console.error('Failed to render symbol:', error)
  }
}

watch(() => modelValue.value.attrs, (newAttrs) => {
  symbolAttrsJson.value = JSON.stringify(newAttrs, null, 2)
  renderSymbol() // 속성 변경 시 다시 렌더링
}, { deep: true })

watch(() => [modelValue.value.type, modelValue.value.size], () => {
  renderSymbol() // 타입이나 크기 변경 시 다시 렌더링
}, { deep: true })

function updateSymbolAttrs() {
  try {
    const parsed = JSON.parse(symbolAttrsJson.value)
    modelValue.value.attrs = parsed
    symbolAttrsError.value = ''
    renderSymbol() // JSON 업데이트 후 다시 렌더링
  } catch (e) {
    symbolAttrsError.value = 'JSON 형식이 올바르지 않습니다.'
  }
}

// 도형 추가 함수
function addShape(shapeType: string) {
  if (!graph || !shapes) return

  try {
    let shape: any
    const defaultAttrs = {
      body: {
        fill: '#ffffff',
        stroke: '#3b82f6',
        strokeWidth: 2
      },
      label: {
        text: '',
        fontSize: 14,
        fill: '#000000'
      }
    }

    // 랜덤 위치 생성 (겹치지 않도록)
    const randomX = Math.floor(Math.random() * 400) + 50
    const randomY = Math.floor(Math.random() * 200) + 50

    switch (shapeType) {
      case 'standard.Rectangle':
        shape = new shapes.standard.Rectangle({
          position: { x: randomX, y: randomY },
          size: { width: 80, height: 60 },
          attrs: defaultAttrs
        })
        break
      case 'standard.Circle':
        shape = new shapes.standard.Circle({
          position: { x: randomX, y: randomY },
          size: { width: 80, height: 80 },
          attrs: defaultAttrs
        })
        break
      case 'standard.Ellipse':
        shape = new shapes.standard.Ellipse({
          position: { x: randomX, y: randomY },
          size: { width: 100, height: 60 },
          attrs: defaultAttrs
        })
        break
      case 'standard.Polygon':
        shape = new shapes.standard.Polygon({
          position: { x: randomX, y: randomY },
          size: { width: 80, height: 80 },
          attrs: {
            body: {
              fill: '#ffffff',
              stroke: '#3b82f6',
              strokeWidth: 2,
              refPoints: '0,10 10,0 20,10 10,20'
            }
          }
        })
        break
      case 'standard.Polyline':
        shape = new shapes.standard.Polyline({
          position: { x: randomX, y: randomY },
          size: { width: 100, height: 60 },
          attrs: {
            body: {
              stroke: '#3b82f6',
              strokeWidth: 2,
              fill: 'none',
              refPoints: '0,0 50,30 100,0'
            }
          }
        })
        break
      case 'standard.Path':
        shape = new shapes.standard.Path({
          position: { x: randomX, y: randomY },
          size: { width: 80, height: 80 },
          attrs: {
            body: {
              stroke: '#3b82f6',
              strokeWidth: 2,
              fill: 'none',
              refD: 'M 0 40 Q 40 0 80 40 T 160 40'
            }
          }
        })
        break
      default:
        shape = new shapes.standard.Rectangle({
          position: { x: randomX, y: randomY },
          size: { width: 80, height: 60 },
          attrs: defaultAttrs
        })
    }

    graph.addCell(shape)
    console.log('Shape added:', shapeType)
  } catch (error) {
    console.error('Failed to add shape:', error)
  }
}
</script>

<style scoped>
.tab-content {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 250px);
}

.tab-content h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-field label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.size-inputs {
  display: flex;
  gap: 0.5rem;
}

.error-text {
  color: #e74c3c;
  font-size: 0.85rem;
}

.shape-toolbar {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.shape-toolbar h4 {
  margin: 0 0 0.75rem 0;
  color: #2c3e50;
  font-size: 0.95rem;
  font-weight: 600;
}

.shape-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.shape-btn {
  min-width: 90px;
}

.symbol-preview {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: #f8f9fa;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.canvas {
  width: 100%;
  height: 400px;
}

/* JointJS 요소 스타일 */
:deep(.joint-element) {
  cursor: move;
}

:deep(.joint-element:hover) {
  filter: brightness(0.95);
}
</style>
