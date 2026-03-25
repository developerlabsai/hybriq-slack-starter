import "dotenv/config";
import { app } from "./platform/bolt-app.js";

const PORT = Number(process.env.PORT) || 3000;

async function main(): Promise<void> {
  // Validate required environment variables
  const required = ["HYBRIQ_API_KEY", "ANTHROPIC_API_KEY", "SLACK_BOT_TOKEN", "SLACK_APP_TOKEN"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    console.error("Copy .env.example to .env and fill in your API keys.");
    console.error("See README.md for setup instructions.");
    process.exit(1);
  }

  await app.start(PORT);
  console.log(`\nHybrIQ Slack Bot is running!`);
  console.log(`  Socket Mode: enabled`);
  console.log(`  Port: ${PORT}`);
  console.log(`\nAvailable commands:`);
  console.log(`  @bot <question>  — Ask the AI Q&A bot`);
  console.log(`  /summarize       — Summarize a conversation`);
  console.log(`  /route <ticket>  — Classify and route a support ticket`);
  console.log(`\nPowered by HybrIQ — https://hybriq.dev`);
}

main().catch((error) => {
  console.error("Failed to start:", error);
  process.exit(1);
});
