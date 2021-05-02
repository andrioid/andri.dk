import React from "react";
import { graphql } from "gatsby";
import { Nav } from "../components/nav";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { SEO, ShareOn } from "../components/seo";

// import '../css/blog-post.css'; // make it pretty!

export default function Template({
  data, // this prop will be injected by the GraphQL query we'll write in a bit
}) {
  if (!data) {
    return null;
  }
  const { markdownRemark: post } = data; // data.markdownRemark holds our post data
  const { frontmatter } = post;
  const { cover } = frontmatter;
  return (
    <>
      <SEO frontmatter={post.frontmatter} postData={post} isBlogPost={true} />
      <Nav />
      <div className="pt-4 bg-gray-200 py-2 md:py-10 md:px-10 min-h-screen md:flex justify-center">
        <div className="bg-white max-w-4xl py-10 shadow px-5 lg:px-10 min-w-half-screen">
          {cover && (
            <GatsbyImage
              alt="post cover"
              image={getImage(cover.childImageSharp)}
            />
          )}

          <div>
            <h1 className="text-gray-900 font-semibold text-xl md:text-3xl">
              {post.fields.title}
            </h1>
            <div className="text-base text-gray-600 flex justify-start mb-4">
              <p>
                {new Date(post.fields.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="mb-4 ">
              {post.fields.tags &&
                post.fields.tags.map((t) => (
                  <span key={t} className="andri-tag text-base">
                    {t}
                  </span>
                ))}
            </div>
          </div>

          <div className="mb-6"></div>

          <div
            className="markdown md:text-base"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          <p>&nbsp;</p>
          <ShareOn
            url={`${data.site.siteMetadata.siteUrl}${post.fields.slug}`}
          />
        </div>
      </div>
    </>
  );
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    site {
      siteMetadata {
        siteUrl
        title
        description
        social {
          twitter
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $path } }) {
      html
      excerpt(pruneLength: 250)
      fields {
        title
        date
        tags
        slug
        socialcard
      }
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        cover {
          publicURL
          childImageSharp {
            gatsbyImageData(transformOptions: { fit: COVER })
          }
        }
      }
    }
  }
`;
