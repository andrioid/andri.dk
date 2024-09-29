import { getAssetURL, getPost, getPosts } from "../../lib/cms";
import { postCard } from "../../lib/social-card/blog-card";

export async function getStaticPaths() {
  const allPosts = await getPosts({ limit: 1000 });

  return allPosts.map((p) => ({ params: { slug: p.slug }, props: {} }));
}

export async function GET({
  params,
}: {
  params: { slug: string };
  request: Request;
}) {
  if (!params.slug) {
    return new Response(null, {
      status: 404,
      statusText: "No post found",
    });
  }
  const post = await getPost(params.slug);
  const coverImage = post.coverImage
    ? getAssetURL(post.coverImage, ["width=600", "height=600", "fit=contain"])
    : undefined;
  console.log("post", post.coverImage, coverImage);
  // return new Response(null, {
  // 	status: 200,
  // 	statusText: "wat",
  // });
  const res = await postCard(post);
  return new Response(res, {
    headers: {
      "Content-Type": "image/svg+xml",
    },
  });
}
