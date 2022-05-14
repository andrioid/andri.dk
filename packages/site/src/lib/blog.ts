// Purpose: Utilities to help with blog post generation

import type { MarkdownInstance } from "astro"
import { parse } from 'path'

export interface Frontmatter {
    title: string;
    date: string;
    draft: boolean;
    tags?: string[];
    // Slug override. Relative to "blog/"
    slug?: string;
    description?: string;
}

export type BlogPost = MarkdownInstance<Frontmatter>;

export function postMapper(post: MarkdownInstance<Frontmatter>): BlogPost {
    // Use filename for slug if none defined
    if (!post.frontmatter.slug) {
        const [, relFile] = post.file.split("blog/");
        const rf = parse(relFile);
        const postSlug = rf.dir ? `${rf.dir}/${rf.name}` : rf.name; // Maybe add override via slug frontmatter?  
        post.frontmatter.slug = postSlug;
    }

    return {
        ...post
    }
}
