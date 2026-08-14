---
name: andri.dk
description: A personal site read through one fixed night window — glass panels for browsing, a paper sheet for reading.
colors:
  accent: "#59b4ff"
  primary-500: "#0067ad"
  primary-600: "#004a8d"
  primary-800: "#000d50"
  primary-900: "#000032"
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
  hover-pink: "#ec4899"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  page-title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.875rem, 3vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  article-title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.875rem, 3vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  card-title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.375
    letterSpacing: "normal"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  section-label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.025em"
  meta:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  code:
    fontFamily: "Source Code Pro Variable, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.75
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
    backgroundColor: "rgb(0 0 50 / 0.60)"
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
    width: "48rem"
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
- **Glass Base** (`{colors.primary-900}`): The fill of every panel, always at 60% with `backdrop-blur-md` behind it.

### Secondary

- **Sky Highlight** (`{colors.sky-highlight}`): The interactive light on the dark ground — hover color for feed titles, and every focus ring over the gradient.
- **Sky Meta** (`{colors.sky-meta}`) / **Sky Body** (`{colors.sky-body}`): Metadata and secondary prose inside glass, usually at 70–85% opacity.
- **Link Sky** (`{colors.link-sky}`): Prose links inside the reading sheet, deepening to `{colors.link-sky-deep}` on hover as the underline brightens. This pair lives only on paper.

### Tertiary

- **Hover Pink** (`{colors.hover-pink}`): Footer profile-icon hover, and nothing else.
- **Star Amber** (`{colors.star-amber}`): GitHub star glyphs, and nothing else.

### Neutral

- **Paper** (`{colors.paper}`): The reading sheet, and the light-tone pill body.
- **Ink** (`{colors.ink}`) / **Ink Strong** (`{colors.ink-strong}`): Body text and article titles on paper.
- **Quiet Slate** (`{colors.quiet-slate}`) / **Rule Slate** (`{colors.rule-slate}`): Captions and hairline rules inside the sheet.
- **Code Night** (`{colors.code-night}`) / **Code Paper** (`{colors.code-paper}`): Fenced code, always dark even on the white sheet.

### Named Rules

**The One Hue Rule.** `--accent` is the only brand color and the ramp is derived from it, never hand-picked. If something needs more emphasis, take another step on the ramp.

**The Warm Note Rule.** Warm color is glyph-sized punctuation only. The moment pink or amber fills an area, it has become a second brand color and is wrong.

**The Legible Ground Rule.** The gradient's top stop is a contrast decision, not a taste one. Any change to it must keep white text at ≥4.5:1 in the top 100px of the viewport, where the nav lives.

## Typography

**Display / Body Font:** the platform UI sans stack (`ui-sans-serif, system-ui, …`)
**Code Font:** Source Code Pro Variable

**Character:** Deliberately unbranded. The gradient, the ramp and the badge texture carry the identity, so the type stays native and instantly legible. Only code changes voice.

### Hierarchy

- **Display** (700, `2.25rem` → `3.75rem`): the name on the home hero. One per site.
- **Page Title** (600, `1.875rem` → `2.25rem`): the `h1` on an atmosphere route, in white over the gradient with an optional one-line description beneath.
- **Article Title** (600, same scale): the `h1` inside a reading sheet, in Ink Strong on paper.
- **Card Title** (500, `1.125rem`): post and project names inside glass, in white, shifting to Sky Highlight on hover.
- **Section Label** (600, `0.875rem`, uppercase, wide tracking): subsection headings and column headers. Case marks the boundary, not size.
- **Body** (400, `1rem`, `1.125rem` at `lg`, line-height 1.75): prose inside the sheet, capped at `48rem` — roughly 75 characters.
- **Meta** (400, `0.6875rem`): feed metadata joined by `·` separators.

### Named Rules

**The Native Type Rule.** No display webfont. The system stack is a decision, not an omission.

**The Case-Signals-Role Rule.** Uppercase is a structural label. Forced lowercase is user-authored metadata. Sentence case is content. Never mix the three.

**The Measure Rule.** Prose never exceeds `48rem`. Sheet width is a reading constraint, not a layout preference — widening it to fill a large screen is always wrong.

