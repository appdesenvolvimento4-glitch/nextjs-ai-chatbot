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
    // 🔥 Login com Google
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // 🔥 Magic link com Resend (se não for usar agora, pode remover este bloco)
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: "Login App <no-reply@seu-dominio.com>",
    }),

    // 🔥 Login normal com email + senha
    Credentials({
      id: "credentials",
      name: "Email e senha",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const users = await getUser(credentials.email);

        if (users.length === 0) {
          // comparação fake pra não vazar tempo
          await compare(credentials.password, DUMMY_PASSWORD);
          return null;
        }

        const [user] = users;

        if (!user.password) {
          await compare(credentials.password, DUMMY_PASSWORD);
          return null;
        }

        const passwordsMatch = await compare(
          credentials.password,
          user.password,
        );

        if (!passwordsMatch) return null;

        return { ...user, type: "regular" as const };
      },
    }),

    // 🔥 Login como convidado
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

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-expect-error - vamos forçar aqui
        token.id = user.id;
        // @ts-expect-error
        token.type = user.type;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-expect-error
        session.user.id = token.id as string;
        // @ts-expect-error
        session.user.type = token.type as "guest" | "regular";
      }
      return session;
    },
  },
};
