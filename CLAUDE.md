# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:4321
npm run build    # Build production site to ./dist/
npm run preview  # Preview production build locally
```

## Architecture

This is an Astro site for Dana Larsen, a Vancouver-based drug policy reform activist.

### Path Aliases (tsconfig.json)
- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@sections/*` → `src/sections/*`
- `@styles/*` → `src/styles/*`
- `@images/*` → `src/assets/images/*`
- `@graphics/*` → `src/assets/graphics/*`

### Page Composition
`src/pages/index.astro` composes the homepage:
```
Layout
├── Nav
├── Hero (header, outside main)
├── main
│   ├── TwoColWrapper (Projects grid + News/Columns sidebar)
│   ├── About
│   └── Newsletter
└── Footer
```

### CSS Architecture
Three global stylesheets loaded via Layout.astro:
1. `reset.css` — CSS reset
2. `variables.css` — Design tokens (colors, spacing, typography, shadows)
3. `global.css` — Base styles, typography, section spacing

Key conventions:
- OKLCH color system with semantic tokens (e.g., `--bg-surface`, `--text-title`)
- Spacing scale: `--sp-01` through `--sp-06` for component spacing, `--layout-01` through `--layout-03` for layout
- `--section-block` controls vertical padding on `main > section` elements
- Base font-size is 62.5% (1rem = 10px)

### SVG Handling
SVGs are imported as raw strings and rendered with `set:html`:
```astro
import icon from '@graphics/icon.svg?raw'
<div set:html={icon} />
```
