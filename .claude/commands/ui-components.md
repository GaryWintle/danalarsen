---
description: Creates a new Astro component in /components or /sections
---

# Create Astro Component

Create a new Astro component following this project's conventions.

## Instructions

Ask the user the following questions using the AskUserQuestion tool:

1. **Component name** - What should the component be called? (e.g., "Card", "Badge", "Modal")

2. **Component location** - Where should it live?
   - `src/components/` - Reusable UI components
   - `src/sections/` - Page sections composed in index.astro

3. **Props needed** - What props should the component accept? Ask for:
   - Prop name
   - Type (string, boolean, number, etc.)
   - Default value (if any)

4. **Slots** - Does the component need slots?
   - Default slot only
   - Named slots (ask for slot names)
   - No slots

## Component Template

Generate the component using this structure:

```astro
---
// Imports first (use path aliases from tsconfig)
// import Component from '@components/Component.astro'
// import icon from '@graphics/Icons/icon.svg?raw'

// Props destructuring with defaults
const {
  propName = 'defaultValue',
  class: className, // Use this pattern if accepting a class prop
} = Astro.props
---

<div class:list={['component-name', className]}>
  <slot />
</div>

<style>
  .component-name {
    /* Use CSS custom properties from variables.css */
    /* font-family: var(--font-body); */
    /* font-size: var(--font-02); */
    /* color: var(--neutral-100); */
    /* padding: var(--sp-04); */
    /* border-radius: var(--br-01); */
  }
</style>
```

## Project Conventions

Follow these conventions when generating the component:

### Path Aliases

- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@sections/*` → `src/sections/*`
- `@styles/*` → `src/styles/*`
- `@images/*` → `src/assets/images/*`
- `@graphics/*` → `src/assets/graphics/*`

### Styling

- Use CSS custom properties from `src/styles/variables.css`
- Colors use oklch() color space (e.g., `var(--blue-100)`, `var(--neutral-200)`)
- Spacing: `var(--sp-01)` through `var(--sp-12)`
- Font sizes: `var(--font-01)` through `var(--font-07)`
- Border radius: `var(--br-01)`, `var(--br-02)`
- Use scoped `<style>` blocks (Astro default)
- For elements injected via `set:html`, use `:global()` in selectors

### Props Pattern

```js
const { variant = 'primary', size = 'md', class: className } = Astro.props
```

### Conditional Classes

```html
<div class:list="{[variant," size, className]}></div>
```

### SVG Icons

```js
import icon from '@graphics/Icons/icon.svg?raw'
```

```html
<!-- Use set:html for raw SVG -->
<div set:html="{icon}" />
```

### Images

```js
import { Image } from 'astro:assets'
```

```html
<image src="{imageSrc}" alt="description" loading="lazy" />
```

## After Creation

After creating the component:

1. Show the user the generated code
2. Ask if they want any modifications
3. Remind them to import and use the component where needed
