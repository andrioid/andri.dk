# Activity feed — engagement counts, Tangled, Bookhive, recency, security

**Status: shipped 2026-08-14.** Everything below is implemented and verified. All ten security
items are fixed, not just the cheap six — see §6. No open work remains in this plan.

Every API claim below was verified live against `did:plc:rrrwbar3wv576qpsymwey5p5` on 2026-08-14.
Anything unverified is marked `[INFERENCE]`.

## 0. Scope

**Settled**

| Item                      | Decision                                                                         |
| ------------------------- | -------------------------------------------------------------------------------- |
| Bluesky likes + replies   | Ship. Already in the response we fetch.                                          |
| `at://` bookmark subjects | Keep — stops a silent discard in a source we already run.                        |
| Tangled stars             | Ship (14 records).                                                               |
| Tangled repos             | Ship (54 records) — but see §4, 52 of them are one bulk import.                  |
| Tangled issues/pulls      | Out. Zero records; add the day one exists.                                       |
| Bookhive                  | Ship as `book-finished` + `book-reading`, equal `KIND_RANK`.                     |
| Saved Bluesky posts       | **Dropped** (§5). Private, verified HTTP 401; the only route is an app password. |
| Store                     | Docker data directory + migration guard. No Fly volume — Fly is no longer used.  |
| Security                  | All ten: 6.1–6.10.                                                               |

**Recency** (§4) — per-kind-per-day cap of 3, plus a 12-month retention prune. An age cutoff alone
was rejected on measured evidence: the two bulk imports are recent, so no single cutoff separates
them from genuine history.

### Found during implementation

Three things the research did not predict:

- **Bookhive's `thumbnail` is not a thumbnail.** It is Goodreads' `_SY75_` list icon — 75px tall,
  2.4 kB — which rendered as an invisible speck in the feed's 448px frame. `cover` is the real
  image (1600×2560). The source prefers `cover` and falls back to `thumbnail`.
- **Zero counters are noise.** `replyCount: 0` rendered as a bare `· 0` beside a filled glyph.
  Only positive counts render now. The store still distinguishes absent from zero; the glyph
  cannot, so the UI does not pretend to.
- **A 10-minute sync TTL hides source changes in dev.** After editing a fetcher, its rows keep
  serving from SQLite until the TTL lapses. Clear the row in `sync_state` to force a resync.

### Verification performed

- Live `/activity`: 60 rows across all 8 kinds; `tangled-star` resolved `cove.town/cove.town` from
  a bare repo DID; Bluesky rows show `· 44 · 5`, matching the appview's `likeCount`/`replyCount`.
- Per-day cap: 47 `tangled-repo` rows dated 2026-07-05 collapse to **3** visible, in SQLite and in
  the rendered page. Whole table 147 raw → 78 visible.
- SSRF guard: loopback by name and by IP, `169.254.169.254`, `10/8`, `192.168/16`, IPv6 `::1` and
  `file://` all rejected in 0–6 ms with no connection attempted; public reads and a real 301 chain
  (`tangled.sh` → `tangled.org`) still succeed.
- Byte cap: a 1.8M-character page still yields its title, so the head is read and the rest dropped.
- `at://` bookmarks: exercised with a stubbed `listRecords` and the real appview — a post subject
  becomes a `bookmark` row carrying the bookmark's own date, and `httpfoo://`, `javascript:` and a
  non-post at-URI are all skipped.
- `tsc --noEmit` clean, `oxlint src/` clean (remaining warnings predate this work), `astro build`
  clean. `astro check` is not available — `@astrojs/check` is not installed and was not added.

---

## 1. Bluesky engagement counts

No extra request, no extra rate-limit cost. `app.bsky.feed.getAuthorFeed` returns `feed[].post` as
`app.bsky.feed.defs#postView`, carrying `likeCount`, `replyCount`, `repostCount`, `quoteCount`,
`bookmarkCount` — all `integer`, all **optional** (`required` is only `uri`, `cid`, `author`,
`record`, `indexedAt`).

Live, unauthenticated, `actor=andri.dk`: real values (`likeCount=44 replyCount=5 repostCount=2
quoteCount=1`), not zeros. Edge-cached `max-age=30`, so counters lag ≤30 s.

**Likes and replies only.** Four numbers on one metadata line is noise.

### Changes

