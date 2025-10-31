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
          <div class="tab-content">
            <h3>기본 정보</h3>
            <div class="form-grid">
              <div class="form-field">
                <label for="partNumber">부품 번호 *</label>
                <InputText
                  id="partNumber"
                  v-model="formData.metadata.partNumber"
                  placeholder="예: MCB-3P-50A"
                  required
                />
              </div>

              <div class="form-field">
                <label for="name">부품명 *</label>
                <InputText
                  id="name"
                  v-model="formData.metadata.name"
                  placeholder="예: 배선용 차단기"
                  required
                />
              </div>

              <div class="form-field">
                <label for="category">카테고리 *</label>
                <Dropdown
                  id="category"
                  v-model="formData.metadata.category"
                  :options="categories"
                  placeholder="카테고리 선택"
                  required
                />
              </div>

              <div class="form-field">
                <label for="manufacturer">제조사 *</label>
                <InputText
                  id="manufacturer"
                  v-model="formData.metadata.manufacturer"
                  placeholder="예: LS산전"
                  required
                />
              </div>

              <div class="form-field full-width">
                <label for="description">설명</label>
                <Textarea
                  id="description"
                  v-model="formData.metadata.description"
                  rows="3"
                  placeholder="부품에 대한 상세 설명"
                />
              </div>

              <div class="form-field">
                <label for="version">버전</label>
                <InputText
                  id="version"
                  v-model="formData.metadata.version"
                  placeholder="1.0"
                />
              </div>

              <div class="form-field full-width">
                <label for="tags">태그</label>
                <Chips
                  id="tags"
                  v-model="formData.metadata.tags"
                  placeholder="태그 입력 후 Enter"
                />
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- 심볼 생성 탭 -->
        <TabPanel header="심볼 생성">
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
                  v-model="formData.symbol.type"
                  placeholder="예: standard.Rectangle"
                />
              </div>

              <div class="form-field">
                <label>심볼 크기</label>
                <div class="size-inputs">
                  <InputNumber
                    v-model="formData.symbol.size.width"
                    placeholder="너비"
                    suffix=" px"
                  />
                  <InputNumber
                    v-model="formData.symbol.size.height"
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
        </TabPanel>

        <!-- 전기 사양 탭 -->
        <TabPanel header="전기 사양">
          <div class="tab-content">
            <h3>전기적 특성</h3>

            <div class="form-section">
              <h4>전압</h4>
              <div class="form-grid">
                <div class="form-field">
                  <label for="voltageRated">정격 전압</label>
                  <InputText
                    id="voltageRated"
                    v-model="formData.electricalSpecs.voltage.rated"
                    placeholder="예: 220V AC"
                  />
                </div>
                <div class="form-field">
                  <label for="voltageType">전압 타입</label>
                  <Dropdown
                    id="voltageType"
                    v-model="formData.electricalSpecs.voltage.type"
                    :options="['AC', 'DC']"
                    placeholder="선택"
                  />
                </div>
                <div class="form-field">
                  <label for="voltageMin">최소 전압</label>
                  <InputText
                    id="voltageMin"
                    v-model="formData.electricalSpecs.voltage.range.min"
                    placeholder="예: 200V"
                  />
                </div>
                <div class="form-field">
                  <label for="voltageMax">최대 전압</label>
                  <InputText
                    id="voltageMax"
                    v-model="formData.electricalSpecs.voltage.range.max"
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
                    v-model="formData.electricalSpecs.current.rated"
                    placeholder="예: 50A"
                  />
                </div>
                <div class="form-field">
                  <label for="currentType">전류 타입</label>
                  <Dropdown
                    id="currentType"
                    v-model="formData.electricalSpecs.current.type"
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
                    v-model="formData.electricalSpecs.power.rated"
                    placeholder="예: 11kW"
                  />
                </div>
                <div class="form-field">
                  <label for="powerMax">최대 전력</label>
                  <InputText
                    id="powerMax"
                    v-model="formData.electricalSpecs.power.max"
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
                    v-model="formData.electricalSpecs.frequency.rated"
                    placeholder="예: 60Hz"
                  />
                </div>
                <div class="form-field">
                  <label for="protectionClass">보호 등급</label>
                  <InputText
                    id="protectionClass"
                    v-model="formData.electricalSpecs.protectionClass"
                    placeholder="예: IP20"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- 물리 사양 탭 -->
        <TabPanel header="물리 사양">
          <div class="tab-content">
            <h3>물리적 특성</h3>

            <div class="form-section">
              <h4>치수</h4>
              <div class="form-grid">
                <div class="form-field">
                  <label for="dimWidth">너비</label>
                  <InputNumber
                    id="dimWidth"
                    v-model="formData.physicalSpecs.dimensions.width"
                    placeholder="54"
                  />
                </div>
                <div class="form-field">
                  <label for="dimHeight">높이</label>
                  <InputNumber
                    id="dimHeight"
                    v-model="formData.physicalSpecs.dimensions.height"
                    placeholder="90"
                  />
                </div>
                <div class="form-field">
                  <label for="dimDepth">깊이</label>
                  <InputNumber
                    id="dimDepth"
                    v-model="formData.physicalSpecs.dimensions.depth"
                    placeholder="75"
                  />
                </div>
                <div class="form-field">
                  <label for="dimUnit">단위</label>
                  <Dropdown
                    id="dimUnit"
                    v-model="formData.physicalSpecs.dimensions.unit"
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
                    v-model="formData.physicalSpecs.weight.value"
                    placeholder="250"
                  />
                </div>
                <div class="form-field">
                  <label for="weightUnit">단위</label>
                  <Dropdown
                    id="weightUnit"
                    v-model="formData.physicalSpecs.weight.unit"
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
                    v-model="formData.physicalSpecs.mountingType"
                    :options="['DIN Rail', 'Panel Mount', 'PCB Mount', 'Wall Mount']"
                    placeholder="선택"
                  />
                </div>
                <div class="form-field">
                  <label for="color">색상</label>
                  <InputText
                    id="color"
                    v-model="formData.physicalSpecs.color"
                    placeholder="예: Gray"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- 3D 모델 탭 -->
        <TabPanel header="3D 모델">
          <div class="tab-content">
            <h3>3D 모델 데이터</h3>
            <Message severity="info">
              GLB, GLTF, STL, OBJ, STEP, IGES 형식의 3D 모델 파일을 업로드할 수 있습니다.
            </Message>

            <div class="form-grid">
              <div class="form-field">
                <label for="modelFormat">모델 포맷</label>
                <Dropdown
                  id="modelFormat"
                  v-model="formData.model3d.format"
                  :options="['gltf', 'glb', 'obj', 'stl', 'step', 'iges']"
                  placeholder="선택"
                />
              </div>

              <div class="form-field full-width">
                <label for="modelFile">3D 모델 파일</label>
                <FileUpload
                  mode="basic"
                  accept=".glb,.gltf,.obj,.stl,.step,.iges"
                  :maxFileSize="10000000"
                  @select="handleModelUpload"
                  chooseLabel="파일 선택"
                />
                <small>최대 10MB</small>
              </div>

              <div class="form-field full-width" v-if="formData.model3d.data">
                <label>3D 모델 미리보기</label>
                <div class="model-preview">
                  <div ref="modelCanvas" class="canvas-3d"></div>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- 인증 및 재고 탭 -->
        <TabPanel header="인증 및 재고">
          <div class="tab-content">
            <div class="form-section">
              <h4>인증 및 표준</h4>
              <div class="form-grid">
                <div class="form-field full-width">
                  <label for="certifications">인증</label>
                  <Chips
                    id="certifications"
                    v-model="formData.certifications.certifications"
                    placeholder="인증 입력 (예: KC, CE, UL)"
                  />
                </div>

                <div class="form-field full-width">
                  <label for="standards">표준</label>
                  <Chips
                    id="standards"
                    v-model="formData.certifications.standards"
                    placeholder="표준 입력 (예: IEC, KEC)"
                  />
                </div>

                <div class="form-field">
                  <label for="rohs">RoHS 준수</label>
                  <Checkbox
                    id="rohs"
                    v-model="formData.certifications.rohs"
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
                    v-model="formData.inventory.stock"
                    placeholder="0"
                  />
                </div>

                <div class="form-field">
                  <label for="minStock">최소 재고</label>
                  <InputNumber
                    id="minStock"
                    v-model="formData.inventory.minStock"
                    placeholder="0"
                  />
                </div>

                <div class="form-field">
                  <label for="price">가격</label>
                  <InputNumber
                    id="price"
                    v-model="formData.inventory.price"
                    mode="currency"
                    currency="KRW"
                    locale="ko-KR"
                  />
                </div>

                <div class="form-field">
                  <label for="supplier">공급업체</label>
                  <InputText
                    id="supplier"
                    v-model="formData.inventory.supplier.name"
                    placeholder="공급업체명"
                  />
                </div>
              </div>
            </div>
          </div>
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
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Chips from 'primevue/chips'
import Checkbox from 'primevue/checkbox'
import FileUpload from 'primevue/fileupload'
import Message from 'primevue/message'
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
const symbolCanvas = ref<HTMLDivElement | null>(null)
const modelCanvas = ref<HTMLDivElement | null>(null)
const symbolAttrsJson = ref('{}')
const symbolAttrsError = ref('')

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
    symbolAttrsJson.value = JSON.stringify(formData.value.symbol.attrs, null, 2)
  }
})

watch(isVisible, (val) => {
  emit('update:visible', val)
})

function updateSymbolAttrs() {
  try {
    formData.value.symbol.attrs = JSON.parse(symbolAttrsJson.value)
    symbolAttrsError.value = ''
  } catch (e) {
    symbolAttrsError.value = 'JSON 형식이 올바르지 않습니다.'
  }
}

function handleModelUpload(event: any) {
  const file = event.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        // Base64 인코딩
        formData.value.model3d!.data = result.split(',')[1]
      }
    }
    reader.readAsDataURL(file)
  }
}

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

.symbol-preview,
.model-preview {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: #f8f9fa;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas,
.canvas-3d {
  width: 100%;
  height: 300px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
