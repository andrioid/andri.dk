---
name: andri.dk
description: A night-sky personal site where lit, flat surfaces float over a slow-moving blue-to-black gradient.
colors:
  signal-blue: "#59b4ff"
  primary-500: "#0067ad"
  primary-600: "#004a8d"
  night-deep: "#033359"
  night-gradient-start: "#1e3a8a"
  night-gradient-end: "#000000"
  sky-highlight: "#7dd3fc"
  link-sky: "#0369a1"
  link-sky-hover: "#075985"
  hover-pink: "#ec4899"
  ink: "#1f2937"
  paper: "#ffffff"
  worktop: "#e5e7eb"
  rule-slate: "#cbd5e1"
  quiet-slate: "#64748b"
  code-night: "#020617"
  code-paper: "#f1f5f9"
  star-amber: "#f59e0b"
  skill-operations: "#065f46"
  skill-programming: "#2460a7"
  skill-data: "#491d70"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.25rem, 2vw, 1.5rem)"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.025em"
  code:
    fontFamily: "Source Code Pro Variable, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
rounded:
  sm: "0.25rem"
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  nav-item:
    backgroundColor: "{colors.link-sky}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.75rem"
    typography: "{typography.label}"
  nav-item-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.night-deep}"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "1.5rem"
  pill:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.night-deep}"
    rounded: "{rounded.sm}"
    padding: "0.125rem 0.5rem"
    height: "1.5rem"
  pill-icon:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.paper}"
    padding: "0 0.125rem"
  skill-tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.25rem 0.75rem"
  rail-panel:
    backgroundColor: "{colors.night-deep}"
    textColor: "{colors.paper}"
    rounded: "{rounded.xl}"
    padding: "1rem"
  button:
    backgroundColor: "{colors.primary-500}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "0.5rem 1rem"
---

# Design System: andri.dk

## Overview

**Creative North Star: "The Night Window"**

The whole site is a view through one window onto a blue-to-black night sky. The gradient never leaves: it runs top to bottom behind every page, drifting on a 15-second cycle, with two enormous soft-white shapes slowly morphing and rotating behind the glass. Content is what the window frames — flat, clean, lit surfaces that sit calmly on top of all that movement and never compete with it.

The register is professional with a deliberate streak of whimsy. The precision is real: a single accent hue generates the entire nine-step ramp, labels are tight, spacing is regular, states are fast and small. The whimsy is where it costs nothing — the morphing blobs, the coffee-cup avatar and favicon, lowercase tags, a red heart next to the skills Andri actually likes. Nothing bounces, nothing shouts, but the site is plainly a person's and not a company's.

Surfaces are flat by default. Depth is a change of medium, not a pile of shadows: on the light worktop, content is paper; on the night gradient, content is glass — translucent, blurred behind, edged with a single hairline ring. The anti-reference is the SaaS landing template: no gradient-mesh hero with three generic feature cards, no logo wall, no pricing tier row.

**Key Characteristics:**

- One accent hue (Signal Blue) generating the full primary ramp — no second brand color.
- A persistent night gradient as the page ground, animated slowly and continuously.
- Flat, clean surfaces; depth expressed as paper-on-light versus glass-on-dark.
- Lowercase, badge-forward metadata (pills and tags) as the recurring texture.
- Small, fast, restrained state changes; whimsy confined to atmosphere and iconography.

## Colors

A single cool blue does all the expressive work; everything else is neutral or a semantic marker.

### Primary

- **Signal Blue** (`{colors.signal-blue}`): The brand accent and the mathematical source of the whole `primary-100`–`primary-900` ramp, each step generated as `oklch(from var(--accent) N% c h)`. Appears directly as headings on cards, pill icon chips, feed node rings, and the `andri` gradient origin. Changing this one value re-tunes the entire system.
- **Night Deep** (`{colors.night-deep}`): The dark-mode gradient origin and the translucent ground of the home activity rail (`primary-900` at 60% with backdrop blur).

### Secondary

