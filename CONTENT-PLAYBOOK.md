# Content Playbook — finishing danalarsen.com at full strength

The engineering is done. What's left — the OG image, the copy, the photos —
is what visitors actually judge. This is the guide to doing that layer at
the level the codebase now deserves. It ends with how to make this project
work for *your* portfolio too.

**The one idea that rules everything below: evidence over claims.**
"Canada's most well-known advocate" is a claim — anyone can type it.
"Founded Canada's first public drug-checking service; 50,000+ samples
tested" is evidence. Dana's career is unusually rich in evidence: firsts,
dates, raids survived, institutions still standing. Every piece of content
you write or pick should put evidence on screen. Claims are what
mediocre sites do; receipts are what credible ones do.

---

## 1. The OG image (closes audit item 6.2)

This image IS the site for most people who ever see it — it renders in
group chats, timelines, and DMs far more often than the site gets visited.
Treat it as the site's business card, designed once, properly.

### The spec (2026 platform reality)

- **1200 × 630px** — the one size that works everywhere (Facebook, X
  large card, LinkedIn, Slack, Discord, WhatsApp, iMessage).
- **Safe zone: keep faces, name, and text inside the center ~1080 × 566**
  (about 60px margin all around). Platforms crop edges differently, and
  iMessage/Slack sometimes square-crop — so the *very* critical content
  (Dana's face + name) should also survive a center square crop. Design
  with a 630×630 center square overlay in Figma and check it.
- **JPG, under ~300 KB.** WhatsApp silently degrades images above ~300 KB;
  everything accepts under 1 MB. Export JPG quality ~80.
- No SVG, no transparency, no text smaller than ~40px — the card is
  usually seen at phone-thumbnail size. Squint-test it at 200px wide.

### What the best do for public figures — and your recipe

Look at cards for politicians, authors, and campaigners: they're all the
same three ingredients, because they work — **a face, a name, an
identity line.** Nothing else.

For Dana:

1. **Photo:** the mic shot (your hero image) or similar — mid-speech,
   eyes toward camera or crowd. Action beats posed for an activist.
   Place him on the right third, facing inward (toward the text).
2. **Background:** dark teal wash (`#123c4d`-ish — sample `--surface-dark`
   from the site) or the photo itself darkened, so it's recognizably the
   same brand as the page people land on. That continuity is a trust cue.
3. **Type:** "Dana Larsen" in the CD serif, white, big (120px+). One line
   under it in Inter: pick the strongest identity line — "Ending Canada's
   war on drugs" beats "Drug Policy Reform Advocate" (verb beats title).
4. Optional: the leaf mark, small, one corner. Nothing else. No URL (the
   platform shows it), no social handles, no second sentence.

### Mechanics

- Build it as a 1200×630 Figma frame; you already have the fonts/colors.
- Export to `public/images/og-default-1200x630.jpg` — the filename the
  Layout already points at. Drop it in, build, done; C3 closes itself.
- Later (optional, cheap wins): per-page variants via the existing
  `ogImage` prop — an /about card ("Three decades. One fight.") and a
  /contact card ("Put Dana on your stage"). Default first; variants only
  if you enjoy it.
- **Test before calling it done:** paste the deployed URL into a real
  Slack/Discord/LinkedIn composer, and run Meta's Sharing Debugger +
  LinkedIn Post Inspector (they also force a cache re-scrape after
  changes — you'll need this whenever you update the image).

---

## 2. Copy — the lesson, then the slots

### Voice: decide it once, write everything in it

Dana's voice on this site should be **plainspoken, confident,
evidence-first, lightly wry.** Think well-edited magazine profile, not
résumé, not manifesto. The site already speaks this way — "Join the
Revolution!", "This page went up in smoke" — so the bar is set: serious
about the mission, unafraid of personality.

Rules that keep you in that voice:

- **Short sentences win.** Journalists skim. Bookers skim harder.
- **Verbs over adjectives.** "Opened, sued, won, tested, ran" — Dana's
  career is verbs. Delete "innovative," "passionate," "renowned" on
  sight; they're what people write when they don't have receipts.
- **Numbers and proper nouns are the texture of credibility.** Dates,
  cities, org names, counts. One real number outweighs a paragraph of
  positioning.
- **Never invent facts or quotes.** Every date, count, and the pull-quote
  must come from Dana or a citable source. For a public figure who gets
  press scrutiny, one wrong number costs more than ten missing ones.
  (This is why the era dates are still marked TODO — verify with Dana.)

### Slot by slot

**Era blocks (the big job — 8 of them).** Formula per era, 40–80 words:
1. *What happened* — one plain sentence.
2. *Why it mattered / what changed* — one or two sentences. This is where
   evidence lives: "first in Canada," "still operating," "X people served."
3. *One memorable concrete detail* — the thing a journalist would quote.
   The police raid, the court win, the line out the door on opening day.

Tense: past for closed eras, present for ongoing ones. Don't restate the
year in the prose — the badge and rail already carry it. Don't write
"in this era" — just tell it.

**Project card blurbs (6).** Formula: *what it is + who it's for + the
remarkable fact*, roughly 12–18 words. "Canada's first storefront
drug-checking service — free, anonymous, no questions asked" is the
shape. The current placeholder ("a smooth, low-dose mushroom shot…") is
product copy; these should be *institution* copy.

**Homepage About blurb (replaces the lorem).** Two sentences max: the
hook, then the bridge. Its only job is earning the click to /about —
don't summarize the whole career, tease the arc: "Three decades of
opening the businesses, fighting the court cases, and running the
campaigns that ended cannabis prohibition in Canada — and he isn't done."

**The pull-quote (photo band).** Must be a real Dana quote — pull it from
a column or interview (the /news collection is full of sources). Pick one
with thesis energy, not a pleasantry. Attribute it if it's from a
publication.

**Microcopy discipline.** The site's conventions are set — sentence-case
labels, verbs on buttons, same term for the same thing everywhere
("the war on drugs," not rotating synonyms). New copy should join the
system, not add a second voice.

### The press-kit block (worth adding to /about when copy lands)

Speaker/media kits are what bookers and journalists actually search for.
The convention across professional speakers: a short section offering
**a 50-word and a 200-word boilerplate bio** (copy-paste ready — that's
the point, they'll use it verbatim), **2–3 downloadable headshots**
(on-stage, formal, candid), and the booking route (your contact form's
Subject dropdown already does triage). This single block converts the
About page from biography into *infrastructure for coverage* — the thing
that gets Dana quoted correctly instead of from a 2013 article.

---

## 3. Photos — direction, selection, mechanics

### Selection principles

- **Editorial beats posed.** For an activist: speaking, marching, at the
  counter of his own shop, mid-interview. Posed studio shots read as
  corporate — wrong brand. The current hero (mic, crowd) is exactly right;
  match its energy.
- **Archival is gold — use it.** For the timeline eras, period-authentic
  images (the actual Cannabis Culture cover, a 2001 campaign photo, the
  dispensary on opening day) beat any modern reshoot. Slight grain and
  dated color are *features* — they prove the timeline is real. This is
  what your Figma mockup already intuited with the magazine cover.
- **One idea per photo.** If you have to explain what to look at, cut it.
- **Consistency comes from grading, not sourcing.** Mixed decades of
  photos will feel cohesive if you apply one gentle treatment (slight
  desaturation, consistent warmth — a single Lightroom/Figma adjustment
  reused). The site's overlays and duotone-ish washes help unify too.

### Slot map

| Slot | Ratio (already built) | What to pick |
| ---- | --------------------- | ------------ |
| About hero | 21:9 | A wide environmental shot — venue, march, press scrum. Different image than the homepage hero |
| Era images ×8 | 4:3 | Period-authentic per era (see above) |
| Photo band ×2 | 3:4 portrait | One candid/human, one crowd/action — the "off the podium" pair |
| OG image | 1200×630 | See section 1 |
| Press kit headshots | — | 2–3 styles: on-stage, formal, candid |

### Mechanics

- Feed the largest original you have into `src/assets/images/` and let
  the existing `<Image>`/`TimelineEra` pipeline resize and convert —
  don't pre-shrink. Aim for sources ≥2× display size (era images: ≥900px
  wide). Keep originals archived outside the repo.
- **Alt text describes the moment, not the medium:** "Dana Larsen speaks
  outside the Vancouver courthouse after the 2013 ruling" — not "photo of
  Dana." The `imageAlt` prop on TimelineEra is waiting for these.
- **Rights:** only use photos Dana owns or has permission for. Press
  photographers own their shots — a licensing email beats a takedown
  later. Credit where promised.

---

## 4. SEO — the content half (the code half is done)

- **Era headings are your keyword surface.** "Leads the Sensible BC
  referendum campaign" is entity-rich — full proper nouns, no cleverness
  in h2s. Google's understanding of Dana-the-entity is built from exactly
  these strings agreeing with Wikipedia and the news coverage.
- **The news/columns CMS is your freshness engine.** A steady trickle
  (add items when coverage happens) beats bursts. Every added item is a
  signal this is the living, canonical Dana Larsen site.
- **Link outward from era copy** — to the project sites and to /news
  items covering that era. Internal + outbound links from substantive
  prose are worth more than any meta tweak remaining.
- **After deploy** (already on your checklist): Search Console, submit
  the sitemap, then watch the branded query ("dana larsen") — the goal is
  this site owning position 1 above the socials, and the knowledge panel
  citing it. Consistent naming everywhere (site, socials, JSON-LD,
  Wikipedia) is what feeds that.

---

## 5. Design/UX restraint for the content phase

- **The site has one signature moment** (the timeline rail). Real photos
  and copy will make pages *feel* fuller — resist adding animation or
  decoration to compensate anywhere else. If a page feels flat after real
  content lands, the fix is a better photo, not a new effect.
- **Don't compress the rhythm.** When real copy is longer than lorem,
  keep the section spacing tokens as they are and let pages be long.
  Cramming to reduce scroll is how cohesive sites die.
- **Keep the token rules** (`src/styles/README.md`): new content never
  needs new colors. If a photo clashes with the palette, grade the photo.
- One h1 per page, eras stay h2 — the outline is part of the SEO.

---

## 6. Making this project work for YOU

This site is now a portfolio piece with receipts. Hiring managers and
clients don't evaluate screenshots — they evaluate *decisions and
results*. You have both, documented:

- **Write the case study** (a page on your own site, or a README):
  problem → approach → measurable outcome. You have unusually good
  material: a real audit (SITE-AUDIT.md), a git history where every
  commit explains its reasoning, and hard numbers — Lighthouse 97–100
  across the board, accessibility 92→100, CLS 0, WCAG AA contrast
  *measured* into the token system, forms with spam protection and
  conversion tracking. Before/after screenshots of the contact page
  alone tell a story.
- **Lead with the invisible work.** Anyone can show a pretty homepage.
  "The closed mobile menu was keyboard-reachable; I made it inert" or
  "I measured every color pair against WCAG and encoded the results in
  the token layer" is what separates a developer from a template user.
  Your audience for this is *other professionals* — they know which of
  those is hard.
- **Ask Dana about a footer credit** — "Site by Gary Wintle" linked to
  your portfolio/contact is a long tradition, tasteful in the footer's
  fine print, and it turns every visitor into a potential lead. Get
  explicit permission; on a political figure's site, some clients prefer
  no third-party links. If not in the footer, the case study carries it.
- **The docs are part of the portfolio.** SITE-AUDIT.md, the token
  README, and this playbook demonstrate process. When a hiring manager
  asks "how do you work?" — you link the repo.

---

## 7. Definition of done

Content: □ OG image shipped + validated in a real composer · □ 8 era
blocks written from verified facts · □ 6 project blurbs · □ homepage
About blurb · □ real pull-quote with source · □ photos in all slots,
graded consistently, with real alt text · □ era dates confirmed by Dana
· □ press-kit block on /about (bios + headshots)

Deploy-side (from SITE-AUDIT): □ Netlify form notifications ×2 + live
test submissions · □ primary domain = www · □ GSC + sitemap · □
Lighthouse re-run on the live site · □ real-device pass

Then ship it, write the case study, and put your name on it.
