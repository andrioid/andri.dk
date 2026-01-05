// Note: Does not work with Deno SSR yet
import { fromJsx } from "@takumi-rs/helpers/jsx";
import { APIRoute } from "astro";
import { CollectionEntry } from "astro:content";
import { getPost } from "~/lib/cms";
import { codesnippetFromMarkdown } from "./_cmp/code-snippet-from-md";
import { codesnippetToImageContainer } from "./_cmp/code-snippet-to-container";
import { OgPostCard } from "./_cmp/og";
import { highlighter, takumiRenderer } from "./_cmp/takumi";

export const GET: APIRoute = async ({ params, request }) => {
  const { slug } = params;
  if (!slug) {
    throw new Error("Missing param slug");
  }
  const post: CollectionEntry<"blog"> = await getPost(slug);
  if (!post) throw new Error("404");

  const card = await fromJsx(OgPostCard({ post }));
  let frames = [{ node: card, durationMs: 3000 }];

  // If most of the content is a single code snippet, then use it as the og-image
  const snippet = codesnippetFromMarkdown(post.body ?? "");
  if (snippet) {
    for (const snip of snippet) {
      frames.push({
        node: codesnippetToImageContainer({
          code: snip.code,
          lang: snip.lang as any,
          highlighter,
        }),
        durationMs: 3000,
      });
    }
  }

  const buffer = await takumiRenderer.renderAnimation(
    frames,
    {
      format: "webp",
      width: 1200,
      height: 630,
    },
    request.signal,
  );
  if (!buffer) throw new Error("Failed to generate");

  return new Response(buffer as unknown as any, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
};
