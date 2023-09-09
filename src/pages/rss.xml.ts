import rss from "@astrojs/rss";
import { site } from "../constants";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html"
import MarkdownIt from "markdown-it"
const parser = new MarkdownIt()

export async function GET() {
	const posts = (await getCollection("blog")).sort(
		(a, b) =>
			b.data.date.valueOf() -
			a.data.date.valueOf()
	);

	return 	rss({
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
			link: `blog/${post.slug}` || "/unknown",
			title: post.data.title,
			pubDate: post.data.date,
			content: sanitizeHtml(parser.render(post.body))

		})),
		// (optional) inject custom xml
		customData: `<language>en-us</language>`,
	});
}