## Layout

One container owns the horizontal rhythm on every route: `max-w-6xl`, gutters `1rem` → `1.5rem` → `2rem`. Home included. A page that wants different gutters is a page that is wrong.

The document scrolls normally everywhere. Nothing traps scroll, nothing locks the viewport, and the header and footer are ordinary flow elements — the gradient is what stays fixed, not the chrome.

**Route grounds are fixed by kind, not by taste.** Index and browsing routes (`/`, `/blog`, `/projects`, `/activity`) are atmosphere: page header over the gradient, content in glass. Reading routes (blog posts, `/now`, `/uses`) are paper: a centred sheet, full-bleed and square-cornered below `md`, floating with `1.5rem` side margins above it.

Home is the only two-column route: a hero at `46dvh` (`62dvh` at `lg`) beside a `23rem` rail (`26rem` at `xl`) that is `sticky top-0 h-dvh` and scrolls internally, with a mask fading its top and bottom edges. Below `lg` the rail disappears and a four-entry activity section takes its place in normal flow, directly under the hero. Grids run one column, two at `sm`, three at `lg` on the full-width blog index.

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
- **Background:** Glass Base at 60% with `backdrop-blur-md`.
- **Border:** 1px ring at 10% white; `40%` Sky Highlight on hover when interactive.
- **Shadow Strategy:** none. See Elevation.
- **Internal Padding:** `1.25rem`.
- **Interactive variant:** pass a link target and the whole surface becomes the anchor, with a `group` hover that lifts the fill to 75% and shifts the title to Sky Highlight.

### Inputs / Fields

The site ships no forms. When one arrives, follow the light pill: white fill, hairline border, `{rounded.sm}`, focus brightening the border plus a 2px offset outline. No glow.

### Navigation

A single row of chips, top right, identical at every breakpoint — it wraps rather than collapsing, and there is no hamburger. At rest each chip is glass (`white/10`, `white/15` ring, white semibold `0.875rem`); the current route inverts to a solid white fill with `primary-800` text and carries `aria-current="page"`. Route matching is by path prefix, so a blog post keeps "Blog" lit. Left of the row sits the round coffee avatar, with the "Andri" wordmark appearing from `sm` up on every route except home.

### Reading Sheet

The paper surface for long-form routes. `48rem` maximum, `bg-white`, Ink text, `{rounded.xl}` and floating from `md` up, full-bleed and square below it. It carries the full `.markdown` block — the only place in the system tuned for light-on-white — and takes no shadow, because it sits on near-black.

### Activity Feed

A vertical timeline in a `1.75rem` + content grid: a round node holding a kind icon, a 1px connector that fades out on the last entry of a date group, then title, a `·`-separated metadata line, an optional two-line summary and a `16:9` thumbnail. It ships in light and dark tones and appears in three places: the sticky home rail, a compact four-entry section on mobile home, and the full `/activity` page.

## Do's and Don'ts

### Do:

- **Do** derive every blue from the ramp generated by `--accent`; editing that one value must remain the way to re-tune the site.
- **Do** decide the route's ground first — atmosphere or reading — then pick glass or paper accordingly.
- **Do** put every route inside the shared container and let it own the gutters.
- **Do** keep prose at or under `48rem`.
- **Do** force lowercase on user-authored metadata and uppercase on structural labels.
- **Do** gate every transform behind `motion-safe:` and pair every hover state with a `focus-visible` equivalent; WCAG 2.2 AA is the target and the current build clears it on every surface.

### Don't:

- **Don't** introduce a second brand color. Warm hues are glyph-sized punctuation only.
- **Don't** cast a shadow on the gradient or float a blurred translucent panel on paper.
- **Don't** add ambient or looping animation. Motion is a response to input, never decoration.
- **Don't** add a display webfont.
- **Don't** lock the viewport or trap scroll. The gradient is fixed; the page is not.
- **Don't** build the SaaS landing pattern: mesh hero, three feature cards, logo wall, pricing row.
- **Don't** invent testimonials, metrics, client logos or pricing. None exist.
