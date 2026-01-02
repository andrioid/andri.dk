import { Renderer } from "@takumi-rs/core";
import ImageResponse from "@takumi-rs/image-response";
import { CollectionEntry } from "astro:content";
import { createElement } from "react";
import { ogCardpersistentImages, OgPostCard } from "./og";

export async function ogCardResponse({
  post,
  renderer,
}: {
  post: CollectionEntry<"blog">;
  renderer: Renderer | undefined; // ImageResponse handles it automatically if undefined
}) {
  return new ImageResponse(
    createElement(OgPostCard, {
      post: post,
    }),
    {
      persistentImages: ogCardpersistentImages,
      width: 1200,
      height: 630,
      format: "webp",
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
      drawDebugBorder: false,
      renderer,
    },
  );
}
