<template>
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
          v-model="modelValue.format"
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

      <div class="form-field full-width" v-if="modelValue.data">
        <label>3D 모델 미리보기</label>
        <div class="model-preview">
          <div ref="modelCanvas" class="canvas-3d"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Dropdown from 'primevue/dropdown'
import FileUpload from 'primevue/fileupload'
import Message from 'primevue/message'
import type { PartData } from '~/types/partXml'

interface Props {
  modelValue: PartData['model3d']
}

const props = defineProps<Props>()
const modelValue = defineModel<PartData['model3d']>({ required: true })

const modelCanvas = ref<HTMLDivElement | null>(null)

function handleModelUpload(event: any) {
  const file = event.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') {
        // Base64 인코딩
        modelValue.value.data = result.split(',')[1]
      }
    }
    reader.readAsDataURL(file)
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

.model-preview {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  background: #f8f9fa;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.canvas-3d {
  width: 100%;
  height: 300px;
}
</style>
