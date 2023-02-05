import { APIRoute } from "astro";
import { getCollection, getEntryBySlug } from "astro:content";
import { generateImageBuffer, PopupCard } from "social-cards";
import { GenerateOptions } from "social-cards/types";

export const prerender = true;
export async function getStaticPaths() {
	const allPosts = await getCollection("blog");

	return allPosts.map((p) => ({ params: { slug: p.slug }, props: {} }));
}

export async function get({
	params,
}: {
	params: { slug: string };
	request: Request;
}) {
	const post = await getEntryBySlug("blog", params["slug"]);
	if (!post) {
		return;
	}
	const options: GenerateOptions = {
		...PopupCard({
			title: post.data.title,
			subtitle: post.data.description,
			authorImage: "./public/img/coffee-art.jpg",
			backgroundImage:
				post.data.coverImage || "./public/img/hvitserkur.jpg",
		}),
	};

	const buf = await generateImageBuffer(options);
	return {
		body: buf,
		encoding: "binary",
	};
}