- `types.ts` — `likes?: number`, `replies?: number` on `activityItemSchema` and `SourceRow`. Keep
  `stars` as-is; do **not** generalise into a `metrics` object. Three nullable integer columns are
  simpler to read and query than a JSON blob, and the renderer needs per-counter glyphs anyway.
- `store.ts` — two columns, plus the `SELECT`/`UPSERT` lists and `rowToEntry`.
- `sources/atproto.ts` — read `post.likeCount` / `post.replyCount`. Absent stays absent, never `0`:
  a missing counter means "unknown", and `0 likes` on every old post is worse than nothing.
- `activity-item.astro` — extend the existing `·`-separated meta line.

### Design constraint

`DESIGN.md` reserves Star Amber for "GitHub star glyphs, and nothing else", and states "the only
filled glyph in the feed is the amber star beside a star count — filled means 'a number follows'".
So: **filled** heart and reply glyphs, in the tone's existing `meta` colour, never amber. Honours
both rules, introduces no colour.

### `at://` bookmark subjects

`fetchBookmarks` drops anything failing `startsWith("http")`, so a bookmark whose subject is a post
URI is **silently discarded**. That is a fail-closed bug in the bookmark source, independent of the
dropped saved-posts feature. `community.lexicon.bookmarks.bookmark` defines `subject` as a plain
`{"type": "string", "format": "uri"}` — the `uri` format admits `at://` as readily as `https://`.

Hydration is verified and unauthenticated:

```
GET https://public.api.bsky.app/xrpc/app.bsky.feed.getPosts?uris=<at-uri>&uris=<at-uri>
```

- `uris` is a **repeated** array param, `maxLength: 25` — batch in chunks of 25.
- `postView.author` is `profileViewBasic`, whose `required` includes `handle`, so
  `https://bsky.app/profile/<handle>/post/<rkey>` is always constructible.
- Reuse the `bluesky` row shape plus the counters above.

Changes nothing today (all 100 current records are `https://`); the day such a bookmark exists, it
renders instead of vanishing.

### Also worth fixing while in this file

We only read `embed.images[0].thumb`. Verified missing cases:

- `app.bsky.embed.external#view` → thumbnail is `embed.external.thumb`, a **single string**, not an
  array. Link-card posts currently show no image at all.
- `app.bsky.embed.recordWithMedia#view` → media is nested one level deeper at `embed.media.images[]`
  / `embed.media.external`.

Switch on `embed.$type` instead of reaching for `.images`.

---

## 2. Tangled

`sh.tangled.*` records live in **my own PDS**, readable unauthenticated via
`com.atproto.repo.listRecords` — same mechanism as the existing bookmark source. No new trust
boundary, no new credential.

**There is no public Tangled appview API.** Every read query defined in `tangled.org/core`
(`sh.tangled.repo.getRepoByRepoDid`, `listRepos`, `actor.getProfile`) returns HTTP 404 with the
site's HTML page. The appview is server-rendered HTML only. Knots don't serve `com.atproto.repo.*`
either (`knot.cove.town/xrpc/…` → 404).

### What's in the repo today

| Collection                           | Count | Verdict                                                                                                       |
| ------------------------------------ | ----- | ------------------------------------------------------------------------------------------------------------- |
| `sh.tangled.feed.star`               | 14    | **Ship.** Spread over 2026-03 → 2026-08 — genuine ongoing activity.                                           |
| `sh.tangled.repo`                    | 54    | **Ship**, subject to §4. 49 created on 2026-07-05, 3 more on 07-06, 1 on 07-11 — a bulk import, not activity. |
| `sh.tangled.repo.issue` / `.pull`    | 0 / 0 | Out by decision.                                                                                              |
| `sh.tangled.string`                  | 2     | Drop — no discoverable public permalink (every candidate URL form 404s).                                      |
| `sh.tangled.feed.reaction`           | 2     | Drop. A 👍 on someone's issue is not activity worth publishing.                                               |
| `sh.tangled.graph.follow` / `.vouch` | 9 / — | Drop. Follows are noise in a work feed.                                                                       |

### Repo rows

`sh.tangled.repo` carries `name`, `description` (≤140 graphemes), `knot`, `topics`, `website`,
`repoDid`, `createdAt`. Only `knot` and `createdAt` are required by the lexicon, though every record
observed has a `name`.

