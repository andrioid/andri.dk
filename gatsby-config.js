module.exports = {
	siteMetadata: {
		title: `andri.dk`,
		description:
			'I make websites, create apps, manage infrastructure, develop products and more.',
		siteUrl:
			process.env.NODE_ENV === 'production'
				? 'https://andri.dk'
				: 'http://localhost:8000',
		author: 'Andri Óskarsson',
		social: {
			twitter: 'andrioid'
		}
	},
	plugins: [
		{
			resolve: require.resolve('./plugins/social-card'),
			options: {
				authorImage: './static/img/coffee-art.jpg',
				backgroundImage: './static/img/hvitserkur.JPG',
				defaultAuthor: 'Andri Óskarsson',
				design: 'default'
			}
		},
		{
			resolve: `gatsby-plugin-feed`,
			options: {
				query: `
				{
					site {
						siteMetadata {
							title
							description
							siteUrl
							site_url: siteUrl
						}
					}
				}
		  		`,
				feeds: [
					{
						serialize: ({ query: { site, allMarkdownRemark } }) => {
							return allMarkdownRemark.edges.map(edge => {
								return Object.assign({}, edge.node.frontmatter, {
									description: edge.node.excerpt,
									date: edge.node.frontmatter.date,
									url: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
									guid: site.siteMetadata.siteUrl + edge.node.frontmatter.path,
									custom_elements: [{ 'content:encoded': edge.node.html }]
								})
							})
						},
						query: `
						{
							allMarkdownRemark(
								sort: { order: DESC, fields: [frontmatter___date] },
								filter: { frontmatter: { draft: { ne: true } } }
							) {
								edges {
									node {
										excerpt
										html
										frontmatter {
											path
											title
											date
										}
									}
								}
							}
						}
						`,
						output: '/rss.xml',
						// optional configuration to insert feed reference in pages:
						// if `string` is used, it will be used to create RegExp and then test if pathname of
						// current page satisfied this regular expression;
						// if not provided or `undefined`, all pages will have feed reference inserted
						match: '^/blog/'
					}
				]
			}
		},
		{
			resolve: 'gatsby-plugin-draft',
			options: {
				publishDraft: process.env.NODE_ENV !== 'production'
			}
		},
		'gatsby-plugin-postcss',
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
		'gatsby-transformer-json', // Resume JSON
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				path: './src/cv'
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
		},
		{
			resolve: 'gatsby-transformer-remark',
			options: {
				plugins: [
					{
						resolve: 'gatsby-remark-vscode',
						options: {
							wrapperClassName: 'full-width',
							injectStyles: false
						}
					},
					{
						resolve: 'gatsby-remark-images',
						//tracedSVG: true,
						options: {
							maxWidth: 896,
							wrapperStyle: 'max-width: 896px;'
						}
					},
					{
						resolve: 'gatsby-remark-copy-linked-files'
					}
				]
			}
		}
	]
}
