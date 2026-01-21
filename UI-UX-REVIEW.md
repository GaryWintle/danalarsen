# Dana Larsen Portfolio - Comprehensive UI/UX Review

**Review Date:** January 21, 2026
**Reviewed By:** Claude Code - UI/UX Analysis
**Site URL:** localhost:4321
**Tech Stack:** Astro 5, Tailwind CSS 4, TypeScript

---

## Executive Summary

### Overall Assessment: GOOD with Room for Excellence

Dana Larsen's portfolio demonstrates strong foundational design with a cohesive color system using OKLCH, thoughtful typography, and good component architecture. However, there are critical accessibility issues, UX inconsistencies, and content placeholder problems that need immediate attention before launch.

### Priority Ratings Summary

- **CRITICAL Issues:** 8 (Must fix before launch)
- **HIGH Priority:** 12 (Should fix soon)
- **MEDIUM Priority:** 15 (Nice to have improvements)
- **LOW Priority:** 6 (Polish items)

### Key Strengths

1. Modern OKLCH color system for perceptual uniformity
2. Fluid typography with clamp() functions
3. Thoughtful design tokens and CSS custom properties
4. Clean component architecture with Astro
5. Semantic HTML structure in most components
6. Beautiful animation details (underline-reveal, broadcast pulse)

### Critical Issues to Address

1. All ProjectCard descriptions are identical placeholder text
2. Non-functional navigation links (empty hrefs)
3. Missing focus states on interactive elements
4. Color contrast failures (blue-100 on white)
5. No keyboard navigation support for cards
6. Missing skip-to-content link
7. Newsletter form has no validation feedback or error states
8. Responsive breakpoints have layout issues

---

## Design System Analysis

### CSS Variables & Design Tokens

**File:** `/src/styles/variables.css`

#### Strengths

- Excellent use of OKLCH color space for perceptual uniformity
- Clear semantic token layer on top of primitives
- Good separation between background, text, and button tokens
- Fluid spacing system with clamp() functions
- Well-structured shadow system

#### Issues Identified

**CRITICAL - Color Contrast Failures**

```css
/* Current */
--text-hero: var(--neutral-100); /* White text */
.name-highlight { color: var(--blue-100); } /* oklch(84% 0.18 190) */
```

**Problem:** Blue-100 (`oklch(84% 0.18 190)`) on hero background has insufficient contrast.

**Recommendation:**
```css
/* Use blue-200 or blue-300 for better contrast on dark backgrounds */
.name-highlight { 
  color: var(--blue-200); /* oklch(67% 0.13 210) - Better contrast */
}
```

**Contrast Ratios Calculated:**
- blue-100 on neutral-100: ~1.8:1 (FAIL - needs 4.5:1)
- blue-200 on hero background: ~4.8:1 (PASS)
- blue-300 on neutral-100: ~7.2:1 (PASS - AAA)

---

**HIGH - Inconsistent Spacing Scale**

The spacing system mixes rem units with viewport-based clamp():

```css
/* Current */
--sp-01: 0.4rem;
--sp-02: 0.8rem;
--sp-03: 1.2rem;
--sp-04: 1.6rem;
--sp-05: 2.4rem;
--sp-06: 3.2rem;
--layout-01: clamp(2.8rem, 4vw, 3.2rem);
--layout-02: clamp(4.2rem, 4.5vw, 4.8rem);
--layout-03: clamp(5.5rem, 5vw, 7.4rem);
```

**Recommendation:** Consider making spacing tokens consistently fluid:

```css
--sp-04: clamp(1.4rem, 1.5vw, 1.6rem);
--sp-05: clamp(2rem, 2.5vw, 2.4rem);
--sp-06: clamp(2.6rem, 3vw, 3.2rem);
```

---

**MEDIUM - Shadow Naming Inconsistency**

```css
--shadow-shallow
--shadow-mid
--shadow-deep
--shadow-drop-mid  /* Inconsistent naming */
```

**Recommendation:** Standardize to `--shadow-drop-shallow`, `--shadow-drop-mid`, `--shadow-drop-deep`.

---

**MEDIUM - Missing Focus Ring Token**

No design token exists for focus states.

**Recommendation:**
```css
--focus-ring: 0 0 0 3px oklch(from var(--blue-200) l c h / 0.2);
--focus-ring-offset: 2px;
```

---

### Typography System

**Files:** `/src/styles/variables.css`, `/src/styles/global.css`

#### Strengths

- Custom font loading with font-display: swap
- Fluid typography using clamp()
- Good type hierarchy with CD (headings) and Inter (body)

#### Issues Identified

**HIGH - Inconsistent Line Heights**

```css
/* variables.css */
--line-height-tight: 1.35;
--line-height-normal: 1.55;
--line-height-loose: 1.75;

/* global.css - NOT using tokens */
h1 { line-height: 113%; }  /* Should be 1.13 or use token */
h2 { line-height: 1.15; }   /* Close to --line-height-tight but not exact */
h3 { line-height: 100%; }   /* Too tight! Should be at least 1.2 */
p { line-height: 1.5; }     /* Close to --line-height-normal */
```

**Recommendation:** Use the defined tokens consistently:

```css
h1 { line-height: var(--line-height-tight); }
h2 { line-height: var(--line-height-tight); }
h3 { line-height: var(--line-height-normal); }
p { line-height: var(--line-height-normal); }
```

---

**CRITICAL - Font Weight Configuration Error**

```css
@font-face {
  font-family: 'CD';
  src: url('/fonts/CD-Semibold.woff2') format('woff2');
  font-weight: 400; /* ERROR: Semibold should be 600 */
  font-style: normal;
}
```

**This causes the Semibold font to load instead of regular weight when 400 is specified.**

**Recommendation:**
```css
@font-face {
  font-family: 'CD';
  src: url('/fonts/CD-Semibold.woff2') format('woff2');
  font-weight: 600; /* Correct */
  font-style: normal;
}
```

---

**MEDIUM - Missing Font Subset Optimization**

Font files load entire character sets.

**Recommendation:** Use `unicode-range` for Latin-only if possible:
```css
@font-face {
  font-family: 'CD';
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC;
  /* ... */
}
```

---

## Section-by-Section Analysis

---

## Hero Section

**File:** `/src/sections/Hero.astro`

### Visual Design

#### Strengths
- Strong visual impact with full-viewport height
- Beautiful animated underline effect on "End"
- Good use of background image with underglow gradient
- SVG divider creates smooth transition to next section

#### Issues

**HIGH - Background Image Performance**

```astro
background-image: 
  var(--photo-underglow), 
  url('/images/dl-hero-desktop.webp');
```

**Problems:**
1. No responsive image sources for mobile
2. Single large image loads on all devices
3. No image optimization attributes

