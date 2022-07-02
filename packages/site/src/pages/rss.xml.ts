import rss from "@astrojs/rss";
import { site } from "../constants";
import { Frontmatter } from "../lib/blog";
import { MarkdownInstance } from "astro";

let allPosts = import.meta.globEager<MarkdownInstance<Frontmatter>>(
	`../content/blog/**/*.md`
);
const posts = Object.values(allPosts)
	.filter(
		(p) => !p.frontmatter.draft || import.meta.env.MODE === "development"
	)
	.sort(
		(a, b) =>
			new Date(b.frontmatter.date).valueOf() -
			new Date(a.frontmatter.date).valueOf()
	);

export const get = () =>
	rss({
		// `<title>` field in output xml
		title: site.title,
		// `<description>` field in output xml
		description: site.description,
		// base URL for RSS <item> links
		// SITE will use "site" from your project's astro.config.
		site: import.meta.env.SITE,
		// list of `<item>`s in output xml
		// simple example: generate items for every md file in /src/pages
		// see "Generating items" section for required frontmatter and advanced use cases
		items: posts.map((post) => ({
			link: `blog/${post.frontmatter.slug}` || "/unknown",
			title: post.frontmatter.title,
			pubDate: new Date(post.frontmatter.date),
		})),
		// (optional) inject custom xml
		customData: `<language>en-us</language>`,
	});
