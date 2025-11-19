import { createClient } from "ai";

export const ai = createClient({
  apiKey: process.env.AI_GATEWAY_API_KEY!,
  baseURL: process.env.AI_GATEWAY_URL!,
});
