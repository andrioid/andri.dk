import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
	loader: glob({
		pattern: ["**/*.md", "**/*.mdx"],
		base: "./src/content/blog",
	}),
	schema: z.object({
		title: z.string(),
		// TODO: use z.coerce.date() ?
		date: z.string().transform((str) => new Date(str)),
		draft: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
		description: z.string().optional(),
		coverImage: z.string().optional(),
	}),
});

export const collections = {
	blog: blogCollection,
};
