import { useEffect, useState } from "react";

interface Props {
  atUri: string;
}

export function BlueSkyInteractions({ atUri }: Props) {
  const [likes, setLikes] = useState<Array<Like>>([]);
  useEffect(() => {
    getLikes(atUri).then(setLikes);
    //getReplies(atUri);
  }, []);
  console.log("likes", likes);
  return (
    <section>
      <hr className="text-gray-300 py-2" />
      <h3 className="leading-snug">Join the conversation</h3>
      <p className="text-gray-700 text-sm">
        Like or comment &nbsp;
        <a target="_blank" className="underline" href={linkAtUri(atUri)}>
          this post on Bluesky
        </a>
        .
      </p>

      <div className="flex flex-row gap-2 flex-wrap max-w-xl mt-2">
        {likes.map((like) => (
          <div key={like.actor.did}>
            <img
              className="rounded-full h-6 shadow-md"
              src={like.actor.avatar}
            />
          </div>
        ))}
        <p className="mb-2">
          {likes.length} {likes.length === 1 ? "Like" : "Likes"}
        </p>
      </div>
    </section>
  );
}

type Like = {
  actor: {
    avatar: string | undefined;
    did: string;
  };
};
async function getLikes(atUri: string): Promise<Array<Like>> {
  const likesUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.getLikes?uri=${encodeURIComponent(atUri)}&limit=10`;
  try {
    const likeRes = await fetch(likesUrl);
    const json = await likeRes.json();
    const likes = json.likes as Array<Like>;
    return likes;
  } catch {
    return [];
  }
}

// TODO: Fix replies too
export async function getReplies(atUri: string): Promise<Array<Like>> {
  const url = `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(atUri)}&depth=1`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    console.log("comments", json);
    const likes = json.likes as Array<Like>;
    return likes;
  } catch {
    return [];
  }
}

function linkAtUri(atUri: string) {
  const uriParts = atUri.match(
    /at:\/\/(did:plc:[^\/]+)\/app\.bsky\.feed\.post\/(.+)/,
  );
  const did = uriParts?.[1];
  const postId = uriParts?.[2];

  return `https://bsky.app/profile/${did}/post/${postId}`;
}
