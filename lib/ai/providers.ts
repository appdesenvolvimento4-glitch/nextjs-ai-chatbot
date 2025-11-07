// lib/ai/providers.ts

import { gateway as createGateway } from "@ai-sdk/gateway";
import { customProvider } from "ai";
import { isTestEnvironment } from "../constants";

// Cria o gateway usando as variáveis de ambiente da Vercel
const gw = createGateway({
  baseURL: process.env.AI_GATEWAY_URL,
  apiKey: process.env.AI_GATEWAY_KEY,
});

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "chat-model": gw.languageModel("minimax/minimax-m2"),
        "chat-model-reasoning": gw.languageModel("minimax/minimax-m2"),
        "title-model": gw.languageModel("minimax/minimax-m2"),
        "artifact-model": gw.languageModel("minimax/minimax-m2"),
      },
    });
