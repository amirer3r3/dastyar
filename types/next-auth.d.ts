import type { DefaultSession } from "next-auth";
import type { TeachingLevel } from "@/app/lib/teaching-levels";

declare module "next-auth" {
  interface User {
    teachingLevel?: TeachingLevel;
  }

  interface Session {
    user: {
      id: string;
      teachingLevel?: TeachingLevel;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    teachingLevel?: TeachingLevel;
  }
}
