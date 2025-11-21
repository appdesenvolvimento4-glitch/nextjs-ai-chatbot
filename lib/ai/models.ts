export const chatModelIds = [
  "longcat-free",
  "qwen3-pro",
  "deepseek-r1",
  "llama4-maverick",
  "vision-pro",
] as const;

export type ChatModelId = (typeof chatModelIds)[number];

export const DEFAULT_CHAT_MODEL: ChatModelId = "longcat-free";

export type ChatModel = {
  id: ChatModelId;
  name: string;
  description: string;
  tier: "free" | "pro";
  capabilities: {
    reasoning?: boolean;
    vision?: boolean;
    longContext?: boolean;
  };
};

export const chatModels: ChatModel[] = [
  {
    id: "longcat-free",
    name: "LongCat Flash (Free)",
    description: "Fast, lightweight chat for everyday use.",
    tier: "free",
    capabilities: {},
  },
  {
    id: "qwen3-pro",
    name: "Qwen3 Max (Pro)",
    description: "General-purpose Pro model with strong instruction following.",
    tier: "pro",
    capabilities: {},
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek R1 (Reasoning)",
    description: "Reasoning-first model with structured chain-of-thought.",
    tier: "pro",
    capabilities: {
      reasoning: true,
    },
  },
  {
    id: "llama4-maverick",
    name: "Llama 4 Maverick (Long Context)",
    description: "Extended context window ideal for long docs and PDFs.",
    tier: "pro",
    capabilities: {
      longContext: true,
    },
  },
  {
    id: "vision-pro",
    name: "Vision Pro (Multimodal)",
    description: "Handles images plus text for vision workflows.",
    tier: "pro",
    capabilities: {
      vision: true,
    },
  },
];

const reasoningModelIds = new Set<ChatModelId>(
  chatModels.filter((model) => model.capabilities.reasoning).map((model) => model.id)
);

export const visionModelIds = new Set<ChatModelId>(
  chatModels.filter((model) => model.capabilities.vision).map((model) => model.id)
);

export const isChatModelId = (value: string): value is ChatModelId =>
  chatModelIds.includes(value as ChatModelId);

export const isReasoningModel = (modelId: string) =>
  reasoningModelIds.has(modelId as ChatModelId);
