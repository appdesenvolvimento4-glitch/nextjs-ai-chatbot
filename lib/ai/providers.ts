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
          "google/gemini-2.5-flash": gateway.languageModel("google/gemini-2.5-flash"),
          "alibaba/qwen3-max": gateway.languageModel("alibaba/qwen3-max"),
          "deepseek/deepseek-r1": wrapLanguageModel({
            model: gateway.languageModel("deepseek/deepseek-r1"),
            middleware: extractReasoningMiddleware({ tagName: "think" }),
          }),
          "meta/llama-4-maverick": gateway.languageModel("meta/llama-4-maverick"),
          "alibaba/qwen3-vl-thinking": gateway.languageModel("alibaba/qwen3-vl-thinking"),
        },
      });
    })()
  : customProvider({
      languageModels: {
        "google/gemini-2.5-flash": gateway.languageModel("google/gemini-2.5-flash"),
        "alibaba/qwen3-max": gateway.languageModel("alibaba/qwen3-max"),
        "deepseek/deepseek-r1": wrapLanguageModel({
          model: gateway.languageModel("deepseek/deepseek-r1"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "meta/llama-4-maverick": gateway.languageModel("meta/llama-4-maverick"),
        "alibaba/qwen3-vl-thinking": gateway.languageModel("alibaba/qwen3-vl-thinking"),
      },
    });

