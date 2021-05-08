// Node.js only
import { fstat } from "fs";
import globby from "globby";
import path from "path";
import fs from "fs";
import matter from "gray-matter";

const POST_DIR = "blog";

export type BlogPost = {
  path: string;
  title: string;
  date: string;
  excerpt?: string;
  content?: string;
  localFile?: string;
};

export async function getPostFilenames() {
  const paths = await globby(["**/*.{md,mdx}"], {
    cwd: POST_DIR,
  });
  console.log("allfiles", paths);
  return paths;
}

export async function getAllPosts(fields: string[] = []): Promise<BlogPost[]> {
  const paths = await getPostFilenames();
  let posts: BlogPost[] = [];
  for (const k in paths) {
    const post = await getPostByFilename(paths[k], fields);
    posts.push({
      localFile: paths[k],
      ...post,
    });
  }
  posts = posts.sort((a, b) => (a.date < b.date ? -1 : 1));
  return posts;
}

export async function getPostByName(
  name: string,
  fields = []
): Promise<BlogPost> {
  const searchPath = name + ".{md,mdx}";
  console.log("searchpath", searchPath);
  const pf = await globby([searchPath], { cwd: POST_DIR });
  console.log("pf", pf);

  if (pf.length === 0) {
    throw new Error("File not found: " + name);
  }
  const localFile = pf[0];
  return getPostByFilename(localFile, fields);
}

export async function getPostByFilename(
  localFile: string,
  fields = []
): Promise<BlogPost> {
  const fullPath = path.join(POST_DIR, localFile);
  if (!fs.existsSync(fullPath)) {
    console.error("File does not exist", fullPath);
    throw new Error("Internal server error");
  }
  const m = fs.readFileSync(fullPath, "utf8");
  const { data, content, excerpt } = matter(m, { excerpt: true });
  let item: BlogPost = {
    path: "",
    title: "",
    date: new Date().toISOString(),
  };
  if (data["path"]) {
    data["path"] = data["path"].replace(/^\//, ""); // Trim the prefix
  }
  fields.forEach((field) => {
    if (field === "content") {
      item[field] = content;
    }
    if (field === "excerpt") {
      item[field] = excerpt || content.split("\n").slice(0, 4).join(" ");
    }
    if (data[field]) {
      item[field] = data[field];
    }
  });
  return item;
}
