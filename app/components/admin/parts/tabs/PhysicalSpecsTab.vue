<template>
  <div class="tab-content">
    <h3>물리적 특성</h3>

    <div class="form-section">
      <h4>치수</h4>
      <div class="form-grid">
        <div class="form-field">
          <label for="dimWidth">너비</label>
          <InputNumber
            id="dimWidth"
            v-model="modelValue.dimensions.width"
            placeholder="54"
          />
        </div>
        <div class="form-field">
          <label for="dimHeight">높이</label>
          <InputNumber
            id="dimHeight"
            v-model="modelValue.dimensions.height"
            placeholder="90"
          />
        </div>
        <div class="form-field">
          <label for="dimDepth">깊이</label>
          <InputNumber
            id="dimDepth"
            v-model="modelValue.dimensions.depth"
            placeholder="75"
          />
        </div>
        <div class="form-field">
          <label for="dimUnit">단위</label>
          <Dropdown
            id="dimUnit"
            v-model="modelValue.dimensions.unit"
            :options="['mm', 'cm', 'inch']"
            placeholder="선택"
          />
        </div>
      </div>
    </div>

    <div class="form-section">
      <h4>무게</h4>
      <div class="form-grid">
        <div class="form-field">
          <label for="weight">무게</label>
          <InputNumber
            id="weight"
            v-model="modelValue.weight.value"
            placeholder="250"
          />
        </div>
        <div class="form-field">
          <label for="weightUnit">단위</label>
          <Dropdown
            id="weightUnit"
            v-model="modelValue.weight.unit"
            :options="['g', 'kg', 'lb']"
            placeholder="선택"
          />
        </div>
      </div>
    </div>

    <div class="form-section">
      <h4>설치 정보</h4>
      <div class="form-grid">
        <div class="form-field">
          <label for="mountingType">설치 방식</label>
          <Dropdown
            id="mountingType"
            v-model="modelValue.mountingType"
            :options="['DIN Rail', 'Panel Mount', 'PCB Mount', 'Wall Mount']"
            placeholder="선택"
          />
        </div>
        <div class="form-field">
          <label for="color">색상</label>
          <InputText
            id="color"
            v-model="modelValue.color"
            placeholder="예: Gray"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import type { PartData } from '~/types/partXml'

interface Props {
  modelValue: PartData['physicalSpecs']
}

const props = defineProps<Props>()
const modelValue = defineModel<PartData['physicalSpecs']>({ required: true })
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

.form-section {
  margin-bottom: 2rem;
}

.form-section h4 {
  margin-bottom: 1rem;
  color: #34495e;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 0.5rem;
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

.form-field label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}
</style>
