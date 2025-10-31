<template>
  <div class="tab-content">
    <h3>JointJS 심볼 정의</h3>
    <Message severity="info">
      JointJS 도형을 정의하여 회로도에서 사용할 심볼을 생성합니다.
    </Message>

    <div class="form-grid">
      <div class="form-field">
        <label for="symbolType">심볼 타입</label>
        <InputText
          id="symbolType"
          v-model="modelValue.type"
          placeholder="예: standard.Rectangle"
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
import { ref, watch, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
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

onMounted(() => {
  symbolAttrsJson.value = JSON.stringify(modelValue.value.attrs, null, 2)
})

watch(() => modelValue.value.attrs, (newAttrs) => {
  symbolAttrsJson.value = JSON.stringify(newAttrs, null, 2)
}, { deep: true })

function updateSymbolAttrs() {
  try {
    modelValue.value.attrs = JSON.parse(symbolAttrsJson.value)
    symbolAttrsError.value = ''
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
