<template>
  <div class="h-full bg-gray-800 flex flex-col">
    <div class="flex-1 overflow-y-auto p-3">
      <div v-if="selectedComponent" class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">부품 타입</label>
          <input
            type="text"
            :value="selectedComponent.type"
            disabled
            class="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-xs text-gray-300"
          >
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">식별자</label>
          <input
            type="text"
            v-model="selectedComponent.name"
            placeholder="예: R1, C2, SW1"
            class="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
          >
        </div>

        <div v-if="selectedComponent.type === 'resistor'">
          <label class="block text-xs font-medium text-gray-400 mb-1">저항값</label>
          <div class="flex gap-2">
            <input
              type="number"
              v-model="selectedComponent.value"
              class="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
            >
            <select class="px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-xs text-gray-200">
              <option>Ω</option>
              <option>kΩ</option>
              <option>MΩ</option>
            </select>
          </div>
        </div>

        <div v-if="selectedComponent.type === 'capacitor'">
          <label class="block text-xs font-medium text-gray-400 mb-1">용량</label>
          <div class="flex gap-2">
            <input
              type="number"
              v-model="selectedComponent.value"
              step="0.000001"
              class="flex-1 px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
            >
            <select class="px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-xs text-gray-200">
              <option>pF</option>
              <option>nF</option>
              <option>µF</option>
              <option>mF</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">설명</label>
          <textarea
            v-model="selectedComponent.description"
            rows="3"
            class="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-xs text-gray-200 focus:border-blue-500 focus:outline-none resize-none"
            placeholder="부품 설명 입력..."
          ></textarea>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">제조사</label>
          <input
            type="text"
            v-model="selectedComponent.manufacturer"
            placeholder="예: Siemens, Schneider"
            class="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
          >
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-400 mb-1">부품 번호</label>
          <input
            type="text"
            v-model="selectedComponent.partNumber"
            placeholder="제조사 부품 번호"
            class="w-full px-2 py-1.5 bg-gray-700 border border-gray-600 rounded text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
          >
        </div>
      </div>

      <div v-else class="text-xs text-gray-500 text-center py-8">
        부품을 선택하면 속성이 표시됩니다
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selectedComponent?: any
}>()
</script>

<style scoped>
.bg-gray-750 {
  background-color: #2d3748;
}
</style>
