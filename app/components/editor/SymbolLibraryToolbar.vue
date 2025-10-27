<template>
  <div class="bg-gray-800 border-b border-gray-700 px-3 py-2">
    <div class="flex items-center gap-2">
      <span class="text-xs text-gray-400">기호 라이브러리:</span>
      <select
        v-model="selectedStandard"
        @change="$emit('change-standard', selectedStandard)"
        class="bg-gray-700 text-gray-300 text-xs border border-gray-600 rounded px-2 py-1"
      >
        <option value="IEC">IEC 표준</option>
        <option value="KEC">KEC 표준</option>
        <option value="ANSI">ANSI 표준</option>
        <option value="custom">사용자 정의</option>
      </select>
      <div class="flex-1"></div>
      <span class="text-xs text-gray-400">도면 크기:</span>
      <select
        v-model="selectedPageSize"
        @change="$emit('change-page-size', selectedPageSize)"
        class="bg-gray-700 text-gray-300 text-xs border border-gray-600 rounded px-2 py-1"
      >
        <option value="A4">A4 (210×297mm)</option>
        <option value="A3">A3 (297×420mm)</option>
        <option value="A2">A2 (420×594mm)</option>
        <option value="A1">A1 (594×841mm)</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  'change-standard': [standard: string]
  'change-page-size': [size: string]
}>()

const selectedStandard = ref('IEC')
const selectedPageSize = ref('A4')
</script>
