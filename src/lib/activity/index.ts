import { getLiveCollection } from "astro:content";
import { getPosts } from "../cms";
import { KIND_RANK, type ActivityItem, type StoredEntry } from "./types";
import { hrefFor, isExternal, normalizeUrl } from "./url";

export { ACTIVITY_KINDS } from "./types";
export type { ActivityItem, ActivityKind } from "./types";
export { formatEntryDate, groupActivity } from "./time";
export { hrefFor, isExternal };

export type ActivityEntry = ActivityItem & { id: string };

/** Merged activity feed: persisted remote sources + blog posts, deduped, newest first. */
export async function getActivity(opts?: {
	limit?: number;
}): Promise<Array<ActivityEntry>> {
	const { entries = [], error } = await getLiveCollection("activity");
	if (error) console.warn("activity: live collection failed", error);

	// Blog posts are local and always fresh, so they are never written to SQLite.
	const posts = await getPosts();
	const blogEntries: Array<StoredEntry> = posts.map((post) => {
		const url = normalizeUrl(`/blog/${post.id}/`);
		return {
			id: url,
			data: {
				kind: "blog",
				date: post.data.date,
				title: post.data.title,
				url,
				summary: post.data.description,
				source: "andri.dk",
				tags: post.data.tags ?? [],
			},
		};
	});

	// One row per URL: bookmarking or posting about my own post collapses to one entry,
	// showing the higher-precedence kind.
	const merged = new Map<string, StoredEntry>();
	for (const e of [...entries, ...blogEntries]) {
		const prev = merged.get(e.id);
		if (!prev || KIND_RANK[e.data.kind] < KIND_RANK[prev.data.kind]) {
			merged.set(e.id, e);
		}
	}

	const sorted = [...merged.values()].sort(
		(a, b) => b.data.date.getTime() - a.data.date.getTime(),
	);
	const window = opts?.limit ? sorted.slice(0, opts.limit) : sorted;
	return window.map((e) => ({ id: e.id, ...e.data }));
}
