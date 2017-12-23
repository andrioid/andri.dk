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
			resolve: 'gatsby-source-rss-fork',
			options: {
				rssURL:
					'https://feeds.pinboard.in/rss/secret:16b24ead131e0282c0a9/u:andrioid/'
			}
		},
		'gatsby-transformer-remark',
		`gatsby-plugin-react-helmet`,
		{
			resolve: `gatsby-plugin-google-analytics`,
			options: {
				trackingId: 'UA-1081252-4',
				// Setting this parameter is optional
				anonymize: true
			}
		}
	]
}
