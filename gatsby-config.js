module.exports = {
  siteMetadata: {
    title: `andri.dk`,
    description:
      "I make websites, create apps, manage infrastructure, develop products and more.",
    siteUrl:
      process.env.NODE_ENV === "production"
        ? "https://andri.dk"
        : "http://localhost:8000",
    author: "Andri Óskarsson",
    social: {
      twitter: "andrioid",
    },
    goatcounterCode: "andrioid",
  },
  plugins: [
    "gatsby-plugin-postcss",
    {
      resolve: "gatsby-plugin-social-cards",
      options: {
        authorImage: "./static/img/coffee-art.jpg",
        backgroundImage: "./static/img/wave.svg",
        defaultAuthor: "Andri Óskarsson",
        design: "card",
      },
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
              return allMarkdownRemark.edges.map((edge) => {
                return Object.assign(
                  {},
                  edge.node.frontmatter,
                  edge.node.fields,
                  {
                    description: edge.node.excerpt,
                    date: edge.node.fields.date,
                    url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                    guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                    custom_elements: [{ "content:encoded": edge.node.html }],
                  }
                );
              });
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
                    fields {
                      slug
                      title
                      date
                    }
									}
								}
							}
						}
						`,
            output: "/rss.xml",
            // optional configuration to insert feed reference in pages:
            // if `string` is used, it will be used to create RegExp and then test if pathname of
            // current page satisfied this regular expression;
            // if not provided or `undefined`, all pages will have feed reference inserted
            match: "^/blog/",
          },
        ],
      },
    },
    "gatsby-plugin-image",
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `blog`,
        path: `${__dirname}/src/blog/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `img`,
        path: `${__dirname}/static/img/`,
      },
    },
    {
      resolve: `@andrioid/gatsby-source-webdav`,
      options: {
        baseURL: process.env["BLOGDATA_URL"],
        credentials: {
          username: process.env["BLOGDATA_USER"],
          password: process.env["BLOGDATA_PASSWORD"],
        },
        recursive: true,
        glob: "**/*.{md,jpg,jpeg,png,gif}",
        sharePath: process.env["BLOGDATA_PATH"],
      },
    },
    "gatsby-transformer-json", // Resume JSON
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: "./src/cv",
      },
    },

    `gatsby-plugin-react-helmet`,
    "gatsby-plugin-catch-links",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          "gatsby-remark-webdav",
          // "gatsby-remark-mermaid",
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              prompt: {
                user: "groot",
                global: true,
              },
            },
          },
          {
            resolve: "gatsby-remark-images",
            //tracedSVG: true,
            options: {
              maxWidth: 896,
              wrapperStyle: "max-width: 896px;",
            },
          },
          "gatsby-remark-autolink-headers",
        ],
      },
    },
  ],
};
