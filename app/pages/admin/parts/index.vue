<template>
  <div class="admin-parts-page">
    <div class="page-header">
      <h1>부품 및 심볼 관리</h1>
      <div class="header-actions">
        <Button
          label="샘플 XML 다운로드"
          icon="pi pi-download"
          @click="downloadSampleXml"
          severity="secondary"
          outlined
        />
        <Button
          label="XML 가져오기"
          icon="pi pi-upload"
          @click="() => fileInput?.click()"
          severity="info"
        />
        <Button
          label="새 부품 추가"
          icon="pi pi-plus"
          @click="openAddDialog"
          severity="success"
        />
      </div>
    </div>

    <Card class="parts-card">
      <template #content>
        <div v-if="loading" class="loading-state">
          <ProgressSpinner />
          <p>부품 목록을 불러오는 중...</p>
        </div>

        <Message v-else-if="error" severity="error">
          {{ error }}
        </Message>

        <DataTable
          v-else
          :value="parts"
          paginator
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          tableStyle="min-width: 50rem"
          stripedRows
          sortMode="multiple"
          filterDisplay="row"
          :globalFilterFields="['name', 'partNumber', 'category', 'manufacturer']"
        >
          <template #header>
            <div class="table-header">
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="globalFilter"
                  placeholder="부품 검색..."
                  class="search-input"
                />
              </span>
            </div>
          </template>

          <Column field="partNumber" header="부품 번호" sortable style="min-width: 12rem">
            <template #body="{ data }">
              <span class="part-number">{{ data.partNumber }}</span>
            </template>
          </Column>

          <Column field="name" header="부품명" sortable style="min-width: 15rem">
            <template #body="{ data }">
              <div class="part-name-cell">
                <strong>{{ data.name }}</strong>
              </div>
            </template>
          </Column>

          <Column field="category" header="카테고리" sortable style="min-width: 10rem">
            <template #body="{ data }">
              <Tag :value="data.category" :severity="getCategorySeverity(data.category)" />
            </template>
          </Column>

          <Column field="manufacturer" header="제조사" sortable style="min-width: 10rem" />

          <Column field="hasSymbol" header="심볼" sortable style="min-width: 8rem">
            <template #body="{ data }">
              <Tag
                :value="data.hasSymbol ? '있음' : '없음'"
                :severity="data.hasSymbol ? 'success' : 'warning'"
              />
            </template>
          </Column>

          <Column field="has3DModel" header="3D 모델" sortable style="min-width: 8rem">
            <template #body="{ data }">
              <Tag
                :value="data.has3DModel ? '있음' : '없음'"
                :severity="data.has3DModel ? 'success' : 'secondary'"
              />
            </template>
          </Column>

          <Column field="updatedAt" header="수정일" sortable style="min-width: 10rem">
            <template #body="{ data }">
              {{ formatDate(data.updatedAt) }}
            </template>
          </Column>

          <Column header="작업" style="min-width: 15rem">
            <template #body="{ data }">
              <div class="action-buttons">
                <Button
                  icon="pi pi-eye"
                  rounded
                  text
                  severity="info"
                  @click="viewPart(data)"
                  v-tooltip.top="'상세보기'"
                />
                <Button
                  icon="pi pi-code"
                  rounded
                  text
                  severity="secondary"
                  @click="viewXml(data)"
                  v-tooltip.top="'XML 보기'"
                />
                <Button
                  icon="pi pi-download"
                  rounded
                  text
                  severity="help"
                  @click="downloadXml(data)"
                  v-tooltip.top="'XML 다운로드'"
                />
                <Button
                  icon="pi pi-pencil"
                  rounded
                  text
                  severity="warning"
                  @click="editPart(data)"
                  v-tooltip.top="'수정'"
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  @click="deletePart(data)"
                  v-tooltip.top="'삭제'"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- 숨겨진 파일 입력 -->
    <input
      ref="fileInput"
      type="file"
      accept=".xml"
      style="display: none"
      @change="handleFileImport"
    />

    <!-- XML 뷰어 다이얼로그 -->
    <Dialog
      v-model:visible="xmlViewerVisible"
      header="부품 XML"
      :style="{ width: '80vw' }"
      :maximizable="true"
      :modal="true"
    >
      <div class="xml-viewer">
        <pre><code>{{ viewingXml }}</code></pre>
      </div>
      <template #footer>
        <Button label="닫기" icon="pi pi-times" @click="xmlViewerVisible = false" text />
        <Button
          label="다운로드"
          icon="pi pi-download"
          @click="downloadViewingXml"
          severity="success"
        />
      </template>
    </Dialog>

    <!-- 부품 추가/수정 모달 -->
    <PartEditorDialog
      v-model:visible="editorVisible"
      :partData="editingPart"
      @save="handlePartSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import { useAdminParts } from '~/composables/admin/useAdminParts'
import type { PartListItem } from '~/composables/admin/useAdminParts'
import PartEditorDialog from '~/components/admin/PartEditorDialog.vue'
import type { PartData } from '~/types/partXml'

// 관리자 레이아웃 사용
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
  title: '부품 관리 - Electric Circuit Web'
})

const toast = useToast()
const {
  fetchPartsList,
  downloadPartXml,
  importPartXml,
  generateSampleXml,
  fetchPartXml
} = useAdminParts()

const loading = ref(true)
const error = ref<string | null>(null)
const parts = ref<PartListItem[]>([])
const globalFilter = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const xmlViewerVisible = ref(false)
const viewingXml = ref('')
const viewingPartId = ref('')
const editorVisible = ref(false)
const editingPart = ref<PartData | null>(null)

onMounted(async () => {
  await loadParts()
})

