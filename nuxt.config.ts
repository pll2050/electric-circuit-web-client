// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  srcDir: 'app/',

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
      firebaseAppId: process.env.FIREBASE_APP_ID || '',
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8080/api',
    },
  },

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
      include: ['@joint/core', '@joint/plus', '@babylonjs/core', '@babylonjs/loaders']
    }
  }
})