- `url` = `https://tangled.org/<myHandle>/<name>` — verified 200 for `tangled.org/andri.dk/andri.dk`.
- `title` = `andri.dk/<name>` (matches the `og:title` convention Tangled itself uses).
- `summary` = `description`.

53 of 54 descriptions read `[READ-ONLY] Mirror of https://github.com/andrioid/…`, so most rows
duplicate repos already in the feed from GitHub, at a different URL — URL-keyed dedupe will not
collapse them. §4 is what keeps that from dominating the feed. Note the duplication is _within_
Tangled too: `andri.dk` has three separate repo records.

### The starred-repo permalink problem, and the fix

`sh.tangled.feed.star.subject` is `{$type: "…#repo", did: <repoDid>}` — **a DID only**. No name, no
owner. `plc.directory` resolves a `repoDid` to its knot's service endpoint, never to owner or name.
There is no verified API path from `repoDid` to `{handle}/{repoName}`.

But `https://tangled.org/<repoDid>` **does** resolve and serves the repo page. Verified:

```
https://tangled.org/did:plc:o7poqxnnxrwzbvreb7m4fa3o
  <title>cove.town/cove.town at main · Tangled</title>
  og:title       cove.town/cove.town
  og:url         https://tangled.org/cove.town/cove.town
  og:description Self-contained atproto self-hosting setup with PDS, knot, spindle, and hold
```

One fetch per newly-starred repo yields title, description **and** the canonical permalink.

**Do this at sync time in the Tangled source, not via `link_preview`.** Two reasons: the row should
be keyed on the canonical `og:url` rather than the DID URL, and `link_preview` would also adopt
`og:image` — a 1200×630 Tangled OpenGraph card — turning every Tangled star into a full-width banner.
Export the existing `metaContent`/`clean` helpers from `preview.ts` as a small `readOpenGraph(url)`
and call it from the Tangled fetcher. No new dependency, no second convention.

Fallback when the fetch fails: keep `https://tangled.org/<repoDid>` as the URL and let `titleFromUrl`
degrade. The row is ugly but present, and it self-heals on the next sync.

`[INFERENCE]` This depends on Tangled's OG tags, which is scraping, not a contract. It is the only
option available, and the fallback is graceful. This is the one fragile piece of the plan.

### New kinds

`tangled-star` and `tangled-repo`. `KIND_META` is a closed `Record<ActivityKind, …>`, so each is a
compile error until it has an icon and a verb — keep that property. Tabler has no Tangled brand
glyph; `tabler:git-branch` fits both.

---

## 3. Bookhive

`buzz.bookhive.book` is in my PDS (19 records), but prefer the appview:

```
GET https://bookhive.buzz/xrpc/buzz.bookhive.getProfile?did=<did>   → 200, unauthenticated
```

Lexicon says "Does not require authentication"; the router registers it with no `auth` key. Returns
`{profile, books[], activity[], friendActivity[]}`.

**Use `books[]`, not `activity[]`.** `activity[]` carries only `{type, createdAt, hiveId, title,
userDid, userHandle}`. `books[]` adds `authors`, `cover`, `thumbnail`, `status`, `stars`, `review`,
`finishedAt`, `startedAt`, `genres` — everything a row needs, in one call.

Row mapping:

- `url` = `https://bookhive.buzz/books/<hiveId>` (verified against the `/books/:hiveId` route)
- `kind` = `book-finished` | `book-reading`, from `status`. Skip `wantToRead` and `abandoned`.
- `date` = `finishedAt ?? startedAt ?? createdAt`
- `title` = `title`
- `summary` = `authors`, plus my `review` when present. **Not** `description` — that is the
  publisher blurb and it contains raw HTML (verified: `<b>`, `<br />`). Astro escapes it, so it is
  not an XSS vector, but it would render literal tags. Cheaper to not use it.
- `image` = `thumbnail`
- `stars` — leave unset. `books[].rating` is the _Goodreads community_ average (`4530`), not mine;
  publishing it as my rating would be a fabrication. My own `stars` is `null` on all 19 records, and
  it is a 1–10 scale the lexicon says maps to 1–5 for display. Wire it if I start rating books.

### Equal rank, and why

The primary key is the normalized URL, and a book's URL never changes. So `book-reading` must be able
to upsert into `book-finished` when I finish it. `UPSERT_ACTIVITY` gates on
`excluded.kind_rank <= activity.kind_rank`, so **both kinds need the same `KIND_RANK`** and the
transition works with zero new machinery. Worth a comment in `KIND_RANK` — it is a non-obvious
coupling to the UPSERT guard.

