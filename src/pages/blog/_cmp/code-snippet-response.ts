import { Renderer } from "@takumi-rs/core";
import { createHighlighter } from "shiki";
import { codesnippetToImageContainer } from "./code-snippet-to-container";

const highlighter = await createHighlighter({
  themes: ["github-dark"],
  langs: ["tsx", "ts", "sql", "shell", "js", "bash", "php", "html", "css"],
});

export async function codesnippetResponse({
  code,
  lang,
  theme,
  renderer = new Renderer(),
}: {
  code: string;
  lang: string;
  theme?: string;
  renderer: Renderer;
}): Promise<Response> {
  const root = codesnippetToImageContainer({
    code,
    lang: lang as any, // this comes from markdown
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
