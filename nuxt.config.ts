// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },

  app: {
    head: {
      htmlAttrs: {
        dir: "rtl",
        lang: "fa",
      },
    },
  },

  runtimeConfig: {
    public: {
      azapi: "https://azapi.ok-ex.io/server/api/support/faq",
      api: "https://api.ok-ex.io/oapi/v1/market/tickers",
    },
  },

  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt", "@formkit/auto-animate"],

  tailwindcss: {
    cssPath: ["~/assets/css/tailwind.css", { injectPosition: "first" }],
  },
});