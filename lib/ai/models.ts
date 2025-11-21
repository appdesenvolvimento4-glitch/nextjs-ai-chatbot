type ChatModelDefinition = {
  id: `${string}/${string}`;
  key:
    | "free-chat"
    | "pro-chat"
    | "pro-reasoning"
    | "pro-long-context"
    | "pro-vision"
    | "pro-tools";
  name: string;
  description: string;
  plan: "free" | "pro";
  capabilities: {
    reasoning: boolean;
    vision: boolean;
    longContext: boolean;
  };
};

export const chatModels = [
  {
    id: "meituan/longcat-flash-chat",
    key: "free-chat",
    name: "LongCat Flash (Free)",
    description: "Modelo rápido e gratuito (texto simples).",
    plan: "free",
    capabilities: { reasoning: false, vision: false, longContext: false },
  },
  {
    id: "alibaba/qwen3-max",
    key: "pro-chat",
    name: "Qwen Max",
    description: "Modelo premium avançado para uso geral.",
    plan: "pro",
    capabilities: { reasoning: true, vision: false, longContext: false },
  },
  {
    id: "deepseek/deepseek-r1",
    key: "pro-reasoning",
    name: "DeepSeek R1",
    description:
      "Modelo especializado em raciocínio profundo (Chain-of-Thought).",
    plan: "pro",
    capabilities: { reasoning: true, vision: false, longContext: false },
  },
  {
    id: "meta/llama-4-maverick",
    key: "pro-long-context",
    name: "Llama 4 Maverick (Long Context)",
    description: "Modelo para PDFs e arquivos extensos.",
    plan: "pro",
    capabilities: { reasoning: true, longContext: true, vision: false },
  },
  {
    id: "alibaba/qwen3-vl-instruct",
    key: "pro-vision",
    name: "Qwen Vision Max",
    description: "Modelo multimodal com suporte a imagens.",
    plan: "pro",
    capabilities: { reasoning: true, vision: true, longContext: false },
  },
  {
    id: "alibaba/qwen3-max",
    key: "pro-tools",
    name: "Qwen Max Tools",
    description: "Modelo com agentes e ferramentas avançadas.",
    plan: "pro",
    capabilities: { reasoning: true, vision: false, longContext: false },
  },
] as const satisfies readonly ChatModelDefinition[];

export type ChatModel = (typeof chatModels)[number];
export type ChatModelId = ChatModel["id"];
export type ModelKey = ChatModel["key"];

export const CHAT_MODEL_IDS = [
  ...new Set(chatModels.map((model) => model.id)),
] as [ChatModelId, ...ChatModelId[]];

export const MODELS = chatModels.reduce<Record<ModelKey, ChatModelId>>(
  (accumulator, model) => {
    accumulator[model.key] = model.id;
    return accumulator;
  },
  {} as Record<ModelKey, ChatModelId>
);

// ---- DEFAULT MODEL DO SISTEMA ----
export const DEFAULT_CHAT_MODEL: ChatModelId = chatModels[0].id;

// ---- HELPERS ÚTEIS ----

export function getModelByKey(key: ModelKey) {
  return chatModels.find((m) => m.key === key);
}

export function getModelById(id: ChatModelId) {
  return chatModels.find((m) => m.id === id);
}

export function isChatModelId(id: string): id is ChatModelId {
  return (CHAT_MODEL_IDS as readonly string[]).includes(id);
}

export function getModelsByPlan(plan: "free" | "pro") {
  return chatModels.filter((m) => m.plan === plan);
}
