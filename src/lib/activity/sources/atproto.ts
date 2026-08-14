import { identities } from "../../../constants";
import type { SourceRow } from "../types";
import { isWebUrl, normalizeUrl } from "../url";
import { okJson } from "./http";
import { listRecords } from "./pds";

const APPVIEW_URL = "https://public.api.bsky.app";
const BOOKMARK_NSID = "community.lexicon.bookmarks.bookmark";
const POST_NSID = "app.bsky.feed.post";
/** `app.bsky.feed.getPosts` caps its `uris` array at 25. */
const HYDRATE_BATCH = 25;

type BookmarkRecord = {
	subject?: unknown;
	createdAt: string;
	tags?: Array<string>;
};

type Facet = {
	features?: Array<{ $type?: string; tag?: string }>;
};

type MediaView = {
	$type?: string;
	images?: Array<{ thumb?: string }>;
	external?: { thumb?: string };
};

type Embed = MediaView & { media?: MediaView };

type PostView = {
	uri: string;
	author?: { handle?: string };
	record: { createdAt: string; text?: string; facets?: Array<Facet> };
	embed?: Embed;
	likeCount?: number;
	replyCount?: number;
};

type FeedItem = {
	reason?: unknown;
	post: PostView;
};

/** The record key is the last segment of an at:// URI. */
function rkeyOf(atUri: string): string {
	return atUri.slice(atUri.lastIndexOf("/") + 1);
}

/** The collection segment of an at:// URI, i.e. everything between the DID and the rkey. */
function collectionOf(atUri: string): string {
	return atUri.split("/").at(-2) ?? "";
}

/**
 * A post's thumbnail hides in one of three places depending on the embed type. Reading only
 * `images` — as this did — silently drops every link-card and quote-with-media thumbnail.
 */
function thumbOf(
	embed?: MediaView & { media?: MediaView },
): string | undefined {
	if (!embed) return undefined;
	if (embed.$type === "app.bsky.embed.recordWithMedia#view") {
		return thumbOf(embed.media);
	}
	return embed.images?.[0]?.thumb ?? embed.external?.thumb;
}

function tagsOf(post: PostView): Array<string> {
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
	return tags;
}

/** The post text *is* the entry, so it becomes the title; the renderer clamps long text. */
function titleOf(post: PostView): string {
	const text = (post.record.text ?? "").replace(/\s+/g, " ").trim();
	return text.length === 0 ? "Post on Bluesky" : text;
}

function permalinkOf(post: PostView): string {
	// `author.handle` is required on profileViewBasic, so this is always constructible; the
	// DID from the URI is only a fallback for a hand-built PostView.
	const handle = post.author?.handle ?? identities.blueskyHandle;
	return `https://bsky.app/profile/${handle}/post/${rkeyOf(post.uri)}`;
}

async function getPosts(uris: Array<string>): Promise<Array<PostView>> {
	const posts: Array<PostView> = [];
	for (let i = 0; i < uris.length; i += HYDRATE_BATCH) {
		const params = new URLSearchParams();
		for (const uri of uris.slice(i, i + HYDRATE_BATCH)) {
			params.append("uris", uri);
		}
		const res = await fetch(
			`${APPVIEW_URL}/xrpc/app.bsky.feed.getPosts?${params}`,
		);
		const body = await okJson<{ posts?: Array<PostView> }>(
			res,
			"bsky getPosts",
		);
		posts.push(...(body.posts ?? []));
	}
	return posts;
}

export async function fetchBookmarks(): Promise<Array<SourceRow>> {
	const records = await listRecords<BookmarkRecord>(BOOKMARK_NSID);

	const rows: Array<SourceRow> = [];
	// The lexicon types `subject` as a plain URI string, so one collection carries both saved
	// links and saved posts. Posts need the appview to become readable, so collect them first
	// and hydrate in batches rather than one request per bookmark.
	const posts = new Map<string, { date: Date; tags: Array<string> }>();

	for (const { value } of records) {
		if (typeof value.subject !== "string") continue;
		const date = new Date(value.createdAt);
		const tags = value.tags ?? [];

		if (
			value.subject.startsWith("at://") &&
			collectionOf(value.subject) === POST_NSID
		) {
			posts.set(value.subject, { date, tags });
			continue;
		}

		// Anything that is not a web link and not a post has no working href.
		if (!isWebUrl(value.subject)) continue;

		let source: string | undefined;
		try {
			source = new URL(value.subject).host;
		} catch {
			source = undefined;
		}
		// title/summary/image are deliberately absent: link_preview supplies them.
		rows.push({
			kind: "bookmark",
			date,
			url: normalizeUrl(value.subject),
			source,
			tags,
		});
	}

	if (posts.size > 0) {
		for (const post of await getPosts([...posts.keys()])) {
			const saved = posts.get(post.uri);
			if (!saved) continue;
			rows.push({
				kind: "bookmark",
				// The bookmark's own date, not the post's: this row records when I saved it.
				date: saved.date,
				url: normalizeUrl(permalinkOf(post)),
				title: titleOf(post),
				source: "bsky.app",
				image: thumbOf(post.embed),
				likes: post.likeCount,
				replies: post.replyCount,
				tags: saved.tags.length > 0 ? saved.tags : tagsOf(post),
			});
		}
	}

	return rows;
}

export async function fetchPosts(): Promise<Array<SourceRow>> {
	const url = `${APPVIEW_URL}/xrpc/app.bsky.feed.getAuthorFeed?actor=${identities.blueskyHandle}&limit=20&filter=posts_no_replies`;
	const res = await fetch(url);
	const { feed } = await okJson<{ feed: Array<FeedItem> }>(
		res,
		"bsky getAuthorFeed",
	);

	const rows: Array<SourceRow> = [];
	for (const item of feed) {
		if (item.reason) continue; // a reason means this is a repost, not my post
		const { post } = item;
		rows.push({
			kind: "bluesky",
			date: new Date(post.record.createdAt),
			url: normalizeUrl(permalinkOf(post)),
			title: titleOf(post),
			// Storing the text as both title and summary would render it twice.
			summary: undefined,
			source: "bsky.app",
			image: thumbOf(post.embed),
			// Absent stays absent: a missing counter is unknown, not zero.
			likes: post.likeCount,
			replies: post.replyCount,
			tags: tagsOf(post),
		});
	}
	return rows;
}
