import Link from "next/link";
import { GraduationCap, UserRound } from "lucide-react";
import { auth } from "@/auth";

export default async function HomeHeader({
  title = "دستیار معلم",
  subtitle = "امروز چه کمکی از دستم برمیاد؟",
}: {
  title?: string;
  subtitle?: string;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="home-header relative">
      <div className="relative h-[140px] overflow-hidden" dir="rtl">
        {/* بنر SVG تمام‌عرض — جایگزین گرادیان و بافت قبلی */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/image_gen_e5c95e40-7c5e-44de-b4d7-a37feb96b198_0.svg"
          alt=""
          aria-hidden="true"
          className="home-header-banner"
        />

        {/* ── آیکون + تایپوگرافی: راست (RTL) ── */}
        <div className="absolute top-[42px] right-4 z-10 flex items-center gap-3">
          <span className="flex shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 p-3.5 text-white backdrop-blur-sm">
            <GraduationCap size={24} strokeWidth={2} />
          </span>

          <div className="min-w-0 text-right">
            <h1 className="text-lg font-bold leading-tight tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-1 text-xs font-medium leading-snug text-white/90">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* ── آواتار: مرکز روی خط موج پایین بنر (چپ) ── */}
      <Link
        href={user ? "/account" : "/login"}
        aria-label={user ? "پروفایل کاربر" : "ورود به حساب"}
        className="home-header__avatar absolute left-4 z-20 block transition-transform"
      >
        <span className="flex h-[68px] w-[68px] origin-center items-center justify-center overflow-hidden rounded-full border-[3px] border-white bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 shadow-lg transition-transform hover:scale-105 active:scale-95">
          {user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name ?? "کاربر"}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound size={32} strokeWidth={1.5} />
          )}
        </span>
      </Link>
    </header>
  );
}
