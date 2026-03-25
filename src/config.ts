export const config = {
  appName: "HybrIQ Slack Bot",

  // Default model for AI responses
  // Change this to use a different model (e.g., "gpt-4o" for OpenAI)
  defaultModel: "claude-sonnet-4-5-20250929",

  // Fallback model if the primary is unavailable
  fallbackModel: "claude-haiku-4-5-20251001",

  // Maximum tokens for AI responses
  maxTokens: 1024,

  // Metadata tag for HybrIQ execution tracking
  metadata: {
    source: "scaffold",
    platform: "slack",
  },
} as const;
