require('@babel/register')({
	presets: [['babel-preset-gatsby', { targets: { node: 'current' } }]]
})
//require('@babel/polyfill')
// require('react')
module.exports = require(`./gatsby-node-old.js`)