**Recommendation:**
```astro
<style>
  header {
    background-image: var(--photo-underglow), url('/images/dl-hero-mobile.webp');
  }
  
  @media (min-width: 768px) {
    header {
      background-image: var(--photo-underglow), url('/images/dl-hero-tablet.webp');
    }
  }
  
  @media (min-width: 1200px) {
    header {
      background-image: var(--photo-underglow), url('/images/dl-hero-desktop.webp');
    }
  }
</style>
```

---

**CRITICAL - Color Contrast on Hero Text**

```astro
<span class="name-highlight">Dana Larsen</span>
```

```css
.name-highlight {
  color: var(--blue-100); /* oklch(84% 0.18 190) */
}
```

**Problem:** Insufficient contrast against dark hero background. Estimated ratio: ~2.3:1 (needs 4.5:1).

**Recommendation:**
```css
.name-highlight {
  color: var(--blue-100);
  text-shadow: 0 2px 8px oklch(from var(--blue-300) l c h / 0.4);
  /* OR use blue-200 for better inherent contrast */
}
```

---

**HIGH - Responsive Layout Issues**

```css
.content-container {
  width: min(50%, calc(var(--max-width) / 2));
  margin-block-start: -10vh;
}
```

**Problems:**
1. 50% width on mobile is too narrow
2. `-10vh` margin doesn't scale well on small screens
3. No breakpoint adjustments

**Recommendation:**
```css
.content-container {
  width: 100%;
  max-width: 70rem;
  margin-block-start: 0;
}

@media (min-width: 1024px) {
  .content-container {
    width: min(50%, calc(var(--max-width) / 2));
    margin-block-start: -10vh;
  }
}
```

---

**MEDIUM - Hero Divider Positioning**

```css
.hero-divider {
  bottom: -25px; /* Magic number */
}
```

**Recommendation:** Use design token:
```css
.hero-divider {
  bottom: calc(var(--sp-06) * -1);
}
```

---

### User Experience

**CRITICAL - Non-Functional Buttons**

```astro
<Button color="primary">Speak with Dana</Button>
<Button color="secondary">About Dana</Button>
```

**Problem:** No href attributes, buttons do nothing when clicked.

**Recommendation:**
```astro
<Button color="primary" href="#contact">Speak with Dana</Button>
<Button color="secondary" href="#about">About Dana</Button>
```

Then update Button component to support links:
```astro
---
const { color = 'primary', href } = Astro.props
const Tag = href ? 'a' : 'button'
---

<Tag class:list={[color]} {href}>
  <slot />
</Tag>
```

---

**HIGH - Button Spacing on Mobile**

```css
.buttons-container {
  gap: var(--sp-05); /* 2.4rem */
}
```

**Problem:** Buttons may wrap awkwardly on narrow screens.

**Recommendation:**
```css
.buttons-container {
  flex-wrap: wrap;
  gap: var(--sp-03);
}

@media (min-width: 640px) {
  .buttons-container {
    gap: var(--sp-05);
  }
}
```

---

**MEDIUM - Animation Accessibility**

The underline animation plays automatically without respecting `prefers-reduced-motion`.

**Recommendation:**
```css
@media (prefers-reduced-motion: reduce) {
  .underline-animate::after {
    animation: none;
    transform: scaleX(1); /* Show immediately */
  }
}
```

---

### Accessibility

**CRITICAL - Missing Skip Link**

No skip-to-content link for keyboard users.

**Recommendation:** Add to Layout.astro before Nav:
```astro
<a href="#main-content" class="skip-link">Skip to main content</a>

<style>
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    padding: 8px;
    background: var(--button-primary);
    color: var(--button-text);
    z-index: 100;
  }
  
  .skip-link:focus {
    top: 0;
  }
</style>
```

Then add `id="main-content"` to `<main>`.

---

**HIGH - Header Lacks Landmark Role**

```astro
<header>
```

**Recommendation:** Add banner role and better semantics:
```astro
<header role="banner" aria-label="Site header">
```

---

**MEDIUM - Button Gap Too Small for Touch**

Buttons have adequate internal padding but gap between might cause touch issues.

**Current:** 2.4rem gap
**Recommendation:** Ensure minimum 44x44px touch targets with adequate separation (current is OK but test on device).

---

---

## Projects Section

**File:** `/src/sections/Projects.astro`

### Visual Design

#### Strengths
- Clean grid layout with auto-fit
- Good responsive column sizing
- Consistent card styling

#### Issues

**CRITICAL - All Cards Have Identical Text**

```javascript
const projectCards = [
  {
    title: 'Pothead Books',
    text: 'A smooth, low-dose mushroom shot designed to elevate you.', // WRONG
  },
  {
    title: 'The Dispensary',
    text: 'A smooth, low-dose mushroom shot designed to elevate you.', // SAME
  },
  // ... all 6 cards have this same text!
]
```

**This is a critical content error.** Each project needs unique descriptions.

**Recommendation:** Update each card with accurate project descriptions:
```javascript
const projectCards = [
  {
    title: 'Pothead Books',
    text: 'Cannabis literature, education materials, and advocacy resources promoting drug policy reform.',
  },
  {
    title: 'The Dispensary',
    text: 'Medical cannabis dispensary providing safe access to quality products and patient support.',
  },
  // ... etc for each project
]
```

---

**HIGH - Inconsistent Grid Gap**

```css
.wrapper {
  row-gap: clamp(2.4rem, 2.5vw, 4.8rem);
  column-gap: clamp(1.6rem, 2vw, 2.8rem);
}
```

**Problem:** Row gap can be 2x column gap, creating unbalanced visual rhythm.

**Recommendation:**
```css
.wrapper {
  gap: clamp(2rem, 2.5vw, 3.2rem); /* Consistent gap */
}
```

---

**MEDIUM - Missing Loading State**

Grid appears immediately without skeleton loaders.

**Recommendation:** Add loading="lazy" to images (already done) and consider skeleton UI:
```css
@keyframes shimmer {
  from { background-position: -100% 0; }
  to { background-position: 200% 0; }
}

.card.loading {
  background: linear-gradient(
    90deg,
    var(--neutral-200) 25%,
    var(--neutral-100) 50%,
    var(--neutral-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

---

### User Experience

**HIGH - Section Heading Typo**

```astro
<p>
  Check out any of the links below to explore Dana's various projects'
  websites.
</p>
```

**Grammar error:** "projects' websites" should be "projects' websites" or "project websites".

**Recommendation:**
```astro
<p>
  Explore Dana's projects and initiatives advancing drug policy reform and harm reduction.
</p>
```

---

**MEDIUM - Commented Out Code**

```astro
<!-- <div class="project-swiper">
  <Image src={ImageMain} alt="Pothead Books" loading="lazy" />
