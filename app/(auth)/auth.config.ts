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
      // comparação fake pra não vazar tempo
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
