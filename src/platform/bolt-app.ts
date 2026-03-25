import { App } from "@slack/bolt";
import { hybriq } from "../hybriq.js";
import { config } from "../config.js";
import { qaBot } from "../agents/qa-bot.js";
import { summarizer } from "../agents/summarizer.js";
import { ticketRouter } from "../agents/ticket-router.js";

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
});

// Handle @mentions — routes to Q&A bot by default
app.event("app_mention", async ({ event, say }) => {
  try {
    const result = await qaBot(hybriq, event.text ?? "", {
      channel: event.channel,
      user: event.user ?? "unknown",
      thread_ts: event.thread_ts ?? event.ts,
    });
    await say({ text: result, thread_ts: event.thread_ts ?? event.ts });
  } catch (error) {
    console.error("[hybriq] Execution failed:", error);
    await say({
      text: "Sorry, I encountered an error processing your request. Please check that your HybrIQ API key is configured correctly.",
      thread_ts: event.thread_ts ?? event.ts,
    });
  }
});

// /summarize — summarize recent channel messages
app.command("/summarize", async ({ command, ack, respond }) => {
  await ack();
  try {
    const result = await summarizer(hybriq, {
      channel: command.channel_id,
      text: command.text || "Summarize the recent conversation",
    });
    await respond({ text: result, response_type: "ephemeral" });
  } catch (error) {
    console.error("[hybriq] Summarizer failed:", error);
    await respond({
      text: "Failed to generate summary. Please try again.",
      response_type: "ephemeral",
    });
  }
});

// /route — classify and route a support ticket
app.command("/route", async ({ command, ack, respond }) => {
  await ack();
  try {
    const result = await ticketRouter(hybriq, {
      text: command.text,
      channel: command.channel_id,
      user: command.user_id,
    });
    await respond({ text: result, response_type: "in_channel" });
  } catch (error) {
    console.error("[hybriq] Ticket router failed:", error);
    await respond({
      text: "Failed to route ticket. Please try again.",
      response_type: "ephemeral",
    });
  }
});
