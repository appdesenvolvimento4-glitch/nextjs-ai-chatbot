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
        deepseekModel,
        llamaModel,
        qwenModel,
        titleModel,
        visionModel,
        longcatModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "longcat-free": google/gemini-2.5-flash,
          "qwen3-pro": alibaba/qwen3-max,
          "deepseek-r1": deepseek/deepseek-r1,
          "llama4-maverick": meta/llama-4-maverick,
          "vision-pro": alibaba/qwen3-vl-thinking,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "google/gemini-2.5-flash": gateway.languageModel("google/gemini-2.5-flash"),
        "alibaba/qwen3-max": gateway.languageModel("alibaba/qwen3-max"),
        "deepseek-r1": wrapLanguageModel({
          model: gateway.languageModel("deepseek/deepseek-r1"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "llama4-maverick": gateway.languageModel("meta/llama-4-maverick"),
        "vision-pro": gateway.languageModel("alibaba/qwen3-vl-thinking"),
      },
    });
