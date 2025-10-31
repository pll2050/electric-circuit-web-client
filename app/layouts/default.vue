<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/layout/default/AppHeader.vue';
import AppFooter from '~/components/layout/default/AppFooter.vue';
import { useRoute } from '#app';
import { useHead } from '@unhead/vue';

const route = useRoute();

useHead({
  title: route.meta.title?`${route.meta.title} - Electric Circuit Web`:'Electric Circuit Web',
});
</script>
