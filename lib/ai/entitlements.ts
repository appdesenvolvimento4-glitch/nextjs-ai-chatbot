import type { UserType } from "@/app/(auth)/auth";
import type { ChatModelId } from "./models";

type Entitlements = {
  maxMessagesPerDay: number;
  availableChatModelIds: ChatModelId[];
};

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users without an account (Free)
   */
  guest: {
    maxMessagesPerDay: 20,
    availableChatModelIds: ["google/gemini-2.5-flash"],
  },

  /*
   * For users with an account (Pro preview)
   */
  regular: {
    maxMessagesPerDay: 100,
    availableChatModelIds: [
      "google/gemini-2.5-flash",
      "alibaba/qwen3-max",
      "deepseek/deepseek-r1",
      "meta/llama-4-maverick",
      "alibaba/qwen3-vl-thinking",
    ],
  },

  /*
   * TODO: For users with an account and a paid membership
   */
};
