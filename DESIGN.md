---
name: andri.dk
description: A personal site read through one fixed night window — glass panels for browsing, a paper sheet for reading.
colors:
  accent: "#59b4ff"
  primary-500: "#0067ad"
  primary-600: "#004a8d"
  primary-800: "#000d50"
  glass: "rgb(0 0 0 / 0.30)"
  ground-end: "#000000"
  sky-highlight: "#7dd3fc"
  sky-meta: "#bae6fd"
  sky-body: "#e0f2fe"
  paper: "#ffffff"
  ink: "#1f2937"
  ink-strong: "#111827"
  quiet-slate: "#64748b"
  rule-slate: "#cbd5e1"
  link-sky: "#0369a1"
  link-sky-deep: "#075985"
  code-night: "#020617"
  code-paper: "#f1f5f9"
  star-amber: "#fbbf24"
typography:
  display:
    fontFamily: "Inter Variable, Inter Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem → 3.75rem at md"
    fontWeight: 780
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  page-title:
    fontFamily: "Inter Variable, Inter Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem → 2.25rem at sm"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  article-title:
    fontFamily: "Inter Variable, Inter Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem → 2.25rem at sm"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  card-title:
    fontFamily: "Inter Variable, Inter Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.375
    letterSpacing: "normal"
  body:
    fontFamily: "Inter Variable, Inter Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem → 1.125rem at lg"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  section-label:
    fontFamily: "Inter Variable, Inter Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.025em"
  meta:
    fontFamily: "Inter Variable, Inter Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 450
    lineHeight: 1.5
    letterSpacing: "normal"
  code:
    fontFamily: "Source Code Pro Variable, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
rounded:
  sm: "0.25rem"
  md: "0.375rem"
  xl: "0.75rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.25rem"
  xl: "2rem"
components:
  nav-item:
    backgroundColor: "rgb(255 255 255 / 0.10)"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.625rem"
    typography: "{typography.section-label}"
  nav-item-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary-800}"
  card:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.paper}"
    rounded: "{rounded.xl}"
    padding: "1.25rem"
  pill:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary-800}"
    rounded: "{rounded.sm}"
    padding: "0.125rem 0.5rem"
    height: "1.5rem"
  pill-dark:
    backgroundColor: "rgb(255 255 255 / 0.10)"
    textColor: "{colors.sky-body}"
    rounded: "{rounded.sm}"
    padding: "0.125rem 0.5rem"
    height: "1.5rem"
  reading-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "2rem 1.25rem"
    width: "40rem"
  button:
    backgroundColor: "{colors.primary-500}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1rem"
---

# Design System: andri.dk

## Overview

**Creative North Star: "The Night Window"**

There is exactly one ground: a deep blue-to-black gradient, fixed to the viewport, that never scrolls and never leaves. Every page is something held up in front of it. Where you are browsing, the site hands you glass — translucent, blurred, hairline-ringed panels that let the night show through. Where you are reading, it hands you paper — an opaque white sheet floating in the same window, full-bleed on a phone.

The register is flat, clean and precise, with a professional core and a streak of whimsy that never costs legibility. Precision is structural: one accent hue generates the entire ramp, one container sets the horizontal rhythm for every route, one badge carries every piece of metadata in two tones. The whimsy sits in the details — a coffee-cup avatar, lowercase tags, the live feed ticking away in its own column.

Nothing here moves on its own. There is no ambient animation, no drifting gradient, no decorative motion of any kind; the only things that move are responses to input, and they take 200ms. Depth is a change of material rather than a stack of shadows. The confirmed anti-reference is the SaaS landing template: no mesh-gradient hero, no three generic feature cards, no logo wall, no pricing row.

**Key Characteristics:**

- One fixed gradient ground, shared by every route and never repainted per page.
- Two materials: glass for browsing surfaces, paper for reading surfaces. They never mix on one screen.
- One accent hue generating the whole ramp — no second brand color.
- Lowercase, badge-forward metadata as the recurring texture, in a light and a dark tone.
- Absolutely no ambient motion; state changes only, ≤200ms, always `motion-safe`-gated.

## Colors

One cool blue generates everything; the neutrals are all in service of reading.

### Primary

