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
          "longcat-free": longcatModel,
          "qwen3-pro": qwenModel,
          "deepseek-r1": deepseekModel,
          "llama4-maverick": llamaModel,
          "vision-pro": visionModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "longcat-free": gateway.languageModel("meituan/longcat-flash-chat"),
        "qwen3-pro": gateway.languageModel("alibaba/qwen3-max"),
        "deepseek-r1": wrapLanguageModel({
          model: gateway.languageModel("deepseek/deepseek-r1"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "llama4-maverick": gateway.languageModel("meta/llama-4-maverick"),
        "vision-pro": gateway.languageModel("xai/grok-2-vision-1212"),
        "title-model": gateway.languageModel("meituan/longcat-flash-chat"),
        "artifact-model": gateway.languageModel("alibaba/qwen3-max"),
      },
    });
