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
    description: "Fast and capable conversational model via Vercel AI Gateway",
  },
  {
    id: "chat-model",
    name: "Grok Vision",
    description:
      "Advanced multimodal model with vision and text capabilities",
  },
  {
    id: "chat-model-reasoning",
    name: "Grok Reasoning",
    description:
      "Uses advanced chain-of-thought reasoning for complex problems",
  },
];
