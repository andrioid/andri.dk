import { identities } from "../../../constants";
import type { SourceRow } from "../types";
import { normalizeUrl } from "../url";

// PDS for did:plc:rrrwbar3wv576qpsymwey5p5, per https://plc.directory/<did>.
// If bookmarks stop appearing, re-resolve the DID document and update this.
const PDS_URL = "https://eurosky.social";
const APPVIEW_URL = "https://public.api.bsky.app";
const BOOKMARK_NSID = "community.lexicon.bookmarks.bookmark";

type BookmarkRecord = {
	value: { subject?: unknown; createdAt: string; tags?: Array<string> };
};

type Facet = {
	features?: Array<{ $type?: string; tag?: string }>;
};

type FeedItem = {
	reason?: unknown;
	post: {
		uri: string;
		record: { createdAt: string; text?: string; facets?: Array<Facet> };
		embed?: { images?: Array<{ thumb?: string }> };
	};
};

/** The record key is the last segment of an at:// URI. */
function rkeyOf(atUri: string): string {
	return atUri.slice(atUri.lastIndexOf("/") + 1);
}

export async function fetchBookmarks(): Promise<Array<SourceRow>> {
	const url = `${PDS_URL}/xrpc/com.atproto.repo.listRecords?repo=${identities.blueskyDid}&collection=${BOOKMARK_NSID}&limit=20`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`atproto listRecords → ${res.status}`);
	const { records } = (await res.json()) as {
		records: Array<BookmarkRecord>;
	};

	const rows: Array<SourceRow> = [];
	for (const { value } of records) {
		// The lexicon also permits an at:// subject; only web links belong in this feed.
		if (
			typeof value.subject !== "string" ||
			!value.subject.startsWith("http")
		) {
			continue;
		}
		let source: string | undefined;
		try {
			source = new URL(value.subject).host;
		} catch {
			source = undefined;
		}
		// title/summary/image are deliberately absent: link_preview supplies them.
		rows.push({
			kind: "bookmark",
			date: new Date(value.createdAt),
			url: normalizeUrl(value.subject),
			source,
			tags: value.tags ?? [],
		});
	}
	return rows;
}

export async function fetchPosts(): Promise<Array<SourceRow>> {
	const url = `${APPVIEW_URL}/xrpc/app.bsky.feed.getAuthorFeed?actor=${identities.blueskyHandle}&limit=20&filter=posts_no_replies`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`bsky getAuthorFeed → ${res.status}`);
	const { feed } = (await res.json()) as { feed: Array<FeedItem> };

	const rows: Array<SourceRow> = [];
	for (const item of feed) {
		if (item.reason) continue; // a reason means this is a repost, not my post
		const { post } = item;
		const text = (post.record.text ?? "").replace(/\s+/g, " ").trim();
		// The post text *is* the entry: storing it as both title and summary would
		// render the same sentence twice. The renderer clamps long text.
		const title = text.length === 0 ? "Post on Bluesky" : text;
		const tags: Array<string> = [];
		for (const facet of post.record.facets ?? []) {
			for (const feature of facet.features ?? []) {
				if (
					feature.$type === "app.bsky.richtext.facet#tag" &&
					feature.tag
				) {
					tags.push(feature.tag);
				}
			}
		}
		rows.push({
			kind: "bluesky",
			date: new Date(post.record.createdAt),
			url: normalizeUrl(
				`https://bsky.app/profile/${identities.blueskyHandle}/post/${rkeyOf(post.uri)}`,
			),
			title,
			summary: undefined,
			source: "bsky.app",
			image: post.embed?.images?.[0]?.thumb,
			tags,
		});
	}
	return rows;
}
