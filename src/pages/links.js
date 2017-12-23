import React from 'react'

const Links = ({ data: { allRssFeedItem: { edges: links } } }) => {
	return (
		<div>
			<h1>Links</h1>
			<ul>
				{links.map(({ node }) => (
					<li key={node.id}>
						<a href={node.link} target="_blank">
							{node.title}
						</a>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Links

export const query = graphql`
	query LinksQuery {
		allRssFeedItem {
			edges {
				node {
					id
					title
					link
				}
			}
		}
	}
`
