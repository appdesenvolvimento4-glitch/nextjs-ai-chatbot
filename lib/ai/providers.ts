// lib/ai/providers.ts

import { gateway as createGateway } from "@ai-sdk/gateway";
import { customProvider } from "ai";
import { isTestEnvironment } from "../constants";

// Inicializa o gateway e aplica variáveis de ambiente se existirem
const gw = createGateway();

process.env.AI_GATEWAY_URL && (gw.baseURL = process.env.AI_GATEWAY_URL);
process.env.AI_GATEWAY_KEY && (gw.apiKey = process.env.AI_GATEWAY_KEY);

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
