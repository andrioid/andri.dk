import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  contactMe: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email(),
    }),
    handler: async (input) => {
      console.log("EMAIL YEAH" + input.email);
      return `Hello, ${input.email}!`;
    },
  }),
  getGreeting: defineAction({
    input: z.object({
      name: z.string(),
    }),
    handler: async (input, ctx) => {
      // https://discord.com/channels/830184174198718474/1295282295510405202
      // TODO: Revisit this. Can't find the IP in the Astro request
      const ip = ctx.request.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        .trim();
      if (!ip) return "Go away";
      //if (!ip) ip = "193.4.194.2";

      const res = await fetch(`http://ip-api.com/json/${ip}`);
      const resJ = await res.json();
      if (resJ.country) {
        return `Hi ${resJ.country}`;
      }

      return `Something went wrong`;
    },
  }),
};
