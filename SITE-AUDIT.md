# danalarsen.com — Site Audit & Launch Checklist

**Date:** July 19, 2026
**Scope:** Full code read-through + rendered verification (desktop 1440px & mobile 390px, dev server + production build)
**Supersedes:** `UI-UX-REVIEW.md` (Jan 2026 — most of its findings are now fixed or stale; safe to delete)

---

## 1. Executive Summary

The site is in **good shape visually and architecturally**. The design system (oklch tokens, fluid type, scoped styles), the component structure, the mobile drawer, focus states, and the Decap CMS pipeline for news/columns are all solid. The production build is lean (~2.6 MB total, largest image 200 KB).

What stands between "portfolio in progress" and "credible public-figure site" falls into four buckets:

1. **Broken things that ship today** — mangled CSS token file, structured data with literal `{placeholder}` text, a 404ing OG image, a newsletter form that posts into the void, a visibly broken `/contact` layout on desktop.
2. **Structural debt you already named** — the `62.5%` rem crutch, incomplete semantic-token adoption, the fragile `body { position: absolute }` layout.
3. **Missing content/pages** — About page, real project blurbs, real About copy, 404 page.
4. **Public-figure table stakes** — working contact + newsletter (owned audience!), per-page SEO, security headers, privacy posture.

Everything below is verified against the actual code/build — file references included.

---

## 2. Verified Findings

### 🔴 Critical — broken in production right now

| # | Finding | Where |
| --- | ------- | ----- |
| C1 | `--button-secondary-shadow` declaration is mangled and **swallows `--image-border`**, so `--image-border` resolves to nothing. Card borders, news-thumbnail borders, and the newsletter input border silently vanish. (This is the uncommitted change in your working tree.) | `src/styles/variables.css:72-77` |
| C2 | ~~JSON-LD shipped literal `{placeholder}` text~~ **Fixed 2026-07-20:** schema built as a frontmatter object, injected via `set:html={JSON.stringify(schema)}`. Real `sameAs` (Wikipedia/X/Facebook/Instagram), per-page types via `schemaType` prop (ProfilePage/AboutPage/ContactPage/CollectionPage), fake SearchAction removed, Person image URL fixed, publisher now references the Person node. Verified parseable on all 5 pages. | `src/layouts/Layout.astro` |
| C3 | `og:image` points to `/images/og-default-1200x630.jpg`, which **does not exist** (marked `// replace`). Every social share of the site renders without an image. | `src/layouts/Layout.astro:14` |
| C4 | ~~Newsletter form posted to nonexistent `/api/subscribe`~~ **Fixed 2026-07-20 (interim):** now a Netlify form (`newsletter`) with honeypot, AJAX inline success/error states, and a no-JS fallback to `/newsletter/thanks` (noindex). Signups collect in the Netlify dashboard for export. *Upgrade path: swap to an ESP with double opt-in when Gary picks one.* | `src/sections/Newsletter.astro` |
| C5 | `/contact` desktop layout is broken: the card **and the footer are squeezed into the left ~60% of the viewport**. Root cause is `body { position: absolute }` shrink-wrapping to content width. | `src/styles/global.css:35-42`, verified via screenshot |
| C6 | `/news` canonical URL points to the **homepage** (`url` prop never passed), telling Google not to index the news page. | `src/pages/news.astro:41-44` |
| C7 | About section is **lorem ipsum**, and its button links to `/about`, which doesn't exist (404). Hero's "About Dana" scrolls to this placeholder. | `src/sections/About.astro:27-34` |
| C8 | All six project cards share the same placeholder blurb ("A smooth, low-dose mushroom shot…"). Coca Leaf Cafe's label says `cocaleafcafe.com` but links to `cocaleafcafe.ca`. | `src/sections/Projects.astro:17-60` |
| C9 | Nav & footer links `#projects` / `#about` are **dead on `/contact` and `/news`** (they resolve to `/contact#projects` etc.). Must be `/#projects`, `/#about`. | `src/components/Nav.astro:15-16,76-79`, `src/components/Footer.astro:13-14` |
| C10 | Nav is white-on-transparent, positioned for the dark hero — on `/contact` and `/news` the links and the script part of the logo are **near-invisible on the light background**. | `src/components/Nav.astro:147-157`, verified via screenshot |

