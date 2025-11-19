export type ChatModel = {
  id: string;
  name: string;
  description: string;
  capabilities?: {
    reasoning?: boolean;
    vision?: boolean;
  };
};

export const chatModels: ChatModel[] = [
  {
    id: "free-chat",
    name: "LongCat Flash (Free)",
    description: "Modelo rápido e gratuito da LongCat (Meituan).",
    capabilities: { reasoning: false, vision: false },
  },
  {
    id: "pro-chat",
    name: "Qwen Max",
    description: "Modelo premium avançado para uso geral.",
    capabilities: { reasoning: true, vision: false },
  },
  {
    id: "pro-reasoning",
    name: "DeepSeek-R1",
    description: "Modelo especializado em raciocínio profundo (chain-of-thought).",
    capabilities: { reasoning: true, vision: false },
  },
  {
    id: "pro-long-context",
    name: "Llama 4 (Long Context)",
    description: "Modelo para PDFs, documentos e contextos longos.",
    capabilities: { reasoning: true, vision: false },
  },
  {
    id: "pro-vision",
    name: "Qwen Vision Max",
    description: "Modelo com suporte a imagens e multimodalidade.",
    capabilities: { reasoning: false, vision: true },
  },
  {
    id: "pro-tools",
    name: "Qwen Max Tools",
    description: "Modelo avançado para Agentes e ferramentas.",
    capabilities: { reasoning: true, vision: false },
  },
];

export const DEFAULT_CHAT_MODEL = "free-chat";

