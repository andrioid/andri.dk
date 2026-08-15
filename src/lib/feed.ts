/**
 * Channel metadata both web feeds share.
 *
 * `rel="self"` is the address `/feed.xslt` offers a browser to paste into a reader, and
 * `rel="alternate"` is its way back to the page the feed mirrors. They are absolute against
 * the configured site, so the advertised address is the canonical one whatever host answers.
 *
 * The atom namespace and the links that use it are returned together on purpose: declaring
 * one without the other emits XML no reader can parse.
 */
export function feedChannel(
	feedPath: string,
	pagePath: string,
): { xmlns: Record<string, string>; stylesheet: string; customData: string } {
	const url = (path: string) => new URL(path, import.meta.env.SITE).href;
	return {
		xmlns: { atom: "http://www.w3.org/2005/Atom" },
		stylesheet: "/feed.xslt",
		customData: [
			`<atom:link rel="self" type="application/rss+xml" href="${url(feedPath)}"/>`,
			`<atom:link rel="alternate" type="text/html" href="${url(pagePath)}"/>`,
			`<language>en-us</language>`,
		].join(""),
	};
}
