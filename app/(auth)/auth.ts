import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Tipo usado em várias partes do app (chat, entitlements, etc.)
export type UserType = "guest" | "regular";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
