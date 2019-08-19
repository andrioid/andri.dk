const generateCard = require('./build').generateCard
const path = require('path')
const uuid = require('uuid')

exports.onCreateNode = ({ node, getNode, actions }) => {
	const { createNodeField } = actions
	if (node.internal.type === `MarkdownRemark`) {
		//console.log('from plugin', node, node.internal.type)
		const post = node.frontmatter
		//console.log('from plugin', post)
		const filename = 'social-card-' + uuid() + '.jpg'
		const output = path.join('./public', filename)

		generateCard({ title: post.title }, output)
			.then(() => {
				console.log('Social card generated: ' + output)
				createNodeField({
					node,
					name: `socialcard`,
					value: filename
				})
			})
			.catch(err => {
				console.log('ERROR while generating card', err)
			})
	}
}
