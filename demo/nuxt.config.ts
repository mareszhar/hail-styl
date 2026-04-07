import path from 'node:path'
import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-04-06',
  devtools: { enabled: false },
  vite: {
    css: {
      preprocessorOptions: {
        stylus: {
          /*
          set up auto-importing of stylus partials.
          the content of these will be automatically available in:
            1. every vue component
            2. every .styl file that is imported into a vue component
          */
          paths: [path.resolve(process.cwd(), 'node_modules')],
          additionalData: `
          @import '${path.resolve(process.cwd(), './design-system.styl')}'
        `,
        },
      },
    },
  }
})