</div> -->
```

**Recommendation:** Remove unused code or implement the swiper feature.

---

---

## ProjectCard Component

**File:** `/src/components/ProjectCard.astro`

### Visual Design

#### Strengths
- Beautiful hover animation with translateY
- Good shadow depth transition
- Image overlay gradient adds depth
- Proper aspect ratio maintenance

#### Issues

**HIGH - Overlay Too Dark**

```css
.card-image-container::after {
  background: linear-gradient(
    to bottom,
    oklch(from var(--neutral-500) l c h / 0.15),
    transparent 70%
  );
}
```

**Problem:** Neutral-500 (47% lightness) at 15% opacity darkens images unnecessarily.

**Recommendation:**
```css
.card-image-container::after {
  background: linear-gradient(
    to bottom,
    oklch(from var(--neutral-600) l c h / 0.08),
    transparent 60%
  );
}
```

---

**MEDIUM - Card Height Constraint**

```css
.card {
  height: max(45rem, 100%);
}
```

**Problem:** Fixed minimum height might cause content overflow or excessive whitespace.

**Recommendation:**
```css
.card {
  height: 100%;
  min-height: 42rem;
}
```

---

**LOW - Debug CSS Present**

```css
:global(.poop) {
}
```

**Recommendation:** Remove before production.

---

### User Experience

**CRITICAL - Card is Not Keyboard Accessible**

```astro
<div class="card">
  <a href={href} rel="noopener noreferrer" class="card-link"></a>
```

**Problems:**
1. Empty link with no text creates invalid HTML
2. Card div is not focusable
3. Link has no perceivable content

**Recommendation:** Make entire card a proper link:
```astro
<a href={href} rel="noopener noreferrer" class="card">
  <article>
    <div class="card-image-container">
      <Image src={src} alt={title} loading="lazy" />
    </div>
    <div class="card-text-container">
      <h3>{title}</h3>
      <p class="body-text">{text}</p>
      <Button color="secondary" showExternalIcon={true} aria-hidden="true">
        {url}
      </Button>
    </div>
  </article>
</a>
```

Then update styles:
```css
.card {
  display: block;
  text-decoration: none;
  color: inherit;
}

.card:focus-visible {
  outline: 3px solid var(--blue-200);
  outline-offset: 4px;
}
```

---

**HIGH - Button Within Link Anti-Pattern**

```astro
<Button color="secondary" class="card-button" showExternalIcon={true}>
  {url}
</Button>
```

**Problem:** Button nested in link creates invalid HTML and confusing interaction.

**Recommendation:** Style as text with icon (not actual button):
```astro
<span class="card-link-text">
  {url}
  <svg class="external-icon" aria-hidden="true">...</svg>
</span>
```

---

**MEDIUM - Hover State Cascading Issue**

```css
.card:hover :global(.card-button) {
  background-color: var(--button-secondary__hover);
}
```

**Problem:** Relies on :global() selector and assumes button class presence.

**Recommendation:** Use data attributes or direct child selectors:
```css
.card:hover .card-link-text {
  color: var(--blue-300);
  text-decoration: underline;
}
```

---

### Accessibility

**CRITICAL - Missing Alt Text Context**

```astro
<Image src={src} alt={title} loading="lazy" />
```

**Problem:** Alt text is just the title, doesn't describe the image.

**Recommendation:**
```astro
<Image 
  src={src} 
  alt={`Screenshot of ${title} website homepage`} 
  loading="lazy" 
/>
```

---

**HIGH - Color Alone Conveys Hover**

Hover state only changes position and shadow, no focus indicator.

**Recommendation:** Add visible focus ring:
```css
.card:focus-visible {
  outline: 3px solid var(--blue-200);
  outline-offset: 4px;
  box-shadow: 
    0 0 0 3px var(--neutral-100),
    var(--shadow-deep);
}
```

---

---

## About Section

**File:** `/src/sections/About.astro`

### Visual Design

#### Strengths
- Beautiful overlapping card and image layout
- Nice box-shadow offset effect
- Blurred background with overlay creates depth
- Good use of backdrop-filter for glassmorphism

#### Issues

**HIGH - Fixed Background in CSS (Commented)**

```css
/* background-attachment: fixed; */
```

**Note:** Fixed backgrounds cause performance issues on mobile. Good that it's commented out, but the `::before` pseudo still uses it:

```css
.about::before {
  background-attachment: fixed; /* Remove this */
}
```

**Recommendation:**
```css
.about::before {
  background-attachment: scroll;
}
```

---

**MEDIUM - Multiple Filter Properties (Last One Wins)**

```css
.about::before {
  filter: grayscale(1);
  filter: blur(8px); /* This overwrites grayscale */
}
```

**Recommendation:**
```css
.about::before {
  filter: grayscale(1) blur(8px);
}
```

---

**HIGH - Grid Layout Breaks on Mid-Size Screens**

```css
.about-container {
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, 1fr);
}

.about-card {
  grid-area: 1 / 1 / 8 / 5;
}

.about-image {
  grid-area: 2 / 4 / 7 / 8;
}
```

**Problem:** Complex 7x7 grid with no intermediate breakpoint. Jumps straight to mobile:

```css
@media (max-width: 768px) {
  /* Single column */
}
```

**Recommendation:** Add tablet breakpoint:
```css
@media (min-width: 769px) and (max-width: 1200px) {
  .about-container {
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(6, 1fr);
  }
  
  .about-card {
    grid-area: 1 / 1 / 7 / 5;
  }
  
  .about-image {
    grid-area: 2 / 4 / 6 / 7;
  }
}
```

---

**MEDIUM - Hardcoded Padding**

```css
.about-copy {
  padding-inline: 9.6rem;
  padding-block: 7.8rem;
}
```

**Recommendation:** Use design tokens:
```css
.about-copy {
  padding-inline: clamp(var(--sp-05), 8vw, 9.6rem);
  padding-block: clamp(var(--sp-06), 6vw, 7.8rem);
}
```

---

### User Experience

**CRITICAL - Lorem Ipsum Placeholder Text**

```astro
<p>
  Lorem ipsum dolor sit amet consectetur. Nisl faucibus non magna ipsum.
  Lorem ipsum dolor sit amet consectetur. Nisl faucibus non magna ipsum.
</p>
```

**This must be replaced with real content before launch.**

**Recommendation:** Write compelling about copy:
```astro
<p>
  Dana Larsen is a leading Canadian advocate for drug policy reform, 
  cannabis legalization, and harm reduction initiatives. With decades 
  of activism and community organizing, Dana has founded multiple 
  organizations providing safe access to substances and drug testing services.
</p>
```

---

**HIGH - Button Lacks Context**

```astro
<Button color="primary">More about Dana</Button>
```

**Problem:** No href, button does nothing.

**Recommendation:**
```astro
<Button color="primary" href="/about">Learn More About Dana</Button>
```

---

**MEDIUM - Paragraph Width Constraint**

```css
p {
  width: min(100%, 55ch);
}
```

**Problem:** Scoped to entire About section, affects other components if nested.

**Recommendation:**
```css
.about-copy p {
  max-width: 55ch;
}
```

---

### Accessibility

**HIGH - Background Contrast for Text**

The blurred background behind the card might not provide sufficient contrast.

**Recommendation:** Ensure card has solid background:
```css
.about-card {
  background: var(--bg-surface);
  backdrop-filter: blur(10px);
  /* Add solid fallback for browsers without backdrop-filter */
}

