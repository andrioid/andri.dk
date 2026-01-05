import { CollectionEntry } from "astro:content";
import { site } from "~/constants";
import { dateToIsoDate } from "~/lib/date-utils";

export function OgPostCard({ post }: { post: CollectionEntry<"blog"> }) {
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
            <span tw="rounded-full bg-white text-black py-2 px-5">#{tag}</span>
          )) ?? null}
        </div>
      </div>
    </div>
  );
}
