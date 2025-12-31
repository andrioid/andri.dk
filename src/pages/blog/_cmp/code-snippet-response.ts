import { codeToImage } from "shiki-image";
import { CodeSnippet } from "./code-snippet-from-md";

// TODO: While shiki-image is nice, it's a rather thin wrapper and we could implement it ourselves

export async function codesnippetResponse(
  snippet: CodeSnippet,
): Promise<Response> {
  const buffer = await codeToImage(snippet.code, {
    lang: snippet.lang as any, // BundledLanguage isn't exported and I'm lazy
    theme: "github-dark",
    format: "webp",
    style: {
      backgroundImage: "linear-gradient(to bottom, #033359ff, black)",
    },
  });
  if (!buffer) throw new Error("Unable to create shiki-image");
  return new Response(buffer as unknown as any, {
    headers: {},
  });
}
