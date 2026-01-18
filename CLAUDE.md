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
- **Tailwind CSS 4** - Utility classes alongside scoped component styles
- **TypeScript** - Strict mode enabled

## Architecture

This is Dana Larsen's portfolio website built as a single-page Astro site.

**Component Organization:**
- `src/layouts/Layout.astro` - Master wrapper with meta tags, SEO, and JSON-LD structured data
- `src/sections/` - Page sections (Hero, Projects, About, Newsletter) composed in index.astro
- `src/components/` - Reusable UI components (Nav, Footer, Button, ProjectCard, etc.)

**Styling System:**
- Design tokens defined in `src/styles/variables.css` using CSS custom properties
- Colors use oklch() color space for perceptual uniformity
- Fluid typography/spacing via clamp() functions
- Styles are scoped within .astro component `<style>` blocks

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
