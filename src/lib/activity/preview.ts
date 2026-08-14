import { getDb } from "./store";

/** Previews are refetched at most once a month; page metadata rarely changes. */
export const PREVIEW_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const PREVIEW_TIMEOUT_MS = 2000;
const MAX_HTML_BYTES = 100_000;
const MAX_TITLE_LENGTH = 140;

const ENTITIES: Record<string, string> = {
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&quot;": '"',
	"&#39;": "'",
	"&#x27;": "'",
	"&nbsp;": " ",
};

/** Decodes the handful of entities that show up in meta tags and collapses whitespace. */
function clean(value: string): string | undefined {
	const text = value
		.replace(
			/&(?:amp|lt|gt|quot|#39|#x27|nbsp);/gi,
			(m) => ENTITIES[m.toLowerCase()] ?? m,
		)
		.replace(/\s+/g, " ")
		.trim();
	return text.length > 0 ? text : undefined;
}

/** Attribute order varies across sites, so match the tag first and its content second. */
function metaContent(html: string, key: string): string | undefined {
	const tag = html.match(
		new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*>`, "i"),
	)?.[0];
	const content = tag?.match(/content=["']([^"']*)["']/i)?.[1];
	return content ? clean(content) : undefined;
}

function store(
	url: string,
	title?: string,
	description?: string,
	image?: string,
): void {
	getDb()
		.prepare(
			`INSERT INTO link_preview (url, title, description, image, fetched_at)
			 VALUES (?, ?, ?, ?, ?)
			 ON CONFLICT(url) DO UPDATE SET title = excluded.title,
			   description = excluded.description, image = excluded.image,
			   fetched_at = excluded.fetched_at`,
		)
		.run(
			url,
			title ?? null,
			description ?? null,
			image ?? null,
			new Date().toISOString(),
		);
}

/**
 * Fetches `url` and stores its title/description/og:image in `link_preview`. Never throws:
 * a failed, non-HTML or metadata-free response is stored as an empty row so it is not
 * retried on every sync.
 */
export async function fetchPreview(url: string): Promise<void> {
	try {
		const res = await fetch(url, {
			redirect: "follow",
			signal: AbortSignal.timeout(PREVIEW_TIMEOUT_MS),
			headers: { "User-Agent": "andri.dk-activity" },
		});
		if (
			!res.ok ||
			!res.headers.get("content-type")?.includes("text/html")
		) {
			store(url);
			return;
		}
		const html = (await res.text()).slice(0, MAX_HTML_BYTES);

		const title =
			metaContent(html, "og:title") ??
			metaContent(html, "twitter:title") ??
			clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
		const description =
			metaContent(html, "og:description") ??
			metaContent(html, "description");

		let image = metaContent(html, "og:image");
		if (image) {
			try {
				image = new URL(image, url).toString();
			} catch {
				image = undefined;
			}
		}

		store(url, title?.slice(0, MAX_TITLE_LENGTH), description, image);
	} catch {
		// A dead host, a timeout or unparseable HTML is still a resolved preview attempt:
		// record it so the URL is not refetched on every sync.
		store(url);
	}
}
