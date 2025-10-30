<template>
  <div class="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
    <h1 class="text-4xl font-bold text-center mb-8">웹폰트 샘플 페이지</h1>
    <div class="mb-4">
      <label for="fontSizeSlider" class="block text-lg font-medium mb-2">폰트 크기 조정</label>
      <input id="fontSizeSlider" type="range" min="12" max="48" v-model="fontSize" class="w-full" />
      <p class="text-sm mt-2">현재 폰트 크기: {{ fontSize }}px</p>
    </div>
    <div class="flex flex-col gap-8 items-center">
      <div>
        <h2 class="text-2xl font-bold mb-4" style="font-family: 'Noto Sans KR', sans-serif;" :style="{ fontSize: fontSize + 'px' }">Noto Sans KR</h2>
        <p style="font-family: 'Noto Sans KR', sans-serif;" :style="{ fontSize: fontSize + 'px' }">모든 인류 구성원의 천부의 존엄성과 동등하고 양도할 수 없는 권리를 인정하는</p>
        <p style="font-family: 'Noto Sans KR', sans-serif;" :style="{ fontSize: fontSize + 'px' }">Whereas recognition of the inherent dignity</p>
      </div>
      <div>
        <h2 class="text-2xl font-bold mb-4" style="font-family: 'Spoqa Han Sans Neo', sans-serif;" :style="{ fontSize: fontSize + 'px' }">Spoqa Han Sans Neo</h2>
        <p style="font-family: 'Spoqa Han Sans Neo', sans-serif;" :style="{ fontSize: fontSize + 'px' }">모든 인류 구성원의 천부의 존엄성과 동등하고 양도할 수 없는 권리를 인정하는</p>
        <p style="font-family: 'Spoqa Han Sans Neo', sans-serif;" :style="{ fontSize: fontSize + 'px' }">Whereas recognition of the inherent dignity</p>
      </div>
      <div>
        <h2 class="text-2xl font-bold mb-4" style="font-family: 'Nanum Gothic', sans-serif;" :style="{ fontSize: fontSize + 'px' }">Nanum Gothic</h2>
        <p style="font-family: 'Nanum Gothic', sans-serif;" :style="{ fontSize: fontSize + 'px' }">모든 인류 구성원의 천부의 존엄성과 동등하고 양도할 수 없는 권리를 인정하는</p>
        <p style="font-family: 'Nanum Gothic', sans-serif;" :style="{ fontSize: fontSize + 'px' }">Whereas recognition of the inherent dignity</p>
      </div>
      <div>
        <h2 class="text-2xl font-bold mb-4" style="font-family: 'Pretendard', sans-serif;" :style="{ fontSize: fontSize + 'px' }">Pretendard</h2>
        <p style="font-family: 'Pretendard', sans-serif;" :style="{ fontSize: fontSize + 'px' }">모든 인류 구성원의 천부의 존엄성과 동등하고 양도할 수 없는 권리를 인정하는</p>
        <p style="font-family: 'Pretendard', sans-serif;" :style="{ fontSize: fontSize + 'px' }">Whereas recognition of the inherent dignity</p>
      </div>
      <div>
        <h2 class="text-2xl font-bold mb-4" style="font-family: 'BM Jua', sans-serif;" :style="{ fontSize: fontSize + 'px' }">BM Jua</h2>
        <p style="font-family: 'BM Jua', sans-serif;" :style="{ fontSize: fontSize + 'px' }">모든 인류 구성원의 천부의 존엄성과 동등하고 양도할 수 없는 권리를 인정하는</p>
        <p style="font-family: 'BM Jua', sans-serif;" :style="{ fontSize: fontSize + 'px' }">Whereas recognition of the inherent dignity</p>
      </div>
      <div>
        <h2 class="text-2xl font-bold mb-4" style="font-family: 'Gmarket Sans', sans-serif;" :style="{ fontSize: fontSize + 'px' }">Gmarket Sans</h2>
        <p style="font-family: 'Gmarket Sans', sans-serif;" :style="{ fontSize: fontSize + 'px' }">모든 인류 구성원의 천부의 존엄성과 동등하고 양도할 수 없는 권리를 인정하는</p>
        <p style="font-family: 'Gmarket Sans', sans-serif;" :style="{ fontSize: fontSize + 'px' }">Whereas recognition of the inherent dignity</p>
      </div>
      <div>
        <h2 class="text-2xl font-bold mb-4" style="font-family: 'Nanum Pen Script', cursive;" :style="{ fontSize: fontSize + 'px' }">Nanum Pen Script</h2>
        <p style="font-family: 'Nanum Pen Script', cursive;" :style="{ fontSize: fontSize + 'px' }">모든 인류 구성원의 천부의 존엄성과 동등하고 양도할 수 없는 권리를 인정하는</p>
        <p style="font-family: 'Nanum Pen Script', cursive;" :style="{ fontSize: fontSize + 'px' }">Whereas recognition of the inherent dignity</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const fontSize = ref(16);

definePageMeta({
  layout: 'default',
  title: '샘플 페이지'
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic&family=Nanum+Pen+Script&family=Noto+Sans+KR:wght@400;700&family=Pretendard:wght@400;700&family=Spoqa+Han+Sans+Neo:wght@400;700&display=swap');

/* 폰트 샘플 페이지 스타일 */
</style>
