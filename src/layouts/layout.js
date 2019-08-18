import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Helmet from 'react-helmet'

export const Layout = ({ slug, children }) => (
	<StaticQuery
		query={graphql`
			query SiteTitleQuery {
				site {
					siteMetadata {
						title
						siteUrl
					}
				}
			}
		`}
		render={data => (
			<>
				<Helmet title={data.site.siteMetadata.title}>
					<meta name="twitter:card" content="summary_large_image" />
					<meta
						name="twitter:image"
						content={`${data.site.siteMetadata.siteUrl}${slug}twitter-card.jpg`}
					/>
				</Helmet>
				{children}
			</>
		)}
	/>
)
