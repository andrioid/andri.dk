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
  date: Date;
  excerpt?: string;
  content?: string;
  sourceFile?: string;
};

export async function getPostFilenames() {
  const paths = await globby(["**/*.md"], {
    cwd: POST_DIR,
  });
  return paths;
}

export async function getAllPosts(fields: string[] = []): Promise<BlogPost[]> {
  const paths = await getPostFilenames();
  const posts: BlogPost[] = paths
    .map((pathname) => ({
      sourceFile: pathname,
      ...getPostByFilename(pathname, fields),
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  return posts;
}

export function getPostByFilename(filename, fields = []): BlogPost {
  const p = path.join(POST_DIR, filename);
  if (!fs.existsSync(p)) {
    console.error("File does not exist", p);
    return;
  }
  const m = fs.readFileSync(p, "utf8");
  const { data, content, excerpt } = matter(m, { excerpt: true });
  let item: BlogPost = {
    path: "",
    title: "",
    date: new Date(),
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
