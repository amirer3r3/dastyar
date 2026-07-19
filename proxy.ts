import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

/**
 * فقط مسیرهای محافظت‌شده از Middleware رد می‌شوند.
 * مسیرهای عمومی مثل /, /worksheets، /marketplace
 * دیگر روی هر navigation منتظر Auth نمی‌مانند.
 */
export const config = {
  matcher: [
    "/my-class/:path*",
    "/planner/:path*",
    "/create/:path*",
    "/account/:path*",
    "/lesson-plan/:path*",
    // آزمون‌های take عمومی‌اند؛ فقط لیست/ویرایش/نتایج محافظت شوند
    "/quiz",
    "/quiz/new",
    "/quiz/:id",
    "/quiz/:id/results",
    "/marketplace/upload/:path*",
  ],
};
