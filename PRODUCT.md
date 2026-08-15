# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two real audiences, but the site is authored personal-first: Andri writes and maintains it for himself, and the public surfaces follow from that.

- **Hiring parties and clients** — recruiters, CTOs, prospective clients evaluating whether to hire or contract Andri. They arrive to judge scope of ability quickly: CV, projects, evidence of real delivery.
- **Peer developers** — arriving from search or Bluesky for a specific blog post, sometimes continuing into who wrote it.

## Product Purpose

A personal site and portfolio for Andri Óskarsson: a home base for writing, a verifiable record of work, and the canonical source for his CV. Success is that a visitor who lands anywhere on the site can establish, without friction, what Andri does and that the record behind it is real.

## Positioning

Three claims a generic dev portfolio could not truthfully copy:

1. **Full-stack plus infrastructure breadth** — websites, apps, infrastructure, and product decisions covered by one person across the whole delivery chain.
2. **A long-running public trail** — blog posts back to 2019 (46 entries), a live GitHub and Bluesky activity feed, `/now`, `/uses`. Working in public, verifiable, not asserted.
3. **The site is itself the demonstration** — generated OG imagery, a PDF CV rendered from structured data, server-rendered and self-hosted. The craft of the artifact is part of the argument.

## Operating Context

- Visitors evaluate in minutes, often from a phone, often arriving mid-site on a blog post rather than the home page.
- Hiring parties frequently need the CV as a file they can forward; `/cv.pdf` is that artifact.
- Posts are shared to Bluesky and other social surfaces, so the generated OG card is the first impression as often as the page is.
- Andri maintains the site himself, continuously; low maintenance cost is a real requirement.

## Capabilities and Constraints

**Capabilities**

- Blog with 46 posts (2019–present), MDX, RSS at `/rss.xml`, Shiki code highlighting.
- Projects collection (8 entries), CV, `/now`, `/uses`, `/contact`, `/activity`.
- Live activity feed aggregating GitHub and Bluesky (`src/lib/activity`), including Bluesky post interactions.
- `/cv.pdf` generated at request time from `src/lib/cv/resume.json` via `@react-pdf/renderer`.
- Per-post OG and social card image generation (takumi, `packages/social-cards`).
- An interactive terminal (`src/lib/terminal-machine.ts`) with an AI-backed prompt. Present and working, but **not** a durable commitment — future work may change or remove it.
- Astro i18n configured for `en`, `da`, `is` with `en` fallback. Configured, not a confirmed product commitment.

**Must keep working**

- `/cv.pdf` generation from `resume.json`.
- The GitHub and Bluesky activity feed as live product surface, not filler.
- Custom per-post OG image generation.

**Constraints**

- Server-rendered and self-hosted: Astro `output: "server"` with the Node middleware adapter, containerized, deployed to with Docker. Must stay SSR and self-hostable.
- Minimal dependencies. Astro + React + Tailwind is the ceiling; adding libraries needs a reason.
- Fast, low-JS pages. Client islands only where interaction demands them.

**Undecided**

- Whether the three locales become a maintained commitment or are dropped to English only.
- Whether the terminal stays.

## Brand Commitments

- Name: Andri Óskarsson. Domain and wordmark: `andri.dk`.
- Current site description: "I make websites, create apps, manage infrastructure, develop products and more."
- Content under `src/content` is CC BY-NC 4.0; the rest is MIT. The repository is public.
- No fixed palette, typeface, or visual system has been declared binding.

## Evidence on Hand

- 46 real blog posts, `src/content/blog/` (2019, 2022, 2024, 2025, 2026).
- 8 real project write-ups, `src/content/project/` (andri.dk, eventpuffin, gastro, karfa, statesman, travian-scrolls, ublproxy, vacation-planner).
- Real CV data, `src/lib/cv/resume.json`.
- Real cover letters, `letters/`.
- Live public identities: GitHub `andrioid`, Bluesky `andri.dk`.

No testimonials, client logos, customer counts, metrics, awards, or pricing exist. Future work must not fabricate any of them.

## Product Principles

1. **Evidence over assertion.** Every claim on the site should be backed by something a visitor can open — a post, a project, a repo, a feed.
2. **Personal first, legible to strangers.** Written for Andri, but a hiring party landing cold must still get oriented fast.
3. **The artifact is the argument.** The site's own craft carries as much weight as its copy.
4. **Cheap to keep alive.** Minimal dependencies, low JS, self-hosted; nothing that rots if left alone for a month.
5. **Nothing invented.** Absent proof stays absent.

## Accessibility & Inclusion

Target WCAG 2.2 AA: contrast, visible focus, full keyboard operability, and honored `prefers-reduced-motion`.
