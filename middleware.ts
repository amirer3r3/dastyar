import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

/**
 * طرح درس و کاربرگ عمومی‌اند.
 * فقط مسیرهای طراحی/ویرایش طرح درس نیاز به ورود دارند.
 */
export const config = {
  matcher: [
    "/my-class/:path*",
    "/planner/:path*",
    "/create/:path*",
    "/account/:path*",
    "/lesson-plan/create",
    "/lesson-plan/create/:path*",
    "/lesson-plan/new",
    "/lesson-plan/edit/:path*",
    "/quiz",
    "/quiz/new",
    "/quiz/:id",
    "/quiz/:id/results",
    "/marketplace/upload/:path*",
  ],
};
