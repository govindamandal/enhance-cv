export default defineNuxtConfig({
  compatibilityDate: "2026-06-08",
  ssr: true,
  nitro: {
    preset: "static"
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "en"
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "A Nuxt static career workspace with resumes, job tracking, and interview preparation."
        }
      ],
      link: [{ rel: "stylesheet", href: "/styles.css" }]
    }
  }
});
