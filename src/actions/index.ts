import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
	contactMe: defineAction({
		accept: "form",
		input: z.object({
			email: z.string(),
		}),
		handler: async (input) => {
			console.log("EMAIL YEAH" + input.email);
			return `Hello, ${input.email}!`;
		},
	}),
};
