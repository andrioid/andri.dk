const path = require('path')
const cp = require('child_process')
const { createFilePath } = require('gatsby-source-filesystem')

// exports.onCreateWebpackConfig = ({ getConfig, actions }) => {
// 	const oldConfig = getConfig()
// 	const config = {
// 		...oldConfig,
// 		output: {
// 			...oldConfig.output,
// 			globalObject: 'this'
// 		}
// 	}

// 	actions.replaceWebpackConfig(config)
// }

exports.createPages = async ({ actions, graphql }) => {
	const { createPage } = actions
	const blogPostTemplate = path.resolve(`src/layouts/blog-post.js`)
	const result = await graphql(`
		{
			allMarkdownRemark(
				sort: { order: DESC, fields: [frontmatter___date] }
				limit: 1000
			) {
				edges {
					node {
						excerpt(pruneLength: 250)
						html
						id
						frontmatter {
							date
							path
							title
						}
					}
				}
			}
		}
	`)

	if (result.errors) {
		console.log(result.errors)
		throw new Error('Things broke, see console output above')
	}

	result.data.allMarkdownRemark.edges.forEach(({ node }) => {
		createPage({
			path: node.frontmatter.path,
			component: blogPostTemplate,
			context: {}
		})
	})
}

exports.onCreateNode = ({ node, getNode, actions }) => {
	const { createNodeField } = actions
	if (node.internal.type === `MarkdownRemark`) {
		const slug = createFilePath({ node, getNode, basePath: `pages` })
		createNodeField({
			node,
			name: `slug`,
			value: slug
		})
	}
}

exports.onPostBuild = () => {
	cp.execSync('yarn run build-cv')
}
