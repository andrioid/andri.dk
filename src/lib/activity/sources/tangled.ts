import { identities } from "../../../constants";
import { PREVIEW_TTL_MS, readOpenGraph, storePreview } from "../preview";
import { readPreview } from "../store";
import type { SourceRow } from "../types";
import { normalizeUrl, titleFromUrl } from "../url";
import { listRecords } from "./pds";

const APPVIEW_URL = "https://tangled.org";
const REPO_NSID = "sh.tangled.repo";
const STAR_NSID = "sh.tangled.feed.star";

type RepoRecord = {
	name?: string;
	description?: string;
	createdAt: string;
};

type StarRecord = {
	subject?: { $type?: string; did?: string; uri?: string };
	createdAt: string;
};

type ResolvedRepo = { url: string; title?: string; summary?: string };

/**
 * `og:title` on a Tangled repo page is `owner/name`, which is also its canonical path — so the
 * label and the permalink are the same fact, and only one needs storing.
 */
function slugUrl(title: string | undefined): string | undefined {
	const slug = title?.trim();
	return slug && /^[^/\s]+\/[^/\s]+$/.test(slug)
		? `${APPVIEW_URL}/${slug}`
		: undefined;
}

/**
 * A star record names only the repo's own DID — no owner, no name — and no public API maps one
 * to the other (`plc.directory` yields the knot, and Tangled serves no read XRPC). But
 * `tangled.org/<repoDid>` does render the repo page, so its OpenGraph tags supply both.
 *
 * Resolutions are cached in `link_preview`, keyed on the DID URL and on the same monthly TTL
 * as every other preview. The `og:image` is deliberately dropped: it is a 1200x630 social card
 * that would render as a full-width banner on a one-line feed row.
 */
async function resolveRepo(repoDid: string): Promise<ResolvedRepo> {
	const didUrl = `${APPVIEW_URL}/${repoDid}`;
	const staleBefore = new Date(Date.now() - PREVIEW_TTL_MS).toISOString();

	const cached = readPreview(didUrl, staleBefore);
	if (cached) {
		return {
			url: slugUrl(cached.title) ?? didUrl,
			title: cached.title,
			summary: cached.description,
		};
	}

	const og = await readOpenGraph(didUrl);
	// Stored even when empty, so an unreachable repo is not refetched on every sync.
	storePreview(didUrl, og?.title, og?.description);
	return {
		url: slugUrl(og?.title) ?? og?.canonical ?? didUrl,
		title: og?.title,
		summary: og?.description,
	};
}

export async function fetchTangledStars(): Promise<Array<SourceRow>> {
	const records = await listRecords<StarRecord>(STAR_NSID);

	const rows: Array<SourceRow> = [];
	for (const { value } of records) {
		// The subject union also permits a starred string (paste); only repos belong here.
		const did =
			value.subject?.$type === `${STAR_NSID}#repo`
				? value.subject.did
				: undefined;
		if (!did) continue;

		// Resolved one at a time: after the first sync every one of these is a cache hit,
		// and a burst of parallel requests at a small forge buys nothing.
		const repo = await resolveRepo(did);
		rows.push({
			kind: "tangled-star",
			date: new Date(value.createdAt),
			url: normalizeUrl(repo.url),
			// Always titled, even when resolution failed: an untitled row would be picked up
			// by the preview backfill, which would then attach the banner we just avoided.
			title: repo.title ?? titleFromUrl(repo.url),
			summary: repo.summary,
			source: "tangled.org",
			tags: [],
		});
	}
	return rows;
}

export async function fetchTangledRepos(): Promise<Array<SourceRow>> {
	const records = await listRecords<RepoRecord>(REPO_NSID, 100);

	const rows: Array<SourceRow> = [];
	for (const { value } of records) {
		// The lexicon leaves `name` optional, but a repo without one has no address.
		const name = value.name?.trim();
		if (!name) continue;

		// My own repos, so the owner is me; a starred repo needs resolveRepo instead.
		const slug = `${identities.tangledHandle}/${name}`;
		rows.push({
			kind: "tangled-repo",
			date: new Date(value.createdAt),
			url: normalizeUrl(`${APPVIEW_URL}/${slug}`),
			title: slug,
			summary: value.description,
			source: "tangled.org",
			tags: [],
		});
	}
	return rows;
}
