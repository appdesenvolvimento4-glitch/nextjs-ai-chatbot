// volte o default para algo que já existia no template:
export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  // mantenha o MiniMax na lista (vamos ligar ele no passo 2)
  {
    id: "minimax/m2",
    name: "MiniMax M2",
    description: "Fast and capable conversational model via Vercel AI Gateway",
  },
  {
    id: "chat-model",
    name: "Grok Vision",
    description: "Advanced multimodal model with vision and text capabilities",
  },
  {
    id: "chat-model-reasoning",
    name: "Grok Reasoning",
    description:
      "Uses advanced chain-of-thought reasoning for complex problems",
  },
];
