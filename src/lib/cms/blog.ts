import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { IS_DEV } from "../utils/dev";

export async function getPosts(opts?: {
	limit?: number;
}): Promise<Array<CollectionEntry<"blog">>> {
	const posts = await getCollection("blog");
	console.log(
		"posts",
		posts.map((p) => p.id),
	);

	const sortedAndFiltered = posts
		// Sort by date
		.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
		// Never show drafts, unless in DEV
		.filter((p) => !p.data.draft || IS_DEV);
	if (opts?.limit) {
		return sortedAndFiltered.slice(0, opts.limit);
	}
	return sortedAndFiltered;
}

export async function getPost(slug: string): Promise<CollectionEntry<"blog">> {
	const ccItem = await getEntry("blog", slug);
	if (!ccItem) throw new Error("Post not found in content collection");
	return ccItem;
}