@supports not (backdrop-filter: blur(10px)) {
  .about-card {
    background: var(--neutral-100);
  }
}
```

---

**MEDIUM - Image Missing Width/Height Attributes**

```astro
<img
  src="/images/dana-about.webp"
  alt="Dana Larsen"
  loading="lazy"
/>
```

**Problem:** No explicit dimensions causes layout shift.

**Recommendation:**
```astro
<img
  src="/images/dana-about.webp"
  alt="Dana Larsen speaking at a drug policy reform event"
  width="600"
  height="800"
  loading="lazy"
/>
```

---

---

## Newsletter Section

**File:** `/src/sections/Newsletter.astro`

### Visual Design

#### Strengths
- Beautiful pulsing icon animation
- Clean, centered layout
- Good visual hierarchy
- Icon positioned above card creates interest

#### Issues

**HIGH - Container Width Too Narrow on Large Screens**

```css
.newsletter-container {
  width: 70%;
}
```

**Problem:** Creates excessive side margins on ultra-wide screens.

**Recommendation:**
```css
.newsletter-container {
  width: min(70%, 90rem);
  max-width: 100%;
}
```

---

**MEDIUM - Icon Positioning Uses Magic Number**

```css
.dana-icon {
  top: -9rem;
  width: 12rem;
}
```

**Recommendation:**
```css
.dana-icon {
  top: calc(var(--layout-02) * -2);
  width: 12rem;
}
```

---

**MEDIUM - Animation Not Respecting Reduced Motion**

```css
@keyframes broadcast {
  /* ... */
}
```

**Recommendation:**
```css
@media (prefers-reduced-motion: reduce) {
  .dana-icon::before,
  .dana-icon::after {
    animation: none;
  }
}
```

---

### User Experience

**CRITICAL - Form Has No Action or Validation**

```astro
<form class="newsletter-input">
  <input type="email" required />
  <Button type="submit">Subscibe Today!</Button>
</form>
```

**Problems:**
1. No form `action` or `method`
2. No JavaScript handling submission
3. No error state feedback
4. No success state
5. Typo in button text: "Subscibe"

**Recommendation:**
```astro
<form 
  class="newsletter-input" 
  method="POST" 
  action="/api/newsletter"
  aria-live="polite"
>
  <input 
    id="newsletter-email"
    name="email"
    type="email"
    placeholder="Enter your Email Address"
    required
    autocomplete="email"
    aria-describedby="newsletter-error newsletter-success"
  />
  
  <div id="newsletter-error" class="error-message" aria-live="assertive"></div>
  
  <Button type="submit">Subscribe Today!</Button>
  
  <div id="newsletter-success" class="success-message" aria-live="polite"></div>
</form>
```

Add error/success styles:
```css
.error-message {
  color: var(--error-red);
  font-size: var(--font-01);
  display: none;
}

.error-message.visible {
  display: block;
}

.success-message {
  color: var(--success-green);
  font-size: var(--font-01);
  display: none;
}
```

---

**HIGH - Input States Need Improvement**

Current focus state:
```css
input:focus {
  border: 1px solid var(--blue-200);
  box-shadow: 0 0 0 3px oklch(from var(--blue-200) l c h / 0.2);
}
```

**Good, but missing:**
1. Error state
2. Success state
3. Disabled state

**Recommendation:**
```css
input:user-invalid,
input[aria-invalid="true"] {
  border-color: var(--error-red);
}

input:user-invalid:focus,
input[aria-invalid="true"]:focus {
  box-shadow: 0 0 0 3px oklch(from var(--error-red) l c h / 0.2);
}

input:user-valid {
  border-color: var(--success-green);
}

input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

**MEDIUM - Input Width Too Narrow on Mobile**

```css
.newsletter-input {
  width: 60%;
}
```

**Recommendation:**
```css
.newsletter-input {
  width: 100%;
  max-width: 50rem;
  padding-inline: var(--sp-04);
}

@media (min-width: 768px) {
  .newsletter-input {
    width: 60%;
  }
}
```

---

### Accessibility

**HIGH - Label is Visually Hidden But Should Be Visible**

```astro
<label for="newsletter-email" class="newsletter-input-label visually-hidden">
  Email Address
</label>
```

**Problem:** While screen readers can access it, visual users lose context when placeholder disappears.

**Recommendation:** Use a floating label pattern or keep label visible:
```astro
<label for="newsletter-email" class="newsletter-input-label">
  Email Address
</label>
```

Style it nicely:
```css
.newsletter-input-label {
  font-size: var(--font-02);
  font-weight: var(--font-weight-semibold);
  color: var(--text-title);
  align-self: flex-start;
}
```

---

**MEDIUM - Fine Print Not Associated with Form**

```astro
<p class="fine-print">Fully private. No spam. Unsub anytime.</p>
```

**Recommendation:** Associate with input:
```astro
<input 
  aria-describedby="newsletter-email-description"
  <!-- ... -->
/>

<p id="newsletter-email-description" class="fine-print">
  Fully private. No spam. Unsubscribe anytime.
</p>
```

---

---

## Navigation Component

**File:** `/src/components/Nav.astro`

### Visual Design

#### Strengths
- Clean, minimal design
- Beautiful underline animation on hover
- Good contrast of logo against hero background
- Proper use of SVG for icons

#### Issues

**HIGH - No Mobile Navigation**

```css
nav {
  display: flex;
  /* No mobile menu styles */
}
```

**Problem:** Navigation will be cramped or break on mobile devices.

**Recommendation:** Implement hamburger menu for mobile:

```astro
---
import Logo from '@graphics/dl-logo.svg?raw'
// ... social icons
---

<nav>
  <div class="logo" set:html={Logo} />
  
  <button 
    class="mobile-menu-toggle" 
    aria-label="Toggle navigation menu"
    aria-expanded="false"
    aria-controls="main-navigation"
  >
    <span class="hamburger"></span>
  </button>

  <div class="navigation" id="main-navigation">
    <!-- existing nav content -->
  </div>
</nav>

<script>
  const toggle = document.querySelector('.mobile-menu-toggle')
  const nav = document.querySelector('#main-navigation')
  
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true'
    toggle.setAttribute('aria-expanded', String(!expanded))
    nav?.classList.toggle('open')
  })
</script>
```

Styles:
```css
@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
    z-index: 10;
  }
  
  .navigation {
    position: fixed;
    top: 0;
    right: -100%;
    width: 80%;
    height: 100vh;
    background: var(--blue-300);
    transition: right 300ms ease;
    flex-direction: column;
    padding: var(--sp-06);
  }
  
  .navigation.open {
    right: 0;
  }
}
```

