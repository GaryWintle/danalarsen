# The design token system — how it works and how to use it

This is the guide to `variables.css`. Read it once and you'll know how to
change any color on the site safely, add new UI without inventing new
colors, and keep the accessibility guarantees we measured into the system.

## The big idea: paint cans vs. job titles

Every color on this site exists at two levels:

**Primitives** are paint cans. `--blue-300` is just "this exact teal" — it
says nothing about where it's used. The name is a *ramp position* (100 =
lightest, 400 = darkest), never a purpose.

**Semantic tokens** are job titles. `--text-link`, `--surface-dark`,
`--button-primary` — each one names a *role* in the interface, and points
at whichever paint can currently does that job:

```css
--text-link: var(--blue-300);   /* the job → the paint can */
```

**The one rule: components only ever use job titles.**

```css
/* ✅ right — says what it IS */
.view-all-link { color: var(--text-link); }

/* ❌ wrong — says what it looks like today */
.view-all-link { color: var(--blue-300); }
```

Why this matters: when we needed links darker for contrast, we changed
*one line* in variables.css and every link on the site followed. If
components referenced `--blue-300` directly, we'd have hunted through
fifteen files — and anything we missed would drift off-brand forever.

## How to do the common things

**Change a color everywhere it appears** → edit the semantic token in
`variables.css`. Example: to make links darker, repoint `--text-link` at a
darker primitive. Don't touch components.

**Adjust the brand itself** (the teal is too green, say) → edit the
primitive. Everything referencing it through semantic tokens shifts
together. After changing a primitive, re-check contrast (below).

**Style a new component** → shop the existing job titles first:
is this text a title, body, muted, a link? Is the surface light or dark?
Nine times out of ten, the token already exists. That's the point — new UI
automatically matches the old.

**Need a role that genuinely doesn't exist?** → add ONE semantic token to
variables.css, point it at a primitive, comment which surface it's safe
on. Resist adding a token for one-off decoration (see exceptions).

**Hover states** → derive them, don't hand-pick them:

```css
--button-primary-hover: oklch(from var(--button-primary) calc(l - 0.05) c h);
```

This "relative color" syntax means: take the button color, drop its
lightness 5 points. Change the base and the hover recalculates itself.
Naming convention: `-hover` suffix, same base name.

## The contrast contract

This is the part that makes the system more than tidy naming. WCAG AA
requires text to contrast with its background at **4.5:1** (normal text)
or **3:1** (large text and graphics). We *measured* every pairing and
encoded the results in the tokens:

- Every `--text-*` token passes 4.5:1 on the surfaces named in its comment.
- `--surface-dark` is dark enough that white text on it passes 4.5:1.
- Graphics tokens (rail dots, borders) target 3:1.
- Two primitives are labeled **decorative only** (`--orange-200`,
  `--neutral-400`) because they *fail* under text. They exist for
  moments where vividness matters and no one has to read anything —
  the timeline's progress line, dashed placeholder borders.

The practical rule this buys you: **if you stick to semantic tokens used
as their names suggest, you cannot ship a contrast failure.** The site
scores 100 on Lighthouse accessibility on every page because of this.

If you change a primitive's lightness, re-verify. Quick way: DevTools →
inspect the text → the color swatch in the Styles panel shows a contrast
ratio. Or paste both colors into webaim.org/resources/contrastchecker.

### Why some colors got darker in the migration

The original palette used `--blue-300` at 57% lightness and buttons at
67%. Measured: white-on-orange buttons hit 2.99:1, links 3.1:1, news
headlines 3.7:1 — all failures. The fix wasn't a redesign; it was
nudging lightness until the math passed while keeping the hues:
`--blue-300` 57%→52%, new `--blue-400` (47%) for dark surfaces, new
`--orange-400` (55%) for buttons. Same brand, now provable.

## The sanctioned exceptions

Components may use a primitive directly **only** when the exact hue is
the design decision and no reading is involved. Current list:

- `ProjectCard` photo-tint gradient (`--blue-200`) — a vivid overlay
- The about page's timeline rail graphics (`--orange-300` fill/dots,
  `--neutral-300` track) — state graphics, held at ≥3:1
- Ghost year watermarks and gray photo placeholders — decorative/temporary

When you do this, leave a comment saying it's deliberate. An uncommented
primitive in a component should be treated as a bug.

## Special tokens worth knowing

- `--focus-ring: 2px solid currentColor` — focus outlines inherit the
  color of the element they're on, so they're automatically visible on
  light *and* dark surfaces. Don't replace with a fixed color.
- `--border-default` holds a full border shorthand (`1px solid …`), so
  it's used as `border: var(--border-default);` — no extra values needed.
- `--input-error` / `--input-focus` — pair them with `:user-invalid` and
  `:focus-visible` as the forms do; both are contrast-safe on input
  backgrounds.
- Shadows are tinted with brand blue at very low alpha rather than black —
  that's why they feel soft. They reference primitives inside
  variables.css, which is fine (that's the token layer's own business).

## Naming conventions

- Primitives: `--{hue}-{step}` — steps go light→dark, 100→400 (neutrals
  to 600). `--neutral-450` exists because we needed "quietest gray that
  still passes as text" between 400 and 500.
- Semantics: `--{category}-{role}[-state]` — `text`, `bg`/`surface`,
  `button`, `input`, `border`, `accent`. States: `-hover`. Context:
  `-ondark` for tokens that live on dark surfaces.
- If you can't tell what a token is for without opening variables.css,
  the name is wrong.

## What NOT to do

- Don't put raw colors in components (`color: #0087a5` or
  `oklch(52% …)`). If it's worth styling, it's worth a token.
- Don't create a semantic token per component (`--newsletter-title-color`).
  Tokens name *roles shared across the site*, not places.
- Don't "fix" contrast by nudging a color inside one component — fix the
  token, or you've forked the palette.
- Don't use `--accent` (bright cyan) on light backgrounds — it's a
  dark-surface highlight and fails as text on white.
- Don't reach for `--orange-200`/`--neutral-400` for anything readable.
  They're marked decorative for a reason.
