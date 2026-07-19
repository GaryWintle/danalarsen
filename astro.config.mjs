// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: 'https://www.danalarsen.com',
  integrations: [
    sitemap({
      // The form success page is noindex — keep it out of the sitemap too
      filter: (page) => !page.includes('/contact/thanks'),
    }),
  ],
  vite: {
    server: {
      allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', '.ngrok.io'],
    },
  },
})
