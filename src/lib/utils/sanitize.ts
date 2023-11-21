import sanitize from "sanitize-html";

const options = {
	allowedTags: [
		...sanitize.defaults.allowedTags,
		"video",
		"source",
		"details",
		"summary",
	],
	allowedAttributes: {
		...sanitize.defaults.allowedAttributes,
		video: ["controls"],
		source: ["src"],
		code: ["style", "class"],
		span: ["style"],
	},
};

export function sanitizePost(postHTML: string): string {
	return postHTML;
	// TODO: Maybe revisit this. Right now it's more trouble than it's worth. Risk is minimal.
	return sanitize(postHTML, options);
}