Today there are 19 `#finished` and 0 `#reading`, so `book-reading` ships untested against real data.

`genres` → `tags` is tempting (8 per book) but pointless: `activity-item.astro` renders tags only
when `tone === "light"`, and all three mount points use `dark`.

### Cover aspect ratio

Covers are portrait (~2:3); the feed thumbnail frame is `aspect-16/9 object-contain`. They will
letterbox with wide margins. `DESIGN.md` declares the 16:9 frame, so **accept the letterboxing**
rather than add a second thumbnail shape for one source.

---

## 4. Feed recency and flood control

Now that the store persists (§6.5), history accumulates for real and this stops being cosmetic.

### The measured problem

Two sources are bulk imports, not activity:

| Source                                 | Distribution                                                        |
| -------------------------------------- | ------------------------------------------------------------------- |
| `sh.tangled.repo`                      | **49 on 2026-07-05**, 3 on 07-06, 1 on 07-11, 1 on 2026-05-02       |
| `buzz.bookhive.book`                   | **18 in 2026-06**, 1 in 2025-12                                     |
| `sh.tangled.feed.star`                 | 1 · 2 · 6 · 3 · 2 across 2026-03 → 08 — genuine                     |
| `community.lexicon.bookmarks.bookmark` | 18 · 55 · 27 across 2026-06 → 08 — genuine, and the dominant source |
| `github-star` / `github-repo`          | Not measured — GitHub rate-limited me mid-measurement (see §6.4)    |

### An age cutoff alone does not work

The floods are recent. 2026-07-05 is 40 days ago, so any cutoff generous enough to keep three months
of bookmarks also keeps all 49 mirror repos. To cut the flood you need ≈30 days — which also deletes
15 of 19 books and two thirds of the bookmark history, leaving `/activity` (limit 60) with maybe 40
rows. Age and flooding are different problems and one lever cannot serve both.

### Recommendation: per-kind-per-day cap, plus retention

**Read-time cap** — no one source may dominate one date group:

```sql
WITH ranked AS (
  SELECT …, ROW_NUMBER() OVER (PARTITION BY kind, date(date) ORDER BY date DESC) AS rn
  FROM activity a LEFT JOIN link_preview p ON p.url = a.url
)
SELECT … FROM ranked WHERE rn <= 3 ORDER BY date DESC LIMIT ?
```

Verified on the project's own runtime (node 24.19.0, SQLite 3.53.3) against a simulation of the real
distribution: **84 rows → 38**, the 49-repo day collapses to 3, and stars and bookmarks are untouched.
One CTE in `SELECT_ACTIVITY`, no new tables, no new concepts. It also fixes the Bookhive backfill for
free, which an age cutoff tuned for Tangled would not.

**Write-time retention** — prune rows older than 12 months during sync, purely to bound growth.
Generous enough to be invisible; the cap is what shapes the feed.

This reads as one rule: _the feed shows what I did recently, and no single source may drown a day._

---

## 5. Saved Bluesky posts — dropped

**Verified blocked without credentials.** Bluesky's native save is private and server-side:

- `app.bsky.bookmark.createBookmark` — _"Creates a **private** bookmark… Requires authentication."_
- `app.bsky.bookmark.getBookmarks` — _"…bookmarked by the authenticated user. **Requires authentication.**"_
- No `app.bsky.bookmark.bookmark` record lexicon exists. Nothing reaches the public repo.
- `describeRepo` on my DID: no `app.bsky.bookmark*` collection among 40.
- `getBookmarks` unauthenticated → **HTTP 401** `{"error":"AuthMissing"}`, on both
  `public.api.bsky.app` and `eurosky.social`.

Dropped because the only route is an app password in the container, and an app password can post as
me and — with the chat scope — read DMs. That would be the highest-value secret in a deployment that
also performs SSRF-prone outbound fetches on my behalf (§6.1). Poor trade for a feed of things I
chose to make public.

If it returns, the cheap route is a client that writes `community.lexicon.bookmarks.bookmark`
instead — which §1 now supports.

---

## 6. Security review

**All ten fixed.** The first pass took 6.1, 6.2, 6.3, 6.5, 6.7 and 6.9; a second pass took the
four that had been deferred (6.4, 6.6, 6.8, 6.10) plus a migration bug the first pass introduced,
recorded as 6.11.

