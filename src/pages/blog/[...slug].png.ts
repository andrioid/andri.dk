import {
  generateImageBuffer,
  PopupCard,
  type GenerateOptions,
} from "social-cards";
import { getPost, getPosts } from "../../lib/cms";

export const prerender = true;
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
  const post = await getPost(params["slug"]);
  if (!post) {
    return;
  }
  const options: GenerateOptions = {
    ...PopupCard({
      title: post.title,
      subtitle: post.description,
      authorImage: "./public/img/coffee-art.jpg",
      backgroundImage: "./public/img/hvitserkur.jpg",
    }),
  };

  const buf = await generateImageBuffer(options);
  return new Response(buf);
}
