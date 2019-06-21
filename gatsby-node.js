require('@babel/register')({
	presets: ['babel-preset-gatsby']
})
//require('@babel/polyfill')
// require('react')
module.exports = require(`./gatsby-node-old.js`)
