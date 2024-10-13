import rss from "@astrojs/rss";
import MarkdownIt from "markdown-it";
import { site } from "../constants";
import { getPosts } from "../lib/cms";
const parser = new MarkdownIt();

export async function GET() {
  const posts = (await getPosts({ limit: 500 })) ?? [];

  return rss({
    // `<title>` field in output xml
    title: site.title,
    // `<description>` field in output xml
    description: site.description ?? "",
    // base URL for RSS <item> links
    // SITE will use "site" from your project's astro.config.
    site: import.meta.env.SITE,
    // list of `<item>`s in output xml
    // simple example: generate items for every md file in /src/pages
    // see "Generating items" section for required frontmatter and advanced use cases
    items: posts.map(({ data: p, ...post }) => ({
      link: `blog/${post.slug}` || "/unknown",
      title: p.title,
      description: p.description ?? "",
      pubDate: p.date,
      content: parser.render(post.body),
    })),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
}
