import { z } from "astro/zod";

/** Kinds fetched from remote APIs and persisted in SQLite. */
export const REMOTE_KINDS = [
	"github-star",
	"github-repo",
	"github-gist",
	"tangled-star",
	"tangled-repo",
	"book-finished",
	"book-reading",
	"bookmark",
	"bluesky",
] as const;

/** All feed kinds. "blog" comes from the build-time `blog` collection, not SQLite. */
export const ACTIVITY_KINDS = ["blog", ...REMOTE_KINDS] as const;

export const activityItemSchema = z.object({
	kind: z.enum(ACTIVITY_KINDS),
	date: z.date(),
	title: z.string(),
	/** Normalized URL — also the row's primary key and the live entry id. */
	url: z.string(),
	/** Plain text: post body, repo/gist description, or link-preview description. */
	summary: z.string().optional(),
	/** Small provenance label, e.g. "github.com" or "zed.dev". */
	source: z.string().optional(),
	tags: z.array(z.string()),
	/** Repo stargazers. */
	stars: z.number().optional(),
	/** Bluesky likes on the post. */
	likes: z.number().optional(),
	/** Bluesky replies to the post. */
	replies: z.number().optional(),
	/** Thumbnail URL: Bluesky image embed or link-preview og:image. */
	image: z.string().optional(),
});

export type RemoteKind = (typeof REMOTE_KINDS)[number];
export type ActivityKind = (typeof ACTIVITY_KINDS)[number];
export type ActivityItem = z.infer<typeof activityItemSchema>;
export type ActivityFilter = { limit?: number; kinds?: Array<ActivityKind> };

/**
 * Collision precedence for one normalized URL — lower wins. Deliberate acts (writing,
 * bookmarking, posting) outrank passive ones (starring), and the winner is stable across
 * syncs rather than whichever source ran last.
 *
 * The UPSERT in `store.ts` also gates on this: it writes only when the incoming rank is at
 * or below the stored one. So kinds that are states of one thing rather than rivals — a book
 * being read and then finished, at one unchanging URL — MUST share a rank, or the later
 * event cannot overwrite the earlier.
 */
export const KIND_RANK: Record<ActivityKind, number> = {
	blog: 0,
	bookmark: 1,
	bluesky: 2,
	"book-finished": 3,
	"book-reading": 3,
	"github-repo": 4,
	"tangled-repo": 5,
	"github-gist": 6,
	"github-star": 7,
	"tangled-star": 8,
};

/**
 * How a kind reads as an act. Shared by the rendered feed and the activity RSS feed, so an
 * entry is named the same way whichever one prints it. Icons stay in the component: they are
 * the part of a kind's presentation XML has no use for.
 */
export const KIND_VERB: Record<ActivityKind, string> = {
	blog: "Wrote",
	"github-star": "Starred",
	"github-repo": "New repo",
	"github-gist": "Gist",
	"tangled-star": "Starred",
	"tangled-repo": "New repo",
	"book-finished": "Finished",
	"book-reading": "Reading",
	bookmark: "Bookmarked",
	bluesky: "Posted",
};

/**
 * What a source knows. `title`, `summary` and `image` may be absent — an atproto bookmark
 * record carries only a URL — and are then supplied by `link_preview` on read.
 */
export type SourceRow = {
	/** Already passed through normalizeUrl(). */
	url: string;
	kind: RemoteKind;
	date: Date;
	title?: string;
	summary?: string;
	source?: string;
	tags: Array<string>;
	stars?: number;
	likes?: number;
	replies?: number;
	image?: string;
};

/** A fully resolved row, ready for the live collection. `id === data.url`. */
export type StoredEntry = { id: string; data: ActivityItem };
