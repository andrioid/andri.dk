/**
 * Third-party text — a repo description written by someone else, a page's `og:title`, a book
 * blurb — reaches the feed with only this between it and the page. Astro escapes markup, so the
 * risk is not injection but display: an unbounded blob breaks the row, and a bidi override can
 * visually reorder the line it sits on, letting one entry impersonate another.
 */

export const MAX_TITLE = 200;
export const MAX_SUMMARY = 400;
export const MAX_TAG = 40;

/**
 * C0/C1 controls except tab, newline and carriage return; the bidi overrides and isolates; the
 * zero-width space; the LRM/RLM marks; and the byte-order mark.
 *
 * Deliberately absent: U+200D ZWJ and U+200C ZWNJ. ZWJ joins emoji sequences, so removing it
 * turns one glyph into several, and ZWNJ is ordinary orthography in Persian and Arabic.
 *
 * Expressed as a predicate rather than a character class because a regex spanning control
 * characters trips `no-control-regex`, and the rule is right that such a class is usually a
 * mistake — this one is not, but a named predicate says so more clearly than a suppression.
 */
function isUnsafeCodePoint(cp: number): boolean {
	if (cp <= 0x08) return true; // NUL..BS
	if (cp === 0x0b || cp === 0x0c) return true; // VT, FF
	if (cp >= 0x0e && cp <= 0x1f) return true; // SO..US
	if (cp >= 0x7f && cp <= 0x9f) return true; // DEL, C1
	if (cp === 0x200b || cp === 0x200e || cp === 0x200f) return true; // ZWSP, LRM, RLM
	if (cp >= 0x202a && cp <= 0x202e) return true; // LRE..RLO
	if (cp >= 0x2066 && cp <= 0x2069) return true; // LRI..PDI
	return cp === 0xfeff; // BOM
}

/**
 * Strips the code points above, collapses whitespace, and clamps to `limit` code points.
 * Returns undefined for empty input so an optional field stays absent rather than becoming "".
 */
export function sanitizeText(
	value: string | undefined,
	limit: number,
): string | undefined {
	if (value === undefined) return undefined;

	// Iterating code points means a clamp can never split a surrogate pair into a lone
	// surrogate. It can still land inside an emoji ZWJ sequence, hence the trailing trim.
	const kept: Array<string> = [];
	for (const char of value) {
		const cp = char.codePointAt(0);
		if (cp !== undefined && !isUnsafeCodePoint(cp)) kept.push(char);
	}

	const text = kept.join("").replace(/\s+/g, " ").trim();
	if (text.length === 0) return undefined;

	const chars = [...text];
	if (chars.length <= limit) return text;
	const clamped = chars
		.slice(0, limit - 1)
		.join("")
		.replace(/\u200D+$/, "")
		.trimEnd();
	return `${clamped}…`;
}

/** Same treatment for a tag list: sanitized, empties dropped, duplicates collapsed. */
export function sanitizeTags(tags: Array<string>): Array<string> {
	const seen = new Set<string>();
	for (const tag of tags) {
		const clean = sanitizeText(tag, MAX_TAG);
		if (clean) seen.add(clean);
	}
	return [...seen];
}