async function loadParts() {
  try {
    loading.value = true
    error.value = null

    // TODO: 실제 API 연동
    // parts.value = await fetchPartsList()

    // 임시 더미 데이터
    await new Promise(resolve => setTimeout(resolve, 500))

    parts.value = [
      {
        id: '1',
        partNumber: 'MCB-3P-50A',
        name: '배선용 차단기 (3극 50A)',
        category: '차단기',
        manufacturer: 'LS산전',
        hasSymbol: true,
        has3DModel: false,
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        partNumber: 'CONT-100A',
        name: '전자접촉기 (100A)',
        category: '접촉기',
        manufacturer: '현대일렉트릭',
        hasSymbol: true,
        has3DModel: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        partNumber: 'THR-50-80A',
        name: '열동 과부하 계전기',
        category: '계전기',
        manufacturer: 'LS산전',
        hasSymbol: true,
        has3DModel: false,
        updatedAt: new Date().toISOString(),
      },
    ]

    loading.value = false
  } catch (err: any) {
    error.value = err.message || '부품 목록을 불러오는데 실패했습니다.'
    loading.value = false
  }
}

function getCategorySeverity(category: string): string {
  const severityMap: Record<string, string> = {
    '차단기': 'danger',
    '접촉기': 'warning',
    '계전기': 'info',
    '표시등': 'success',
    '버튼': 'secondary',
  }
  return severityMap[category] || 'secondary'
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function downloadSampleXml() {
  try {
    const xml = generateSampleXml()
    const blob = new Blob([xml], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample-part.xml'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.add({
      severity: 'success',
      summary: '성공',
      detail: '샘플 XML을 다운로드했습니다.',
      life: 3000,
    })
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: err.message || '샘플 XML 다운로드에 실패했습니다.',
      life: 3000,
    })
  }
}

async function handleFileImport(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  try {
    loading.value = true
    // TODO: 실제 API 연동
    // await importPartXml(file)

    toast.add({
      severity: 'success',
      summary: '성공',
      detail: 'XML 파일을 가져왔습니다.',
      life: 3000,
    })

    await loadParts()
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: err.message || 'XML 파일 가져오기에 실패했습니다.',
      life: 3000,
    })
  } finally {
    loading.value = false
    // 파일 입력 초기화
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

function openAddDialog() {
  editingPart.value = null
  editorVisible.value = true
}

function viewPart(part: PartListItem) {
  console.log('부품 상세보기:', part)
  toast.add({
    severity: 'info',
    summary: '알림',
    detail: '부품 상세보기는 곧 구현 예정입니다.',
    life: 3000,
  })
}

async function viewXml(part: PartListItem) {
  try {
    // TODO: 실제 API 연동
    // viewingXml.value = await fetchPartXml(part.id)

    // 임시로 샘플 XML 표시
    viewingXml.value = generateSampleXml()
    viewingPartId.value = part.id
    xmlViewerVisible.value = true
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: err.message || 'XML을 불러오는데 실패했습니다.',
      life: 3000,
    })
  }
}

async function downloadXml(part: PartListItem) {
  try {
    // TODO: 실제 API 연동
    // await downloadPartXml(part.id, `${part.partNumber}.xml`)

    // 임시로 샘플 XML 다운로드
    const xml = generateSampleXml()
    const blob = new Blob([xml], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${part.partNumber}.xml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.add({
      severity: 'success',
      summary: '성공',
      detail: 'XML을 다운로드했습니다.',
      life: 3000,
    })
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: err.message || 'XML 다운로드에 실패했습니다.',
      life: 3000,
    })
  }
}

function downloadViewingXml() {
  try {
    const blob = new Blob([viewingXml.value], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `part-${viewingPartId.value}.xml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.add({
      severity: 'success',
      summary: '성공',
      detail: 'XML을 다운로드했습니다.',
      life: 3000,
    })
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: err.message || 'XML 다운로드에 실패했습니다.',
      life: 3000,
    })
  }
}

async function editPart(part: PartListItem) {
  try {
    // TODO: 실제 API 연동
    // editingPart.value = await fetchPart(part.id)

    // 임시로 샘플 데이터 로드
    const sampleXml = generateSampleXml()
    const { partXmlConverter } = await import('~/utils/partXmlConverter')
    editingPart.value = partXmlConverter.fromXML(sampleXml)
    editingPart.value.metadata.id = part.id
    editingPart.value.metadata.partNumber = part.partNumber
    editingPart.value.metadata.name = part.name

    editorVisible.value = true
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: err.message || '부품 정보를 불러오는데 실패했습니다.',
      life: 3000,
    })
  }
}

async function handlePartSave(data: PartData) {
  try {
    loading.value = true

    // TODO: 실제 API 연동
    // if (data.metadata.id) {
    //   await updatePart(data.metadata.id, data)
    // } else {
    //   await createPart(data)
    // }

    toast.add({
      severity: 'success',
      summary: '성공',
      detail: '부품이 저장되었습니다.',
      life: 3000,
    })

    await loadParts()
  } catch (err: any) {
    toast.add({
      severity: 'error',
      summary: '오류',
      detail: err.message || '부품 저장에 실패했습니다.',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

function deletePart(part: PartListItem) {
  console.log('부품 삭제:', part)
  toast.add({
    severity: 'warn',
    summary: '알림',
    detail: '부품 삭제 기능은 곧 구현 예정입니다.',
    life: 3000,
  })
}
</script>

<style scoped>
.admin-parts-page {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #2c3e50;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.parts-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.loading-state p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.search-input {
  width: 300px;
}

.part-number {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #3498db;
}

.part-name-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.part-name-cell strong {
  color: #2c3e50;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.xml-viewer {
  max-height: 60vh;
  overflow: auto;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 1rem;
}

.xml-viewer pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #2c3e50;
}

.xml-viewer code {
  display: block;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
