import { identities } from "../../../constants";
import type { SourceRow } from "../types";
import { normalizeUrl } from "../url";
import { okJson } from "./http";

const API_URL = "https://api.github.com";
/** GitHub rejects requests without a User-Agent. */
const USER_AGENT = "andri.dk-activity";

type GhRepo = {
	full_name: string;
	html_url: string;
	description: string | null;
	stargazers_count: number;
	created_at: string;
	fork: boolean;
	private: boolean;
};

type GhStar = { starred_at: string; repo: GhRepo };

type GhGist = {
	id: string;
	html_url: string;
	description: string | null;
	created_at: string;
	files?: Record<string, unknown>;
};

async function ghFetch<T>(path: string, accept: string): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		headers: { Accept: accept, "User-Agent": USER_AGENT },
	});
	// Unauthenticated GitHub reports an exhausted budget as 403 with a reset header, not 429,
	// so `okJson` turns that into a RateLimitError the sync loop can wait out properly.
	return okJson<T>(res, `GitHub ${path}`);
}

export async function fetchStars(): Promise<Array<SourceRow>> {
	const stars = await ghFetch<Array<GhStar>>(
		`/users/${identities.github}/starred?per_page=20`,
		"application/vnd.github.star+json",
	);
	return stars.map(({ starred_at, repo }) => ({
		kind: "github-star",
		date: new Date(starred_at),
		url: normalizeUrl(repo.html_url),
		title: repo.full_name,
		summary: repo.description ?? undefined,
		source: "github.com",
		stars: repo.stargazers_count,
		tags: [],
	}));
}

export async function fetchRepos(): Promise<Array<SourceRow>> {
	const repos = await ghFetch<Array<GhRepo>>(
		`/users/${identities.github}/repos?type=owner&sort=created&direction=desc&per_page=20`,
		"application/vnd.github+json",
	);
	return repos
		.filter((repo) => !repo.fork && !repo.private)
		.map((repo) => ({
			kind: "github-repo",
			date: new Date(repo.created_at),
			url: normalizeUrl(repo.html_url),
			title: repo.full_name,
			summary: repo.description ?? undefined,
			source: "github.com",
			stars: repo.stargazers_count,
			tags: [],
		}));
}

export async function fetchGists(): Promise<Array<SourceRow>> {
	const gists = await ghFetch<Array<GhGist>>(
		`/users/${identities.github}/gists?per_page=20`,
		"application/vnd.github+json",
	);
	return gists.map((gist) => ({
		kind: "github-gist",
		date: new Date(gist.created_at),
		url: normalizeUrl(gist.html_url),
		// A gist has no name: its description, else its first filename, else its id.
		title:
			gist.description?.trim() ||
			Object.keys(gist.files ?? {})[0] ||
			gist.id,
		source: "gist.github.com",
		tags: [],
	}));
}
