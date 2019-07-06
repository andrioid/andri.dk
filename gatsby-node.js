const path = require('path')
const cp = require('child_process')
const { createFilePath } = require('gatsby-source-filesystem')

// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = async ({ page, boundActionCreators }) => {
	const { createPage } = boundActionCreators

	return new Promise((resolve, reject) => {
		if (page.path.match(/^\/$/)) {
			// It's assumed that `landingPage.js` exists in the `/layouts/` directory
			page.layout = 'plain'

			// Update the page.
			createPage(page)
		}

		resolve()
	})
}

exports.onCreateWebpackConfig = ({ getConfig, actions }) => {
	const oldConfig = getConfig()
	const config = {
		...oldConfig,
		output: {
			...oldConfig.output,
			globalObject: 'this'
		}
	}

	actions.replaceWebpackConfig(config)
}

exports.createPages = async ({ boundActionCreators, graphql }) => {
	const { createPage } = boundActionCreators
	const blogPostTemplate = path.resolve(`src/layouts/blog-post.js`)
	return graphql(`
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
	`).then(result => {
		if (result.errors) {
			return Promise.reject(result.errors)
		}
		result.data.allMarkdownRemark.edges.forEach(({ node }) => {
			if (!node.frontmatter.path) {
				throw new Error(JSON.stringify(node))
			}
			createPage({
				path: node.frontmatter.path,
				component: blogPostTemplate,
				context: {} // additional data can be passed via context
			})
		})
	})
}

exports.onCreateNode = ({ node, actions, getNode }) => {
	const { createNodeField } = actions
	if (node.internal.type === `MarkdownRemark`) {
		const value = createFilePath({ node, getNode })
		createNodeField({
			name: `slug`,
			node,
			value
		})
	}
}

exports.onPostBuild = () => {
	cp.execSync('yarn run build-cv')
}
