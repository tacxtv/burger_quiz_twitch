const apiUrl = process.env.API_URL || 'http://localhost:4000'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  srcDir: 'src',
  app: {
    head: {
      script: [
        apiUrl + '/scripts/overlay.js',
      ],
    },
  },
  modules: ['nuxt-proxy'],
  runtimeConfig: {
    public: {
      apiUrl,
    },
    proxy: {
      options: {
        target: apiUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
        },
        pathFilter: [
          '/api',
        ],
      },
    }
  },
})
