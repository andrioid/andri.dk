module.exports = {
	siteMetadata: {
		title: `andri.dk`,
		description: 'Personal homepage, portfolio and tech blog',
		siteUrl: 'https://andri.dk'
	},
	plugins: [
		// `gatsby-plugin-netlify-cms`,
		'gatsby-transformer-remark',
		`gatsby-transformer-sharp`,
		`gatsby-plugin-sharp`,

		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `pages`,
				path: `${__dirname}/src/pages/`
			}
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `blog`,
				path: `${__dirname}/src/blog/`
			}
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `img`,
				path: `${__dirname}/static/img/`
			}
		},
		{
			resolve: `gatsby-plugin-typography`,
			options: {
				pathToConfigModule: `src/utils/typography`,
				omitGoogleFont: true
			}
		},
		`gatsby-plugin-react-helmet`,
		'gatsby-plugin-catch-links',
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
