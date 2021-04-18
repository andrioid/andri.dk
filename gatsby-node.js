const path = require("path");

exports.createPages = async ({ actions, graphql, reporter }) => {
  try {
    console.debug("createPages called");
    const { createPage } = actions;
    const blogPostTemplate = path.resolve(`src/layouts/blog-post.js`);
    const result = await graphql(`
      {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          limit: 1000
        ) {
          edges {
            node {
              excerpt(pruneLength: 250)
              html
              id
              fields {
                slug
                title
              }
              frontmatter {
                date
                path
                title
              }
            }
          }
        }
      }
    `);

    if (result.errors) {
      console.error(result.errors);
      reporter.panic("Page query failed");
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      if (node.fields && node.fields.slug) {
        createPage({
          path: node.fields && node.fields.slug,
          component: blogPostTemplate,
          context: {},
        });
      }
    });
  } catch (err) {
    console.error(err);
    reporter.panic("Failed to create page");
  }
};

exports.onCreateNode = ({ node, getNode, actions, reporter }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    if (!node.parent) {
      return;
    }
    const fileNode = getNode(node.parent);

    const { frontmatter } = node;
    let title = frontmatter.title;
    let slug = frontmatter && frontmatter.path;
    let date = frontmatter && frontmatter.date && new Date(frontmatter.date);
    let tags = (frontmatter && frontmatter.tags) || [];
    let draft = frontmatter.draft === true || false;

    if (fileNode.parent) {
      const davNode = getNode(fileNode.parent);
      if (davNode && davNode.internal.type === "webdav") {
        const namePath = path.parse(davNode.filename);
        if (!title) {
          title = namePath.name;
        }
        if (!slug) {
          slug = `${namePath.dir}/${namePath.name}`.toLowerCase();
        }
        if (!date) {
          date = new Date(davNode.lastmod);
        }
      }
    }

    if (!slug) {
      console.error("no slug", node);
      //reporter.panic("No slug found for markdown node");
    }

    createNodeField({
      node,
      name: `title`,
      value: title,
    });

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });

    createNodeField({
      node,
      name: `date`,
      value: date,
    });

    createNodeField({
      node,
      name: `tags`,
      value: tags,
    });

    createNodeField({
      node,
      name: `draft`,
      value: draft,
    });
  }
};
