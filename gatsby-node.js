const path = require("path");
const cp = require("child_process");
const { createFilePath } = require("gatsby-source-filesystem");

exports.createPages = async ({ actions, graphql }) => {
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
    console.log(result.errors);
    throw new Error("Things broke, see console output above");
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    const path = node.frontmatter.path;
    if (path) {
      createPage({
        path: node.frontmatter.path,
        component: blogPostTemplate,
        context: {},
      });
    } else {
      console.warn("Node doesn't have path set", node.frontmatter.title, node);
    }
  });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  console.debug("onCreateNode", node);
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }
};

exports.onPostBuild = () => {
  cp.execSync("npm run build-cv");
};
