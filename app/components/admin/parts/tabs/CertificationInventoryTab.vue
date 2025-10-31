<template>
  <div class="tab-content">
    <div class="form-section">
      <h4>인증 및 표준</h4>
      <div class="form-grid">
        <div class="form-field full-width">
          <label for="certifications">인증</label>
          <Chips
            id="certifications"
            v-model="certifications.certifications"
            placeholder="인증 입력 (예: KC, CE, UL)"
          />
        </div>

        <div class="form-field full-width">
          <label for="standards">표준</label>
          <Chips
            id="standards"
            v-model="certifications.standards"
            placeholder="표준 입력 (예: IEC, KEC)"
          />
        </div>

        <div class="form-field">
          <label for="rohs">RoHS 준수</label>
          <Checkbox
            id="rohs"
            v-model="certifications.rohs"
            :binary="true"
          />
        </div>
      </div>
    </div>

    <div class="form-section">
      <h4>재고 및 가격</h4>
      <div class="form-grid">
        <div class="form-field">
          <label for="stock">재고</label>
          <InputNumber
            id="stock"
            v-model="inventory.stock"
            placeholder="0"
          />
        </div>

        <div class="form-field">
          <label for="minStock">최소 재고</label>
          <InputNumber
            id="minStock"
            v-model="inventory.minStock"
            placeholder="0"
          />
        </div>

        <div class="form-field">
          <label for="price">가격</label>
          <InputNumber
            id="price"
            v-model="inventory.price"
            mode="currency"
            currency="KRW"
            locale="ko-KR"
          />
        </div>

        <div class="form-field">
          <label for="supplier">공급업체</label>
          <InputText
            id="supplier"
            v-model="inventory.supplier.name"
            placeholder="공급업체명"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Chips from 'primevue/chips'
import Checkbox from 'primevue/checkbox'
import type { PartData } from '~/types/partXml'

interface Props {
  certifications: PartData['certifications']
  inventory: PartData['inventory']
}

const props = defineProps<Props>()
const certifications = defineModel<PartData['certifications']>('certifications', { required: true })
const inventory = defineModel<PartData['inventory']>('inventory', { required: true })
</script>

<style scoped>
.tab-content {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(90vh - 250px);
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

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-field label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}
</style>
