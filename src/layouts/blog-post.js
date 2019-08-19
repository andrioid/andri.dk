import React from 'react'
import { graphql } from 'gatsby'
import { Nav } from '../components/nav'
import Img from 'gatsby-image'
import { Layout } from './layout'
import { SEO } from '../components/seo'

// import '../css/blog-post.css'; // make it pretty!

export default function Template({
	data // this prop will be injected by the GraphQL query we'll write in a bit
}) {
	if (!data) {
		return null
	}
	const { markdownRemark: post } = data // data.markdownRemark holds our post data
	const { cover } = post.frontmatter
	return (
		<Layout slug={data.markdownRemark.fields.slug}>
			<SEO frontmatter={post.frontmatter} postData={post} />
			<Nav />
			<div className="blog-post-container pt-4 bg-gray-200 py-2 md:py-10 md:px-10 min-h-screen">
				<div className="bg-white max-w-4xl py-10 shadow px-5 lg:px-10">
					{cover ? (
						<Img
							//sizes={cover.childImageSharp.sizes}
							//className="max-w-xl flex items-center justify-center"
							fluid={cover.childImageSharp.fluid}
							//className="max-h-one-third-screen"
						/>
					) : null}

					<div>
						<h1 className="text-gray-900 font-semibold text-xl md:text-3xl">
							{post.frontmatter.title}
						</h1>
						<div className="text-sm text-gray-600 flex justify-start mb-4">
							<p>{post.frontmatter.date}</p>
						</div>
						<div className="mb-4 ">
							{post.frontmatter.tags.map(t => (
								<span key={t} className="tag text-xs">
									{t}
								</span>
							))}
						</div>
					</div>

					<div className="mb-6"></div>

					<div
						className="markdown text-sm md:text-base"
						dangerouslySetInnerHTML={{ __html: post.html }}
					/>
				</div>
			</div>
		</Layout>
	)
}

export const pageQuery = graphql`
	query BlogPostByPath($path: String!) {
		markdownRemark(frontmatter: { path: { eq: $path } }) {
			html
			fields {
				slug
				socialcard
			}
			frontmatter {
				date(formatString: "MMMM DD, YYYY")
				path
				title
				tags
				cover {
					publicURL
					childImageSharp {
						fluid(
							maxWidth: 2000
							quality: 100
							maxHeight: 420
							fit: COVER
							background: "#ffffff"
						) {
							...GatsbyImageSharpFluid
						}
						sizes(maxWidth: 2000) {
							...GatsbyImageSharpSizes
						}
					}
				}
			}
		}
	}
`
