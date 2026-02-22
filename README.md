# danalarsen.com

Personal website for Dana Larsen — Vancouver-based drug policy reform activist, author, and founder of multiple harm reduction organizations.

Built with **Astro**, a custom design system, and a focus on accessibility and performance.

![Astro](https://img.shields.io/badge/Astro-FF5D01?logo=astro&logoColor=white)
![CSS](https://img.shields.io/badge/CSS_Custom_Properties-1572B6?logo=css3&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)


<img width="1597" height="1227" alt="image" src="https://github.com/user-attachments/assets/b53cda58-273b-4c42-be6c-a6edd7b25446" />

## Tech Stack

- **Framework:** [Astro](https://astro.build) — static-first, component-based architecture
- **Styling:** Vanilla CSS with a custom token-based design system (OKLCH color space)
- **Fonts:** Self-hosted custom typefaces (`CD`, `Inter`) with `font-display: swap`
- **Images:** WebP format, lazy loaded, with `astro:assets` optimization

## Design System

The site uses a two-tier token system defined in `src/styles/variables.css`:

- **Primitive tokens** — raw color, spacing, and type values (`--blue-200`, `--sp-04`, `--font-03`)
- **Semantic tokens** — contextual mappings for surfaces, text, and interactive states (`--bg-surface`, `--text-title`, `--button-primary`)

All colors use the **OKLCH** color space for perceptually uniform palettes and relative color syntax for hover states and transparency.

## Key Features

- **Accessible by default** — skip links, ARIA labels, visible focus rings, semantic HTML, and `prefers-reduced-motion` support
- **SEO optimized** — structured data (`Person`, `WebSite`, `WebPage`), Open Graph / Twitter Card meta, canonical URLs, sitemap, and `robots.txt`
- **Responsive layout** — fluid typography with `clamp()`, container-aware grid layouts, and mobile-first breakpoints
- **Component architecture** — reusable Astro components (`Button`, `ProjectCard`, `NewsBlock`, `SidebarBlock`) with scoped styles
- **Performance** — font preloading, DNS prefetching, lazy-loaded images, and minimal client-side JS

## Project Structure

```
src/
├── assets/graphics/     # SVG icons, social icons, decorative elements
├── components/          # Reusable UI components (Button, Nav, Footer, etc.)
├── layouts/             # Base HTML layout with meta and structured data
├── pages/               # Route entry points
├── sections/            # Page-level sections (Hero, Projects, About, Newsletter)
└── styles/              # Global styles, reset, and design tokens
public/
├── fonts/               # Self-hosted WOFF2/WOFF files
├── images/              # Optimized static images
├── favicon.svg
├── robots.txt
└── sitemap.xml
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```


## Status

🚧 **In active development** — content sections and responsive refinements in progress.

---

Designed and developed by me. Built to ship, not just to show.
