import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Helmet from 'react-helmet'

export const Layout = ({ slug, children }) => {
	const data = useStaticQuery(graphql`
	query SiteTitleQuery {
		site {
			siteMetadata {
				title
				siteUrl
			}
		}
	}
`)
	return <>
		<Helmet title={data.site.siteMetadata.title}>
			<meta name="twitter:card" content="summary_large_image" />
			<meta
				name="twitter:image"
				content={`${data.site.siteMetadata.siteUrl}${slug}twitter-card.jpg`}
			/>
		</Helmet>
		{children}
	</>
}