### 6.1 SSRF via link preview — _medium_ — IN SCOPE

`preview.ts` fetches an arbitrary URL from a bookmark record with `redirect: "follow"`, no host or IP
validation, then writes that response's `<title>`, `og:description` and `og:image` into a **public**
page.

A bookmarked URL that redirects to `http://169.254.169.254/…` (cloud metadata), a private-network
address, or `http://localhost:3000/` gets its response metadata published on andri.dk. `follow` means
the hostile hop need not be the URL I saw.

The trust boundary is my own PDS, so this needs me to bookmark a hostile link — but a bookmark is by
definition a link I don't control, often from someone I don't know. Thin protection.

Fix: allow only `http:`/`https:`; resolve the host and reject loopback, link-local, private, CGNAT
and unique-local ranges; use `redirect: "manual"` and re-validate every hop, with a hard hop cap.

### 6.2 Unbounded response body → OOM — _medium_ — IN SCOPE

```ts
const html = (await res.text()).slice(0, MAX_HTML_BYTES);
```

The cap is applied **after** the whole body is buffered. A multi-hundred-megabyte response, or a
modest gzip bomb, is a single-request kill. `AbortSignal.timeout(2000)` bounds time, not bytes, and
gigabits arrive inside two seconds.

Fix: reject an oversized `Content-Length`, then stream and abort once 100 kB have arrived. Same cap,
enforced where it means something.

### 6.3 `isExternal` is a prefix match — _low-medium, confirmed_ — IN SCOPE

```
isExternal("https://andri.dk.evil.com/pwn")  → false
hrefFor   ("https://andri.dk.evil.com/pwn")  → ".evil.com/pwn/"
```

Any `andri.dk.*` or `andri.dkfoo.*` host is classified as own-site. Result: a broken relative link,
and — because `target`/`rel` are gated on `isExternal` — the row silently loses
`rel="noopener noreferrer"`. Not XSS, but a correctness bug in the security-relevant branch.

Fix: `new URL(url).origin === SITE_ORIGIN`, inside the existing try/catch.

### 6.4 Retry storm against rate-limited APIs — _medium, operational_ — FIXED

`RETRY_TTL_MS = 60_000` on failure, no backoff, no `Retry-After` handling. Unauthenticated GitHub
allows 60 requests/hour/IP; three GitHub sources retrying every 60 s is 180/hour — so the first 403
keeps the feed **permanently** rate-limited, self-sustaining rather than self-healing.

Not theoretical: GitHub rate-limited _this research session_ from a handful of manual calls
(`API rate limit exceeded for 87.104.249.212`). Adding Tangled and Bookhive raises steady-state
volume.

Fix: exponential backoff with a ceiling, and honour `Retry-After` / `X-RateLimit-Reset`.

### 6.5 Store is ephemeral and has no migration path — _medium, correctness_ — IN SCOPE

Two problems in one place.

`DB_PATH` defaults to `./.cache/activity.sqlite`, and `.cache/` is gitignored with nothing mounted
over it. So `replaceWindow`'s documented promise — _"Rows older than that boundary survive, so items
that aged out of the API window remain as history"_ — is **false in production**. Every restart
truncates the feed to whatever the current 20-item API windows hold, and makes the next request pay a
cold, fully-awaited sync of every source.

Separately, `SCHEMA` is all `CREATE TABLE IF NOT EXISTS`, so **adding a column does nothing to an
existing database**. §1 adds two. Today that is masked by the store being wiped on every restart; the
moment it persists, it is a live bug.

Fix:

- A `data/` directory as the mount point: `ENV ACTIVITY_DB_PATH=/app/data/activity.sqlite`, the
  directory created and `chown app:app` in the Dockerfile (it already runs as uid 1000), declared
  `VOLUME /app/data`, and `data/` added to `.gitignore` and `.dockerignore`.
- `PRAGMA user_version` with a destructive rebuild of `activity` on mismatch. It is a cache —
  rebuilding from the APIs is the design, so a destructive migration is the honest one. About six
  lines.
- `fly.toml` is now stale (Fly is no longer used) but nothing here depends on it. Left alone.

### 6.6 Third-party image hotlinking leaks visitor data — _low, privacy_ — FIXED

