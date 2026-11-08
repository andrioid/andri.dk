import rss from "@astrojs/rss";
import MarkdownIt from "markdown-it";
import { site } from "~/constants";
import { getPosts } from "~/lib/cms";
import { feedChannel } from "~/lib/feed";
import type { Locale } from "~/lib/i18n";

const parser = new MarkdownIt();

/** The blog feed for one language: /rss.xml for English, /rss.<lang>.xml otherwise. */
export async function blogFeed(language: Locale): Promise<Response> {
	const latestPosts = (await getPosts({ limit: 30 })) ?? [];
	const posts = latestPosts.filter((p) => p.data.language === language);
	const feedPath = language === "en" ? "/rss.xml" : `/rss.${language}.xml`;

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
		...feedChannel(
			feedPath,
			"/blog/",
			language === "en" ? "en-us" : language,
		),
	});
}