- **Accent** (`{colors.accent}`): The generator. It is never painted directly anywhere — its only job is to be `--accent`, from which `primary-100` through `primary-900` are derived as `oklch(from var(--accent) N% c h)`. Changing this one value re-tunes the site.
- **Ground Top** (`{colors.primary-500}`): The top stop of the fixed gradient, running to pure black at the bottom. Chosen at this depth so white nav and heading text clear 6:1 against it; anything lighter fails AA at the top of the viewport.
- **Glass** (`{colors.glass}`): The fill of every panel — plain black at 30% over `backdrop-blur-md`, never a tinted navy. Because it only darkens, a panel keeps whatever hue the gradient has behind it at that scroll position, which is what makes it read as glass rather than as a blue box.

### Secondary

- **Sky Highlight** (`{colors.sky-highlight}`): The interactive light on the dark ground — hover color for feed titles, and every focus ring over the gradient.
- **Sky Meta** (`{colors.sky-meta}`) / **Sky Body** (`{colors.sky-body}`): Metadata and secondary prose inside glass, usually at 70–85% opacity.
- **Link Sky** (`{colors.link-sky}`): Prose links inside the reading sheet, deepening to `{colors.link-sky-deep}` on hover as the underline brightens. This pair lives only on paper.

### Tertiary

- **Star Amber** (`{colors.star-amber}`): GitHub and Tangled star glyphs, and nothing else.
- **Like Red** (`{colors.like-red}`): Bluesky like glyphs, and nothing else. Red for a heart is a convention the whole web already reads, so borrowing it costs less than teaching a cool-hued heart.

These two are the system's entire warm vocabulary, and both exist only at glyph size beside a number — the pink hover that went with the old icon-row footer is not coming back.

### Neutral

- **Paper** (`{colors.paper}`): The reading sheet, and the light-tone pill body.
- **Ink** (`{colors.ink}`) / **Ink Strong** (`{colors.ink-strong}`): Body text and article titles on paper.
- **Quiet Slate** (`{colors.quiet-slate}`) / **Rule Slate** (`{colors.rule-slate}`): Captions and hairline rules inside the sheet.
- **Code Night** (`{colors.code-night}`) / **Code Paper** (`{colors.code-paper}`): Fenced code, always dark even on the white sheet.

### Named Rules

**The One Hue Rule.** `--accent` is the only brand color and the ramp is derived from it, never hand-picked. If something needs more emphasis, take another step on the ramp.

**The Warm Note Rule.** Warm color is glyph-sized punctuation only — currently an amber star and a red heart, each bound to one meaning and never used for anything else. A third warm hue, or any warm fill larger than a glyph, has become a second brand color and is wrong.

**The Legible Ground Rule.** The gradient's top stop is a contrast decision, not a taste one. Any change to it must keep white text at ≥4.5:1 in the top 100px of the viewport, where the nav lives.

## Typography

**Display / Body Font:** Inter Variable, self-hosted from a hand-built subset (`scripts/subset-inter.sh`) — upright plus true italics, no synthetic oblique
**Fallback:** `Inter Fallback` — a metric-matched local face, not a second voice. See The Stand-In Rule.
**Code Font:** Source Code Pro Variable

**Character:** One sans doing every job, cut to stop looking like stock Inter. The face is set with `cv11`, Inter's single-storey `a`, which trades the default double-storey bowl for a circle and a stem and gives the whole site a geometric read at every size. `ss08` rounds the quotes and commas to match. The gradient, the ramp and the badge texture still carry most of the identity — but the lettering is now a decision rather than a default. Only code changes voice.

That one substitution is also why the font is subset by hand: `@fontsource-variable/inter` ships its woff2 files with the layout features stripped, so `cv11` is unreachable from the package. The subset costs about 6KB over fontsource's and pins out the `opsz` axis, which is not driven.

Three renderers draw this face and none of them share a pipeline, so
`scripts/subset-inter.sh` emits a cut for each: variable woff2 subsets for the
browser, one feature-frozen woff2 for the social cards, and four static TTFs for
the CV PDF. The browser is the only one that can apply `cv11` from CSS — takumi
and react-pdf both need it baked into the default glyphs, so it is. The CV is a
file people forward around detached from the site, which is exactly why it may
not quietly fall back to a different typeface.

Inter is spaced for interface text, so the system tightens it as it grows and leaves it alone when small: `-0.025em` at title and display sizes, `0` at body, `+0.025em`/`+0.06em` on the uppercase labels. Tracking is a function of size here, never a per-component decision.

