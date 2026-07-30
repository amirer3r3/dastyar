import type { DefaultSession } from "next-auth";
import type { TeachingLevel } from "@/app/lib/teaching-levels";

declare module "next-auth" {
  interface User {
    teachingLevel?: TeachingLevel;
    isAdmin?: boolean;
  }

  interface Session {
    user: {
      id: string;
      teachingLevel?: TeachingLevel;
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    teachingLevel?: TeachingLevel;
    isAdmin?: boolean;
  }
}
