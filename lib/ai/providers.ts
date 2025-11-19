import { gateway } from "@ai-sdk/gateway";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
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
          "pro-chat": chatModel,
          "pro-reasoning": reasoningModel,
          "pro-long-context": titleModel,
          "pro-artifact": artifactModel,
          "free-chat": chatModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        // --------------------------
        // 🔥 MODELOS PRO 
        // --------------------------

        // Chat Premium (principal)
        "pro-chat": gateway.languageModel("qwen/qwen-max"),

        // DeepSeek-R1 (thinking profundo)
        "pro-reasoning": wrapLanguageModel({
          model: gateway.languageModel("deepseek/deepseek-r1"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),

        // Llama 4 (PDF / long context)
        "pro-long-context": gateway.languageModel("meta-llama/llama-4-405b-instruct"),

        // Vision (se enviar imagem)
        "pro-vision": gateway.languageModel("qwen/qwen-vl-max"),

        // Agentes / ferramentas / raciocínio estruturado
        "pro-tools": gateway.languageModel("qwen/qwen-max"),

        // --------------------------
        // 🆓 MODELO FREE 
        // --------------------------
        "free-chat": gateway.languageModel("meituan/longcat-flash-chat"),
      },
    });
