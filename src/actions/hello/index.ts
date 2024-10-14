import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getCountryFromHeaders } from "./country";
import { greetingPrompt, promptAI } from "./ai";

export const hello = {
  getGreeting: defineAction({
    input: z.object({
      name: z.string(),
    }),
    handler: async (input, ctx) => {
      const country = await getCountryFromHeaders(ctx.request.headers);
      // https://discord.com/channels/830184174198718474/1295282295510405202
      // TODO: Revisit this. Can't find the IP in the Astro request
      if (!country)
        return "I couldn't figure out where you're from. So no insult for you.";
      const greeting = await promptAI(greetingPrompt(country));
      if (greeting) return greeting;
      return `Something went wrong`;
    },
  }),
};