**The weight axis is used as an axis, not as four static weights.** Off-grid values are legitimate and deliberate: `450` for text on glass, `780` for the hero. A weight that no static family ships is the clearest evidence the axis is being driven.

### Hierarchy

- **Display** (780, `2.25rem` → `3.75rem`, tracking `-0.025em`, balanced): the name on the home hero. One per site. The weight is off-grid on purpose — 700 sat too light against the gradient at 60px.
- **Title** (600, `1.875rem` → `2.25rem`, tracking `-0.025em`): one role in two tones — white over the gradient on an index route, Ink Strong on paper inside a reading sheet. They are deliberately identical: the same document title should not change size because the ground under it changed.
- **Card Title** (500, `1.125rem`): post and project names inside glass, in white, shifting to Sky Highlight on hover. Both card kinds use this one role.
- **Section Label** (600, `0.875rem`, uppercase, wide tracking): subsection headings and column headers. Case marks the boundary, not size — but a label still never renders smaller than the text it heads.
- **Body** (400 on paper, 450 on glass, `1rem`, `1.125rem` at `lg`, line-height 1.75): prose inside the sheet, capped at `{--container-measure}` — a measured median of 72 characters.
- **Meta** (450, `0.6875rem`, tabular figures with a slashed zero): feed metadata joined by `·` separators. Figures are tabular because the feed is a column of counts and dates that would otherwise shift line to line.

**The prose ramp.** Inside `.markdown`, heading sizes are `em` so the whole ramp rides the body size the sheet steps up at `lg`: `1.75` / `1.375` / `1.1875` / `1` / `0.9375` / `0.8125`. Below `h3` the ramp reaches body size, so weight and case take over from size — an `h4` set at body size in bold still reads as a heading, and `h6` is marked by uppercase rather than shrunk further. Every step is a visible one; two heading levels that need a ruler to tell apart are one level too many.

### Named Rules

**The One Family Rule.** Inter for everything that is not code, Source Code Pro for code, and nothing else. The face is settled; a third family needs a job neither can do. Distinctiveness comes from how this one face is cut and driven — `cv11`, the tracking ramp, the weight axis — not from adding another.

**The Stand-In Rule.** The webfont never gets to reflow the page. `Inter Fallback` is a local Arial/Helvetica/Liberation face carrying `size-adjust` and ascent/descent overrides measured against Inter, so it occupies an identical line box while the real face loads. Change Inter and those numbers are re-measured, not guessed.

**The Case-Signals-Role Rule.** Uppercase is a structural label. Forced lowercase is user-authored metadata. Sentence case is content. Never mix the three.

**The Measure Rule.** Prose sits at `--container-measure` (`40rem`, a measured median of 72 characters) and never exceeds it. That token is the single source: the sheet's column and the header that titles it both read it, so they cannot drift. Character count is the constraint, not width — change the body size and the token is re-measured against 65–75 characters.

**The Dark-Ground Weight Rule.** Text on the gradient is one notch heavier than the same role on paper: `--font-weight-glass` (450) against 400. Light type on a dark ground reads thinner than its weight, so the ground sets the weight and the paper sheet resets it — the rule lives on `<body>` and is undone in `reading-sheet.astro`, so it holds for anything added later without a per-component decision. Nothing on glass ever goes below 400.

**The Italic Agreement Rule.** `cv11` is applied to the roman only, because Inter's true italic already draws a single-storey `a` and upstream ships no alternate for it. The two agree by construction. If the roman ever drops `cv11`, the italic will disagree with it — check the pair, not just the roman.

## Layout

One container owns the horizontal rhythm on every route: `max-w-6xl`, gutters `1rem` → `1.5rem` → `2rem`. Reading routes narrow the _entire shell_ to `max-w-3xl`, so the nav, the sheet and the footer share one column edge — a sheet floating inside a wider header reads as a mistake. A page that wants different gutters is a page that is wrong.

The document scrolls normally everywhere. Nothing traps scroll, nothing locks the viewport, and the header and footer are ordinary flow elements — the gradient is what stays fixed, not the chrome.

**Route grounds are fixed by kind, not by taste.** Index and browsing routes (`/`, `/blog`, `/projects`, `/activity`) are atmosphere: content in glass. Reading routes (blog posts, `/now`, `/uses`) are paper: a centred sheet, full-bleed and square-cornered below `md`, floating above it. What does _not_ change by kind is how a page opens — see the rule below.

