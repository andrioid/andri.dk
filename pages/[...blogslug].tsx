import React from "react";
import { useRouter } from "next/router";
import { getAllPosts, getPostByFilename } from "../lib/blog-posts";
import { GetStaticPaths, GetStaticProps } from "next";

function BlogPosts({ query, post }) {
  const router = useRouter();
  console.log("post props", post);
  console.log("router query", router.query);
  return <p>Hello</p>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts(["path"]);
  return {
    paths: posts.map((post) => {
      const pathArray = post.path.split("/");
      console.log("patharray", pathArray);
      return {
        params: {
          blogslug: pathArray,
          banana: "boat",
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log("static props", params);
  // const post = getPostByFilename(params.post.sourceFile, [
  //   "path",
  //   "date",
  //   "title",
  //   "content",
  // ]);
  return {
    props: {
      //post,
    },
  };
};

export default BlogPosts;
