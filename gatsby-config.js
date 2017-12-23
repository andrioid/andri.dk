module.exports = {
	siteMetadata: {
		title: `andri.dk`
	},
	plugins: [
		{
			resolve: 'gatsby-source-filesystem',
			options: { name: 'src', path: `${__dirname}/src/` }
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
