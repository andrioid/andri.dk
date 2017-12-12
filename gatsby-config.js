module.exports = {
	siteMetadata: {
		title: `andri.dk`
	},
	plugins: [
		{
			resolve: 'gatsby-source-filesystem',
			options: { name: 'src', path: `${__dirname}/src/` }
		},
		{
			resolve: 'gatsby-source-rss',
			options: {
				rssURL:
					'https://feeds.pinboard.in/rss/secret:16b24ead131e0282c0a9/u:andrioid/'
			}
		},
		'gatsby-transformer-remark',
		`gatsby-plugin-react-helmet`
	]
}
