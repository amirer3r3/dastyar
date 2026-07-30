import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { verifyCredentials } from "./app/lib/users";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "ایمیل", type: "email" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const user = await verifyCredentials(email, password);
        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          teachingLevel: user.teachingLevel,
          isAdmin: user.isAdmin === true,
        };
      },
    }),
  ],
});
