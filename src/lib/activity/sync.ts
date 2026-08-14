import { PREVIEW_TTL_MS, fetchPreview } from "./preview";
import {
	readSyncState,
	readUrlsNeedingPreview,
	replaceWindow,
	writeSyncState,
} from "./store";
import { fetchBookmarks, fetchPosts } from "./sources/atproto";
import { fetchGists, fetchRepos, fetchStars } from "./sources/github";
import { REMOTE_KINDS, type RemoteKind, type SourceRow } from "./types";

const SYNC_TTL_MS = 10 * 60 * 1000;
/** Shorter re-attempt window after a failure so a transient outage self-heals fast. */
const RETRY_TTL_MS = 60 * 1000;
/** Cap on preview fetches per sync so one run cannot fan out unboundedly. */
const PREVIEW_BATCH = 20;

const FETCHERS: Record<RemoteKind, () => Promise<Array<SourceRow>>> = {
	"github-star": fetchStars,
	"github-repo": fetchRepos,
	"github-gist": fetchGists,
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
			);
		} finally {
			inflight.delete(kind);
		}

		// Source-agnostic, bounded and idempotent: usually zero rows. Kept out of the
		// block above so a preview hiccup never marks a healthy source as failed.
		try {
			const staleBefore = new Date(
				Date.now() - PREVIEW_TTL_MS,
			).toISOString();
			const urls = readUrlsNeedingPreview(PREVIEW_BATCH, staleBefore);
			await Promise.all(urls.map(fetchPreview));
		} catch (err) {
			console.warn("activity: preview backfill failed", err);
		}
	})();

	inflight.set(kind, job);
	return job;
}

/**
 * Brings the store up to date. A source that has never synced successfully is awaited so
 * the first request has data; a stale source refreshes in the background so no request pays
 * network latency.
 */
export async function syncActivity(): Promise<void> {
	const cold: Array<Promise<void>> = [];
	for (const kind of REMOTE_KINDS) {
		const state = readSyncState(kind);
		const staleAfter = state?.error ? RETRY_TTL_MS : SYNC_TTL_MS;
		if (state && Date.now() - state.attemptedAt.getTime() < staleAfter)
			continue;
		const job = syncSource(kind);
		if (!state?.syncedAt) cold.push(job); // never succeeded → this request must wait
	}
	await Promise.all(cold);
}
