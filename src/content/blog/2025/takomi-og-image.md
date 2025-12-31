---
date: "2025-12-29T00:00:00.000Z"
tags:
  - social-media
title: Social-media images directly into PNG from JSX with Takumi
---

Improving engagement of your online content can come down to how it's previewed on social-media services. If you're like me, and not keen on creating these open-graph images by hand for every post then you can generate them programmatically.

## Takumi

[Takumi](https://takumi.kane.tw/) is a tool that receives JSX and outputs images. It has support for (some) CSS, Tailwind and HTML. We'll be using React's JSX in this example; but there's also a lower-level API you can use if you like. It can run on Node.js, or in the browser using WASM.

If your template looks like this

```tsx
function Hello() {
  return (
    <div tw="bg-white w-full h-full flex items-center justify-center">
      <h1 tw="text-4xl font-bold">Hello</h1>
    </div>
  );
}
```

You'll receive something like this:
![Hello Example](./takomi-example1.png)

### Astro SSR example

Most of the documentation is focused around Next.js. But, my framework of choice is [Astro](https://astro.build/).

Create a handler in `pages/blog/[...slug].og.ts`. It will respond to anything at `/blog/2025/whatever/you/want.og`.

```ts
import { ImageResponse } from "@takumi-rs/image-response";

export async function GET({ params }: { params: Params }) {
  const { slug } = params;
  const post: CollectionEntry<"blog"> = await getPost(slug);
  // TODO: You should handle errors here

  return new ImageResponse(
    // Using createElement instead of JSX because file is TS, not TSX
    // - Replace OgImage with your component
    createElement(OgImage, { post: post }),
    {
      width: 1200,
      height: 630,
      format: "png", // webp, others supported
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}

// Simplified version of my getPost using a content-collection "blog"
async function getPost(slug: string): Promise<CollectionEntry<"blog">> {
  const post = await getEntry("blog", slug);
  if (!post) throw new Error("Post not found");
  return post;
}
```

## My template

The template component looks like this:

![andri.dk og image example](./takomi-example2.webp)

With the following template

```tsx
export function OgImage({ post }: { post: CollectionEntry<"blog"> }) {
  return (
    <div
      tw="bg-black w-full h-full flex flex-col justify-evenly text-white px-16 gap-6 py-8 "
      style={{
        backgroundImage: "linear-gradient(to bottom, #033359ff, black)",
      }}
    >
      <h1 id="title" tw="text-6xl font-bold">
        {post.data.title}
      </h1>

      <div tw="flex flex-col gap-8 text-3xl">
        <div id="post-meta" tw="flex flex-row gap-6">
          <img src="avatar" alt="avatar" tw="h-20 w-20 rounded-full" />
          <div tw="h-full flex flex-col justify-center">
            <span tw="font-bold">{site.author}</span>
            <span tw="text-gray-400">{dateToIsoDate(post.data.date)}</span>
          </div>
        </div>
        <div id="tags" tw="flex flex-row gap-4 font-semibold">
          {post.data.tags?.map((tag) => (
            <span tw="rounded-full bg-white text-black py-1.5 px-4">
              #{tag}
            </span>
          )) ?? null}
        </div>
      </div>
    </div>
  );
}
```

I'm using an image in my template. We need fetch it and pass it to Takomi in the `persistedImages` array of the response.

```ts
const persistentImages: Array<PersistentImage> = [
  {
    src: "avatar",
    data: readFileSync(path.join(process.cwd(), "public/img/coffee-art.jpg")),
  },
];
```

In the template above, we reference it with `<img src="avatar">`. Note that we're doing this in the module-scope to cache the image in memory. If you're tight on memory, you could do this as a part of the request handler. But, then it will be slower.

## Conclusion

Takomi is an amazing tool to create images from markup. It supports Tailwind out of the box and it's not as heavy handed as running, say a full Google Chrome to generate a single image.

While I'm using this for server-side-rendering, it should work fine in static-site-generation (SSG) scenarios as well.

It's also not limited to Astro, Next.js or the framework of the week. It's written in Rust, and compiles to WASM.

If you're still reading this, please check out [Takumi's documentation](https://takumi.kane.tw/docs) and make it your own.
