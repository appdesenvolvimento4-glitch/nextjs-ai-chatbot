export type ChatModel = {
  id: string; // ID usado na API do Vercel AI Gateway
  key: ModelKey; // id lógico interno (garante Type Safety)
  name: string;
  description: string;
  plan: "free" | "pro";
  capabilities?: {
    reasoning?: boolean;
    vision?: boolean;
    longContext?: boolean;
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
    id: "qwen/qwen-max",
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
    id: "qwen/qwen-vision-max",
    key: "pro-vision",
    name: "Qwen Vision Max",
    description: "Modelo multimodal com suporte a imagens.",
    plan: "pro",
    capabilities: { reasoning: true, vision: true, longContext: false },
  },
  {
    id: "qwen/qwen-max-tools",
    key: "pro-tools",
    name: "Qwen Max Tools",
    description: "Modelo com agentes e ferramentas avançadas.",
    plan: "pro",
    capabilities: { reasoning: true, vision: false, longContext: false },
  },
] as const;

export const MODELS = Object.fromEntries(
  chatModels.map((m) => [m.key, m.id])
) as Record<string, string>;

export type ModelKey = (typeof chatModels)[number]["key"];

// ---- DEFAULT MODEL DO SISTEMA ----
export const DEFAULT_CHAT_MODEL: ModelKey = "free-chat";

// ---- HELPERS ÚTEIS ----

export function getModelByKey(key: ModelKey) {
  return chatModels.find((m) => m.key === key);
}

export function getModelsByPlan(plan: "free" | "pro") {
  return chatModels.filter((m) => m.plan === plan);
}
