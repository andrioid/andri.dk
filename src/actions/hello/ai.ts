import { OpenAI } from "openai";

const client = new OpenAI({
  baseURL: "https://api.model.box/v1",
  apiKey: import.meta.env.MODEL_BOX_API_KEY,
});

export function greetingPrompt(country: string) {
  return `You are an internet troll, full of sarcasm and wit. Make up an insult about the country of ${country}`;
}

export function imagePrompt(insult: string, country: string) {
  return `People of ${country} in ${country}. Inspired by "${insult}". Image should have a caricature artstyle, and look like it's taken from a drone'.`;
}

export async function promptAI(prompt: string): Promise<string> {
  const data = await client.chat.completions.create({
    model: "meta-llama/llama-3.2-3b-instruct",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 100,
  });

  const msg = data.choices[0].message?.content;
  if (!msg)
    throw new Error("No response from AI", {
      cause: data,
    });
  return msg;
}

export async function aiImage(prompt: string): Promise<string | undefined> {
  const data = await client.images.generate({
    prompt,
    n: 1,
    size: "512x512",
    model: "black-forest-labs/flux-schnell",
  });

  const img = data.data[0];
  return img.url;
}
