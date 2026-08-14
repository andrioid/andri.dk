const DAY_MS = 24 * 60 * 60 * 1000;

/** Local midnight, so grouping matches the reader's calendar rather than UTC. */
function startOfDay(date: Date): number {
	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	).getTime();
}

function labelFor(date: Date, today: number): string {
	const day = startOfDay(date);
	if (day >= today) return "Today";
	if (day === today - DAY_MS) return "Yesterday";
	if (day > today - 7 * DAY_MS) return "This week";
	return date.toLocaleDateString(undefined, {
		month: "long",
		year: "numeric",
	});
}

export type ActivityGroup<T> = { label: string; items: Array<T> };

/**
 * Buckets an already newest-first list into consecutive date groups — Today, Yesterday,
 * This week, then one group per month — preserving the incoming order.
 */
export function groupActivity<T extends { date: Date }>(
	items: Array<T>,
	now: Date = new Date(),
): Array<ActivityGroup<T>> {
	const today = startOfDay(now);
	const groups: Array<ActivityGroup<T>> = [];
	for (const item of items) {
		const label = labelFor(item.date, today);
		const current = groups[groups.length - 1];
		if (current?.label === label) current.items.push(item);
		else groups.push({ label, items: [item] });
	}
	return groups;
}

/** Day and month; the year appears only when the item is not from the current one. */
export function formatEntryDate(date: Date, now: Date = new Date()): string {
	return date.toLocaleDateString(undefined, {
		month: "short",
		day: "numeric",
		year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
	});
}