- **Link Sky** (`{colors.link-sky}`): Every interactive text link in prose and the top-menu chip background. Deepens to **Link Sky Deep** (`{colors.link-sky-hover}`) on hover, with the underline decoration brightening at the same time.
- **Sky Highlight** (`{colors.sky-highlight}`): The light-on-dark counterpart — the hero's role line, dark-tone feed titles on hover, and focus outlines over the gradient.

### Tertiary

- **Hover Pink** (`{colors.hover-pink}`): Reserved exclusively for footer profile-icon hover. It is the one warm note in the system and its rarity is what makes it read as a wink rather than a second brand color.
- **Star Amber** (`{colors.star-amber}`): GitHub star counts only.
- **Skill markers** — Operations green (`{colors.skill-operations}`), Programming blue (`{colors.skill-programming}`), Data purple (`{colors.skill-data}`): category identity on the skills grid; they color the category heading and the tag border/text, never a fill.

### Neutral

- **Paper** (`{colors.paper}`): Every content surface — cards, project tiles, the article sheet.
- **Worktop** (`{colors.worktop}`): The page ground on all non-home routes; paper surfaces rest on it.
- **Ink** (`{colors.ink}`): Default body text.
- **Quiet Slate** (`{colors.quiet-slate}`): Captions, figcaptions, blockquote footers, code-fence language labels.
- **Rule Slate** (`{colors.rule-slate}`): Borders, table rules, blockquote bars, link underline decoration at rest.
- **Code Night** (`{colors.code-night}`) / **Code Paper** (`{colors.code-paper}`): Fenced code blocks, always dark regardless of surrounding surface (Shiki `github-dark`).

### Named Rules

**The One Hue Rule.** Signal Blue is the only brand color, and the primary ramp is derived from it rather than hand-picked. Never introduce a second accent; if a new emphasis is needed, take another step on the ramp.

**The Warm Note Rule.** Warm color (pink, amber, the skill red heart) appears only as a punctuation mark on a single element. The moment warmth covers an area rather than a glyph, it has become a second brand color and is wrong.

## Typography

**Display Font:** the platform UI sans stack (`ui-sans-serif, system-ui, …`)
**Body Font:** the same stack — one family across the whole site
**Label/Mono Font:** Source Code Pro Variable, for code only

**Character:** Deliberately unbranded type. With the gradient, the ramp, and the badge texture already carrying the identity, the type stays neutral, native, and instantly legible — the site's personality is in its light and its surfaces, not its letterforms. Only code changes voice, into a monospace with visible engineering character.

### Hierarchy

- **Display** (700, `2.25rem` → `3.75rem` at `md`, tight leading): the name on the home hero, over the gradient, with a drop shadow for separation. One per page, home only.
- **Headline** (600, `1.25rem` → `1.5rem` at `md`, uppercase): section titles. Uppercase is what marks a section boundary; size alone does not.
- **Title** (600, `1.25rem`, leading-none): project names and card titles, set in Signal Blue's mid ramp rather than ink.
- **Body** (400, `1rem`, `1.125rem` at `lg`, line-height 1.75): prose. Paragraphs run at `leading-7`; a `.lead` opener steps up to `1.125rem`/`1.25rem`. Prose blocks cap at `max-w-prose`.
- **Label** (600, `0.6875rem`–`0.75rem`, wide tracking, often uppercase or lowercase-forced): feed metadata, tags, table headers, code-fence language tags. Lowercase on pills and tags; uppercase on structural labels.

### Named Rules

**The Native Type Rule.** Do not add a display webfont to carry personality. The system font is a decision, not an omission; new surfaces inherit it.

**The Case-Signals-Role Rule.** Uppercase means "structural label" (section heading, column header). Lowercase-forced means "user-authored metadata" (tag, pill). Sentence case means content. Do not mix the three.

## Layout

Full-viewport shell: `h-dvh` column of header, main, footer, with the gradient painted on the shell so it is continuous and never scrolls away. On the home route the page itself does not scroll on desktop — the interior panes scroll independently; on all other routes the shell scrolls normally.

