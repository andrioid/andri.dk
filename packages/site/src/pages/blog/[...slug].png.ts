import { getCollection, getEntryBySlug } from "astro:content";
import { generateImageBuffer, PopupCard } from "social-cards";
import { GenerateOptions } from "social-cards/types";

export const prerender = true;
export async function getStaticPaths() {
	const allPosts = await getCollection("blog");

	return allPosts.map((p) => ({ params: { slug: p.slug }, props: {} }));
}

export async function get({ params, request }) {
	const post = await getEntryBySlug("blog", params["slug"]);
	if (!post) {
		return;
	}
	const card = PopupCard;
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
	// const response = await fetch(
	// 	"https://astro.build/assets/press/full-logo-light.png"
	// );
	// const buffer = Buffer.from(await response.arrayBuffer());
	return {
		body: buf,
		encoding: "binary",
	};
}
