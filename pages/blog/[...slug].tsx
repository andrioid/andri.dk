import React from "react";
import { useRouter } from "next/router";
import {
  getAllPosts,
  getPostByFilename,
  getPostByName,
} from "../../lib/blog-posts";
import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

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
  title: string;
  date: Date;
}

export default function BlogPosts({ source }: BlogPostProps) {
  const router = useRouter();
  //console.log("post props", post);
  console.log("router query", router.query);
  return (
    <div>
      <p>Hello</p>
      <MDXRemote {...source} />
    </div>
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
  console.log("static props", params);
  const localPath = params.slug.join("/");
  const post = await getPostByName(localPath, [
    "path",
    "date",
    "title",
    "content",
  ]);

  const mdxSource = await serialize(post.content);

  return {
    props: {
      source: mdxSource,
      title: post.title,
      date: new Date(post.date),
    },
  };
};
