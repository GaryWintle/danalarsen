// @ts-check
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
  site: 'https://www.danalarsen.com',
  integrations: [
    sitemap({
      // Form success pages are noindex — keep them out of the sitemap too
      filter: (page) => !page.includes('/thanks'),
    }),
  ],
  vite: {
    server: {
      allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', '.ngrok.io'],
    },
  },
})
