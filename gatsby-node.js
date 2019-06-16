require('@babel/register')({
	presets: ['env', 'gatsby']
})
require('@babel/polyfill')
module.exports = require(`./gatsby-node-babel.js`)
