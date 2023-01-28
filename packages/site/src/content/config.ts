import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		date: z.string().transform((str) => new Date(str)),
		draft: z.boolean(),
		tags: z.array(z.string()).optional(),
		description: z.string().optional(),
	}),
});

const cvCollection = defineCollection({
	schema: z.object({}),
});

export const collections = {
	blog: blogCollection,
	cv: cvCollection,
};
