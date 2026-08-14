import { PREVIEW_TTL_MS, fetchPreview } from "./preview";
import {
	type SyncState,
	pruneActivity,
	readSyncState,
	readUrlsNeedingPreview,
	replaceWindow,
	writeSyncState,
} from "./store";
import { fetchBookmarks, fetchPosts } from "./sources/atproto";
import { fetchFinishedBooks, fetchReadingBooks } from "./sources/bookhive";
import { fetchGists, fetchRepos, fetchStars } from "./sources/github";
import { RateLimitError } from "./sources/http";
import { fetchTangledRepos, fetchTangledStars } from "./sources/tangled";
import { REMOTE_KINDS, type RemoteKind, type SourceRow } from "./types";

const SYNC_TTL_MS = 10 * 60 * 1000;
/** First re-attempt after a failure; each consecutive failure doubles it, up to the cap. */
const RETRY_BASE_MS = 60 * 1000;
const RETRY_MAX_MS = 60 * 60 * 1000;
/** Cap on preview fetches per sync so one run cannot fan out unboundedly. */
const PREVIEW_BATCH = 20;

const FETCHERS: Record<RemoteKind, () => Promise<Array<SourceRow>>> = {
	"github-star": fetchStars,
	"github-repo": fetchRepos,
	"github-gist": fetchGists,
	"tangled-star": fetchTangledStars,
	"tangled-repo": fetchTangledRepos,
	"book-finished": fetchFinishedBooks,
	"book-reading": fetchReadingBooks,
	bookmark: fetchBookmarks,
	bluesky: fetchPosts,
};

const inflight = new Map<RemoteKind, Promise<void>>();

/** Fetches one source, persists it, then backfills missing previews. Never rejects. */
export async function syncSource(kind: RemoteKind): Promise<void> {
	const existing = inflight.get(kind);
	if (existing) return existing;

	const job = (async () => {
		try {
			replaceWindow(kind, await FETCHERS[kind]());
			writeSyncState(kind);
		} catch (err) {
			console.warn(`activity: ${kind} sync failed`, err);
			writeSyncState(
				kind,
				err instanceof Error ? err.message : String(err),
				// An endpoint that named its own reset beats any schedule we invent.
				err instanceof RateLimitError
					? new Date(Date.now() + err.retryAfterMs)
					: undefined,
			);
		} finally {
			inflight.delete(kind);
		}

		// Source-agnostic housekeeping, bounded and idempotent: usually zero rows. Kept out
		// of the block above so a preview hiccup never marks a healthy source as failed.
		try {
			pruneActivity();
			const staleBefore = new Date(
				Date.now() - PREVIEW_TTL_MS,
			).toISOString();
			const urls = readUrlsNeedingPreview(PREVIEW_BATCH, staleBefore);
			await Promise.all(urls.map(fetchPreview));
		} catch (err) {
			console.warn("activity: housekeeping failed", err);
		}
	})();

	inflight.set(kind, job);
	return job;
}

/**
 * How long to leave a source alone. A healthy one refreshes on the normal TTL; a failing one
 * backs off exponentially, because the failure that matters most here is an exhausted rate
 * limit. Unauthenticated GitHub allows 60 requests an hour, so three sources retrying every
 * minute is 180 — enough to hold the limit closed indefinitely and never recover.
 */
function waitFor(state: SyncState): number {
	if (!state.error) return SYNC_TTL_MS;
	const backoff = RETRY_BASE_MS * 2 ** Math.max(0, state.failures - 1);
	return Math.min(backoff, RETRY_MAX_MS);
}

function isDue(state: SyncState, now: number): boolean {
	if (state.retryAfter && now < state.retryAfter.getTime()) return false;
	return now - state.attemptedAt.getTime() >= waitFor(state);
}

/**
 * Brings the store up to date. A source that has never synced successfully is awaited so
 * the first request has data; a stale source refreshes in the background so no request pays
 * network latency.
 */
export async function syncActivity(): Promise<void> {
	const now = Date.now();
	const cold: Array<Promise<void>> = [];
	for (const kind of REMOTE_KINDS) {
		const state = readSyncState(kind);
		if (state && !isDue(state, now)) continue;
		const job = syncSource(kind);
		if (!state?.syncedAt) cold.push(job); // never succeeded → this request must wait
	}
	await Promise.all(cold);
}