**The One Opening Rule.** Every route names itself the same way: on the gradient, above any surface, via page-header — optional eyebrow, `h1`, optional description, then metadata. A reading route's sheet holds the body and nothing else. Titles never come from a `#` in content; they come from frontmatter. This is why a tag looks identical on `/blog` and on the post it links to: both sit on the same ground, in the same dark tone.

**The Shared Column Rule.** A title and the text it titles sit on exactly the same column edges at every breakpoint. On a reading route the header therefore renders through the _sheet's_ padding chain rather than the page container's — same gutter, same `--container-measure` — so the two can never drift apart. Verified identical at 390, 640, 768, 1024, 1280 and 1600.

Home carries the only rail: a `23rem` panel (`26rem` at `xl`) fixed to the full height of the viewport from `lg` up, with the page shell padded to clear it. It is a panel beside the site, not a column inside the page — it runs past the header and footer, scrolls internally, and masks its own top and bottom edges. Below `lg` it disappears and a four-entry activity section takes its place in normal flow under the hero. Grids run one column, two at `sm`, three at `xl` beside the rail and at `lg` on full-width routes.

Spacing follows Tailwind's 4px base: cards pad at `1.25rem`, the sheet at `1.25rem`/`2rem`, subsections separate by `2rem`.

### Named Rules

**The One Container Rule.** Horizontal rhythm is set in exactly one component. No page declares its own gutters.

**The Full-Bleed Sheet Rule.** On a phone the reading sheet runs edge to edge with square corners — the measure matters more than the margin. Glass cards do the opposite: they stay inset and rounded at every size, because a grid of edge-to-edge panels reads as a broken table.

## Elevation & Depth

No shadows on the night ground — a cast shadow over near-black is invisible, so the system does not pretend otherwise. Depth there is a change of material: 60% fills, `backdrop-blur-md`, and 1px rings at 10% white that brighten to Sky Highlight on hover or focus. Ring opacity, not blur radius, communicates state.

Inside the reading sheet, ordinary paper physics resume at a small scale: images and `kbd` keys carry a `shadow-sm`, because there they sit on white and a shadow means something.

### Shadow Vocabulary

