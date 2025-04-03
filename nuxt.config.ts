// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  ssr: false,
  runtimeConfig: {
    public: {
      apiUrl: 'https://api.openweathermap.org',
      apiKey: process.env.API_KEY,
      imgUrl: 'https://openweathermap.org/img/wn'
    }
  },
  css: ['assets/css/main.css'],
  modules: ['@nuxt/icon', '@nuxt/ui', '@vueuse/nuxt']
})