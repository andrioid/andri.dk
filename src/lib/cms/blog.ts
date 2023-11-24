import {
	getCollection,
	type CollectionEntry,
	getEntryBySlug,
} from "astro:content";
import { getAssetURL, getDirectusClient } from "./cms";
import { readItem, readItems } from "@directus/sdk";
import MarkdownIt from "markdown-it";
import { IS_DEV } from "../utils/dev";
import sanitize from "sanitize-html";
import { sanitizePost } from "../utils/sanitize";
import Shiki from "markdown-it-shiki";

const parser = new MarkdownIt({
	html: true,
});
parser.use(Shiki, {
	theme: "github-dark",
});

// Get all of the blog posts. Both from content-collection, but also Directus

// TODO: Only fetch the fields we need
export async function getPosts({
	limit = 10000,
	showDraft = IS_DEV,
}: {
	limit?: number;
	showDraft?: boolean;
}) {
	const ccPosts = (await getCollection("blog")).map(
		translateFromContentSchema,
	);
	const client = getDirectusClient();
	const cmsPosts = (await client.request(readItems("blog"))).map(
		translateFromCMS,
	);

	const allPosts = [...ccPosts, ...cmsPosts]
		.sort((a, b) => b.date.getTime() - a.date.getTime())
		.filter((p) => p.status === "published" || showDraft === true);
	return allPosts.slice(0, limit);
}

export async function getPost(slug: string): Promise<CommonBlogRendered> {
	const client = getDirectusClient();
	const ccItem = await getEntryBySlug("blog", slug);
	if (ccItem) {
		return {
			...translateFromContentSchema(ccItem),
			render: ccItem.render,
		};
	}
	try {
		const cmsItem = await client.request(readItem("blog", slug));
		if (!ccItem && !cmsItem) throw new Error("Page not found");
		console.log("cmsItem", cmsItem);
		return {
			...translateFromCMS(cmsItem),
			// TODO Allow HTML, and sanitize for video/preview tags
			rendered: sanitizePost(parser.render(cmsItem.body)),
		};
	} catch (err) {
		throw new Error("Page not found");
	}
}

export type DirectusBlog = {
	title: string;
	slug: string;
	body: string;
	coverImage?: string;
	date: string;
	description?: string;
	tags?: Array<string>;
	status: "draft" | "published" | "idea";
};

export type CommonBlog = {
	title: string;
	slug: string;
	body: string;
	coverImage?: string;
	status: "draft" | "published" | "idea";
	description?: string;
	tags?: Array<string>;
	date: Date;
};

export type CommonBlogRendered = CommonBlog & {
	rendered?: string;
	render?: CollectionEntry<"blog">["render"];
};

function translateFromContentSchema(post: CollectionEntry<"blog">): CommonBlog {
	return {
		body: post.body,
		date: post.data.date,
		description: post.data.description,
		status: post.data.draft === true ? "draft" : "published",
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
		coverImage: post.coverImage ? getAssetURL(post.coverImage) : undefined,
	};
}