- **Hairline** (`box-shadow: 0 0 0 1px rgb(255 255 255 / 0.1)`): the resting edge of every glass surface.
- **Hairline Active** (`box-shadow: 0 0 0 1px rgb(125 211 252 / 0.4)`): hover and focus-within on an interactive panel.
- **Paper Lift** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.05)`): images and keys inside the sheet only.

### Named Rules

**The Two Materials Rule.** Decide the material before styling anything. Glass takes a ring, a translucent fill and backdrop blur, never a shadow. Paper takes an opaque fill and may take a small shadow. Never put one on the other's ground.

## Shapes

Quiet, small radii, consistent at every breakpoint: badges `{rounded.sm}`, nav chips and skill tags `{rounded.md}`, every panel and the reading sheet `{rounded.xl}`. Only the avatar and the feed's timeline nodes are fully round.

Borders are hairlines — 1px, low contrast, defining an edge rather than drawing attention. The pill is the one two-part silhouette: a filled icon cap and a body, clipped by `overflow-clip` so both halves share a single outline.

There is no organic or freeform geometry anywhere in the system.

## Components

### Buttons

- **Shape:** `{rounded.sm}`.
- **Primary:** `primary-500` fill from the generated ramp, white label, semibold, `0.5rem 1rem` (5.9:1).
- **Hover / Focus:** deepens one ramp step to `primary-600` (8.9:1); color only, no lift, no scale. Focus is a 2px offset outline — Sky Highlight over the gradient, `primary-500` on paper.
- **Note:** the site is navigation-led and currently ships no buttons. Prefer a link or a nav chip before introducing one.

### Chips

- **Pill** — the signature primitive, in two tones. **Light** (on paper): white body, `primary-800` lowercase text, Signal-derived border and filled icon cap. **Dark** (on glass): `white/10` body, Sky Body text, `white/25` border, `white/15` cap, all brightening toward Sky Highlight when the containing link is hovered. Both are `1.5rem` tall at `0.75rem` type.
- **Tag** — a Pill that adopts an icon when its name matches a known technology. Post tags, project tags, feed tags, skills. Capped at three per card.

### Cards / Containers

- **Corner Style:** `{rounded.xl}` at every size.
- **Background:** Glass — black at 30% with `backdrop-blur-md`.
- **Border:** 1px ring at 10% white; `40%` Sky Highlight on hover when interactive.
- **Shadow Strategy:** none. See Elevation.
- **Internal Padding:** `1.25rem`.
- **Interactive variant:** pass a link target and the whole surface becomes the anchor, with a `group` hover that lifts the fill to 75% and shifts the title to Sky Highlight.

### Inputs / Fields

The site ships no forms. When one arrives, follow the light pill: white fill, hairline border, `{rounded.sm}`, focus brightening the border plus a 2px offset outline. No glow.

### Navigation

A single row of chips, top right, identical at every breakpoint — it wraps rather than collapsing, and there is no hamburger. At rest each chip is glass (`white/10`, `white/15` ring, white semibold `0.875rem`); the current route inverts to a solid white fill with `primary-800` text and carries `aria-current="page"`. Route matching is by path prefix, so a blog post keeps "Blog" lit. Left of the row sits the round coffee avatar plus the "Andri" wordmark from `sm` up — except on home, where the hero already carries both and the masthead would only repeat them, so the chips right-align alone.

### Reading Sheet

The paper surface for long-form routes, holding the body and nothing else — the title, date and tags live on the gradient above it like every other route. It spans the full container width, is `bg-white` with Ink text, `{rounded.xl}` and floating from `md` up, full-bleed and square below it. The reading measure is held by a centred `--container-measure` column _inside_ the sheet, not by the sheet itself — a reading page must not look narrower than the rest of the site. Code blocks and figures break out of that column on `lg`, since they are scanned rather than read by line. It carries the full `.markdown` block, the only place in the system tuned for light-on-white, and takes no shadow because it sits on near-black.

### Footer

A three-column colophon closing every route above a hairline rule: **Site** (the five internal routes), **Elsewhere** (the four public profiles), and **This site** (RSS, source repository), with a build line and a copyright-and-licence line beneath. Links are body-size text with a `1rem` leading icon — not the 36px unlabelled glyph row it replaced, which was the largest type on the site and carried no information.

**The Unadvertised Artifact Rule.** `/cv.pdf` and the email address in `resume.json` are reachable but deliberately unlinked. Do not surface them in navigation, the footer, or a call to action; the social profiles are the contact path.

### Activity Feed

A vertical timeline in a `1.75rem` + content grid: a round node holding an **outline** kind icon, a 1px connector that fades out on the last entry of a date group, then title, a `·`-separated metadata line, an optional two-line summary and a `16:9` thumbnail. The only filled glyph in the feed is the amber star beside a star count — filled means "a number follows". It ships in light and dark tones and appears in three places: the fixed home rail, a compact four-entry section on mobile home, and the full `/activity` page.

**Deferred by default.** The feed is a server island (`server:defer`): pages ship immediately with a static placeholder and the stream arrives when the live collection answers. A slow GitHub or Bluesky must never hold a page. The placeholder does not pulse or shimmer — the no-ambient-motion rule has no exception for loading states.

## Do's and Don'ts

### Do:

- **Do** derive every blue from the ramp generated by `--accent`; editing that one value must remain the way to re-tune the site.
- **Do** decide the route's ground first — atmosphere or reading — then pick glass or paper accordingly.
- **Do** put every route inside the shared container and let it own the gutters.
- **Do** keep prose at `--container-measure`, and re-measure that token against 65–75 characters whenever the body size changes.
- **Do** force lowercase on user-authored metadata and uppercase on structural labels.
- **Do** gate every transform behind `motion-safe:` and pair every hover state with a `focus-visible` equivalent; WCAG 2.2 AA is the target and the current build clears it on every surface.

### Don't:

- **Don't** introduce a second brand color. Warm hues are glyph-sized punctuation only.
- **Don't** cast a shadow on the gradient or float a blurred translucent panel on paper.
- **Don't** add ambient or looping animation. Motion is a response to input, never decoration.
- **Don't** add a third font family, and don't set light-on-dark text below weight 400.
- **Don't** lock the viewport or trap scroll. The gradient is fixed; the page is not.
- **Don't** build the SaaS landing pattern: mesh hero, three feature cards, logo wall, pricing row.
- **Don't** invent testimonials, metrics, client logos or pricing. None exist.
