import React from "react";
import { useRouter } from "next/router";
import {
  BlogPost,
  getAllPosts,
  getPostByFilename,
  getPostByName,
} from "../../lib/blog-posts";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { ParsedUrlQuery } from "querystring";
import BlogPageLayout from "../../components/layouts/blog-post";

const components = {
  //a: CustomLink,
  // It also works with dynamically-imported components, which is especially
  // useful for conditionally loading components for certain routes.
  // See the notes in README.md for more details.
  //TestComponent: dynamic(() => import("../../components/TestComponent")),
  Head,
};

interface BlogPostProps {
  source: MDXRemoteSerializeResult<Record<string, unknown>>;
  post: BlogPost;
}

export default function BlogPosts({ source, post }: BlogPostProps) {
  const router = useRouter();
  //console.log("post props", post);
  console.log("router query", router.query);
  return (
    <BlogPageLayout post={post}>
      <MDXRemote {...source} />
    </BlogPageLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts(["path"]);
  return {
    paths: posts.map((post) => {
      const slugFile = post.localFile.substr(
        0,
        post.localFile.lastIndexOf(".md")
      );
      const pathArray = slugFile.split("/");
      console.log("patharray", pathArray);
      return {
        params: {
          slug: pathArray,
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogPostProps> = async ({
  params,
}) => {
  const { slug } = params;
  console.log("static props", params);
  const localPath = slug && typeof slug !== "string" && slug.join("/");
  const post = await getPostByName(localPath, [
    "path",
    "date",
    "title",
    "content",
    "tags",
  ]);

  const mdxSource = await serialize(post.content);

  return {
    props: {
      source: mdxSource,
      post: {
        ...post,
      },
    },
  };
};
