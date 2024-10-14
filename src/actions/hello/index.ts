import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getCountryFromHeaders } from "./country";
import { aiImage, greetingPrompt, imagePrompt, promptAI } from "./ai";
import { COUNTRIES } from "./country-list";

export const hello = {
  getGreeting: defineAction({
    input: z.object({
      country: z.enum(COUNTRIES).optional(),
    }),
    handler: async (
      input,
      ctx,
    ): Promise<{
      insult: string;
      image?: string;
    }> => {
      const country = input.country;
      if (!country)
        return {
          insult:
            "I couldn't figure out where you're from. So no insult for you.",
        };
      const insult = await promptAI(greetingPrompt(country));
      let img = undefined;
      try {
        img = await aiImage(imagePrompt(insult, country));
      } catch (err) {
        console.error("Image generation failed", err);
      }

      console.log("[Insult] " + insult, img);

      if (insult)
        return {
          insult: insult,
          image: img,
        };
      return {
        insult: `Something went wrong`,
        image: img,
      };
    },
  }),
  getCountry: defineAction({
    handler: async (input, ctx) => {
      try {
        return getCountryFromHeaders(ctx.request.headers);
      } catch (err) {
        return undefined;
      }
    },
  }),
};
