import type { NextAuthConfig } from "next-auth";
import type { TeachingLevel } from "@/app/lib/teaching-levels";
import { isTeachingLevel } from "@/app/lib/teaching-levels";

const protectedPrefixes = [
  "/my-class",
  "/planner",
  "/create",
  "/account",
  "/lesson-plan",
  "/quiz",
  "/marketplace/upload",
];

function isPublicQuizTake(pathname: string): boolean {
  return /^\/quiz\/[^/]+\/take$/.test(pathname);
}

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      if (isPublicQuizTake(pathname)) {
        return true;
      }

      const isProtected = protectedPrefixes.some((p) =>
        pathname.startsWith(p)
      );

      if (isProtected && !isLoggedIn) {
        return false;
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        if (user.teachingLevel && isTeachingLevel(user.teachingLevel)) {
          (token as { teachingLevel?: TeachingLevel }).teachingLevel =
            user.teachingLevel;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        const level = (token as { teachingLevel?: unknown }).teachingLevel;
        if (typeof level === "string" && isTeachingLevel(level)) {
          session.user.teachingLevel = level;
        }
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
