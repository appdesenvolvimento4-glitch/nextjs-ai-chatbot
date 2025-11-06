// lib/ai/models.ts

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
    id: "minimax/minimax-m2",
    name: "Minimax M2",
    description:
      "Modelo de linguagem da Minimax com suporte avançado em português e inglês",
    capabilities: { reasoning: true, vision: true },
  },
];

export const DEFAULT_CHAT_MODEL = "minimax/minimax-m2";
