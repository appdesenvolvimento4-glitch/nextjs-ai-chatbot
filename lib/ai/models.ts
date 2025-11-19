export type ChatModel = {
  id: string; // ID usado na API do seu backend / AI Gateway
  key: string; // ID lógico interno
  name: string;
  description: string;
  plan: "free" | "pro"; // <--- essencial
  capabilities?: {
    reasoning?: boolean;
    vision?: boolean;
    longContext?: boolean;
  };
};

export const chatModels: ChatModel[] = [
  {
    id: "meituan/longcat-flash-chat",
    key: "free-chat",
    name: "LongCat Flash (Free)",
    description: "Modelo rápido e gratuito da LongCat (texto simples).",
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
    description: "Modelo especializado em raciocínio profundo (chain-of-thought).",
    plan: "pro",
    capabilities: { reasoning: true, vision: false, longContext: false },
  },
  {
    id: "meta/llama-4-maverick",
    key: "pro-long-context",
    name: "Llama 4 Maverick (Long Context)",
    description: "Modelo para PDFs, documentos longos e arquivos.",
    plan: "pro",
    capabilities: { reasoning: true, vision: false, longContext: true },
  },
  {
    id: "qwen/qwen-vision-max",
    key: "pro-vision",
    name: "Qwen Vision Max",
    description: "Modelo multimodal com suporte a imagens.",
    plan: "pro",
    capabilities: { reasoning: true, vision: true },
  },
  {
    id: "qwen/qwen-max-tools",
    key: "pro-tools",
    name: "Qwen Max Tools",
    description: "Modelo avançado com agentes e execução de ferramentas.",
    plan: "pro",
    capabilities: { reasoning: true, vision: false },
  },
];

export const MODELS = Object.fromEntries(
  chatModels.map((m) => [m.key, m.id])
) as const;

export type ModelKey = keyof typeof MODELS;

export const DEFAULT_CHAT_MODEL: ModelKey = "free-chat";

