import { getCollection, type CollectionEntry } from "astro:content";
import { getDirectusClient } from "./cms";
import { readItems } from "@directus/sdk";

// Get all of the blog posts. Both from content-collection, but also Directus
export async function getPosts({ limit = 10 }: { limit?: number }) {
	const ccPosts = (await getCollection("blog")).map(
		translateFromContentSchema,
	);
	const client = getDirectusClient();
	const cmsPosts = await (
		await client.request(
			readItems("blog", {
				limit: limit,
			}),
		)
	).map(translateFromCMS);
	console.log("cmsPosts", cmsPosts);

	const allPosts = [...ccPosts, ...cmsPosts].sort(
		(a, b) => b.date.getTime() - a.date.getTime(),
	);
	return allPosts;
}

export async function getPost() {}

export type DirectusBlog = {
	title: string;
	slug: string;
	body: string;
	coverImage?: string;
	date: string;
	draft: boolean;
	description?: string;
	tags?: Array<string>;
};

export type CommonBlog = {
	title: string;
	slug: string;
	body: string;
	coverImage?: string;
	draft: boolean;
	description?: string;
	tags?: Array<string>;
	date: Date;
};

function translateFromContentSchema(post: CollectionEntry<"blog">): CommonBlog {
	return {
		body: post.body,
		date: post.data.date,
		description: post.data.description,
		draft: post.data.draft ?? false,
		slug: post.slug,
		title: post.data.title,
		coverImage: post.data.coverImage,
		tags: post.data.tags,
	};
}

function translateFromCMS(post: DirectusBlog): CommonBlog {
	return {
		...post,
		date: new Date(post.date),
	};
}
