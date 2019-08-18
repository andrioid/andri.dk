import React from 'react'
import path from 'path'
import { StaticQuery, graphql } from 'gatsby'
import Helmet from 'react-helmet'
import defaultMetaImage from '../../static/img/default-og-image.png'

// Borrowed from https://github.com/kentcdodds/kentcdodds.com/blob/master/src/components/seo/index.js
// Thanks Kent
export const SEO = ({ postData, frontmatter = {}, metaImage, isBlogPost }) => (
	<StaticQuery
		query={graphql`
			{
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
			}
		`}
		render={({ site: { siteMetadata: seo } }) => {
			const postMeta =
				frontmatter || postData.childMarkdownRemark.frontmatter || {}
			const title = postMeta.title || seo.title
			const description =
				postMeta.plainTextDescription || postMeta.description || seo.description
			const image = `${seo.siteUrl}${(postMeta.cover &&
				postMeta.cover.publicURL) ||
				defaultMetaImage}`
			const url = postMeta.path ? `${seo.siteUrl}${postMeta.path}` : seo.siteUrl

			return (
				<>
					<Helmet>
						{/* General tags */}
						<title>{title}</title>
						<meta name="description" content={description} />
						<meta name="image" content={image} />

						{/* OpenGraph tags */}
						<meta property="og:url" content={url} />
						{isBlogPost ? <meta property="og:type" content="article" /> : null}
						<meta property="og:title" content={title} />
						<meta property="og:description" content={description} />
						<meta property="og:image" content={image} />

						{/* Twitter Card tags */}
						<meta name="twitter:card" content="summary_large_image" />
						<meta name="twitter:creator" content={seo.social.twitter} />
						<meta name="twitter:title" content={title} />
						<meta name="twitter:description" content={description} />
						<meta name="twitter:image" content={image} />
					</Helmet>
				</>
			)
		}}
	/>
)
