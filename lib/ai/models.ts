export const DEFAULT_CHAT_MODEL = "minimax/minimax-m2";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
  id: "minimax/minimax-m2",
  name: "Minimax M2",
  description: "Modelo de linguagem da Minimax com suporte avançado em português e inglês",
  capabilities: { reasoning: true, vision: true },
}
