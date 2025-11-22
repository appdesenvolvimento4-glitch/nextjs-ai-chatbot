export const chatModelIds = [
  "meituan/longcat-flash-chat",
  "alibaba/qwen3-max",
  "deepseek/deepseek-r1",
  "meta/llama-4-maverick",
  "alibaba/qwen3-vl-thinking",
] as const;

export type ChatModelId = (typeof chatModelIds)[number];

export const DEFAULT_CHAT_MODEL: "meituan/longcat-flash-chat";

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
    id: "meituan/longcat-flash-chat",
    name: "meituan/longcat-flash-chat",
    description: "Fast, lightweight chat for everyday use.",
    tier: "free",
    capabilities: {},
  },
  {
    id: "alibaba/qwen3-max",
    name: "alibaba/qwen3-max",
    description: "General-purpose Pro model with strong instruction following.",
    tier: "pro",
    capabilities: {},
  },
  {
    id: "deepseek/deepseek-r1",
    name: "deepseek/deepseek-r1",
    description: "Reasoning-first model with structured chain-of-thought.",
    tier: "pro",
    capabilities: {
      reasoning: true,
    },
  },
  {
    id: "meta/llama-4-maverick",
    name: "Llama 4 Maverick",
    description: "Extended context window ideal for long docs and PDFs.",
    tier: "pro",
    capabilities: {
      longContext: true,
    },
  },
  {
    id: "alibaba/qwen3-vl-thinking",
    name: "alibaba/qwen3-vl-thinking",
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
