import type { HybrIQSDK } from "@hybriq/sdk";
import { config } from "../config.js";

const SYSTEM_PROMPT = `You are a conversation summarizer for a Slack workspace. Your job is to produce clear, actionable summaries.

Guidelines:
- Start with a one-line TL;DR
- Group related topics with bullet points
- Highlight action items with a dedicated "Action Items" section
- Note any decisions made
- Keep the summary under 200 words
- Use Slack-friendly formatting`;

interface SummarizeContext {
  channel: string;
  text: string;
}

export async function summarizer(
  sdk: HybrIQSDK,
  context: SummarizeContext
): Promise<string> {
  const result = await sdk.execute({
    model: config.defaultModel,
    messages: [
      {
        role: "user",
        content: `Please summarize the following conversation or topic:\n\n${context.text}`,
      },
    ],
    systemPrompt: SYSTEM_PROMPT,
    maxTokens: config.maxTokens,
    metadata: {
      ...config.metadata,
      agent: "summarizer",
      slackChannel: context.channel,
    },
  });

  return result.response;
}
