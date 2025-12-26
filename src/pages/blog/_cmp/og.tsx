import { CollectionEntry } from "astro:content";
import { site } from "~/constants";
import { dateToIsoDate } from "~/lib/date-utils";

export function OgImage({ post }: { post: CollectionEntry<"blog"> }) {
  return (
    <div
      tw="bg-black w-full h-full flex flex-col justify-evenly text-white px-14 gap-6 "
      style={{
        backgroundImage: "linear-gradient(to bottom, #033359ff, black)",
      }}
    >
      <div id="tags" tw="flex flex-row gap-4 font-semibold text-lg">
        {post.data.tags?.map((tag) => (
          <span tw="rounded-md bg-white text-black py-1 px-2">#{tag}</span>
        )) ?? null}
      </div>

      <h1 tw="text-6xl font-bold">{post.data.title}</h1>
      <div tw="flex flex-row gap-6">
        <img src="avatar" alt="avatar" tw="h-20 w-20 rounded-full" />
        <div tw="h-full text-2xl flex flex-col justify-center">
          <span tw="">{site.author}</span>
          <span tw="text-xl text-gray-400">
            {dateToIsoDate(post.data.date)}
          </span>
        </div>
      </div>
    </div>
  );
}
