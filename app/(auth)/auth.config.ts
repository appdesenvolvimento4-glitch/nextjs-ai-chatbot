import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";

import { compare } from "bcrypt-ts";
import { DUMMY_PASSWORD } from "@/lib/constants";
import { createGuestUser, getUser } from "@/lib/db/queries";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    newUser: "/",
  },

  providers: [
    // ----------------------------------------
    // 🔥 LOGIN COM GOOGLE
    // ----------------------------------------
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ----------------------------------------
    // 🔥 MAGIC LINK COM RESEND (opcional)
    // ----------------------------------------
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: "Login App <no-reply@seu-dominio.com>",
    }),

    // ----------------------------------------
    // 🔥 LOGIN COM EMAIL + SENHA (Credentials)
    // ----------------------------------------
    Credentials({
      id: "credentials",
      name: "Email e senha",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },

      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const users = await getUser(email);

        if (!users || users.length === 0) {
          // comparação fake pra evitar timing attack
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const [user] = users;

        if (!user.password) {
          await compare(password, DUMMY_PASSWORD);
          return null;
        }

        const passwordsMatch = await compare(password, user.password);

        if (!passwordsMatch) return null;

        return { ...user, type: "regular" as const };
      },
    }),

    // ----------------------------------------
    // 🔥 LOGIN COMO CONVIDADO
    // ----------------------------------------
    Credentials({
      id: "guest",
      name: "Guest",
      credentials: {},
      async authorize() {
        const [guestUser] = await createGuestUser();
        return { ...guestUser, type: "guest" as const };
      },
    }),
  ],

  // ----------------------------------------
  // 🔥 CALLBACKS — adiciona user.id e user.type à sessão
  // ----------------------------------------
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = (user as any).id;
        (token as any).type = (user as any).type;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = (token as any).id;
        (session.user as any).type = (token as any).type;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

