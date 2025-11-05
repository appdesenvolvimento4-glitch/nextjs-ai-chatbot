// lib/ai/models.ts

export const DEFAULT_CHAT_MODEL: string = "minimax/m2";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "minimax/m2",
    name: "MiniMax M2",
    description: "Modelo principal de IA conversacional via MiniMax API Gateway",
  },
];
