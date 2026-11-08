import type { APIRoute } from "astro";
import { blogFeed } from "~/lib/blog-feed";
import { isLocale } from "~/lib/i18n";

/** /rss.da.xml and /rss.is.xml. English lives at /rss.xml only. */
export const GET: APIRoute = ({ params }) => {
	const { lang } = params;
	if (!isLocale(lang) || lang === "en") {
		return new Response(null, { status: 404 });
	}
	return blogFeed(lang);
};
