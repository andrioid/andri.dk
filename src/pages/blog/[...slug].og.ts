// Note: Does not work with Deno SSR yet
import type { PersistentImage } from "@takumi-rs/core";
import { ImageResponse } from "@takumi-rs/image-response";
import { Params } from "astro";
import { CollectionEntry, getEntry } from "astro:content";
import { readFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { getPost } from "~/lib/cms";
import { OgImage } from "./_cmp/og";

const persistentImages: Array<PersistentImage> = [
  {
    src: "avatar",
    data: readFileSync(path.join(process.cwd(), "public/img/coffee-art.jpg")),
  },
];

export async function GET({ params }: { params: Params }) {
  const { slug } = params;
  if (!slug) {
    throw new Error("Missing param slug");
  }
  const post: CollectionEntry<"blog"> = await getPost(slug);

  return new ImageResponse(
    createElement(OgImage, {
      post: post,
    }),
    {
      width: 1200,
      height: 630,
      format: "webp",
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
      drawDebugBorder: false,
      persistentImages,
    },
  );
}

// Simplified version of my getPost using a content-collection "blog"
async function getPostImpl(slug: string): Promise<CollectionEntry<"blog">> {
  const post = await getEntry("blog", slug);
  if (!post) throw new Error("Post not found");
  return post;
}
