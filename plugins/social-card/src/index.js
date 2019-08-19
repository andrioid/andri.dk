const fs = require('fs')
const path = require('path')
const generateCard = require('./build').generateCard
const uuid = require('uuid/v4')

// Remark plugin, maybe not do that?
module.exports = ({ markdownNode }, options) => {
	const post = markdownNode.frontmatter

	const output = path.join('./public', 'social-card-' + uuid() + '.jpg')

	generateCard({ title: post.title }, output)
		.then(() => {
			console.log('Social card generated: ' + output)
		})
		.catch(err => {
			console.log('ERROR while generating card', err)
		})
}
