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
    console.log(result.errors);
    throw new Error("Things broke, see console output above");
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    console.log("page node", node);
    if (path) {
      createPage({
        path: node.fields && node.fields.slug,
        component: blogPostTemplate,
        context: {},
      });
    } else {
      console.warn("Node doesn't have path set", node.frontmatter.title, node);
    }
  });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    if (!node.parent) {
      return;
    }
    const fileNode = getNode(node.parent);
    if (!fileNode.parent) {
      return;
    }

    console.log("md node", node);

    const davNode = getNode(fileNode.parent);

    const namePath = path.parse(davNode.filename);

    const title = node.frontmatter.title || namePath.name || "wtf gatsby";

    const slug =
      davNode && davNode.type === "webdav"
        ? `${namePath.dir}/${namePath.name}`.toLowerCase()
        : createFilePath({ node, getNode, basePath: `pages` });

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
  }
};

exports.onPostBuild = () => {
  cp.execSync("npm run build-cv");
};
