// Note: Does not work with Deno SSR yet
import { fromJsx } from "@takumi-rs/helpers/jsx";
import { APIRoute } from "astro";
import { CollectionEntry } from "astro:content";
import { createHighlighter } from "shiki";
import { getPost } from "~/lib/cms";
import { codesnippetFromMarkdown } from "./_cmp/code-snippet-from-md";
import { codesnippetToImageContainer } from "./_cmp/code-snippet-to-container";
import { OgPostCard } from "./_cmp/og";
import { takumiRenderer } from "./_cmp/takumi";

const highlighter = await createHighlighter({
  themes: ["github-dark"],
  langs: ["tsx", "ts", "sql", "shell", "js", "bash", "php", "html", "css"],
});

export const GET: APIRoute = async ({ params, request }) => {
  const { slug } = params;
  if (!slug) {
    throw new Error("Missing param slug");
  }
  const post: CollectionEntry<"blog"> = await getPost(slug);

  // If most of the content is a single code snippet, then use it as the og-image
  const snippet = codesnippetFromMarkdown(post.body ?? "");
  if (!snippet) {
    throw new Error("Post body missing");
  }
  const snippetContainer = codesnippetToImageContainer({
    code: snippet.code,
    lang: snippet.lang as any,
    highlighter,
  });
  const card = await fromJsx(OgPostCard({ post }));
  const buffer = await takumiRenderer.renderAnimation(
    [
      { node: card, durationMs: 3000 },
      { node: snippetContainer, durationMs: 3000 },
    ],
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
