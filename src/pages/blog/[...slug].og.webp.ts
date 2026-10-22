// Note: Does not work with Deno SSR yet
import { APIRoute } from "astro";
import { type AnimationScene, renderAnimation } from "takumi-js";
import { getPost } from "~/lib/cms";
import { codesnippetFromMarkdown } from "./_cmp/code-snippet-from-md";
import { codesnippetToImageContainer } from "./_cmp/code-snippet-to-container";
import { OgPostCard } from "./_cmp/og";
import { highlighter, takumiImages, takumiRenderer } from "./_cmp/takumi";

export const GET: APIRoute = async ({ params, request }) => {
	const { slug } = params;
	if (!slug) {
		throw new Error("Missing param slug");
	}
	const post = await getPost(slug);
	if (!post) {
		return new Response(null, {
			status: 404,
			statusText: "Not found",
		});
	}

	const scenes: AnimationScene[] = [
		{ node: OgPostCard({ post }), durationMs: 3000 },
	];

	// If most of the content is a single code snippet, then use it as the og-image
	const snippet = codesnippetFromMarkdown(post.body ?? "");
	if (snippet) {
		for (const snip of snippet) {
			scenes.push({
				node: codesnippetToImageContainer({
					code: snip.code,
					lang: snip.lang as any,
					highlighter,
				}),
				durationMs: 3000,
			});
		}
	}

	const buffer = await renderAnimation({
		renderer: takumiRenderer,
		images: takumiImages,
		scenes,
		format: "webp",
		width: 1200,
		height: 630,
		// Every scene is a still, so one sampled frame per second is enough.
		fps: 1,
		signal: request.signal,
	});
	if (!buffer) throw new Error("Failed to generate");

	return new Response(buffer as unknown as any, {
		headers: {
			"Cache-Control": "public, max-age=3600",
		},
	});
};
