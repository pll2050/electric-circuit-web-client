// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  srcDir: 'app/',

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  app: {
    head: {
      title: 'Electric Circuit Web',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Web-based electrical circuit design and simulator' }
      ],
    }
  },

  css: [
    '~/assets/css/main.css',
  ],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  vite: {
    optimizeDeps: {
      include: ['jointjs', '@babylonjs/core', '@babylonjs/loaders']
    }
  }
})
