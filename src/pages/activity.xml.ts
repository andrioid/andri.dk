import rss from "@astrojs/rss";
import { feedChannel } from "../lib/feed";
import { KIND_VERB, getActivity } from "../lib/activity";

/** Same window as the /activity page, so the feed and the page never disagree. */
const LIMIT = 60;

export async function GET() {
	const items = await getActivity({ limit: LIMIT });

	return rss({
		title: "andri.dk | Activity",
		description: "Recent posts, stars, repos, gists and bookmarks.",
		site: import.meta.env.SITE,
		items: items.map((item) => ({
			// Every row's URL is already absolute — own-site ones are keyed on
			// https://andri.dk whatever host serves this — so @astrojs/rss passes it
			// through untouched and the guid stays stable across environments.
			link: item.url,
			// The verb carries what the icon carries in the rendered feed: without it a
			// bare repo name gives a reader no way to tell a star from a new project.
			title: `${KIND_VERB[item.kind]}: ${item.title}`,
			// Absent, not empty: half these rows are a bare starred repo with nothing to say,
			// and `<description></description>` is noise in every reader that shows it.
			description: item.summary,
			pubDate: item.date,
			// Lets a reader filter by act, which is the one axis this feed mixes.
			categories: [item.kind, ...item.tags],
		})),
		...feedChannel("/activity.xml", "/activity/"),
	});
}
