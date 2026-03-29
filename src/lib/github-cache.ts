const TTL = 10 * 60 * 1000; // 10 minutes

interface CacheEntry {
	stars: number;
	timestamp: number;
}

const cache = new Map<string, CacheEntry>();

/**
 * Fetches the stargazer count for a GitHub repo, with in-memory caching.
 * @param repo - Format: "owner/repo", e.g. "andrioid/andri.dk"
 * @returns The star count, or null if the fetch failed.
 */
export async function getStars(repo: string): Promise<number | null> {
	const cached = cache.get(repo);
	if (cached && Date.now() - cached.timestamp < TTL) {
		return cached.stars;
	}

	try {
		const res = await fetch(`https://api.github.com/repos/${repo}`, {
			headers: { Accept: "application/vnd.github.v3+json" },
		});
		if (!res.ok) return null;

		const json = await res.json();
		const stars = json.stargazers_count as number;
		cache.set(repo, { stars, timestamp: Date.now() });
		return stars;
	} catch {
		return null;
	}
}
