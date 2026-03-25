import type { HybrIQSDK } from "@hybriq/sdk";
import { config } from "../config.js";

const SYSTEM_PROMPT = `You are a support ticket classifier and router. Analyze incoming messages and determine:

1. **Urgency**: Critical / High / Medium / Low
2. **Department**: Engineering, Product, Sales, Support, Billing, Other
3. **Summary**: One-line summary of the issue

Format your response as:
*Urgency*: [level]
*Department*: [department]
*Summary*: [one-line summary]
*Recommended Action*: [what should happen next]

Guidelines:
- Be decisive — always pick a department, never say "unclear"
- Critical = system down, data loss, security breach
- High = user-blocking bug, revenue impact
- Medium = non-blocking bug, feature request
- Low = question, cosmetic issue, nice-to-have`;

interface TicketContext {
  text: string;
  channel: string;
  user: string;
}

export async function ticketRouter(
  sdk: HybrIQSDK,
  context: TicketContext
): Promise<string> {
  const result = await sdk.execute({
    model: config.defaultModel,
    messages: [
      {
        role: "user",
        content: `Classify and route this support ticket:\n\n${context.text}`,
      },
    ],
    systemPrompt: SYSTEM_PROMPT,
    maxTokens: 512,
    metadata: {
      ...config.metadata,
      agent: "ticket-router",
      slackChannel: context.channel,
      slackUser: context.user,
    },
  });

  return result.response;
}
