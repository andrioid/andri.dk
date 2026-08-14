export const site = {
	baseURL:
		// Optional chaining: this module is also imported by plain-node scripts,
		// where import.meta.env does not exist.
		import.meta.env?.MODE === "development"
			? "http://localhost:3000"
			: "https://andri.dk",
	title: "Andri Óskarsson | andri.dk",
	description:
		"I make websites, create apps, manage infrastructure, develop products and more.",
	author: "Andri Óskarsson",
};

/** Public identities the activity feed reads from. */
export const identities = {
	github: "andrioid",
	blueskyHandle: "andri.dk",
	blueskyDid: "did:plc:rrrwbar3wv576qpsymwey5p5",
	/** Same atproto handle; Tangled addresses repos as `tangled.org/<handle>/<name>`. */
	tangledHandle: "andri.dk",
};
