import type { APIRoute } from "astro";
import { isLocale, LOCALE_COOKIE } from "~/lib/i18n";

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * The footer switcher's target: `/lang?set=da&next=/blog/` stores the choice
 * and sends the visitor back. Plain links, so it works without JavaScript.
 */
export const GET: APIRoute = ({ url, cookies, redirect }) => {
	const set = url.searchParams.get("set");
	const next = url.searchParams.get("next") ?? "/";
	// Same-site paths only: "//evil.example" or "/\evil.example" would be an
	// open redirect, since browsers read both as another host.
	const target = /^\/(?![/\\])/.test(next) ? next : "/";

	if (isLocale(set)) {
		cookies.set(LOCALE_COOKIE, set, {
			path: "/",
			maxAge: ONE_YEAR,
			sameSite: "lax",
			httpOnly: true,
		});
	}
	return redirect(target, 303);
};