Home is a two-column split above `lg`: a centered hero claiming the main column and a fixed-width rail (`23rem`, `26rem` at `xl`) holding the activity stream. Below `lg` they stack, and the hero is deliberately capped at `72dvh` so the first feed entries peek above the fold and the page reads as one thing rather than two.

Content routes sit in a `Section` wrapper with generous side gutters that grow with the viewport (`md:px-20`, `lg:px-40`) and `1.5rem` vertical padding. Index grids are one column, two at `md`, three at `lg`, gap `1rem`. Article pages are a single paper sheet capped at `lg:max-w-6xl` with `2.5rem` vertical and up to `2.5rem` horizontal padding.

Spacing follows Tailwind's 4px base. Cards pad at `1.5rem`, panels at `1rem`–`1.25rem`, badge rows gap at `0.25rem`–`0.5rem`. Breakpoints are the Tailwind defaults (`40rem` / `48rem` / `64rem` / `80rem`); `md` is where gutters and rounding appear, `lg` is where the layout becomes two-dimensional.

**The Edge-to-Edge Mobile Rule.** Rounding and side gutters are desktop affordances (`md:rounded-md`, `md:px-*`). On phones, surfaces run full-bleed to the screen edge with square corners. Never ship a rounded, inset card on mobile.

## Elevation & Depth

Hybrid, split by ground. On the light worktop, depth is paper: white surfaces carry a real cast shadow (`shadow-lg`) that deepens on hover (`shadow-2xl`), reading as a sheet lifting off a table. On the night gradient, shadows are invisible, so depth comes from medium instead — translucent fills (`primary-900/60`, `white/5`), `backdrop-blur-md`, and 1px rings (`ring-1 ring-white/10`) that brighten on hover or focus.

