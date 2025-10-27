<template>
  <div class="bg-gray-800 border-b border-gray-700 px-3 py-2">
    <div class="flex items-center gap-2 overflow-x-auto">
      <div class="text-xs text-gray-400 mr-2">부품:</div>

      <!-- Power Sources -->
      <button
        @click="$emit('add-component', 'battery')"
        class="flex flex-col items-center justify-center w-16 h-16 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded transition-colors group"
        title="DC 전원"
      >
        <div class="text-xl mb-1">⎓</div>
        <span class="text-[9px] text-gray-400 group-hover:text-gray-200">DC 전원</span>
      </button>

      <button
        @click="$emit('add-component', 'ac-source')"
        class="flex flex-col items-center justify-center w-16 h-16 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded transition-colors group"
        title="AC 전원"
      >
        <div class="text-xl mb-1">∿</div>
        <span class="text-[9px] text-gray-400 group-hover:text-gray-200">AC 전원</span>
      </button>

      <div class="w-px h-12 bg-gray-600 mx-1"></div>

      <!-- Passive Components -->
      <button
        @click="$emit('add-component', 'resistor')"
        class="flex flex-col items-center justify-center w-16 h-16 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded transition-colors group"
        title="저항"
      >
        <div class="text-xl mb-1">▭</div>
        <span class="text-[9px] text-gray-400 group-hover:text-gray-200">저항</span>
      </button>

      <button
        @click="$emit('add-component', 'capacitor')"
        class="flex flex-col items-center justify-center w-16 h-16 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded transition-colors group"
        title="커패시터"
      >
        <div class="text-xl mb-1">⊥⊥</div>
        <span class="text-[9px] text-gray-400 group-hover:text-gray-200">커패시터</span>
      </button>

      <button
        @click="$emit('add-component', 'inductor')"
        class="flex flex-col items-center justify-center w-16 h-16 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded transition-colors group"
        title="인덕터"
      >
        <div class="text-xl mb-1">∾</div>
        <span class="text-[9px] text-gray-400 group-hover:text-gray-200">인덕터</span>
      </button>

      <div class="w-px h-12 bg-gray-600 mx-1"></div>

      <!-- Switches -->
      <button
        @click="$emit('add-component', 'switch')"
        class="flex flex-col items-center justify-center w-16 h-16 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded transition-colors group"
        title="스위치"
      >
        <div class="text-xl mb-1">⚬—</div>
        <span class="text-[9px] text-gray-400 group-hover:text-gray-200">스위치</span>
      </button>

      <button
        @click="$emit('add-component', 'relay')"
        class="flex flex-col items-center justify-center w-16 h-16 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded transition-colors group"
        title="릴레이"
      >
        <div class="text-xl mb-1">⊏⊐</div>
        <span class="text-[9px] text-gray-400 group-hover:text-gray-200">릴레이</span>
      </button>

      <button
        @click="$emit('add-component', 'breaker')"
        class="flex flex-col items-center justify-center w-16 h-16 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded transition-colors group"
        title="차단기"
      >
        <div class="text-xl mb-1">⊟</div>
        <span class="text-[9px] text-gray-400 group-hover:text-gray-200">차단기</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  'add-component': [componentType: string]
}>()
</script>
