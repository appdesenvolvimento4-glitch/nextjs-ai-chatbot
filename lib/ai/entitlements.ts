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
    availableChatModelIds: ["longcat-free"],
  },

  /*
   * For users with an account (Pro preview)
   */
  regular: {
    maxMessagesPerDay: 100,
    availableChatModelIds: [
      "longcat-free",
      "qwen3-pro",
      "deepseek-r1",
      "llama4-maverick",
      "vision-pro",
    ],
  },

  /*
   * TODO: For users with an account and a paid membership
   */
};
