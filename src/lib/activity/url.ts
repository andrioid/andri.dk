/** Own origin, hardcoded so persisted keys are identical in dev and production. */
const SITE_ORIGIN = "https://andri.dk";

const TRACKING_PARAMS: Record<string, true> = {
	utm_source: true,
	utm_medium: true,
	utm_campaign: true,
	utm_term: true,
	utm_content: true,
	fbclid: true,
	gclid: true,
	mc_cid: true,
	mc_eid: true,
	ref_src: true,
	igshid: true,
};

/**
 * Canonical key for a feed item. Resolves site-relative paths against SITE_ORIGIN,
 * lowercases the host, drops a leading "www.", the fragment and known tracking params,
 * sorts remaining query params, and strips trailing slashes. Non-http(s) or unparseable
 * input is returned unchanged.
 */
export function normalizeUrl(raw: string): string {
	try {
		const u = raw.startsWith("/")
			? new URL(raw, SITE_ORIGIN)
			: new URL(raw);
		if (u.protocol !== "http:" && u.protocol !== "https:") return raw;
		u.hash = "";
		// Snapshot the keys: deleting while iterating searchParams skips entries.
		for (const key of Array.from(u.searchParams.keys())) {
			if (TRACKING_PARAMS[key.toLowerCase()]) u.searchParams.delete(key);
		}
		u.searchParams.sort();
		const host = u.host.toLowerCase().replace(/^www\./, "");
		let path = u.pathname.replace(/\/+$/, "");
		if (path === "" && u.search) path = "/";
		return `${u.protocol}//${host}${path}${u.search}`;
	} catch {
		return raw;
	}
}

/**
 * True when the URL points somewhere other than this site. Compares the parsed origin, not a
 * string prefix: `https://andri.dk.evil.com/` shares our prefix but not our origin, and
 * treating it as own-site would emit it as a relative href and strip `rel="noopener"`.
 */
export function isExternal(url: string): boolean {
	try {
		return new URL(url).origin !== SITE_ORIGIN;
	} catch {
		return true;
	}
}

/**
 * True for an http(s) URL. `normalizeUrl` passes anything it cannot parse straight through,
 * so sources check this before a value becomes a row: a non-web scheme has no working href.
 */
export function isWebUrl(raw: string): boolean {
	try {
		const { protocol } = new URL(raw);
		return protocol === "http:" || protocol === "https:";
	} catch {
		return false;
	}
}

/** Render href: own-site URLs collapse to a trailing-slash path so they route internally. */
export function hrefFor(url: string): string {
	if (isExternal(url)) return url;
	const path = url.slice(SITE_ORIGIN.length);
	return path === "" ? "/" : `${path}/`;
}

/**
 * Last-resort title from a URL: last path segment, percent-decoded, file extension and
 * separators stripped, first letter upper-cased; hostname when there is no path.
 */
export function titleFromUrl(url: string): string {
	let segment: string | undefined;
	try {
		segment = new URL(url).pathname.split("/").filter(Boolean).pop();
	} catch {
		segment = url.split("/").filter(Boolean).pop();
	}

	if (segment) {
		let text = segment;
		try {
			text = decodeURIComponent(segment);
		} catch {
			// Malformed percent-escapes: keep the raw segment.
		}
		text = text
			.replace(/\.[a-z0-9]{1,5}$/i, "")
			.replace(/[-_]+/g, " ")
			.replace(/\s+/g, " ")
			.trim();
		if (text) return text.charAt(0).toUpperCase() + text.slice(1);
	}

	try {
		return new URL(url).host;
	} catch {
		return url;
	}
}
