import rss from "@astrojs/rss";
import MarkdownIt from "markdown-it";
import { site } from "../constants";
import { feedChannel } from "../lib/feed";
import { getPosts } from "../lib/cms";
const parser = new MarkdownIt();

export async function GET() {
	const latestPosts = (await getPosts({ limit: 30 })) ?? [];
	const posts = latestPosts.filter((p) => p.data.language == "en");

	return rss({
		title: site.title,
		description: site.description ?? "",
		site: import.meta.env.SITE,
		items: posts.map(({ data: p, ...post }) => ({
			link: `blog/${post.id}`,
			title: p.title,
			description: p.description ?? "",
			pubDate: p.date,
			content: post.body ? parser.render(post.body) : undefined,
		})),
		...feedChannel("/rss.xml", "/blog/"),
	});
}
