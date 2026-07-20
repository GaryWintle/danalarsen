# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Production build to ./dist/
npm run preview  # Preview production build locally
```

## Tech Stack

- **Astro 5** - Static site generator with component-based architecture
- **Scoped component styles + design tokens** - No CSS framework; styling lives in each component's `<style>` block on top of `src/styles/variables.css`
- **TypeScript** - Strict mode enabled
- **@fontsource-variable/inter** - Self-hosted body font ('Inter Variable'); CD display face self-hosted in `public/fonts/`

## Architecture

This is Dana Larsen's portfolio website built as a single-page Astro site.

**Component Organization:**

- `src/layouts/Layout.astro` - Master wrapper with meta tags, SEO, and JSON-LD structured data
- `src/sections/` - Page sections (Hero, Projects, About, Newsletter) composed in index.astro
- `src/components/` - Reusable UI components (Nav, Footer, Button, ProjectCard, etc.)

**Styling System:**

- Two-layer design tokens in `src/styles/variables.css`: primitives (`--blue-300`) → semantic roles (`--text-link`). **Components must use semantic tokens only** — see `src/styles/README.md` for the full guide and the contrast contract (every `--text-*` token passes WCAG AA on its documented surface)
- Colors use oklch() color space for perceptual uniformity
- Fluid typography/spacing via clamp() functions
- Styles are scoped within .astro component `<style>` blocks
- **Note:** When targeting elements injected via `set:html` (like raw SVG imports), use `:global()` in selectors since injected content doesn't receive Astro's scoping attributes. Example: `.wrapper :global(svg) { ... }`

**TypeScript Path Aliases:**

```
@components/* → src/components/*
@layouts/*    → src/layouts/*
@sections/*   → src/sections/*
@styles/*     → src/styles/*
@images/*     → src/assets/images/*
@graphics/*   → src/assets/graphics/*
```

## Formatting

Uses Prettier with Astro plugin. Config: no semicolons, single quotes, 80 char width.

## Use Up-to-Date Docs

Use Context7 to check up-to-date docs when needed for implementing new libraries or frameworks, or adding features using them.
