export function greetingPrompt(country: string) {
  return `You are an internet troll, full of sarcasm and wit. Make up an insult about the country of ${country}`;
}

export async function promptAI(prompt: string): Promise<string> {
  const apiKey = import.meta.env.MODEL_BOX_API_KEY;
  if (!apiKey)
    throw new Error("Seems someone forgot to add an API key to the secrets...");
  try {
    const response = await fetch("https://api.model.box/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 100,
      }),
      //signal: AbortSignal.timeout(1000),
    });

    if (!response.ok) {
      console.error(response.statusText);
      if (response.body) {
        const body = response.body;
        console.log("body", response.headers);
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const msg = data.choices[0].message;
    return msg.content;
  } catch (error) {
    throw new Error("Failed to talk to the AI API");
  }
}
