import type { LiveLoader } from "astro/loaders";
import { readActivity, readEntry } from "./store";
import { syncActivity } from "./sync";
import type { ActivityFilter, ActivityItem } from "./types";
import { normalizeUrl } from "./url";

/**
 * Serves the feed from SQLite. Never returns `{ error }`: one dead source must not blank
 * the page, and the store still holds the rows from the last successful sync.
 */
export function activityLoader(): LiveLoader<
	ActivityItem,
	{ id: string },
	ActivityFilter
> {
	return {
		name: "activity",
		async loadCollection({ filter }) {
			await syncActivity();
			return {
				entries: readActivity({
					limit: filter?.limit,
					kinds: filter?.kinds,
				}),
			};
		},
		async loadEntry({ filter }) {
			await syncActivity();
			return readEntry(normalizeUrl(filter.id));
		},
	};
}
