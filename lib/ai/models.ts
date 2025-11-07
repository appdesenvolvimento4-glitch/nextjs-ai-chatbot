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
    id: "chat-model", // precisa bater com o providers.ts
    name: "Minimax M2",
    description:
      "Modelo de linguagem da Minimax com suporte avançado em português e inglês.",
    capabilities: { reasoning: true, vision: true },
  },
];

export const DEFAULT_CHAT_MODEL = "chat-model"; // também precisa ser igual
