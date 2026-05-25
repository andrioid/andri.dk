import { z } from "astro/zod";
import { defineAction } from "astro:actions";

export const server = {
  contactMe: defineAction({
    accept: "form",
    input: z.object({
      email: z.email(),
    }),
    handler: async (input) => {
      console.log("EMAIL YEAH" + input.email);
      return `Hello, ${input.email}!`;
    },
  }),
};
