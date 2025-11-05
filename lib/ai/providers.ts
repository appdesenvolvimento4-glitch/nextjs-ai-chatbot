import { gateway } from "@ai-sdk/gateway";
import { customProvider } from "ai";
import { isTestEnvironment } from "../constants";

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
        // 🚀 Principal modelo de chat (Minimax M2)
        "chat-model": gateway.languageModel("minimax/minimax-m2"),

        // Modelo opcional de raciocínio (se quiser separar)
        "chat-model-reasoning": gateway.languageModel("minimax/minimax-m2"),

        // Modelos de suporte (título e artefato) — podem usar o mesmo
        "title-model": gateway.languageModel("minimax/minimax-m2"),
        "artifact-model": gateway.languageModel("minimax/minimax-m2"),
      },
    });