### 🟠 High — wrong, but not visibly on fire

| # | Finding | Where |
| --- | ------- | ----- |
| H1 | ~~`--font-body: 'Inter'` but **Inter is never loaded**~~ **Fixed 2026-07-19:** self-hosted via `@fontsource-variable/inter` (variable wght 100–900, latin subset 48 KB), token updated to `'Inter Variable'`. | `src/styles/variables.css:98`, `src/layouts/Layout.astro:2` |
| H2 | ~~Homepage `<title>` missing the space in "DanaLarsen"~~ **Fixed 2026-07-19** (by Gary, in-IDE). | `src/pages/index.astro:51` |
| H3 | On the homepage, `<main id="main-content">` (inside TwoColWrapper) only wraps Projects + sidebar. **Hero, About, and Newsletter live outside `<main>`** — wrong landmark structure, and the skip link skips past nothing useful. | `src/components/TwoColWrapper.astro:5`, `src/pages/index.astro:52-77` |
| H4 | `/news` renders `<Footer />` **after `</Layout>`**, i.e. outside `<html>`. Browsers re-parent it, but it's invalid HTML. | `src/pages/news.astro:67` |
| H5 | About image is a raw `<img>` with no width/height: it collapses to ~2px then expands to ~600px on load — a **massive CLS**. (Verified live: rect height 2 → 609.) Same pattern in NewsBlock thumbnails. | `src/sections/About.astro:38-43`, `src/components/NewsBlock.astro:28` |
| H6 | Newsletter `aria-labelledby="newsletter-title"` points at a **class, not an id** — broken reference. Also: "**Subscibe** Today!" typo. | `src/sections/Newsletter.astro:23,45` |
| H7 | ProjectCard `aria-labelledby="project-title-{title}"` is a literal string (not interpolated) with no matching id; `role="article"` on a div; button's aria-label says "opens in new tab" but there's **no `target="_blank"`**. | `src/components/ProjectCard.astro:7,15-24` |
| H8 | Hero buttons' aria-labels ("Learn more about Dana Larsen's advocacy work") don't contain their visible text ("About Dana") — WCAG 2.5.3 *Label in Name* failure for voice-control users. Just drop the aria-labels; visible text is fine. | `src/sections/Hero.astro:48-59` |
| H9 | ~~Hand-written single-page sitemap; robots/canonical host mismatch~~ **Fixed 2026-07-20:** `@astrojs/sitemap` + `site` in config, hand-written file deleted, robots.txt → www sitemap-index, apex→www 301s in netlify.toml, `<link rel="sitemap">` in head. | `astro.config.mjs`, `public/robots.txt`, `netlify.toml` |
| H10 | Tailwind 4 is a **dead dependency**: `@tailwindcss/vite` is installed but never added to `astro.config.mjs`, no `@import 'tailwindcss'` anywhere, and `tailwind.config.mjs` is stale v3-format. Remove it (you're not using utilities) or wire it up for real. CLAUDE.md's "Tailwind CSS 4" claim is currently false. | `package.json`, `astro.config.mjs`, `tailwind.config.mjs` |
| H11 | No 404 page (`src/pages/404.astro`). | — |
| H12 | `background-attachment: fixed` on the About backdrop — ignored/janky on iOS Safari and a scroll-performance cost. | `src/sections/About.astro:69` |
| H13 | `@font-face` weight mapping is tangled: CD-Semibold registered as weight **400** (comment says "Black"), CD-Roman.woff2 shipped but never registered, CD-Light-Italic preloaded for a single italic word. Worth one deliberate pass. | `src/styles/global.css:1-27`, `src/layouts/Layout.astro:61-81` |
| H14 | ~~Contact page has no `<h1>`~~ **Fixed 2026-07-20:** card heading is the page h1 (scoped styles keep the previous look). | `src/components/ContactForm.astro` |
| H15 | ~~No honeypot, no success state, chevron-less select~~ **Fixed 2026-07-20:** honeypot + hidden `form-name`, `action="/contact/thanks"` success page (noindex), SVG chevron on the select, `:user-invalid` error styling, autocomplete attrs, maxlengths, optional Organization/Outlet field, response-time + privacy microcopy. Needs one live test after deploy. | `src/components/ContactForm.astro`, `src/pages/contact/thanks.astro` |

### 🟡 Medium — hygiene & polish

- **M1** — `dns-prefetch` to googletagmanager.com but no analytics installed. Either remove, or (better for this audience — see §4) add a cookieless, privacy-first analytics tool. `src/layouts/Layout.astro:82`
- **M2** — Viewport meta lacks `initial-scale=1`. `src/layouts/Layout.astro:20`
- **M3** — Favicon is SVG-only: no `favicon.ico` fallback, no `apple-touch-icon`, no web manifest / `theme-color` pair for light+dark.
- **M4** — Dead code: `.newsletter-container::after` favicon leftover (`Newsletter.astro:99-103`), commented-out swiper block + unused `Image`/`ImageMain` imports (`Projects.astro`), unused `Nav` import (`Hero.astro:3`), `--text-hero` token defined but unused.
- **M5** — Junk files shipped or committed: `public/images/image 6.png` (772 KB, ships to prod), `src/assets/images/dl-hero-mobile.png` (2.7 MB, unused — the .webp is used), `dana-about-old.webp`, `project-photos/Unconfirmed 984100.crdownload:com.dropbox.attrs`, `projects-main.jpg:Zone.Identifier`, duplicate `projects-potheadbooks.{jpg,png}`, root-level `verify-*.png` + audit screenshots, stale `UI-UX-REVIEW.md`.
- **M6** — `reset.css` sets `outline: none` on all form controls globally, then components re-add `:focus-visible` one by one. It works today but is a booby trap; prefer removing the global `outline: none` and styling `:focus-visible` at the reset level.
- **M7** — TwoColWrapper: `<style>` tag sits *inside* `<main>` markup; `section > section` nesting with unlabeled outer section. Harmless but messy.
- **M8** — Breakpoint zoo: `402px, 640px, 738px, 768px, 834px, 950px, 1024px, 1170px, 60rem` across files. Standardize on 3–4 named breakpoints during the token pass.
- **M9** — `scroll-behavior: smooth` and BackToTop's smooth `scrollTo` don't check `prefers-reduced-motion` (hero underline animation doesn't either).
- **M10** — Contrast spot-checks worth running once tokens settle: `--neutral-400` fine print/placeholder on white (likely ~2.4:1, fails), `blue-100` hero highlight over photo. Run axe/Lighthouse after the token migration rather than hand-fixing now.
- **M11** — `mobile` npm script points to `~/bin/ngrok` (machine-specific); fine, just noting it won't work elsewhere.
- **M12** — Footer copyright is hardcoded "2025" → use `new Date().getFullYear()`.

### ✅ Verified non-issues (don't chase these)

- The "blank" project card images and "missing" About photo in my first screenshots were **dev-server lazy-load races** — all images load fine (and in the prod build they're static). The dark "pill" mid-page was the Astro dev toolbar.
- Skip link, mobile drawer (focus management, Escape, backdrop), focus-visible states, Button-as-link polymorphism, `fetchOgImage` fallback logic, news/columns CMS pipeline — all in good working order.
- Old review's "62.5% trick is a strength" — you've outgrown it; ignore that doc.

---

## 3. The Two Refactors You Named

### 3a. Killing `font-size: 62.5%`

Right now `1rem = 10px`. Removing the hack means **every rem value in the repo shrinks by ÷1.6** (e.g. `1.6rem → 1rem`, `--sp-06: 3.2rem → 2rem`, `--max-width: 151.3rem → 94.5rem`).

Gotchas to respect during conversion:

- **Media queries in rem never used the 62.5% base** (they resolve against the initial 16px). `@media (max-width: 60rem)` already means 960px — *don't* convert those. Px media queries are unaffected.
- `clamp()` middle terms in `vw` are unaffected; only the rem bounds convert.
- Values that *look* like px-derived magic (`151.3rem`, `-25px`, `7rem` offsets) are the moment to round to sane numbers, not preserve them.
- Do it as **one atomic commit** with a full visual before/after sweep (both viewports, all three pages) — a missed value shows up as a 1.6× size error, which is easy to spot if you look.

### 3b. Semantic tokens everywhere

`variables.css` already has the right two-layer shape (primitives → semantic). The gaps:

- Components still reach into primitives directly: `--blue-100/200/300`, `--neutral-…` appear all over `Hero`, `Nav`, `BackToTop`, `Newsletter`, `Footer`, card hover gradients, etc.
- Missing semantic slots you'll want: `--surface-dark` (footer/drawer/contact-header blue-300), `--text-link` / `--text-link-hover`, `--accent` (blue-100 highlights), `--border-default` (rename of `--image-border`), `--input-bg/border/placeholder`, `--overlay-*` for the photo gradients.
- Consolidate `--news-sidebar-divider` / `--news-divider` (duplicates) into `--border-default`.
- Naming nit: `--button-primary__hover` (BEM-ish `__`) vs everything else — pick one convention (`--button-primary-hover`).
- Fluid-vs-static split (`--sp-*` static, `--layout-*` fluid) is good — keep it, document it in a short comment header.

Do **3a before 3b** (converting values once is enough), then migrate components to semantic tokens file-by-file.

---

## 4. Best Practices: Sites for Public / Political Figures

What separates a good portfolio from an effective platform for an activist:

**Own your audience.** Social accounts get suspended — drug-policy content especially. The newsletter is the single most valuable feature on this site, and it currently 404s. Wire it to an ESP with **double opt-in** (Buttondown and EmailOctopus are cheap and neutral; Mailchimp works), keep the "no spam, unsub anytime" promise visible, and never gate it behind analytics scripts.

**Be findable as an entity, not just a site.** Dana has a Wikipedia page — the `sameAs` array in Person JSON-LD linking Wikipedia + real social profiles is exactly how Google builds the knowledge panel. That's why C2 matters more here than on a normal portfolio. Add per-page JSON-LD (`ContactPage`, `CollectionPage` for news) and a real 1200×630 OG image with his face and name — shares on X/Facebook are how this audience travels.

**Make press contact frictionless.** Journalists on deadline decide in seconds. The contact form's "Media Inquiry" subject is good; go further with a small **Press/Media section** on the About page (or `/press`): downloadable headshots, a 50-word and 200-word boilerplate bio, and the booking route. The news/columns archive you already built is genuinely great for this — it's proof of media relevance.

**Protect visitors.** Some of this site's visitors are vulnerable people looking up drug testing services. That means: no invasive tracking (prefer cookieless analytics — Plausible/Fathom/Netlify — over GA4; then the GTM dns-prefetch goes away), a short plain-language **privacy page**, and HTTPS with real **security headers** in `netlify.toml` (`Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`). A defaced or spoofed activist site is a real attack vector; headers are cheap insurance. Also confirm the Decap `/admin` auth (DecapBridge) has 2FA on the underlying accounts.

**Credibility details.** Accurate, active canonical host (pick www or apex, 301 the other), no lorem ipsum anywhere, a 404 page that routes people home, dates on everything, and an accessibility bar of WCAG 2.2 AA — inclusive access is on-message for a harm-reduction advocate.

**Performance is mostly done.** 2.6 MB total, AVIF/WebP hero, font preloads — this is already better than most political sites. Just fix the CLS (H5), drop the junk PNG (M5), and keep the budget: hero image ≤ 200 KB, everything else lazy.

---

## 5. Working Checklist

Ordered so we can move through it together. Each phase is a coherent chunk with a visual verify at the end.

### Phase 0 — Stop the bleeding (quick, high-value fixes)

- [x] **0.1** Repair `variables.css` C1 mangle: restore `--button-secondary-shadow`'s second shadow line, resurrect `--image-border` *(done 2026-07-19 — restored from git; the whole working-tree diff was the accident. Rename to `--border-default` deferred to 3b)*
- [x] **0.2** Fix homepage title *(fixed by Gary in-IDE, 2026-07-19)*
- [x] **0.3** "Subscribe" typo fixed; h2 given `id="newsletter-title"` so the form's `aria-labelledby` resolves; dropped the redundant submit-button aria-label
- [x] **0.4** `/news` canonical now `https://www.danalarsen.com/news`; `<Footer />` moved inside `<Layout>`
- [x] **0.5** Nav (desktop + drawer) and footer links → `/#projects`, `/#about`, `/#newsletter`; added missing `id="newsletter"` anchor to the Newsletter section (the drawer link was dead on every page). Verified cross-page: About link from `/news` lands on `/#about`
- [x] **0.6** Verified live: `.ca` 301s to `.com` — href aligned to `https://cocaleafcafe.com/`. All six project URLs checked, all resolve
- [x] **0.7** Hero button aria-labels removed (visible text is the accessible name); ProjectCard: dropped `role="article"` + broken `aria-labelledby`, added `target="_blank"` to match the "(opens in new tab)" label, label now contains the visible text
- [x] **0.8** Footer year → `{new Date().getFullYear()}` *(freezes at build time — fine, since CMS commits trigger Netlify rebuilds regularly)*

*Phase 0 complete 2026-07-19. Findings C1, C6, C8-partial (TLD only — blurbs still placeholder, see 4.3), C9, H2, H4, H6, H7, H8 resolved.*

### Phase 1 — The rem refactor (§3a) ✅ *(done 2026-07-19)*

- [x] **1.1** Delete `font-size: 62.5%`; convert all rem values in `variables.css` (÷1.6, round to sane numbers)
- [x] **1.2** Convert component styles file-by-file (Hero, Nav, Footer, Button, cards, sections, pages) — *skip rem media queries*
- [x] **1.3** Full visual sweep at 390px and 1440px, all three pages, against before-screenshots — page heights within 2–4px of before; computed sizes identical (h1 80px, body 16px, logo 120px)
- [x] **1.4** Commit as one atomic change

*Conversion notes: exact ÷1.6 preserved everywhere except deliberate micro-rounding: `--max-width` 151.3rem→94.5rem (1513→1512px), nav-link padding 7.5px→8px + underline offset 2.5px→2px, skip-link padding 7.5/15px→8/16px, sub-pixel letter-spacings rewritten in px (0.02rem→0.2px etc.). Rem media queries (`60rem` in news.astro) intentionally untouched — they always resolved against 16px.*

### Phase 2 — Semantic token migration (§3b) ✅ *(done 2026-07-20)*

- [x] **2.1** Semantic layer rebuilt: added `--surface-dark`, `--text-link(-hover)`, `--text-strong`, `--text-muted`, `--accent`, `--accent-warm`, `--input-bg/-focus`, `--border-default` (replaces 3 duplicate border tokens); `__hover` → `-hover`; hovers now derived via relative color syntax; `--focus-ring` is `currentColor` (self-adapting on any surface). New primitives: `--orange-300/400`, `--blue-400`, `--neutral-450`
- [x] **2.2** Every component migrated to semantic tokens; remaining primitives are commented, sanctioned decorative uses only (ProjectCard photo tint, rail graphics, placeholders)
- [x] **2.3** All contrast failures fixed by measurement (canvas-computed WCAG ratios): `--blue-300` 57%→52% (titles/links/headlines pass 4.5), `--blue-400` dark surfaces (white text 5.96), `--orange-400` buttons (4.89), `--neutral-450` muted text (4.66+), rail graphics on `--orange-300` (3.22 ≥3). About CTA's secondary button became an on-dark text link (a blue button can't contrast against the blue band). Bonus fixes: mobile drawer now `inert` when closed (links were tab-reachable while invisible), placeholder labels darkened. **Lighthouse accessibility: 100 on all five pages.** System + practices documented in `src/styles/README.md`

### Phase 3 — Layout & landmark structure

- [x] **3.1** Remove `body { position: absolute }` *(done 2026-07-19 — body is now a normal full-width flex column with `min-height: 100vh`; nav got `inset-inline: 0; margin-inline: auto` so it centers past 1512px. `/contact` desktop fixed (C5); homepage/news pixel-identical at 390/1440; at 1920px everything now centers properly where the old layout left-anchored. Removed the redundant mobile body re-declaration.)*
- [x] **3.2** *(done 2026-07-19)* `<main id="main-content">` now lives in `index.astro` wrapping Hero→Newsletter (fixes H3); global `main` is `width: 100%` with width constraints local to each page (TwoColWrapper carries `var(--max-width)` itself) so hero/About stay full-bleed at ultrawide. TwoColWrapper tidied (M7): no more main-in-component, style-in-markup, or section-in-section; dead no-op rules removed
- [ ] **3.3** Nav visibility on light pages (C10): give Nav a variant (dark text / solid background) for non-hero pages, or a scroll-aware background
- [x] **3.4** *(done 2026-07-19)* Standardized on four rem media queries — 40rem/640, 48rem/768, 60rem/960, 75rem/1200 — documented at the top of `variables.css`. Mappings: 402→40rem (no-op), 640→40rem, 738→48rem, 768→48rem, 834→60rem (sidebar now stacks ≤960 — coherent with hero's tablet flip), 950→60rem, 1170→75rem; deleted Hero's redundant 1024px block and NewsBlock's empty media query. Hero's `<source media="1024px">` image-switch attributes left as-is (content decision, not a CSS breakpoint)
- [ ] **3.5** Re-screenshot everything

### Phase 4 — Pages & content

- [ ] **4.1** Build `/about` page — *structure shipped 2026-07-20 from Gary's Figma concept:* scrollytelling career timeline with a sticky rail (desktop: vertical spine with orange progress fill + passed/active node states; mobile: sticky horizontal year bar with progress underline), 8 era blocks with ghost-year watermarks and rise-in reveals (reduced-motion safe, content never JS-gated), photo band + pull-quote, closing CTA to /contact and /news. Vanilla IntersectionObserver — no GSAP, no scroll-jacking (deliberate). **Remaining: verify all era dates/titles with Dana, replace lorem copy + gray placeholders with real photos, consider a press-kit block.** Also fixed site-wide: `body` overflow-x `hidden`→`clip` (hidden silently broke `position: sticky` everywhere)
- [ ] **4.2** Replace About-section lorem ipsum with a 2–3 sentence hook that leads to `/about`
- [ ] **4.3** Write six real project card blurbs
- [x] **4.4** *(done 2026-07-20)* `404.astro` — ghost-number motif from the timeline, on-brand copy ("This page went up in smoke."), routes to home + media page. noindex, excluded from sitemap, serves with a real HTTP 404 status (verified on preview; Netlify uses `dist/404.html` the same way)
- [ ] **4.5** Contact page h1 (H14)

### Phase 5 — Forms that actually work

- [x] **5.1** *(code done 2026-07-20; deploy verification pending)* Honeypot (`bot-field`, offscreen), hidden `form-name` (enables future AJAX), `action="/contact/thanks"` → dedicated success page (noindex, trackable conversion URL, sets reply expectations, links home + /news), optional Organization/Outlet field for media/booking triage, `autocomplete` on all identity fields, select chevron + placeholder color, `:user-invalid` styling via new `--input-error` token, maxlengths, marketer copy (response-time promise in header; "never shared, no mailing list" note at submit). Footer now pins to viewport bottom on short pages. **After deploy: enable a Netlify form notification (dashboard → Forms → Notifications) and send one live test — forms don't run locally.**
- [x] **5.2** *(interim done 2026-07-20)* Newsletter wired as a second Netlify form: honeypot, hidden `form-name`, AJAX submit with inline "You're in!" / retryable error (role="status"), `input:user-invalid` styling, no-JS fallback POST → `/newsletter/thanks` (noindex, excluded from sitemap). **After deploy: add a Netlify notification for the `newsletter` form + one live test. When an ESP is chosen (double opt-in!), swap the form action/fetch target — two-line change — and export collected addresses.**
- [x] **5.3** *(done 2026-07-20)* `/privacy` page — short, honest, plain-language (no trackers/analytics/cookies on public pages; forms → Netlify storage + Dana's team; newsletter unsubscribe; /admin cookie note; external-links caveat). Linked from footer (all pages), contact form privacy note, and newsletter fine print. Indexed + in sitemap

### Phase 6 — SEO & meta

- [x] **6.1** *(done 2026-07-20)* JSON-LD rebuilt as frontmatter object + `set:html` (C2 fixed — see findings table). **Note: sameAs URLs mirror the site's own social links (x/facebook/instagram .com/danalarsen) — confirm those are Dana's real handles.**
- [ ] **6.2** Design & generate real OG image (1200×630), drop in `public/images/` (C3)
- [x] **6.3** *(done 2026-07-20)* `site: 'https://www.danalarsen.com'` + `@astrojs/sitemap` in astro.config (filter excludes `/contact/thanks`); hand-written `public/sitemap.xml` deleted; robots.txt → `https://www.danalarsen.com/sitemap-index.xml`; `<link rel="sitemap">` in Layout head; apex→www 301s in netlify.toml. Verified: generated sitemap lists exactly `/`, `/contact/`, `/news/`. **After deploy: set `www.danalarsen.com` as the primary domain in Netlify (Domain management), and submit the sitemap in Google Search Console.**
- [x] **6.4** *(done 2026-07-20)* `favicon.ico` (16/32/48 PNG-in-ICO), `apple-touch-icon.png` (180), manifest icons 192/512 (white leaf on brand `#0087a5`, maskable-safe), `site.webmanifest`, viewport `initial-scale=1`, theme-color `#000` → `#0087a5`. Icons generated from `favicon.svg` via sharp
- [x] **6.5** *(decided 2026-07-20)* **No analytics for launch** — Gary's call, fits the privacy posture. Dead GTM dns-prefetch removed (M1). If revisited post-launch, prefer a cookieless provider (Plausible/GoatCounter/Netlify Analytics) and remember to allow it in the CSP when 7.4 lands

### Phase 7 — Performance, fonts, hardening, cleanup ✅ *(done 2026-07-20, except contrast → 2.3)*

- [x] **7.1** About image now `<Image>` with width/height (CLS 0 measured, was ~600px shift); NewsBlock thumbnails were already reserved by their fixed-size container — their alt is now empty (decorative inside a link that carries the headline)
- [x] **7.2** CD weight mapping documented as deliberate (400 = Semibold "regular display", 700 = Black); unused CD-Roman + all legacy `.woff` deleted (woff2-only); all three preloads kept — 20 KB each and all render above-fold text
- [x] **7.3** `background-attachment: fixed` removed (backdrop now consistent incl. iOS); reduced-motion guards on smooth scroll (CSS + BackToTop JS), hero underline, newsletter broadcast rings
- [x] **7.4** CSP shipped as a **PROD-only meta tag in Layout** ('self' everything; style-src +unsafe-inline for Astro's scoped styles; img-src +data: for the select chevron) — meta, not header, so Decap `/admin` keeps its external scripts; `frame-ancestors` covered by the X-Frame-Options header. `assetsInlineLimit: 0` forces all scripts external (inlined ones were CSP-blocked — caught on the preview build). Verified zero violations + all scripts functional on the built site
- [x] **7.5** Tailwind uninstalled, stale `tailwind.config.mjs` deleted, CLAUDE.md tech-stack corrected
- [x] **7.6** ~4 MB of junk purged (image 6.png, unused hero PNG, old about photo, column-thumbnails dir, Dropbox/Zone.Identifier strays, duplicate potheadbooks.jpg, xmp sidecars, verify-*.png, UI-UX-REVIEW.md); dead code removed (unused imports, commented swiper + hover blocks, newsletter ::after — which was silently adding 48px of phantom flex spacing — unused `--text-hero`, debug comments)
- [x] **7.7** Lighthouse on the production build: **home 97 perf / 96 a11y / 100 best-practices / 100 SEO; about 99 / 92 / 100. CLS 0, TBT 0ms.** Removed news/column link aria-labels (label-in-name mismatches — natural link text is the correct name). Only remaining audit: color-contrast → documented in 2.3. **Gary: re-run Lighthouse on the live deploy + one real-device pass (`npm run mobile` ngrok script)**

---

*Generated by Claude Code after full code read-through, rendered inspection (Playwright), and production build verification.*
