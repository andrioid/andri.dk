import { Renderer } from "@takumi-rs/core";
import { createHighlighter } from "shiki";
import { codesnippetToImageBuffer } from "./code-snippet-to-container";

const highlighter = await createHighlighter({
  themes: ["github-dark"],
  langs: ["tsx", "ts", "sql", "shell"],
});

export async function codesnippetResponse({
  code,
  lang,
  theme,
  renderer,
}: {
  code: string;
  lang: string;
  theme?: string;
  renderer: Renderer;
}): Promise<Response> {
  // Grab 20 lines
  const buffer = await codesnippetToImageBuffer({
    code,
    lang: lang as any, // this comes from markdown
    renderer,
    highlighter,
  });
  if (!buffer) throw new Error("Unable to create shiki-image");
  return new Response(buffer as unknown as any, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "image/webp",
    },
  });
}
