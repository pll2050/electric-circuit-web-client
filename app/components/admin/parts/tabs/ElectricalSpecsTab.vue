<template>
  <div class="tab-content">
    <h3>전기적 특성</h3>

    <div class="form-section">
      <h4>전압</h4>
      <div class="form-grid">
        <div class="form-field">
          <label for="voltageRated">정격 전압</label>
          <InputText
            id="voltageRated"
            v-model="modelValue.voltage.rated"
            placeholder="예: 220V AC"
          />
        </div>
        <div class="form-field">
          <label for="voltageType">전압 타입</label>
          <Dropdown
            id="voltageType"
            v-model="modelValue.voltage.type"
            :options="['AC', 'DC']"
            placeholder="선택"
          />
        </div>
        <div class="form-field">
          <label for="voltageMin">최소 전압</label>
          <InputText
            id="voltageMin"
            v-model="modelValue.voltage.range.min"
            placeholder="예: 200V"
          />
        </div>
        <div class="form-field">
          <label for="voltageMax">최대 전압</label>
          <InputText
            id="voltageMax"
            v-model="modelValue.voltage.range.max"
            placeholder="예: 240V"
          />
        </div>
      </div>
    </div>

    <div class="form-section">
      <h4>전류</h4>
      <div class="form-grid">
        <div class="form-field">
          <label for="currentRated">정격 전류</label>
          <InputText
            id="currentRated"
            v-model="modelValue.current.rated"
            placeholder="예: 50A"
          />
        </div>
        <div class="form-field">
          <label for="currentType">전류 타입</label>
          <Dropdown
            id="currentType"
            v-model="modelValue.current.type"
            :options="['AC', 'DC']"
            placeholder="선택"
          />
        </div>
      </div>
    </div>

    <div class="form-section">
      <h4>전력</h4>
      <div class="form-grid">
        <div class="form-field">
          <label for="powerRated">정격 전력</label>
          <InputText
            id="powerRated"
            v-model="modelValue.power.rated"
            placeholder="예: 11kW"
          />
        </div>
        <div class="form-field">
          <label for="powerMax">최대 전력</label>
          <InputText
            id="powerMax"
            v-model="modelValue.power.max"
            placeholder="예: 15kW"
          />
        </div>
      </div>
    </div>

    <div class="form-section">
      <h4>기타</h4>
      <div class="form-grid">
        <div class="form-field">
          <label for="frequency">주파수</label>
          <InputText
            id="frequency"
            v-model="modelValue.frequency.rated"
            placeholder="예: 60Hz"
          />
        </div>
        <div class="form-field">
          <label for="protectionClass">보호 등급</label>
          <InputText
            id="protectionClass"
            v-model="modelValue.protectionClass"
            placeholder="예: IP20"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import type { PartData } from '~/types/partXml'

interface Props {
  modelValue: PartData['electricalSpecs']
}

const props = defineProps<Props>()
const modelValue = defineModel<PartData['electricalSpecs']>({ required: true })
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
