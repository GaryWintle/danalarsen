import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const news = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/news' }),
  schema: z.object({
    newsImage: z.string(),
    newsHeadline: z.string(),
    newsSource: z.string(),
    newsDate: z.string(),
    href: z.string(),
  }),
})

const columns = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/columns' }),
  schema: z.object({
    headline: z.string(),
    source: z.string(),
    date: z.string(),
    href: z.string(),
  }),
})

export const collections = { news, columns }
