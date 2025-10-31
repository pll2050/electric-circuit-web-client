<template>
  <div class="tab-content">
    <h3>기본 정보</h3>
    <div class="form-grid">
      <div class="form-field">
        <label for="partNumber">부품 번호 *</label>
        <InputText
          id="partNumber"
          v-model="modelValue.partNumber"
          placeholder="예: MCB-3P-50A"
          required
        />
      </div>

      <div class="form-field">
        <label for="name">부품명 *</label>
        <InputText
          id="name"
          v-model="modelValue.name"
          placeholder="예: 배선용 차단기"
          required
        />
      </div>

      <div class="form-field">
        <label for="category">카테고리 *</label>
        <Dropdown
          id="category"
          v-model="modelValue.category"
          :options="categories"
          placeholder="카테고리 선택"
          required
        />
      </div>

      <div class="form-field">
        <label for="manufacturer">제조사 *</label>
        <InputText
          id="manufacturer"
          v-model="modelValue.manufacturer"
          placeholder="예: LS산전"
          required
        />
      </div>

      <div class="form-field full-width">
        <label for="description">설명</label>
        <Textarea
          id="description"
          v-model="modelValue.description"
          rows="3"
          placeholder="부품에 대한 상세 설명"
        />
      </div>

      <div class="form-field">
        <label for="version">버전</label>
        <InputText
          id="version"
          v-model="modelValue.version"
          placeholder="1.0"
        />
      </div>

      <div class="form-field full-width">
        <label for="tags">태그</label>
        <Chips
          id="tags"
          v-model="modelValue.tags"
          placeholder="태그 입력 후 Enter"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Chips from 'primevue/chips'
import type { PartData } from '~/types/partXml'

interface Props {
  modelValue: PartData['metadata']
}

const props = defineProps<Props>()
const modelValue = defineModel<PartData['metadata']>({ required: true })

const categories = [
  '차단기',
  '접촉기',
  '계전기',
  '표시등',
  '버튼',
  '스위치',
  '센서',
  '변압기',
  '기타'
]
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
</style>
