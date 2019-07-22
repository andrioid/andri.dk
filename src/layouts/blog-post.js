import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import { Nav } from '../components/nav'

// import '../css/blog-post.css'; // make it pretty!

export default function Template({
	data // this prop will be injected by the GraphQL query we'll write in a bit
}) {
	const { markdownRemark: post } = data // data.markdownRemark holds our post data
	return (
		<>
			<Helmet title={`andri.dk - ${post.frontmatter.title}`} />
			<Nav />
			<div className="blog-post-container pt-4 bg-gray-200 py-2 md:px-4 min-h-screen">
				<div className="bg-white max-w-6xl py-10 shadow px-5 lg:px-10">
					<div className="mb-6">
						<div>
							<h1 className="text-gray-900 font-semibold text-3xl">
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
					</div>

					<div
						className="markdown"
						dangerouslySetInnerHTML={{ __html: post.html }}
					/>
				</div>
			</div>
		</>
	)
}

export const pageQuery = graphql`
	query BlogPostByPath($path: String!) {
		markdownRemark(frontmatter: { path: { eq: $path } }) {
			html
			frontmatter {
				date(formatString: "MMMM DD, YYYY")
				path
				title
				tags
			}
		}
	}
`
