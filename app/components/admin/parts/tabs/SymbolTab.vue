<template>
  <div class="tab-content">
    <h3>JointJS 심볼 정의</h3>
    <Message severity="info">
      JointJS 도형을 정의하여 회로도에서 사용할 심볼을 생성합니다.
    </Message>

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

// 사용 가능한 심볼 타입
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
      height: 300,
      gridSize: 10,
      drawGrid: {
        name: 'dot',
        args: { color: '#e5e7eb', thickness: 1 }
      },
      background: {
        color: '#ffffff'
      },
      cellViewNamespace: shapes,
      interactive: false // 미리보기는 편집 불가
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

.symbol-preview {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: #f8f9fa;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas {
  width: 100%;
  height: 300px;
}
</style>
