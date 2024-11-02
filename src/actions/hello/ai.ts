import { OpenAI } from "openai";

const client = new OpenAI({
	baseURL: "https://api.model.box/v1",
	apiKey: import.meta.env.MODEL_BOX_API_KEY,
});

export function greetingPrompt(country: string) {
	return [
		`You are a travel journalist knowledgeable of all countries of the world`,
		`You are creative and full of sarcasm and wit`,
		`Make up a random fact about ${country}`,
	].join(". ");
}

export function imagePrompt(insult: string, country: string) {
	const prompt = [
		`Summarize the following joke about ${country}: "${insult}"`,
		"stunning shot, beautiful nature, people",
		"Caricature art-style",
		"No text, No titles, No quotes",
	];
	return prompt.join(". ");
}

export async function promptAI(prompt: string): Promise<string> {
	const data = await client.chat.completions.create({
		//model: "meta-llama/llama-3.2-3b-instruct",
		model: "deepseek/deepseek-chat",

		messages: [
			{
				role: "user",
				content: prompt,
			},
		],
		temperature: 1.5,
		max_tokens: 150,
		max_completion_tokens: 100,
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
