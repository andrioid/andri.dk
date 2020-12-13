import React from 'react'
import Link from 'gatsby-link'
import { graphql } from 'gatsby'
import { Nav } from '../components/nav'

// import '../css/index.css'; // add some style if you want!

export default function Index({ data }) {
	const { edges: posts } = data.allMarkdownRemark
	return (
		<>
			<Nav />
			<div className="">
				{posts
					.filter(post => post.node.frontmatter.title.length > 0)
					.map(({ node: post }) => {
						return (
							<div className="p-4 max-w-xl" key={post.id}>
								<h1 className="text-xl uppercase">
									<Link to={post.frontmatter.path}>
										{post.frontmatter.title}
									</Link>
								</h1>
								<h2 className="text-gray-500">{post.frontmatter.date}</h2>
								<p>{post.excerpt}</p>
							</div>
						)
					})}
			</div>
		</>
	)
}

export const pageQuery = graphql`
	query IndexQuery {
		allMarkdownRemark(
			sort: { order: DESC, fields: [frontmatter___date] }
			filter: { fields: { draft: { ne: true } } }
		) {
			edges {
				node {
					excerpt(pruneLength: 250)
					id
					frontmatter {
						title
						date(formatString: "YYYY-MM-DD")
						path
						tags
					}
				}
			}
		}
	}
`
