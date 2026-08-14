/**
 * One place where a source's HTTP failure becomes an error the sync loop can reason about.
 * The distinction that matters is "try again in a moment" versus "this endpoint has told us
 * how long to wait" — retrying into a closed rate-limit window is how a feed stays broken.
 */
export class RateLimitError extends Error {
	constructor(
		message: string,
		readonly retryAfterMs: number,
	) {
		super(message);
		this.name = "RateLimitError";
	}
}

/** A day, past which we assume a misparsed header rather than an honest instruction. */
const MAX_RETRY_AFTER_MS = 24 * 60 * 60 * 1000;

/**
 * The wait an endpoint asked for, from `Retry-After` (delta-seconds or HTTP date) or GitHub's
 * `X-RateLimit-Reset` (epoch seconds). Undefined when it said nothing usable.
 */
export function retryAfterFrom(res: Response): number | undefined {
	const clamp = (ms: number): number | undefined =>
		Number.isFinite(ms) && ms > 0 && ms <= MAX_RETRY_AFTER_MS
			? Math.ceil(ms)
			: undefined;

	const retryAfter = res.headers.get("retry-after");
	if (retryAfter) {
		const seconds = Number(retryAfter);
		if (Number.isFinite(seconds)) return clamp(seconds * 1000);
		const date = Date.parse(retryAfter);
		if (Number.isFinite(date)) return clamp(date - Date.now());
	}

	// Only meaningful once the budget is actually spent; otherwise reset is just "next hour".
	const remaining = res.headers.get("x-ratelimit-remaining");
	const reset = Number(res.headers.get("x-ratelimit-reset"));
	if (remaining === "0" && Number.isFinite(reset)) {
		return clamp(reset * 1000 - Date.now());
	}
	return undefined;
}

/**
 * Parses a successful JSON response, or throws. A 429, or a 403 carrying an exhausted rate-limit
 * budget — which is how GitHub reports one — becomes a `RateLimitError` with the wait it named.
 */
export async function okJson<T>(res: Response, label: string): Promise<T> {
	if (res.ok) return (await res.json()) as T;

	const wait = retryAfterFrom(res);
	if (wait !== undefined && (res.status === 429 || res.status === 403)) {
		throw new RateLimitError(
			`${label} → ${res.status}, retry in ${Math.round(wait / 1000)}s`,
			wait,
		);
	}
	throw new Error(`${label} → ${res.status}`);
}
