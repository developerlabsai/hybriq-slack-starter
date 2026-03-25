import type { HybrIQSDK } from "@hybriq/sdk";
import { config } from "../config.js";

const SYSTEM_PROMPT = `You are a helpful AI assistant in a Slack workspace. You answer questions clearly and concisely.

Guidelines:
- Keep responses focused and under 300 words
- Use Slack-friendly formatting (bold with *text*, code with \`backticks\`, lists with bullet points)
- If you don't know something, say so honestly
- Be professional but approachable`;

interface SlackContext {
  channel: string;
  user: string;
  thread_ts: string;
}

export async function qaBot(
  sdk: HybrIQSDK,
  userMessage: string,
  context: SlackContext
): Promise<string> {
  // Strip the bot mention from the message
  const cleanMessage = userMessage.replace(/<@[A-Z0-9]+>/g, "").trim();

  const result = await sdk.execute({
    model: config.defaultModel,
    messages: [
      { role: "user", content: cleanMessage },
    ],
    systemPrompt: SYSTEM_PROMPT,
    maxTokens: config.maxTokens,
    metadata: {
      ...config.metadata,
      agent: "qa-bot",
      slackChannel: context.channel,
      slackUser: context.user,
    },
  });

  return result.response;
}
