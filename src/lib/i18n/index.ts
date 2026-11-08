import { STRINGS, type StringKey } from "./strings";

export const LOCALES = ["en", "da", "is"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Cookie set by the footer language switcher. */
export const LOCALE_COOKIE = "lang";

export function isLocale(value: unknown): value is Locale {
	return LOCALES.includes(value as Locale);
}

/**
 * Primary language subtags from an Accept-Language header, best first.
 * "da-DK, en;q=0.8, is;q=0" gives ["da", "en"]: regions are dropped and q=0
 * means "not acceptable", so it is left out.
 */
export function parseAcceptLanguage(header: string | null): Array<string> {
	if (!header) return [];
	const ranked = header
		.split(",")
		.map((part, index) => {
			const [tag, ...params] = part.trim().split(";");
			const q = params
				.map((p) => p.trim())
				.find((p) => p.startsWith("q="));
			return {
				lang: tag.split("-")[0].toLowerCase(),
				q: q ? Number(q.slice(2)) : 1,
				index,
			};
		})
		.filter(({ lang, q }) => lang && lang !== "*" && q > 0)
		// Stable on ties, so header order decides between equal weights.
		.sort((a, b) => b.q - a.q || a.index - b.index)
		.map(({ lang }) => lang);
	return [...new Set(ranked)];
}

/**
 * The UI language: the switcher's cookie if set, otherwise the first supported
 * language the browser asks for, otherwise English.
 */
export function resolveLocale(
	cookie: string | undefined,
	accepted: Array<string>,
): Locale {
	if (isLocale(cookie)) return cookie;
	return accepted.find(isLocale) ?? DEFAULT_LOCALE;
}

/**
 * Whether a visitor can be assumed to read a post's language, and so should see
 * its description. English is always readable.
 */
export function isReadable(
	language: Locale,
	visitor: { locale: Locale; acceptedLanguages: Array<string> },
): boolean {
	return (
		language === "en" ||
		language === visitor.locale ||
		visitor.acceptedLanguages.includes(language)
	);
}

export function t(locale: Locale, key: StringKey): string {
	return STRINGS[locale][key];
}

/** "8 Nov 2026" / "8. nov. 2026" / "8. nóv. 2026". */
export function formatDate(date: Date, locale: Locale): string {
	return date.toLocaleDateString(locale, {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}
