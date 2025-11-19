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

        // Chat principal
        "pro-chat": gateway.languageModel("qwen/qwen-max"),

        // DeepSeek-R1 com reasoning stream
        "pro-reasoning": wrapLanguageModel({
          model: gateway.languageModel("deepseek/deepseek-r1"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),

        // Modelo para PDFs / contextos grandes
        "pro-long-context": gateway.languageModel("meta/llama-4-maverick"),

        // Multimodal (imagem + texto)
        "pro-vision": gateway.languageModel("qwen/qwen-vision-max"),

        // Agentes / Tools (se disponível)
        "pro-tools": gateway.languageModel("qwen/qwen-max-tools"),

        // --------------------------
        // 🆓 MODELO FREE 
        // --------------------------
        "free-chat": gateway.languageModel("meituan/longcat-flash-chat"),
      },
    });

