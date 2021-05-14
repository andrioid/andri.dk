import React, { ReactChildren, ReactNode } from "react";
import { BlogPost } from "../../lib/blog-posts";
import { formatDate } from "../../lib/date";
import { Nav } from "../nav";
import { Layout } from "./layout";

// import '../css/blog-post.css'; // make it pretty!

export default function BlogPageLayout({
  children, // this prop will be injected by the GraphQL query we'll write in a bit
  post,
}: {
  children: ReactNode;
  post: BlogPost;
}) {
  return (
    <Layout>
      <Nav />
      <div className="pt-4 bg-gray-200 py-2 md:py-10 md:px-10 min-h-screen md:flex justify-center">
        <div className="bg-white max-w-4xl py-10 shadow px-5 lg:px-10 container">
          {/* {cover ? (
            <Img
              //sizes={cover.childImageSharp.sizes}
              fluid={cover.childImageSharp.fluid}
              //className="max-h-one-third-screen"
            />
          ) : null} */}

          <div>
            <h1 className="text-gray-900 font-semibold text-xl md:text-3xl">
              {post.title}
            </h1>
            <div className="text-sm text-gray-600 flex justify-start mb-4">
              <p>{formatDate(new Date(post.date))}</p>
            </div>
            {post.tags && (
              <div className="mb-4 ">
                {post.tags.map((t) => (
                  <span key={t} className="andri-tag text-base">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6"></div>

          <div className="markdown text-sm md:text-base">{children}</div>
        </div>
      </div>
    </Layout>
  );
}
