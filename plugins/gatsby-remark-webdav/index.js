const visit = require(`unist-util-visit`);
const path = require(`path`);
const fs = require("fs-extra");

module.exports = (
  { markdownAST, markdownNode, getNode, pathPrefix, getNodesByType },
  pluginOptions
) => {
  // We need the markdown file relative path from the dav node
  const fileNode = getNode(markdownNode.parent);
  if (!fileNode || !fileNode.parent) {
    return markdownNode;
  }
  const davNode = getNode(fileNode.parent);
  const dir = path.dirname(davNode.filename);
  const imgdir = davNode.basename.split(".")[0];

  visit(markdownAST, "image", (item) => {
    const ipath = path.join(dir, item.url);
    const fileNodes = getNodesByType(`File`)
      .filter((fn) => {
        if (!fn.parent) {
          return false;
        }
        if (!fn.internal.mediaType.includes("image/")) {
          return false;
        }
        return true;
      })
      .map((fn) => {
        const davNode = getNode(fn.parent);
        return {
          ...fn,
          davFilename: davNode.filename,
        };
      });

    const fNode = fileNodes.find((f) => f.davFilename === ipath);
    if (!fNode) {
      console.warn("Unable to find webdav file for node", ipath);
      return;
    }
    const dirPath = path
      .join(process.cwd(), "public", dir, imgdir)
      .toLowerCase();
    const dstPath = path.join(dirPath, "../", item.url);
    fs.ensureDirSync(dirPath);
    fs.copyFileSync(fNode.absolutePath, dstPath);
  });

  return markdownAST;
};
