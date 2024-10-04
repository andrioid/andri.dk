// Note: Does not work with Deno SSR yet

import { resumeRaw } from "@lib/cv/index";
import { resumeToString } from "@lib/cv/pdf-utils";

export const prerender = true;

export async function GET() {
  const pdfBlob = await resumeToString(resumeRaw);
  return new Response(pdfBlob, {
    headers: {
      "content-type": "application/pdf",
    },
  });
}