CSP allows `img-src https:` and `item.image` comes straight from a third-party `og:image`. Every
visitor's IP and User-Agent goes to whichever host a bookmarked page nominated. Bookhive adds
`i.gr-assets.com` (Amazon/Goodreads), so my reading habits become Amazon's telemetry about my readers.

Fix: `referrerpolicy="no-referrer"` on feed `<img>`; validate the stored URL is http(s) before
rendering. Proxying would close it properly, but that is a caching subsystem.

### 6.7 Weak scheme validation at ingest — _low_ — IN SCOPE

`fetchBookmarks` gates on `subject.startsWith("http")`, which admits `httpfoo://weird`.
`normalizeUrl` returns unparseable input **unchanged**, so that string reaches `href`. Not an XSS
vector, but it produces dead links. Validate `new URL(subject).protocol` at ingest and drop the row
otherwise. More important now: §1 makes `at://` a legitimate third case, so the check has to
distinguish three outcomes rather than two.

### 6.8 Third-party text enters the feed unbounded — _low_ — FIXED

Today: GitHub descriptions of repos I star. With Tangled: other people's repo descriptions. With
Bookhive: Goodreads blurbs containing raw HTML. Astro escapes all of it, so no XSS — but nothing caps
length or strips control characters, and a bidi override (U+202E) in a repo description can visually
reverse adjacent text.

Fix: run every third-party `title`/`summary` through the existing `clean()`, extended to strip C0/C1
controls and bidi overrides, with a length cap.

### 6.9 Full-table read per island render — _low, perf_ — IN SCOPE

`getActivity` calls `getLiveCollection("activity")` with **no filter**, so every render reads every
row, sorts in JS, then slices; `limit` is applied after all that work. The homepage mounts two
islands, so one homepage view is two full scans. Bookmarks alone are already 100+ rows and this plan
adds three sources.

Fix: pass `limit` through to the loader's filter — `readActivity` already supports it and
`loadCollection` already forwards it. A one-line plumbing gap.

### 6.10 Build secret persisted into a derived image — _low_ — FIXED

`Dockerfile` took `MODEL_BOX_API_KEY` as a build `ARG` and promoted it to `ENV` in the `build`
stage; `server-build` is `FROM build`, so that stage inherited the secret in its environment,
readable via `docker inspect`. The default `server` stage is `FROM dependencies` and never did.

Fixed by passing it per-command — `RUN MODEL_BOX_API_KEY=$MODEL_BOX_API_KEY npm run build` — so it
never enters any image's config. Residual, and not closed by this: an `ARG` value is still recorded
in build history for the stage that declares it. Closing that needs a BuildKit secret mount, which
changes how CI invokes the build.

### 6.11 Version and shape could disagree — _medium, introduced by 6.5_ — FIXED

The first pass wrote `PRAGMA user_version` and `CREATE TABLE IF NOT EXISTS` as separate statements.
They can diverge: a crash between them, or a second connection running older code — which is
exactly what a dev-server hot reload produces — leaves the version asserting a shape the tables do
not have. Observed live: `user_version = 2` against a `sync_state` still carrying the v1 columns,
which made `readSyncState` throw `no such column: failures` on every read. The live collection
swallowed the error and `/activity` rendered blog posts only.

Fixed two ways: the whole migration now runs in one transaction, and the rebuild triggers on a
column-shape check as well as the version, so a stale table is repaired whatever the version claims.
Verified by seeding the exact drift and reopening: both tables rebuilt, `link_preview` preserved,
second open a no-op.

---

## 7. Sequencing

1. **6.5 first** — the data directory and migration guard must land before any column is added.
2. **The rest of the cheap six** — 6.3, 6.7, 6.9, then 6.1 and 6.2 together (both in `preview.ts`,
   which §2 is about to give a second caller).
3. **Bluesky counters, embeds, `at://` subjects** (§1). One source file, one schema change, one
   renderer change.
4. **§4 recency** — before Tangled repos land, so the flood never reaches a page.
5. **Tangled** (§2) — `readOpenGraph`, then stars, then repos.
6. **Bookhive** (§3) — one fetcher, one appview call.

Verification at each step: `npm run check`, then load `/activity` and confirm real rows for the new
kind. The feed is a live server island, so the page itself is the smoke test. §4 gets an explicit
check: the 2026-07-05 group must show 3 Tangled repo rows, not 49.
