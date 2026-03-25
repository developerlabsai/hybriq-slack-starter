# HybrIQ Slack Starter

Build AI-powered Slack bots in 5 minutes with [HybrIQ](https://hybriq.dev).

This starter includes 3 pre-built AI agents:
- **Q&A Bot** — Answers questions via `@mention`
- **Summarizer** — Summarizes conversations via `/summarize`
- **Ticket Router** — Classifies and routes support tickets via `/route`

All AI calls route through HybrIQ's execution engine, giving you automatic caching, cost tracking, retry logic, and model switching — without writing any infrastructure code.

## Quick Start (5 minutes)

### Prerequisites

- Node.js 18+ installed
- A [HybrIQ account](https://hybriq.dev) with an API key
- An [Anthropic API key](https://console.anthropic.com) (BYOK)
- A Slack workspace where you can install apps

### 1. Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and click **Create New App** > **From scratch**
2. Name it (e.g., "HybrIQ Bot") and select your workspace
3. Under **OAuth & Permissions**, add these Bot Token Scopes:
   - `app_mentions:read`
   - `chat:write`
   - `commands`
   - `channels:history`
4. Install the app to your workspace and copy the **Bot User OAuth Token** (`xoxb-...`)
5. Under **Socket Mode**, enable it and generate an **App-Level Token** (`xapp-...`) with `connections:write` scope
6. Under **Event Subscriptions**, subscribe to `app_mention` bot event
7. Under **Slash Commands**, create `/summarize` and `/route` commands

### 2. Clone and configure

```bash
git clone https://github.com/developerlabsai/hybriq-slack-starter.git
cd hybriq-slack-starter
cp .env.example .env
```

Edit `.env` with your keys:
```env
HYBRIQ_API_KEY=hiq_live_your_key
ANTHROPIC_API_KEY=sk-ant-your_key
SLACK_BOT_TOKEN=xoxb-your-token
SLACK_APP_TOKEN=xapp-your-token
SLACK_SIGNING_SECRET=your-secret
```

### 3. Install and run

```bash
npm install
npm run dev
```

### 4. Test it

In Slack, mention your bot:
```
@HybrIQ Bot What is the capital of France?
```

The bot responds with an AI-generated answer. Check your HybrIQ dashboard — you'll see the execution logged with cost, tokens, and cache status.

## Customization

### Change the AI model

Edit `src/config.ts`:
```typescript
export const config = {
  defaultModel: "claude-sonnet-4-5-20250929",  // Change this
  // ...
};
```

### Add a new agent

1. Create a new file in `src/agents/` (copy `qa-bot.ts` as a template)
2. Define your system prompt and function
3. Register it in `src/platform/bolt-app.ts` with an event handler or slash command

### Use a different LLM provider

Update `.env` to use OpenAI instead:
```env
OPENAI_API_KEY=sk-your-key
```

Update `src/config.ts`:
```typescript
defaultModel: "gpt-4o",
```

## Deploy

### Railway (one-click)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

Add your environment variables in Railway's dashboard.

### Docker

```bash
docker build -t hybriq-slack-bot .
docker run --env-file .env hybriq-slack-bot
```

## What HybrIQ Gives You

- **Caching** — Same question asked twice? Second time costs $0
- **Cost tracking** — See exactly what each AI call costs in the dashboard
- **Model switching** — Swap Claude for GPT-4 with one config change
- **BYOK** — Use your own API keys, keep 92%+ margins
- **Retry logic** — Automatic retries with exponential backoff on transient failures

## Project Structure

```
src/
├── hybriq.ts          # HybrIQ SDK initialization
├── config.ts          # App configuration (model, tokens, metadata)
├── index.ts           # Entry point
├── platform/
│   └── bolt-app.ts    # Slack Bolt app setup & event handlers
└── agents/
    ├── qa-bot.ts      # Q&A agent (@mention handler)
    ├── summarizer.ts  # Conversation summarizer (/summarize)
    └── ticket-router.ts  # Ticket classifier (/route)
```

## License

MIT

---

Built with [HybrIQ](https://hybriq.dev) — the AI backend that gets cheaper the more you use it.