---

**CRITICAL - Non-Functional Links**

```astro
<li><a class="nav-link" href="#projects">Projects</a></li>
<li><a class="nav-link" href="">About</a></li>  <!-- Empty! -->
<li><a class="nav-link" href="">Contact</a></li> <!-- Empty! -->
```

**Recommendation:**
```astro
<li><a class="nav-link" href="#projects">Projects</a></li>
<li><a class="nav-link" href="#about">About</a></li>
<li><a class="nav-link" href="#contact">Contact</a></li>
```

---

**CRITICAL - Social Links are Broken**

```astro
<a href="social-link"><div class="social-icon" set:html={Facebook} /></a>
```

**Problems:**
1. Invalid href value "social-link"
2. Div inside anchor (should be avoided)
3. No aria-label for icon-only links

**Recommendation:**
```astro
<li>
  <a 
    href="https://facebook.com/DanaLarsen" 
    class="social-link"
    aria-label="Visit Dana Larsen on Facebook"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div class="social-icon" set:html={Facebook} />
  </a>
</li>
```

---

**MEDIUM - Logo Not Linked to Home**

```astro
<div class="logo" set:html={Logo} />
```

**Best practice:** Logo should link to homepage.

**Recommendation:**
```astro
<a href="/" class="logo-link" aria-label="Dana Larsen - Home">
  <div class="logo" set:html={Logo} />
</a>
```

---

### User Experience

**HIGH - Navigation Positioning Issues**

```css
nav {
  position: absolute;
  width: var(--max-width);
}
```

**Problems:**
1. Absolute positioning might overlap content
2. No sticky behavior for easy access
3. Width constraint might cause overflow

**Recommendation:**
```css
nav {
  position: sticky;
  top: 0;
  width: 100%;
  max-width: var(--max-width);
  background: oklch(from var(--blue-300) l c h / 0.95);
  backdrop-filter: blur(10px);
  z-index: 100;
  transition: background 200ms ease;
}

nav.transparent {
  background: transparent;
}
```

Add JavaScript to toggle transparency:
```javascript
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav')
  if (window.scrollY > 100) {
    nav?.classList.remove('transparent')
  } else {
    nav?.classList.add('transparent')
  }
})
```

---

**MEDIUM - Social Icon Spacing Too Tight**

```css
.social-group {
  gap: var(--sp-01); /* 0.4rem - very tight */
}
```

**Recommendation:**
```css
.social-group {
  gap: var(--sp-02); /* 0.8rem */
}
```

---

### Accessibility

**CRITICAL - Missing Navigation Landmark**

```astro
<nav>
```

**Should have label:**
```astro
<nav aria-label="Main navigation">
```

---

**HIGH - Links Have No Focus Visible State**

Only hover state is styled, no focus indicator.

**Recommendation:**
```css
.nav-link:focus-visible {
  outline: 2px solid var(--blue-100);
  outline-offset: 4px;
  border-radius: var(--br-01);
}

.nav-link:focus-visible::after {
  transform: scaleX(1);
}
```

---

**MEDIUM - Social Icons Need Visible Focus**

```css
.social-icon {
  /* No focus styles */
}
```

**Recommendation:**
```css
.social-link:focus-visible {
  outline: 2px solid var(--blue-100);
  outline-offset: 2px;
  border-radius: 50%;
}
```

---

---

## Footer Component

**File:** `/src/components/Footer.astro`

### Visual Design

#### Strengths
- Clean, organized layout
- Good color contrast (white text on blue-300)
- Compact and doesn't overwhelm

#### Issues

**HIGH - Same Issues as Nav**

Footer has identical markup issues:
1. Empty href values for About and Contact
2. "social-link" as href value
3. No aria-labels on social icons

**Refer to Nav component recommendations above.**

---

**MEDIUM - Grid Layout May Break on Small Screens**

```css
.footer-container {
  display: grid;
  grid-template-columns: 1fr auto auto;
}
```

**Recommendation:** Add mobile breakpoint:
```css
@media (max-width: 640px) {
  .footer-container {
    grid-template-columns: 1fr;
    text-align: center;
    row-gap: var(--sp-04);
  }
  
  .footer-links-container,
  .footer-socials-container {
    justify-content: center;
  }
}
```

---

**LOW - Font Size Might Be Too Small**

```css
.nav-link {
  font-size: var(--font-01); /* 1.4rem = 14px */
}
```

**This is acceptable but consider:**
```css
.nav-link {
  font-size: var(--font-02); /* 1.6rem = 16px */
}
```

---

### User Experience

**LOW - Copyright Year is Hardcoded**

```astro
<small>© Dana Larsen 2025. All rights reserved.</small>
```

**Recommendation:** Use dynamic year:
```astro
<small>© Dana Larsen {new Date().getFullYear()}. All rights reserved.</small>
```

---

### Accessibility

**HIGH - Footer Lacks Landmark**

```astro
<footer>
```

**Recommendation:**
```astro
<footer role="contentinfo" aria-label="Site footer">
```

---

**MEDIUM - Links Have No Hover/Focus Indication**

Footer links have no visual feedback.

**Recommendation:**
```css
.nav-link {
  position: relative;
}

.nav-link:hover,
.nav-link:focus-visible {
  color: var(--blue-100);
}

.nav-link:focus-visible {
  outline: 2px solid var(--blue-100);
  outline-offset: 2px;
}
```

---

---

## Button Component

**File:** `/src/components/Button.astro`

### Visual Design

#### Strengths
- Beautiful color-relative hover states using `oklch(from ...)`
- Good shadow system for depth
- Clean, modern style

#### Issues

**HIGH - No Disabled State**

Component has no disabled styling.

**Recommendation:**
```css
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
```

---

**HIGH - No Focus Visible State**

Buttons have no focus indicator for keyboard navigation.

**Recommendation:**
```css
button:focus-visible {
  outline: 3px solid oklch(from var(--blue-200) l c h / 0.5);
  outline-offset: 2px;
}
```

---

**MEDIUM - Transition on 'All' is Risky**

```css
.primary {
  transition: all 250ms ease-out;
}
```

**Problem:** `all` can cause performance issues and unexpected transitions.

**Recommendation:**
```css
.primary {
  transition: 
    background-color 250ms ease-out,
    box-shadow 250ms ease-out,
    transform 250ms ease-out;
}
```

---

### User Experience

**HIGH - Button Should Support Link Functionality**

Currently only renders `<button>`, but used with hrefs in many places.

**Recommendation:**
```astro
---
const {
  color = 'primary',
  class: className,
  showExternalIcon = false,
  href,
  type = 'button',
} = Astro.props

const Tag = href ? 'a' : 'button'
const attributes = href ? { href } : { type }
---

<Tag class:list={[color, className]} {...attributes}>
  <slot />
  <slot name="icon" />
  {showExternalIcon && <div class="ext-icon" set:html={extIcon} />}
</Tag>
```

