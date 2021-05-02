import React, { useEffect } from "react";
import { useStaticQuery, graphql } from "gatsby";
import Helmet from "react-helmet";
import defaultMetaImage from "../../static/img/default-og-image.png";
import {
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  FacebookShareButton,
  FacebookIcon,
} from "react-share";

// Borrowed from https://github.com/kentcdodds/kentcdodds.com/blob/master/src/components/seo/index.js
// Thanks Kent
export const SEO = ({ postData, frontmatter = {}, metaImage, isBlogPost }) => {
  const isDev = process.env.NODE_ENV !== "production";
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          author
          siteUrl
          title
          description
          social {
            twitter
          }
          goatcounterCode
        }
      }
    }
  `);
  const {
    site: { siteMetadata: seo },
  } = data;
  const postMeta =
    frontmatter || postData.childMarkdownRemark.frontmatter || {};
  const postFields = (postData && postData.fields) || {};
  let title = postFields.title || postMeta.title;
  if (title) {
    title += ` | ${seo.title}`;
  } else {
    title = seo.title;
  }

  const description =
    postData?.excerpt ||
    postMeta.plainTextDescription ||
    postMeta.description ||
    seo.description;
  const image = `${seo.siteUrl}/${
    (postData && postData.fields.socialcard) || defaultMetaImage
  }`;
  const url = postData?.fields.slug
    ? `${seo.siteUrl}${postData?.fields.slug}`
    : seo.siteUrl;

  return (
    <>
      <Helmet>
        {/* General tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="author" content={seo.author} />
        {/* OpenGraph tags */}
        <meta property="og:url" content={url} />
        {postData ? <meta property="og:type" content="article" /> : null}
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content={seo.title} />
        <meta property="og:description" content={description} />
        <meta name="image" property="og:image" content={image} />
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content={seo.social.twitter} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        {/* RSS, yes, its back! */}
        <link
          rel="alternate"
          type="application/rss+xml"
          href="/rss.xml"
          title={title}
        />
        {!isDev && (
          <script
            data-goatcounter={`https://${seo.goatcounterCode}.goatcounter.com/count`}
            async
            src="//gc.zgo.at/count.js"
          ></script>
        )}
      </Helmet>
    </>
  );
};

export function ShareOn({ url }: { url: string }) {
  const buttonSize = 40;
  return (
    <div className="share-box">
      Did you like the article? Please share. If not, please{" "}
      <a href="https://twitter.com/andrioid" target="_blank" rel="noreferrer">
        send me a DM
      </a>
      <p>&nbsp;</p>
      <LinkedinShareButton url={url} className="mr-1">
        <LinkedinIcon size={buttonSize} />
      </LinkedinShareButton>
      <TwitterShareButton url={url} className="mr-1">
        <TwitterIcon size={buttonSize} />
      </TwitterShareButton>
      <FacebookShareButton url={url}>
        <FacebookIcon size={buttonSize} />
      </FacebookShareButton>
    </div>
  );
}
