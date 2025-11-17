import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/",
  },

  providers: [
    // 🔥 GOOGLE LOGIN
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // 🔥 MAGIC LINK (Email Login via Resend)
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: "Login App <no-reply@seu-dominio.com>",
    }),
  ],
} satisfies NextAuthConfig;