Surfaces are otherwise flat: no inner bevels, no gradients on components, no stacked shadow layers. The only gradients in the system are the page ground and two fade masks (the feed connector's tail, the scroll mask on the home rail).

### Shadow Vocabulary

- **Sheet** (`box-shadow: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1)`): resting state of a card on the worktop.
- **Sheet Raised** (`box-shadow: 0 25px 50px -12px rgb(0 0 0 / .25)`): hover state of a linked card. The only shadow transition in the system.
- **Hairline** (`box-shadow: inset 0 0 0 1px currentColor`-equivalent via `ring-1`): the dark-ground substitute for a shadow. Ring opacity, not blur, communicates state.

### Named Rules

**The Two Grounds Rule.** Ask which ground a surface is on before styling it. Paper on the worktop takes a shadow and an opaque white fill. Glass on the gradient takes a ring, a translucent fill, and backdrop blur — never a shadow, which does nothing over the dark sky.

## Shapes

Small, quiet radii. Badges are barely rounded (`{rounded.sm}`), cards and buttons take `{rounded.md}`, media thumbnails `{rounded.lg}`, and the largest panels — the activity rail, code blocks, callouts, images in prose — `{rounded.xl}`. Only the avatar and the feed's timeline nodes are fully round.

Borders are hairlines: 1px, low-contrast, used to define an edge rather than draw attention. Pills combine both languages in one silhouette — a filled icon cap on the left, a white body on the right, clipped by `overflow-clip` so the two halves share one continuous outline.

The atmosphere layer is the exception and the source of the whimsy: the two background shapes animate between organic blob radii (`40% 60% 60% 40% / 70% 30% 70% 30%`) and rotate continuously. Freeform geometry belongs to the background only; foreground components are strictly rectilinear with small corners.

## Components

### Buttons

- **Shape:** small corners (`{rounded.sm}`).
- **Primary:** `primary-500` fill from the generated ramp, white label, semibold, `0.5rem 1rem` padding (5.9:1 on white text).
- **Hover / Focus:** deepens one ramp step to `primary-600` (8.9:1), color transition only — no lift, no scale. Focus is a 2px offset outline in `primary-500` over light grounds, Sky Highlight over the gradient.
- **Note:** the site is navigation-led; real buttons are rare. Prefer a link or a nav chip before introducing a button.

### Chips

- **Pill** — the system's signature primitive. A `1.5rem`-tall capsule-free rectangle: optional icon cap filled Signal Blue with a white glyph, body in white with `primary-800` lowercase text at `0.75rem`, hairline Signal Blue border, both halves clipped to one outline. Hovering the containing link lightens cap and border one ramp step.
- **Tag** — a Pill that auto-adopts an icon when the tag name matches a known technology. Used for post tags, project tags, and feed tags; capped at three per card.
- **Skill tag** — outline-only, `{rounded.md}`, lowercase semibold, bordered and colored by category (green / blue / purple). A red heart glyph marks a preferred skill.

### Cards / Containers

- **Corner Style:** `{rounded.md}` at `md` and up; square, full-bleed below.
- **Background:** Paper; the entire card is a link.
- **Shadow Strategy:** Sheet at rest, Sheet Raised on hover (see Elevation).
- **Border:** none — the shadow does the separating.
- **Internal Padding:** `1.5rem` for post cards, `0.75rem 1rem` for project tiles.
- **Contents:** dated cards lead with a calendar icon and short date at `0.875rem`, then the title in `primary-500`, then a tag row.

### Inputs / Fields

Not part of the shipped system; the site has no forms outside the contact dialog. When one is needed, follow the pill's language: white fill, hairline Signal Blue border, `{rounded.sm}`, and a focus state that brightens the border and adds a 2px offset outline — no glow.

### Navigation

Top-right chip row: each item is a Link Sky pill at 80% opacity with white semibold `0.875rem` text and `{rounded.md}` corners, inverting to a white fill with Night Deep text on hover. Items wrap rather than collapse — there is no hamburger, and the row is the same on every breakpoint. Left of it sits the round coffee avatar, with the wordmark "Andri" shown on every route except home, where the hero already says it.

### Activity Feed

The signature component. A vertical timeline in a two-column grid (`1.75rem` node column + content): a round `1.75rem` node holding a kind icon, connected downward by a 1px line that fades to transparent on the last entry of a date group. Each row is title, then a `0.6875rem` metadata line joined by `·` separators (verb · source · relative time · star count), then an optional two-line summary and a `16:9` `object-contain` thumbnail.

It ships in two tones against the two grounds: **light** (white node, Signal Blue ring, ink-on-paper text) and **dark** (Night Deep node, Sky Highlight icon, white rings and text). The node blooms to 110% on group hover or focus, gated behind `motion-safe`.

## Do's and Don'ts

### Do:

- **Do** derive every new blue from the `primary-100`–`primary-900` ramp, which is generated from `--accent`. Editing `--accent` must remain the way to re-tune the site.
- **Do** decide the ground first (worktop or gradient), then choose paper-plus-shadow or glass-plus-ring accordingly.
- **Do** keep rounding and gutters behind `md:` so mobile surfaces stay full-bleed and square.
- **Do** force lowercase on user-authored metadata (tags, pills) and uppercase on structural labels.
- **Do** gate every transform or scale behind `motion-safe:` and pair every hover state with a `focus-visible` equivalent; WCAG 2.2 AA is the target.
- **Do** cap tag rows at three and clamp feed titles and summaries; density is controlled by truncation, not by shrinking type.

### Don't:

- **Don't** introduce a second brand color. Warm hues (pink, amber, red) are glyph-sized punctuation only.
- **Don't** put a drop shadow on the night gradient, or a translucent blurred panel on the light worktop. The two depth languages do not cross.
- **Don't** add a display webfont. The native sans stack is the committed choice.
- **Don't** build the SaaS landing pattern: mesh-gradient hero, three generic feature cards, logo wall, pricing row. It is the confirmed anti-reference.
- **Don't** apply the morphing-blob geometry to a foreground component. Organic shape belongs to the atmosphere layer only.
- **Don't** animate content. The only continuous motion in the system is the background gradient and its two shapes; everything else moves for ≤200ms in response to input.
