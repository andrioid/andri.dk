import { blogFeed } from "~/lib/blog-feed";

export function GET() {
	return blogFeed("en");
}
