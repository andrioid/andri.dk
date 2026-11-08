import { defineMiddleware } from "astro:middleware";
import {
	DEFAULT_LOCALE,
	LOCALE_COOKIE,
	parseAcceptLanguage,
	resolveLocale,
} from "~/lib/i18n";

/**
 * Resolves the UI language for every request. Prerendered routes have no
 * visitor, so they get English and no headers are read.
 */
export const onRequest = defineMiddleware(async (context, next) => {
	if (context.isPrerendered) {
		context.locals.locale = DEFAULT_LOCALE;
		context.locals.acceptedLanguages = [];
		return next();
	}

	const accepted = parseAcceptLanguage(
		context.request.headers.get("accept-language"),
	);
	context.locals.acceptedLanguages = accepted;
	context.locals.locale = resolveLocale(
		context.cookies.get(LOCALE_COOKIE)?.value,
		accepted,
	);

	const response = await next();
	// The same URL renders differently per language, so caches must key on both.
	response.headers.append("Vary", "Accept-Language, Cookie");
	return response;
});
