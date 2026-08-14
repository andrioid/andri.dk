import { identities } from "../../../constants";
import type { RemoteKind, SourceRow } from "../types";
import { normalizeUrl } from "../url";

const APPVIEW_URL = "https://bookhive.buzz";
const USER_AGENT = "andri.dk-activity";

/**
 * Only these two statuses are activity. `wantToRead` is a plan, and `abandoned` is the absence
 * of an event — neither belongs in a feed of things I did.
 */
const KIND_BY_STATUS: Record<string, RemoteKind> = {
	"buzz.bookhive.defs#finished": "book-finished",
	"buzz.bookhive.defs#reading": "book-reading",
};

type UserBook = {
	hiveId?: string;
	title?: string;
	/** Tab-separated, per the lexicon. */
	authors?: string;
	status?: string;
	review?: string;
	cover?: string;
	thumbnail?: string;
	startedAt?: string;
	finishedAt?: string;
	createdAt?: string;
};

/**
 * `getProfile` returns the whole library in one call, but `FETCHERS` is keyed by kind, so both
 * book kinds would request it separately. A brief memo collapses that back to one request.
 */
const CACHE_MS = 30_000;
let cached: { at: number; rows: Array<SourceRow> } | undefined;

/**
 * The author line, plus my own review when I wrote one. Deliberately not the book's
 * `description`: that is the publisher blurb, and it arrives with raw HTML in it.
 */
function summaryOf(book: UserBook): string | undefined {
	const authors = book.authors?.split("\t").filter(Boolean).join(", ");
	const review = book.review?.replace(/\s+/g, " ").trim();
	return [authors, review].filter(Boolean).join(" — ") || undefined;
}

async function fetchLibrary(): Promise<Array<SourceRow>> {
	const url = `${APPVIEW_URL}/xrpc/buzz.bookhive.getProfile?did=${identities.blueskyDid}`;
	const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
	if (!res.ok) throw new Error(`bookhive getProfile → ${res.status}`);
	const { books = [] } = (await res.json()) as { books?: Array<UserBook> };

	const rows: Array<SourceRow> = [];
	for (const book of books) {
		const kind = KIND_BY_STATUS[book.status ?? ""];
		const date = book.finishedAt ?? book.startedAt ?? book.createdAt;
		if (!kind || !book.hiveId || !book.title || !date) continue;

		rows.push({
			kind,
			date: new Date(date),
			url: normalizeUrl(`${APPVIEW_URL}/books/${book.hiveId}`),
			title: book.title,
			summary: summaryOf(book),
			source: "bookhive.buzz",
			// `cover` before `thumbnail`: despite the names, `thumbnail` is Goodreads'
			// `_SY75_` list icon — 75px tall, a speck in the feed's 448px frame.
			image: book.cover ?? book.thumbnail,
			tags: [],
		});
	}
	return rows;
}

async function library(): Promise<Array<SourceRow>> {
	if (cached && Date.now() - cached.at < CACHE_MS) return cached.rows;
	const rows = await fetchLibrary();
	cached = { at: Date.now(), rows };
	return rows;
}

/**
 * Split by kind so each keeps its own sync window in the store. A book that changes status
 * keeps its URL, and both kinds share a `KIND_RANK`, so the new state upserts over the old.
 */
export async function fetchFinishedBooks(): Promise<Array<SourceRow>> {
	return (await library()).filter((row) => row.kind === "book-finished");
}

export async function fetchReadingBooks(): Promise<Array<SourceRow>> {
	return (await library()).filter((row) => row.kind === "book-reading");
}