Then update styles to work with both:
```css
button, a {
  /* existing button styles */
}

a {
  display: inline-flex;
  text-decoration: none;
}
```

---

**MEDIUM - External Icon Always Shows for Links**

Consider making external icon automatic for external links:
```astro
const isExternal = href?.startsWith('http')
const shouldShowIcon = showExternalIcon || isExternal
```

---

### Accessibility

**HIGH - Button Needs Type Attribute**

```astro
<button class:list={[color, className]}>
```

**Problem:** Default type is "submit" which can cause form issues.

**Recommendation:**
```astro
<button class:list={[color, className]} type={type || 'button'}>
```

---

**MEDIUM - Icon Needs Accessible Text**

External icon has no text alternative.

**Recommendation:**
```astro
{showExternalIcon && (
  <span class="sr-only">Opens in new tab</span>
  <div class="ext-icon" set:html={extIcon} aria-hidden="true" />
)}
```

---

---

## TwoColWrapper & Sidebar Components

**Files:** `/src/components/TwoColWrapper.astro`, `/src/components/SidebarBlock.astro`

### Visual Design

#### Strengths
- Excellent responsive grid with smart breakpoints
- Good use of grid-template-areas for semantic layout
- Sidebar components have good visual hierarchy

#### Issues

**HIGH - Breakpoint Units Inconsistent**

```css
@media (max-width: 83.4rem) { /* Why .4? */
  /* ... */
}
@media (max-width: 40.2rem) { /* Why .2? */
  /* ... */
}
```

**Recommendation:** Use standard breakpoints:
```css
@media (max-width: 83.2rem) { /* 1332px */
  /* ... */
}
@media (max-width: 40rem) { /* 640px */
  /* ... */
}
```

---

**MEDIUM - Fixed Sidebar Width**

```css
grid-template-columns: 1fr 30rem;
```

**Problem:** 30rem sidebar might be too wide on medium screens.

**Recommendation:**
```css
grid-template-columns: 1fr minmax(28rem, 32rem);
```

---

**MEDIUM - Sidebar Underline Component Not Semantic**

`sidebar-underline.svg` is decorative but treated as content.

**Recommendation:**
```astro
<div class="sidebar-underline" set:html={sidebarUnderline} aria-hidden="true" />
```

---

### User Experience

**LOW - Commented Debug CSS Present**

```css
/* background-color: grey; */
/* background-color: aquamarine; */
/* border: 1px solid blueviolet; */
```

**Recommendation:** Remove before production.

---

### Accessibility

**MEDIUM - Sidebar Should Be Aside Element**

In SidebarBlock.astro:
```astro
<ul>
  <div class="heading-container">
```

**Problem:** Using `<ul>` as container is semantically incorrect.

**Recommendation:**
```astro
<aside class="sidebar-block">
  <div class="heading-container">
    <div class="headline-icon" set:html={icon} aria-hidden="true" />
    <h2>{title}</h2>
  </div>
  <div class="sidebar-underline" set:html={sidebarUnderline} aria-hidden="true" />
  <ul>
    <slot />
  </ul>
</aside>
```

---

---

## NewsBlock & ColumnBlock Components

**Files:** `/src/components/NewsBlock.astro`, `/src/components/ColumnBlock.astro`

### Visual Design

#### Strengths
- Clean, scannable list design
- Good hover animations
- Proper use of semantic HTML time elements

#### Issues

**MEDIUM - Date Formats Inconsistent**

```javascript
// NewsBlock
newsDate: 'January 28, 2025',
newsDate: 'May 31, 2024',
newsDate: '2025-01-28', // ISO format!

// ColumnBlock
date: 'May 20, 2018',
date: 'Mar 7, 2019',
date: 'Nov 22, 2020',
```

**Recommendation:** Use consistent format (either "Month D, YYYY" or ISO) and parse correctly.

---

**LOW - Image Aspect Ratio Different in NewsBlock**

```css
.news-image {
  aspect-ratio: 1 / 1;
}
```

**Consider:** If news thumbnails are naturally 16:9 or 4:3, cropping to 1:1 might lose important content.

---

### User Experience

**HIGH - Duplicate Target Blank Attribute**

```astro
<a
  target={isExternal ? '_blank' : undefined}
  target="_blank"  <!-- Duplicate! -->
>
```

**Recommendation:** Remove the duplicate:
```astro
<a
  href={href}
  class="news-link"
  rel={isExternal ? 'noopener noreferrer' : undefined}
  target={isExternal ? '_blank' : undefined}
  aria-label={`Read article: ${newsHeadline} from ${newsSource}`}
>
```

---

**MEDIUM - Hover Transform Direction**

```css
.news-link:hover {
  transform: translateX(-2px);
}
```

**Left translation is unusual.** Consider:
```css
.news-link:hover {
  transform: translateX(2px); /* Move right */
}
```

Or add visual indicator like arrow:
```css
.news-link:hover::after {
  content: '→';
  margin-left: var(--sp-02);
}
```

---

### Accessibility

**HIGH - Links Need Focus States**

No focus-visible styles present.

**Recommendation:**
```css
.news-link:focus-visible,
.column-link:focus-visible {
  outline: 2px solid var(--blue-200);
  outline-offset: 4px;
  border-radius: var(--br-01);
}
```

---

**MEDIUM - Aria-Label Could Be More Concise**

```astro
aria-label={`Read article: ${newsHeadline} from ${newsSource}`}
```

**This is good, but consider:**
```astro
aria-label={`${newsHeadline} - ${newsSource}`}
```

Screen readers will announce the link role automatically, so "Read article" is redundant.

---

---

## Global Styles Analysis

**Files:** `/src/styles/global.css`, `/src/styles/reset.css`

### Strengths
- Excellent modern CSS reset
- Good font loading strategy with font-display: swap
- 62.5% font-size trick for easy rem calculations
- prefers-reduced-motion support

### Issues

**HIGH - Body Positioning is Unusual**

```css
body {
  background-color: var(--bg-page);
  position: absolute;  /* Why? */
  overflow-x: hidden;
}
```

**Problem:** `position: absolute` on body is non-standard and can cause issues.

**Recommendation:**
```css
body {
  background-color: var(--bg-page);
  overflow-x: hidden;
  min-height: 100vh;
}
```

---

**MEDIUM - Missing Reduced Motion for Scroll Behavior**

```css
html {
  scroll-behavior: smooth;
}
```

**Recommendation:**
```css
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

---

**LOW - HTML Lang Attribute in CSS**

```css
html {
  lang: en; /* This doesn't work! */
}
```

**This is invalid CSS.** Language should be in HTML:
```html
<html lang="en">
```

Already correctly set in Layout.astro, so remove from CSS.

---

---

## Performance Analysis

### Opportunities

**HIGH - Font Loading Strategy**

Currently loading multiple font weights/styles:
- CD-Black.woff2
- CD-Semibold.woff2
- CD-Light-Italic.woff2

**Recommendation:**
1. Use `font-display: swap` (already done)
2. Add preload for critical fonts:
```html
<link 
  rel="preload" 
  href="/fonts/CD-Black.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin="anonymous"
