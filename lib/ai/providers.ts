import { gateway } from "@ai-sdk/gateway";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";
import { MODELS } from "./models";

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");

      return customProvider({
        languageModels: {
          [MODELS["pro-chat"]]: chatModel,
          [MODELS["pro-reasoning"]]: reasoningModel,
          [MODELS["pro-long-context"]]: titleModel,
          [MODELS["free-chat"]]: chatModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        // --------------------------
        // 🔥 MODELOS PRO
        // --------------------------

        // Chat Premium (principal)
        [MODELS["pro-chat"]]: gateway.languageModel(MODELS["pro-chat"]),

        // DeepSeek-R1 (thinking profundo)
        [MODELS["pro-reasoning"]]: wrapLanguageModel({
          model: gateway.languageModel(MODELS["pro-reasoning"]),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),

        // Llama 4 (PDF / long context)
        [MODELS["pro-long-context"]]: gateway.languageModel(
          MODELS["pro-long-context"]
        ),

        // Vision (se enviar imagem)
        [MODELS["pro-vision"]]: gateway.languageModel(MODELS["pro-vision"]),

        // Agentes / ferramentas / raciocínio estruturado
        [MODELS["pro-tools"]]: gateway.languageModel(MODELS["pro-tools"]),

        // --------------------------
        // 🆓 MODELO FREE
        // --------------------------
        [MODELS["free-chat"]]: gateway.languageModel(MODELS["free-chat"]),
      },
    });
