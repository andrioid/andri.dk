const path = require('path')

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

exports.createPages = async ({ boundActionCreators, graphql }) => {
	const { createPage } = boundActionCreators
	const blogPostTemplate = path.resolve(`src/templates/blog-post.js`)
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
			console.log('wtf man', result.errors)
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