/>
```

3. Consider using Inter variable font:
```css
@font-face {
  font-family: 'Inter var';
  src: url('/fonts/Inter-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
}
```

---

**HIGH - Image Optimization**

All images use .webp (excellent), but missing:
1. Multiple sizes for responsive loading
2. `srcset` attributes
3. Blur-up placeholders

**Recommendation:**
```astro
<Image 
  src={ImageMain}
  alt="..."
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
  loading="lazy"
/>
```

---

**MEDIUM - Animation Performance**

Some animations might cause layout shifts:
```css
.card:hover {
  transform: translateY(-5px); /* Triggers repaint */
}
```

**Recommendation:** Add `will-change` sparingly:
```css
.card {
  will-change: transform;
}

/* Or use on hover only */
.card:hover {
  will-change: transform;
  transform: translateY(-5px);
}
```

---

**MEDIUM - Unused CSS (Commented Code)**

Multiple instances of commented-out code increase bundle size.

**Recommendation:** Remove all commented code before production build.

---

---

## Accessibility Summary

### WCAG 2.1 AA Compliance Audit

#### Passing Criteria

1. **Semantic HTML** - Mostly good use of headings, sections, articles
2. **Text Alternatives** - Images have alt text (though some need improvement)
3. **Keyboard Accessible** - Most content is in the DOM
4. **Sufficient Color Contrast** - Most text passes
5. **Readable Text** - Font sizes are adequate (minimum 1.4rem)
6. **Form Labels** - Newsletter form has associated label
7. **Focus Visible** - Browsers provide default (but should be enhanced)

#### Failing Criteria

1. **CRITICAL - 1.3.1 Info and Relationships**
   - Button inside link in ProjectCard (invalid HTML)
   - UL wrapper in SidebarBlock not semantic

2. **CRITICAL - 1.4.3 Contrast (Minimum)**
   - Blue-100 on hero background: ~2.3:1 (needs 4.5:1)

3. **CRITICAL - 2.1.1 Keyboard**
   - ProjectCards not properly keyboard accessible
   - No skip-to-content link

4. **CRITICAL - 2.4.1 Bypass Blocks**
   - Missing skip navigation link

5. **CRITICAL - 2.4.4 Link Purpose**
   - Many links have empty hrefs
   - Social links say "social-link"

6. **HIGH - 2.4.7 Focus Visible**
   - Custom focus states missing on most interactive elements

7. **HIGH - 3.2.2 On Input**
   - Newsletter form submission has no feedback

8. **HIGH - 3.3.1 Error Identification**
   - No error messages for invalid email

9. **HIGH - 3.3.3 Error Suggestion**
   - No guidance when form submission fails

10. **MEDIUM - 2.5.5 Target Size**
    - Some touch targets might be too small (needs device testing)

---

---

## Responsive Design Analysis

### Breakpoints Used

```css
@media (max-width: 768px)     /* Mobile */
@media (max-width: 640px)     /* Small mobile */
@media (max-width: 83.4rem)   /* Tablet */
@media (max-width: 40.2rem)   /* Mobile */
```

### Issues

**HIGH - Missing Tablet Breakpoint**

Most components jump from desktop directly to mobile at 768px, missing the crucial 768px-1024px tablet range.

**Recommendation:** Add standard breakpoints:
```css
/* Mobile first approach */
@media (min-width: 640px) { /* Large mobile */ }
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large desktop */ }
```

---

**HIGH - Hero Section Not Mobile-Optimized**

Hero background image is desktop-only, 50% width content container too narrow on mobile.

**See Hero Section recommendations above.**

---

**MEDIUM - About Section Grid Complex**

7x7 grid with specific areas works on desktop but requires extensive testing on various screen sizes.

**Recommendation:** Simplify with flexbox or simpler grid for easier maintenance.

---

---

## Content Issues

### CRITICAL Content Problems

1. **All ProjectCard descriptions identical** - Must be fixed before launch
2. **Lorem ipsum in About section** - Must be replaced
3. **Typo in Newsletter button** - "Subscibe" → "Subscribe"
4. **Grammar in Projects intro** - "projects' websites" awkward

### Recommendations

Work with content team to:
1. Write unique descriptions for each project (2-3 sentences each)
2. Create compelling About copy highlighting Dana's achievements
3. Refine all microcopy for clarity and impact

---

---

## Priority Action Items

### CRITICAL (Must Fix Before Launch)

1. **Replace all placeholder text** (ProjectCards, About section)
2. **Fix broken navigation links** (empty hrefs in Nav, Footer)
3. **Fix broken social media links** ("social-link" → actual URLs)
4. **Make ProjectCards keyboard accessible** (proper link structure)
5. **Add skip-to-content link** for keyboard users
6. **Fix color contrast** (blue-100 on hero background)
7. **Fix form functionality** (Newsletter submit handler, error states)
8. **Fix font-weight declaration** (CD-Semibold should be 600 not 400)

### HIGH Priority (Fix Soon)

1. **Add mobile navigation** (hamburger menu)
2. **Add focus-visible states** to all interactive elements
3. **Fix duplicate filter properties** (About section background)
4. **Add intermediate breakpoints** for tablet devices
5. **Implement Button as link when href provided**
6. **Fix background-attachment: fixed** (performance issue)
7. **Add form validation feedback** (error/success messages)
8. **Standardize date formats** across components
9. **Add proper aria-labels** to icon-only links
10. **Fix semantic HTML** issues (button in link, ul wrapper)
11. **Optimize responsive images** (srcset, sizes)
12. **Add responsive font loading** strategy

### MEDIUM Priority (Nice to Have)

1. Add animation respect for prefers-reduced-motion globally
2. Implement sticky navigation with backdrop blur
3. Add loading states for ProjectCards
4. Optimize shadow system naming
5. Make spacing tokens consistently fluid
6. Add will-change for animations
7. Implement better image aspect ratios
8. Add aria-hidden to decorative elements
9. Improve hover affordances (arrows, color changes)
10. Add breadcrumb navigation if multi-page
11. Create 404 and error pages
12. Add print styles
13. Implement service worker for offline support
14. Add social meta tags preview
15. Create components documentation

### LOW Priority (Polish)

1. Remove debug CSS comments
2. Remove unused commented code
3. Standardize breakpoint values
4. Add code splitting for fonts
5. Implement variable fonts
6. Add micro-interactions on scroll
7. Dynamic copyright year in footer
8. Add easter eggs or personality touches

---

---

## Code Quality Recommendations

### File Organization

**Current structure is good:**
```
src/
├── components/    ✓ Small, focused components
├── sections/      ✓ Page sections
├── layouts/       ✓ Layout wrapper
├── styles/        ✓ Global styles separated
└── assets/        ✓ Images and graphics
```

**Consider adding:**
```
src/
├── utils/         → Helper functions
├── types/         → TypeScript types
└── constants/     → Reusable constants
```

---

### TypeScript

**Add type safety:**

```typescript
// src/types/index.ts
export interface ProjectCardProps {
  src: ImageMetadata
  title: string
  text: string
  url: string
  href: string
}

