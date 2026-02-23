# A Complete Guide to Building a Git-Based CMS with Astro, Decap, and DecapBridge

> Written as a reference for anyone who wants to understand and replicate this setup from scratch. By the end of this guide, you will understand not just *what* to do, but *why* each piece exists and how they all fit together.

---

## Table of Contents

1. [The Big Picture](#the-big-picture)
2. [Part 1 — Astro Content Collections](#part-1--astro-content-collections)
3. [Part 2 — Decap CMS](#part-2--decap-cms)
4. [Part 3 — Authentication with DecapBridge](#part-3--authentication-with-decapbridge)
5. [Part 4 — Image Handling](#part-4--image-handling)
6. [Part 5 — OG Image Auto-Fetching](#part-5--og-image-auto-fetching)
7. [Part 6 — Netlify Deployment](#part-6--netlify-deployment)
8. [Part 7 — The Full Workflow End-to-End](#part-7--the-full-workflow-end-to-end)
9. [Gotchas and Tips](#gotchas-and-tips)
10. [Adapting This Setup for Other Projects](#adapting-this-setup-for-other-projects)

---

## The Big Picture

Before diving into files and code, it helps to understand what we are actually building and why.

A traditional CMS (like WordPress) stores content in a database and runs a server to serve it. That approach is powerful but comes with hosting costs, security vulnerabilities, and performance concerns.

**A git-based CMS works differently:**

- Content lives in plain text files (Markdown) committed directly to your git repository
- The static site generator (Astro) reads those files at build time and produces a plain HTML website
- A CMS admin interface (Decap) provides a friendly form UI for editing those files
- When the client saves something, Decap commits the change to GitHub, which triggers a new build and deploy

The result is a site with **no database, no server, near-zero running costs, built-in version history**, and a client-friendly editing experience. The tradeoff is that changes take 1–2 minutes to appear live (the time it takes Netlify to rebuild and deploy).

Here is the full stack at a glance:

| Layer | Tool | Role |
|---|---|---|
| Framework | Astro | Reads content files, builds static HTML |
| Content | Markdown files | Stores the actual data |
| CMS UI | Decap CMS | Form interface for editing Markdown |
| Auth | DecapBridge | Handles login without needing GitHub |
| Hosting | Netlify | Serves the site, triggers rebuilds on git push |

---

## Part 1 — Astro Content Collections

### What is a Content Collection?

In Astro, a **content collection** is a folder of Markdown (or JSON/YAML) files that Astro treats as a structured dataset. Instead of hardcoding data in your components, you define a schema for it and load it dynamically at build time.

Think of it like a simple spreadsheet: each `.md` file is a row, and the frontmatter fields at the top are the columns.

### The content.config.ts File

This file lives at `src/content.config.ts` and is the central definition of your collections. It tells Astro:

1. Where to find the files
2. What shape the data should be (the schema)

```ts
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const news = defineCollection({
  // glob() scans a directory for matching files
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/news' }),
  // z.object() defines the expected frontmatter fields
  schema: z.object({
    newsImage: z.string().optional(), // optional = field can be absent
    newsHeadline: z.string(),         // required string
    newsSource: z.string(),
    newsDate: z.string(),
    href: z.string(),
  }),
})

export const collections = { news }
```

**Key concepts:**

- `glob()` is the "loader" — it finds all matching files in the directory. The pattern `**/[^_]*.md` means "any `.md` file that does not start with an underscore, in any subfolder". The underscore convention is useful for draft files you don't want published.
- `z` is Zod, a TypeScript validation library. It ensures every file in your collection has the right shape. If a file is missing a required field, Astro will throw a helpful error at build time rather than silently producing a broken page.
- `.optional()` means the field does not have to be present in the frontmatter.

### Writing a Markdown Content File

Each `.md` file in `src/content/news/` corresponds to one news item. The `---` fenced block at the top is called **frontmatter** — it is YAML, and it maps directly to the fields you defined in your schema.

```markdown
---
newsHeadline: Raids on Medical Cannabis Dispensaries Threaten Drug-Testing Services
newsSource: The Tyee
newsDate: January 29, 2025
href: https://thetyee.ca/News/2025/01/30/Raids-Medical-Cannabis-Dispensaries/
---
```

The body below the frontmatter (if any) is the page content. For our news items, we only use frontmatter — no body needed.

### Querying a Collection

In any Astro page or component, you can load all items from a collection with `getCollection()`:

```astro
---
import { getCollection } from 'astro:content'

const newsItems = await getCollection('news')
// newsItems is a typed array — TypeScript knows every field on each item
---

{newsItems.map((item) => (
  <NewsBlock {...item.data} />
))}
```

`item.data` contains the frontmatter fields. `item.id` contains the file slug. Astro generates full TypeScript types for this automatically, so your editor will autocomplete field names and catch typos.

### Why Markdown over Hardcoded Data?

Before this setup, data might live in a TypeScript file like `data/newsBlocks.ts` as a hardcoded array. Markdown files are better because:

- **They are editable by non-developers** — that is the whole point of the CMS
- **They have version history** — every change is a git commit
- **They can be validated** — the schema catches mistakes
- **They are portable** — any static site generator can read them

---

## Part 2 — Decap CMS

### What is Decap CMS?

Decap CMS (formerly Netlify CMS) is an open-source, browser-based content management system. It is not a service — it is just a JavaScript application that you host yourself at `/admin` on your own site. It reads and writes directly to your git repository.

When the client visits `yoursite.com/admin`, they see a clean form interface. When they click Save, Decap commits a new or updated `.md` file to your repository on their behalf.

### The Two Files You Need

#### `public/admin/index.html`

This is the entry point for the admin UI. It is just an HTML file that loads the Decap JavaScript from a CDN.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>Content Manager</title>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </body>
</html>
```

**Important details:**

- `meta name="robots" content="noindex"` prevents search engines from indexing your admin page
- The Decap script goes in `<body>`, not `<head>`. This is not negotiable — if you put it in the head it will not initialise correctly.
- This file goes in `public/admin/` because anything in Astro's `public/` folder is served as-is, without processing

#### `public/admin/config.yml`

This is the brain of your CMS. It tells Decap:
- How to authenticate (the backend)
- Where to store uploaded media
- What collections exist and what fields they have

```yaml
backend:
  name: git-gateway
  repo: YourGitHubUsername/your-repo
  branch: main
  identity_url: https://auth.decapbridge.com/sites/YOUR-SITE-UUID
  gateway_url: https://gateway.decapbridge.com

media_folder: 'public/uploads/news'
public_folder: '/uploads/news'

collections:
  - name: 'news'
    label: 'News'
    folder: 'src/content/news'
    create: true
    delete: true
    format: 'frontmatter'
    extension: 'md'
    fields:
      - { label: 'Headline', name: 'newsHeadline', widget: 'string' }
      - { label: 'Source', name: 'newsSource', widget: 'string' }
      - { label: 'Date', name: 'newsDate', widget: 'datetime', format: 'MMMM D, YYYY', time_format: false }
      - { label: 'Link', name: 'href', widget: 'string', pattern: ['^https?://', 'Must start with https://'] }
```

### Understanding config.yml Fields

**`media_folder` vs `public_folder`** — These two work together and are a common source of confusion:

- `media_folder` is the **filesystem path** where uploaded files are saved (relative to the project root). For us, `public/uploads/news`.
- `public_folder` is the **URL path** that gets written into your content files. For us, `/uploads/news`. So when the CMS saves an image, the frontmatter will read `newsImage: /uploads/news/photo.jpg`, which is the correct URL path when served.

**`format: 'frontmatter'`** — Tells Decap the files use YAML frontmatter (the `---` block). This must match how your actual files are structured.

**`slug`** — Controls the filename for newly created entries. For example:
```yaml
slug: 'story-{{year}}{{month}}{{day}}-{{fields.newsSource | slugify}}'
```
This would produce a filename like `story-20250129-the-tyee.md`. The `| slugify` filter converts the field value to a URL-safe string.

**`editor.preview: false`** — Decap has a live preview panel, but it cannot render Astro components. Setting this to false hides the panel and keeps the editor clean.

### Widget Types

Decap's fields are called "widgets". The most common ones:

| Widget | Description | Output |
|---|---|---|
| `string` | Single line text | Plain string |
| `text` | Multi-line text | Plain string |
| `datetime` | Date/time picker | Formatted string (you control format) |
| `image` | File upload or URL | Path string |
| `boolean` | Toggle switch | `true` / `false` |
| `select` | Dropdown menu | One of the defined options |
| `list` | Array of items | YAML array |
| `markdown` | Rich text editor | Markdown string |

**Using `datetime` with a human-readable format:**
```yaml
widget: 'datetime'
format: 'MMMM D, YYYY'   # Outputs: January 29, 2025
date_format: 'MMMM D, YYYY'
time_format: false        # Hides the time picker
```
The format string uses Moment.js syntax. `MMMM` = full month name, `D` = day without leading zero, `YYYY` = four-digit year.

**Adding validation with `pattern`:**
```yaml
pattern: ['^https?://', 'Must be a full URL starting with https://']
```
The first item is a regex, the second is the error message shown to the user.

---

## Part 3 — Authentication with DecapBridge

### Why Not Netlify Identity?

The original built-in solution for Decap authentication was Netlify Identity. It was the standard recommendation for years. However, **Netlify deprecated it in February 2025**. It still technically works for existing setups, but it receives no bug fixes or feature updates and could be removed at any time.

The lesson here: always check whether a service is still actively maintained before building on it. A quick web search for "Netlify Identity 2025" would have surfaced the deprecation notice.

### What DecapBridge Does

DecapBridge is a purpose-built authentication service for Decap CMS. It sits between your CMS admin interface and GitHub, handling the login and permission flow so that:

- Your client never needs a GitHub account
- You control who has access from a dashboard
- Invitations are sent by email — the client sets their own password

From a technical perspective, DecapBridge acts as a custom `identity_url` and `gateway_url` in your Decap config. When the client logs in, they authenticate with DecapBridge, which then grants Decap permission to commit to your repository using a GitHub token you provided during setup.

### Setup Steps (One-Time)

1. Create an account at [decapbridge.com](https://decapbridge.com)
2. Create a new "Site" — provide your live site URL and your GitHub repo path
3. Generate a GitHub **fine-grained personal access token** with:
   - Repository access: your specific repo only
   - Permissions: Contents (read/write), Metadata (read)
4. Paste the token into DecapBridge
5. Choose "Classic" auth (email/password) for simple client setups
6. Copy the generated `backend` block into your `config.yml`
7. Invite users by email from the DecapBridge dashboard — they receive an email, set a password, and are taken directly to `/admin`

### The Token Expiry Question

Set the GitHub token to **no expiration**. A token with an expiry date will silently break the CMS when it expires — the client won't know why it stopped working. The risk is acceptable because the token is scoped to a single repository with write access only, and stored securely in DecapBridge.

---

## Part 4 — Image Handling

### The Core Conflict

Astro has a powerful image optimisation system built in. When you use `import myImage from './image.webp'` or Astro's `image()` schema helper, Astro resizes, compresses, and generates `srcset` attributes automatically. This produces perfectly sized, highly optimised images.

The problem: **Decap writes absolute public paths** like `/uploads/news/image.jpg`. Astro's image system requires relative imports or known source files — it cannot optimise arbitrary public paths at build time.

This means there is an unavoidable tradeoff when using a git-based CMS:

| Approach | Astro optimises images? | Client can upload images? |
|---|---|---|
| `src/assets/` + relative paths | ✅ Yes | ❌ No — only developers |
| `public/uploads/` + absolute paths | ❌ No | ✅ Yes — via CMS |

For a client-managed site, the right choice is `public/uploads/`. The practical impact is small — modern image formats (WebP, AVIF) uploaded by the client are already well-compressed, and the browser handles downscaling well enough for thumbnail use.

### The Schema Change

To accommodate public paths, change the schema from Astro's `image()` helper to a plain `z.string()`:

```ts
// Before — Astro-optimised, cannot handle public paths
schema: ({ image }) => z.object({
  newsImage: image(),
})

// After — plain string, works with any path or URL
schema: z.object({
  newsImage: z.string().optional(),
})
```

And in your component, replace `<Image>` with a plain `<img>`:

```astro
<!-- Before -->
<Image src={newsImage} alt={newsHeadline} loading="lazy" decoding="async" />

<!-- After -->
<img src={newsImage} alt={newsHeadline} loading="lazy" decoding="async" />
```

The CSS (`object-fit: cover`) handles all sizing, so the visual result is the same.

### Where Uploaded Files Live

Files uploaded through the CMS go into `public/uploads/news/` and are committed to your git repository as part of the same save operation. This means:

- The repo grows slightly with every uploaded image
- Images are version-controlled
- Netlify serves them as static files with no extra configuration

For a portfolio site with occasional updates this is ideal. For a site with hundreds of images, you would want to consider a cloud media library like Cloudinary instead.

---

## Part 5 — OG Image Auto-Fetching

### The Problem It Solves

Requiring the client to upload a thumbnail for every news article is friction. News articles from major outlets already have a high-quality promotional image called an **Open Graph (OG) image** — it is the image you see when you share the article on social media.

Rather than making the client hunt down and upload that image manually, we can fetch it automatically at build time.

### What is an OG Image?

Every well-built news site includes a set of `<meta>` tags in the `<head>` of each article:

```html
<meta property="og:image" content="https://example.com/images/article-thumbnail.jpg" />
```

This is part of the [Open Graph protocol](https://ogp.me/), originally created by Facebook to control how links appear when shared. The `og:image` tag contains the URL of the intended thumbnail.

### The Fetch Utility

We created `src/utils/fetchOgImage.ts` to handle this:

```ts
export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)...',
      },
    })
    if (!res.ok) return null
    const html = await res.text()

    // Try multiple patterns — different sites format their meta tags differently
    const patterns = [
      // Quoted attributes, property first (most common)
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      // Quoted attributes, content first
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      // Unquoted attributes, content first (e.g. Vancouver Sun / Postmedia)
      /<meta[^>]+content=([^\s"'>]+)[^>]+property=og:image[\s>]/i,
      // Unquoted attributes, property first
      /<meta[^>]+property=og:image[^>]+content=([^\s"'>]+)/i,
      // Twitter image fallback — quoted
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
      // Twitter image fallback — unquoted
      /<meta[^>]+content=([^\s"'>]+)[^>]+name=twitter:image[\s>]/i,
    ]

    for (const pattern of patterns) {
      const match = html.match(pattern)
      if (match?.[1]) return match[1]
    }

    return null
  } catch {
    return null
  }
}
```

**Why so many regex patterns?** HTML is not as consistent as you might hope. Most sites quote their attributes (`content="url"`) but some — including major Canadian news outlets using the Postmedia platform (Vancouver Sun, National Post) — use unquoted attributes (`content=url`). Both are valid HTML. You need to handle both.

**Why a User-Agent header?** Some sites block requests that look like bots. Using a browser User-Agent string makes the request look like it is coming from a real user's Chrome browser.

**Why `AbortSignal.timeout(8000)`?** This sets a timeout — if a site takes more than 8 seconds to respond, we give up and move on. Without a timeout, a slow or unresponsive site could hang your entire build.

### The Fallback Chain

In `src/pages/index.astro`, we resolve images with a priority chain:

```astro
---
const resolvedNewsItems = await Promise.all(
  newsItems.map(async (item) => ({
    ...item.data,
    newsImage:
      item.data.newsImage        // 1. Use manually set image if present
      ?? (await fetchOgImage(item.data.href))  // 2. Try to fetch OG image
      ?? undefined,              // 3. Fall back to component default
  })),
)
---
```

The `??` operator is the **nullish coalescing** operator. It means "use the left side unless it is null or undefined, in which case use the right side." This creates a clean three-level priority system.

**The component default** is set in `NewsBlock.astro`:
```astro
const { newsImage = '/images/danalarsen-profile.webp', ... } = Astro.props
```

So the full chain is:
1. Manually uploaded image in frontmatter
2. OG image fetched from the article URL
3. Profile photo fallback

### This Happens at Build Time

An important nuance: this fetch happens when Netlify **builds** the site, not when a visitor views the page. The result is baked into the static HTML. This means:

- There is no runtime cost — visitors do not wait for the fetch
- Build times will increase slightly (a few seconds per article, running in parallel)
- If a news site later changes their OG image, the live site will not update until the next build

---

## Part 6 — Netlify Deployment

### netlify.toml

This file sits at the project root and tells Netlify how to build your site:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

Without this file, Netlify can sometimes guess the right settings — but being explicit is always better. Specifying `NODE_VERSION = "20"` ensures your build uses a modern Node version with native `fetch` support (which our OG image utility depends on).

### How Decap Commits Work

When a client saves or publishes content in the CMS:

1. Decap collects the form data and serialises it as a Markdown file
2. It sends the file to DecapBridge's gateway
3. The gateway uses your GitHub token to commit the file directly to your repository
4. GitHub notifies Netlify (via webhook) that a new commit was pushed
5. Netlify starts a new build
6. The build runs `npm run build`, which reads the new `.md` file
7. The new content appears on the live site

The whole process typically takes 1–2 minutes. The client will see a "Publishing" state in the CMS, and then the content goes live.

### A Practical Consequence: Pull Before You Push

Because the CMS can commit to your repository at any time, you will occasionally hit a rejected push when working locally:

```
! [rejected] main -> main (fetch first)
```

This just means the remote has commits you do not have locally (Decap committed something while you were working). The fix is always the same:

```bash
git pull origin main --rebase && git push origin main
```

The `--rebase` flag keeps the history clean by replaying your local commits on top of the remote ones, rather than creating an extra merge commit.

---

## Part 7 — The Full Workflow End-to-End

Here is the complete picture of what happens from the client adding a story to it appearing on the live site:

```
Client opens yoursite.com/admin
        ↓
DecapBridge authenticates them
        ↓
Client fills in: Headline, Source, Date, URL
        ↓
Client clicks "Publish"
        ↓
Decap creates: src/content/news/story-20250129-the-tyee.md
        ↓
DecapBridge commits the file to GitHub on the client's behalf
        ↓
GitHub notifies Netlify (webhook)
        ↓
Netlify runs: npm run build
        ↓
Astro's getCollection('news') reads the new .md file
        ↓
fetchOgImage() fetches the OG thumbnail from the article URL
        ↓
NewsBlock renders with the fetched image
        ↓
Netlify deploys the new static HTML
        ↓
Content appears live (~1-2 minutes after clicking Publish)
```

---

## Gotchas and Tips

### The Decap `image` Widget Cannot Be Truly Optional

The `image` widget in Decap does not properly support `required: false` — it will still block saving if left empty. If you need an optional image field, either:

- Remove it from the CMS and handle it in code (as we did with OG fetching)
- Use `widget: 'string'` instead, so the client can paste an image URL or leave it blank

### Always Test Your Regex Against Real Sites

HTML is messy. The two HTML meta tag formats we encountered:

```html
<!-- Most sites — quoted attributes -->
<meta property="og:image" content="https://example.com/image.jpg" />

<!-- Postmedia (Vancouver Sun, National Post, etc.) — unquoted attributes -->
<meta content=https://example.com/image.jpg property=og:image>
```

When building an OG fetcher for a new project, test it manually against your target sites before assuming it works. A quick `node -e` test (like the ones we ran in this project) will save you a lot of debugging later.

### Decap's `datetime` Widget Uses Moment.js Format Strings

Quick reference for common formats:

| Format String | Output |
|---|---|
| `MMMM D, YYYY` | January 29, 2025 |
| `MMM D, YYYY` | Jan 29, 2025 |
| `YYYY-MM-DD` | 2025-01-29 |
| `D MMMM YYYY` | 29 January 2025 |

### Local Testing with `decap-server`

You do not need to deploy to test CMS changes. Run these two commands in separate terminals:

```bash
# Terminal 1 — Decap proxy (reads/writes your local filesystem)
npx decap-server

# Terminal 2 — Astro dev server
npm run dev
```

Then in `config.yml`, temporarily uncomment:
```yaml
local_backend: true
```

Navigate to `http://localhost:4321/admin/` and click "Use local backend". Changes write directly to your local `src/content/` folder with no login required. **Remember to re-comment `local_backend: true` before committing.**

### The `.gitignore` Lesson

Windows creates `Zone.Identifier` files for anything downloaded from the internet. Dropbox creates `.com.dropbox.attrs` files. Neither belongs in your repo. Add these to `.gitignore` proactively:

```gitignore
*.Zone.Identifier
*.dropbox.attrs
*.com.dropbox.attrs
Unconfirmed *.crdownload*
```

### Decap Config Changes Take a Deploy to Take Effect

`config.yml` is a static file served from `public/admin/`. When you update it, you need to push and wait for Netlify to deploy before the CMS reflects the change. This is easy to forget when you are iterating on the CMS configuration.

---

## Adapting This Setup for Other Projects

Here is a checklist for applying this pattern to a new Astro project:

### 1. Define your collections

For each type of content you want to manage:

- Create a folder under `src/content/`
- Add an entry in `src/content.config.ts` with a `defineCollection()` and Zod schema
- Write a few sample `.md` files to test with

### 2. Create the admin UI

- Create `public/admin/index.html` (copy the template from this guide)
- Create `public/admin/config.yml` — mirror your collection schemas as Decap fields

### 3. Set up DecapBridge

- Register at [decapbridge.com](https://decapbridge.com)
- Create a GitHub fine-grained token scoped to just this repo
- Copy the generated backend block into `config.yml`

### 4. Create `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"
```

### 5. Handle images

Decide upfront:

- **Client uploads images** → use `public/uploads/` and `z.string()` in schema
- **Dev manages images** → use `src/assets/` and Astro's `image()` helper

If clients upload images, consider adding OG auto-fetching for any collection that has external article URLs.

### 6. Deploy and invite users

- Push to GitHub, confirm Netlify builds successfully
- Set up DecapBridge (add token, invite users by email)
- Test the full publish flow end-to-end before handing off to the client

---

*This guide was written based on a real implementation. Every decision documented here was made for a specific reason — understanding the "why" behind each choice is what will allow you to adapt this pattern confidently for future projects.*
