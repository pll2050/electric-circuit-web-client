<template>
  <Dialog
    v-model:visible="isVisible"
    header="부품 추가/수정"
    :style="{ width: '90vw', height: '90vh' }"
    :maximizable="true"
    :modal="true"
    :closable="true"
    @hide="handleClose"
  >
    <div class="part-editor">
      <TabView v-model:activeIndex="activeTab" class="part-tabs">
        <!-- 메타데이터 탭 -->
        <TabPanel header="메타데이터">
          <MetadataTab v-model="formData.metadata" />
        </TabPanel>

        <!-- 심볼 생성 탭 -->
        <TabPanel header="심볼 생성">
          <SymbolTab v-model="formData.symbol" />
        </TabPanel>

        <!-- 전기 사양 탭 -->
        <TabPanel header="전기 사양">
          <ElectricalSpecsTab v-model="formData.electricalSpecs" />
        </TabPanel>

        <!-- 물리 사양 탭 -->
        <TabPanel header="물리 사양">
          <PhysicalSpecsTab v-model="formData.physicalSpecs" />
        </TabPanel>

        <!-- 3D 모델 탭 -->
        <TabPanel header="3D 모델">
          <Model3dTab v-model="formData.model3d" />
        </TabPanel>

        <!-- 인증 및 재고 탭 -->
        <TabPanel header="인증 및 재고">
          <CertificationInventoryTab
            v-model:certifications="formData.certifications"
            v-model:inventory="formData.inventory"
          />
        </TabPanel>
      </TabView>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <Button label="취소" icon="pi pi-times" @click="handleClose" text />
        <Button label="XML 미리보기" icon="pi pi-code" @click="previewXml" severity="secondary" />
        <Button label="저장" icon="pi pi-check" @click="handleSave" severity="success" />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'
import MetadataTab from './tabs/MetadataTab.vue'
import SymbolTab from './tabs/SymbolTab.vue'
import ElectricalSpecsTab from './tabs/ElectricalSpecsTab.vue'
import PhysicalSpecsTab from './tabs/PhysicalSpecsTab.vue'
import Model3dTab from './tabs/Model3dTab.vue'
import CertificationInventoryTab from './tabs/CertificationInventoryTab.vue'
import type { PartData } from '~/types/partXml'
import { partXmlConverter } from '~/utils/partXmlConverter'

interface Props {
  visible: boolean
  partData?: PartData | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'save', data: PartData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isVisible = ref(props.visible)
const activeTab = ref(0)

const formData = ref<PartData>({
  metadata: {
    id: '',
    partNumber: '',
    name: '',
    description: '',
    category: '',
    manufacturer: '',
    version: '1.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
  },
  symbol: {
    type: 'standard.Rectangle',
    size: { width: 80, height: 60 },
    attrs: {
      body: {
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
      },
      label: {
        text: '',
        fontSize: 14,
        fill: '#000000',
      },
    },
  },
  electricalSpecs: {
    voltage: {
      rated: '',
      range: { min: '', max: '' },
      type: '',
    },
    current: {
      rated: '',
      range: { min: '', max: '' },
      type: '',
    },
    power: {
      rated: '',
      max: '',
    },
    frequency: {
      rated: '',
    },
    protectionClass: '',
  },
  physicalSpecs: {
    dimensions: {
      width: 0,
      height: 0,
      depth: 0,
      unit: 'mm',
    },
    weight: {
      value: 0,
      unit: 'g',
    },
    mountingType: '',
    color: '',
  },
  certifications: {
    certifications: [],
    standards: [],
    rohs: false,
  },
  model3d: {
    format: 'glb',
    data: '',
  },
  inventory: {
    stock: 0,
    minStock: 0,
    price: 0,
    currency: 'KRW',
    supplier: {
      name: '',
    },
  },
})

watch(() => props.visible, (val) => {
  isVisible.value = val
  if (val && props.partData) {
    formData.value = JSON.parse(JSON.stringify(props.partData))
  }
})

watch(isVisible, (val) => {
  emit('update:visible', val)
})

function previewXml() {
  try {
    const xml = partXmlConverter.toXML(formData.value)
    console.log('Generated XML:', xml)
    // TODO: XML 미리보기 다이얼로그 표시
  } catch (e) {
    console.error('Failed to generate XML:', e)
  }
}

function handleSave() {
  formData.value.metadata.updatedAt = new Date().toISOString()
  if (!formData.value.metadata.createdAt) {
    formData.value.metadata.createdAt = new Date().toISOString()
  }

  emit('save', formData.value)
  handleClose()
}

function handleClose() {
  isVisible.value = false
  activeTab.value = 0
}
</script>

<style scoped>
.part-editor {
  height: calc(90vh - 150px);
  display: flex;
  flex-direction: column;
}

.part-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
