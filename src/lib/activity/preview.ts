import { lookup } from "node:dns/promises";
import { isIPv4, isIPv6 } from "node:net";
import { getDb } from "./store";
import { MAX_SUMMARY, MAX_TITLE, sanitizeText } from "./text";

/** Previews are refetched at most once a month; page metadata rarely changes. */
export const PREVIEW_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const PREVIEW_TIMEOUT_MS = 2000;
const MAX_HTML_BYTES = 100_000;
/** Redirects are followed by hand so every hop is checked; three is plenty for a preview. */
const MAX_REDIRECTS = 3;
const USER_AGENT = "andri.dk-activity";

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

/**
 * Loopback, private, link-local, CGNAT and reserved IPv4 space. Unparseable input is treated
 * as blocked: a preview is never important enough to fetch an address we could not classify.
 */
function isBlockedIpv4(ip: string): boolean {
	const parts = ip.split(".").map(Number);
	if (parts.length !== 4) return true;
	if (parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255))
		return true;
	const [a, b] = parts as [number, number, number, number];
	if (a === 0 || a === 10 || a === 127) return true;
	if (a === 169 && b === 254) return true; // link-local, incl. cloud metadata
	if (a === 172 && b >= 16 && b <= 31) return true;
	if (a === 192 && (b === 168 || b === 0)) return true;
	if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
	if (a === 198 && (b === 18 || b === 19)) return true; // benchmarking
	if (a >= 224) return true; // multicast and reserved
	return false;
}

/** Unspecified, loopback, unique-local and link-local IPv6, plus IPv4-mapped forms. */
function isBlockedIpv6(ip: string): boolean {
	const v =
		ip
			.toLowerCase()
			.replace(/^\[|\]$/g, "")
			.split("%")[0] ?? "";
	// ::ffff:1.2.3.4 carries a v4 address; judge it as one rather than letting it through.
	const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
	if (mapped?.[1]) return isBlockedIpv4(mapped[1]);
	if (v === "::" || v === "::1") return true;
	const head = v.split(":")[0] ?? "";
	if (/^f[cd]/.test(head)) return true; // fc00::/7 unique-local
	if (/^fe[89ab]/.test(head)) return true; // fe80::/10 link-local
	return false;
}

/**
 * Resolves `hostname` and rejects it when any address is in a blocked range — every address,
 * because a host that answers with one public and one private A record must not be fetched.
 *
 * This closes the redirect-to-internal path, not DNS rebinding: the name is resolved here and
 * again by `fetch`, so a TTL-0 record could differ between the two. Closing that needs
 * connecting to a pinned IP with a manual Host header, which `fetch` cannot express.
 */
async function isPublicHost(hostname: string): Promise<boolean> {
	const host = hostname.replace(/^\[|\]$/g, "");
	if (isIPv4(host)) return !isBlockedIpv4(host);
	if (isIPv6(host)) return !isBlockedIpv6(host);
	try {
		const addresses = await lookup(host, { all: true });
		if (addresses.length === 0) return false;
		return addresses.every(({ address, family }) =>
			family === 6 ? !isBlockedIpv6(address) : !isBlockedIpv4(address),
		);
	} catch {
		return false;
	}
}

/**
 * Fetches `url`, validating scheme and host on every hop. `redirect: "manual"` is what makes
 * the host check meaningful — `follow` would let a public URL bounce to a private address
 * without the guard ever seeing it. Returns undefined when a hop is rejected.
 */
async function guardedFetch(url: string): Promise<Response | undefined> {
	let target = url;
	for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
		const parsed = new URL(target);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
			return undefined;
		}
		if (!(await isPublicHost(parsed.hostname))) return undefined;

		const res = await fetch(target, {
			redirect: "manual",
			signal: AbortSignal.timeout(PREVIEW_TIMEOUT_MS),
			headers: {
				"User-Agent": USER_AGENT,
				Accept: "text/html,application/xhtml+xml",
			},
		});

		const location =
			res.status >= 300 && res.status < 400
				? res.headers.get("location")
				: null;
		if (!location) return res;
		await res.body?.cancel();
		target = new URL(location, target).toString();
	}
	return undefined;
}

/**
 * Reads at most `MAX_HTML_BYTES` and abandons the rest. Buffering the whole body to slice it
 * afterwards would let one oversized or compressed-bomb response exhaust memory, and the
 * metadata we want is in `<head>` anyway.
 */
async function readCapped(res: Response): Promise<string> {
	if (!res.body) return "";
	const reader = res.body.getReader();
	const decoder = new TextDecoder("utf-8");
	let html = "";
	let bytes = 0;
	try {
		while (bytes < MAX_HTML_BYTES) {
			const { done, value } = await reader.read();
			if (done) break;
			bytes += value.byteLength;
			html += decoder.decode(value, { stream: true });
		}
	} finally {
		await reader.cancel().catch(() => undefined);
	}
	return html;
}

export type OpenGraph = {
	title?: string;
	description?: string;
	image?: string;
	/** `og:url` — the page's own canonical address, which may differ from the one requested. */
	canonical?: string;
};

/**
 * Reads the OpenGraph metadata of `url`. Shares the fetch guards and the byte cap with
 * `fetchPreview`. Returns undefined when the page could not be fetched or is not HTML.
 */
export async function readOpenGraph(
	url: string,
): Promise<OpenGraph | undefined> {
	const res = await guardedFetch(url);
	if (!res) return undefined;
	if (!res.ok || !res.headers.get("content-type")?.includes("text/html")) {
		await res.body?.cancel();
		return undefined;
	}

	const html = await readCapped(res);
	return {
		title:
			metaContent(html, "og:title") ??
			metaContent(html, "twitter:title") ??
			clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
		description:
			metaContent(html, "og:description") ??
			metaContent(html, "description"),
		image: metaContent(html, "og:image"),
		canonical: metaContent(html, "og:url"),
	};
}

/**
 * Upserts one `link_preview` row. Exported so sources can cache their own lookups.
 *
 * Sanitized here because everything stored is a stranger's page metadata, and this is the one
 * place it enters the database — the same reasoning as `replaceWindow`.
 */
export function storePreview(
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
			sanitizeText(title, MAX_TITLE) ?? null,
			sanitizeText(description, MAX_SUMMARY) ?? null,
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
		const og = await readOpenGraph(url);
		if (!og) {
			storePreview(url);
			return;
		}

		let image = og.image;
		if (image) {
			try {
				image = new URL(image, url).toString();
			} catch {
				image = undefined;
			}
		}

		storePreview(url, og.title, og.description, image);
	} catch {
		// A dead host, a timeout or unparseable HTML is still a resolved preview attempt:
		// record it so the URL is not refetched on every sync.
		storePreview(url);
	}
}
