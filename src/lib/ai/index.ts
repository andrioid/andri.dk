import { MODEL_BOX_API_KEY as apiKey } from "astro:env/server";
import OpenAI from "openai";

const client = new OpenAI({
	baseURL: "https://api.model.box/v1",
	apiKey,
});

const defaultBody: Partial<OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming> =
	{
		model: "deepseek/deepseek-chat",
		temperature: 1.5,
		max_tokens: 150,
		max_completion_tokens: 100,
	};

type PromptBody = typeof defaultBody;

export async function textPrompt(
	userPrompt: string,
	body: PromptBody = defaultBody,
): Promise<string> {
	const messages = body.messages ?? [];
	messages.push({
		role: "user",
		content: userPrompt,
	});
	const data = await client.chat.completions.create({
		...body,
		//model: "meta-llama/llama-3.2-3b-instruct",
		model: "deepseek/deepseek-chat",
		messages,
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

export async function imagePrompt(prompt: string): Promise<string | undefined> {
	const data = await client.images.generate({
		prompt,
		n: 1,
		size: "512x512",
		model: "black-forest-labs/flux-schnell",
	});

	const img = data.data[0];
	return img.url;
}
