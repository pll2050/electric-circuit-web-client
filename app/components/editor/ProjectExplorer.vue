<template>
  <div class="h-full bg-gray-800 flex flex-col">
    <div class="flex-1 overflow-y-auto p-2 text-sm">
      <div class="space-y-1">
        <div class="flex items-center gap-1 px-2 py-1 text-gray-300 hover:bg-gray-700 rounded cursor-pointer">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          <span class="text-xs">{{ projectName }}</span>
        </div>
        <div class="ml-4 space-y-1">
          <div
            v-for="file in files"
            :key="file.id"
            @click="selectFile(file.id)"
            :class="[
              'flex items-center gap-1 px-2 py-1 text-gray-300 hover:bg-gray-700 rounded cursor-pointer',
              selectedFileId === file.id ? 'bg-gray-700' : ''
            ]"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
            </svg>
            <span class="text-xs">{{ file.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  projectName?: string
}>()

const emit = defineEmits<{
  'select-file': [fileId: string]
}>()

const selectedFileId = ref('main')

const files = [
  { id: 'main', name: 'Main.p01' },
  { id: 'power', name: 'Power.p02' },
  { id: 'control', name: 'Control.p03' }
]

const selectFile = (fileId: string) => {
  selectedFileId.value = fileId
  emit('select-file', fileId)
}
</script>

<style scoped>
.bg-gray-750 {
  background-color: #2d3748;
}
</style>
