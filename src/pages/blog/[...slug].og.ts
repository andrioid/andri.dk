// Note: Does not work with Deno SSR yet
import { Params } from "astro";
import { CollectionEntry } from "astro:content";
import { getPost } from "~/lib/cms";
import { codesnippetFromMarkdown } from "./_cmp/code-snippet-from-md";
import { codesnippetResponse } from "./_cmp/code-snippet-response";
import { ogCardResponse } from "./_cmp/og-card-response";
import { takumiRenderer } from "./_cmp/takumi";

export async function GET({ params }: { params: Params }) {
  const { slug } = params;
  if (!slug) {
    throw new Error("Missing param slug");
  }
  const post: CollectionEntry<"blog"> = await getPost(slug);

  // If most of the content is a single code snippet, then use it as the og-image
  const snippet = codesnippetFromMarkdown(post.body ?? "");
  if (snippet && post.body) {
    if (snippet[0].code.length > post.body.length * 0.5) {
      return await codesnippetResponse({
        code: snippet[0].code,
        lang: snippet[0].lang,
        renderer: takumiRenderer,
      });
    }
  }
  return ogCardResponse({ post, renderer: takumiRenderer });
}
