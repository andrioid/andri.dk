import { readItem, readItems } from "@directus/sdk";
import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import MarkdownIt from "markdown-it";
import { IS_DEV } from "../utils/dev";
import { sanitizePost } from "../utils/sanitize";
import { getAssetURL, getDirectusClient } from "./cms";

const parser = new MarkdownIt({
  html: true,
});
/*
parser.use(Shiki, {
	theme: "github-dark",
});
*/

// Get all of the blog posts. Both from content-collection, but also Directus

// TODO: Only fetch the fields we need
export async function getPosts(opts?: {
  limit?: number;
}): Promise<Array<CollectionEntry<"blog">>> {
  const posts = await getCollection("blog");
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