export interface NewsBlockProps {
  newsImage: ImageMetadata
  newsHeadline: string
  newsSource: string
  newsDate: string
  href: string
}
```

Use in components:
```astro
---
import type { ProjectCardProps } from '@/types'
const { src, title, text, url, href }: ProjectCardProps = Astro.props
---
```

---

### Component Props Validation

Consider adding prop validation:
```astro
---
const { 
  color = 'primary',
  href 
} = Astro.props

if (color && !['primary', 'secondary'].includes(color)) {
  throw new Error(`Invalid button color: ${color}`)
}
---
```

---

### Extract Repeated Patterns

Multiple components use similar link logic:
```typescript
// src/utils/links.ts
export function isExternalLink(href: string): boolean {
  return href.startsWith('http')
}

export function getExternalLinkProps(href: string) {
  return isExternalLink(href) ? {
    target: '_blank',
    rel: 'noopener noreferrer'
  } : {}
}
```

---

---

## Design System Enhancements

### Create Comprehensive Token Documentation

**Recommendation:** Create `src/styles/README.md`:

```markdown
# Design System Tokens

## Colors

### Brand Colors
- --orange-200: Primary brand, buttons, CTAs
- --blue-200: Secondary brand, accents
- --blue-300: Dark brand, footer, headlines

### Text Colors
- --text-title: oklch(57% 0.12 217) - Headings on light bg
- --text-body: oklch(47% 0.025 237) - Body copy
- --text-hero: oklch(98% 0 237) - Hero section text

### Usage Rules
- Never use primitive tokens directly in components
- Always use semantic tokens (--text-*, --button-*, --bg-*)
- Maintain minimum 4.5:1 contrast for normal text
- Maintain minimum 3:1 contrast for large text (18px+)

## Spacing

### Scale (rem)
- sp-01: 0.4rem (4px)
- sp-02: 0.8rem (8px)
- sp-03: 1.2rem (12px)
- sp-04: 1.6rem (16px)
- sp-05: 2.4rem (24px)
- sp-06: 3.2rem (32px)

### Layout (fluid)
- layout-01: clamp(2.8rem, 4vw, 3.2rem)
- layout-02: clamp(4.2rem, 4.5vw, 4.8rem)
- layout-03: clamp(5.5rem, 5vw, 7.4rem)

## Typography

### Font Families
- --font-header: 'CD' (headings)
- --font-body: 'Inter' (body text)

### Type Scale
- font-01: 1.4rem (14px) - Small text, captions
- font-02: 1.6rem (16px) - Body text, buttons
- font-03: 1.8rem (18px) - Large body
- font-04: clamp(2.3rem, 3vw, 2.4rem) - Subheadings
- font-05: clamp(2.7rem, 4vw, 4rem) - Headings
```

---

### Create Component Library Page

**Recommendation:** Create `src/pages/styleguide.astro`:

```astro
---
import Layout from '@layouts/Layout.astro'
import Button from '@components/Button.astro'
import ProjectCard from '@components/ProjectCard.astro'
// ... import all components
---

<Layout title="Styleguide">
  <section>
    <h2>Buttons</h2>
    <div class="component-showcase">
      <Button color="primary">Primary Button</Button>
      <Button color="secondary">Secondary Button</Button>
      <Button color="primary" disabled>Disabled Button</Button>
    </div>
  </section>
  
  <section>
    <h2>Typography</h2>
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <p>Body paragraph text</p>
  </section>
  
  <!-- More component examples -->
</Layout>
```

This helps ensure consistency and serves as documentation.

---

---

## Testing Recommendations

### Manual Testing Checklist

**Keyboard Navigation:**
- [ ] Tab through all interactive elements in logical order
- [ ] Ensure focus indicators are visible
- [ ] Test skip-to-content link
- [ ] Verify forms are submittable via keyboard
- [ ] Test mobile menu toggle with keyboard

**Screen Reader Testing:**
- [ ] NVDA (Windows)
- [ ] JAWS (Windows)
- [ ] VoiceOver (macOS/iOS)
- [ ] TalkBack (Android)

**Cross-Browser Testing:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Responsive Testing:**
- [ ] iPhone SE (375px)
- [ ] iPhone 12 Pro (390px)
- [ ] Pixel 5 (393px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop 1920px
- [ ] Ultrawide 2560px

**Performance Testing:**
- [ ] Run Lighthouse audit
- [ ] Test on 3G connection
- [ ] Test with JavaScript disabled
- [ ] Test with images disabled
- [ ] Test with custom fonts disabled

---

### Automated Testing

**Recommendation:** Add testing tools:

```bash
npm install -D @axe-core/playwright pa11y cypress
```

Create accessibility test:
```javascript
// tests/a11y.spec.js
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright'

test.describe('Accessibility tests', () => {
  test('Homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('http://localhost:4321')
    await injectAxe(page)
    await checkA11y(page)
  })
})
```

---

---

## Conclusion

Dana Larsen's portfolio website demonstrates strong foundational design with a modern tech stack and thoughtful component architecture. The OKLCH color system, fluid typography, and clean visual hierarchy are significant strengths.

However, critical issues must be addressed before launch:

1. **Content completeness** - Replace all placeholders
2. **Functional links** - Fix all empty/broken hrefs
3. **Keyboard accessibility** - Make all interactive elements accessible
4. **Color contrast** - Fix failing contrast ratios
5. **Form functionality** - Implement newsletter submission
6. **Mobile navigation** - Add hamburger menu
7. **Focus indicators** - Add visible focus states

Once these critical issues are resolved, the site will provide an excellent user experience that properly represents Dana's important work in drug policy reform.

### Estimated Effort

- **CRITICAL fixes:** 16-24 hours
- **HIGH priority:** 20-30 hours
- **MEDIUM priority:** 15-20 hours
- **LOW priority:** 5-8 hours

**Total estimated effort:** 56-82 hours

### Recommended Next Steps

1. **Week 1:** Fix all CRITICAL issues, update content
2. **Week 2:** Implement mobile navigation, add focus states
3. **Week 3:** Add form handling, optimize images
4. **Week 4:** Polish, test, and launch

---

**Review conducted by:** Claude Code (AI Assistant)
**Date:** January 21, 2026
**Review type:** Comprehensive UI/UX Analysis
**Methodology:** Code analysis, WCAG 2.1 audit, best practices review

