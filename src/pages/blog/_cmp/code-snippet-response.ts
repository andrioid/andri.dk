import { Renderer } from "takumi-js/node";
import { codesnippetToImageContainer } from "./code-snippet-to-container";
import { highlighter, loadLang } from "./takumi";

export async function codesnippetResponse({
	code,
	lang,
	renderer = new Renderer(),
}: {
	code: string;
	lang: string;
	theme?: string;
	renderer: Renderer;
}): Promise<Response> {
	const root = codesnippetToImageContainer({
		code,
		lang: (await loadLang(lang)) as any, // this comes from markdown
		highlighter,
	});
	const buffer = await renderer.render(root, {
		format: "webp",
		width: 1200,
		height: 630,
		drawDebugBorder: false,
	});
	if (!buffer) throw new Error("Unable to create shiki-image");
	return new Response(buffer as unknown as any, {
		headers: {
			"Cache-Control": "public, max-age=3600",
			"Content-Type": "image/webp",
		},
	});
}
