import type { UserType } from "@/app/(auth)/auth";
import { getModelsByPlan, type ChatModel } from "./models";

type Entitlements = {
  maxMessagesPerDay: number;
  availableChatModelIds: ChatModel["id"][];
};

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  /*
   * For users without an account
   */
  guest: {
    maxMessagesPerDay: 20,
    availableChatModelIds: getModelsByPlan("free").map((model) => model.id),
  },

  /*
   * For users with an account
   */
  regular: {
    maxMessagesPerDay: 100,
    availableChatModelIds: Array.from(
      new Set([
        ...getModelsByPlan("free"),
        ...getModelsByPlan("pro"),
      ].map((model) => model.id))
    ),
  },

  /*
   * TODO: For users with an account and a paid membership
   */
};
