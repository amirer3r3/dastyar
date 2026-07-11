import Link from "next/link";
import { Bell, GraduationCap, LogIn, LogOut } from "lucide-react";
import { auth } from "@/auth";
import { logoutAction } from "@/app/lib/auth-actions";

type AppHeaderProps = {
  title?: string;
  subtitle?: string;
};

export default async function AppHeader({
  title = "دستیار معلم",
  subtitle,
}: AppHeaderProps) {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 mx-auto flex max-w-md items-center justify-between gap-3 bg-background/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/30">
          <GraduationCap size={24} />
        </span>
        <div className="flex flex-col">
          <h1 className="text-base font-bold leading-tight text-foreground">
            {user ? user.name : title}
          </h1>
          <p className="text-xs text-muted">
            {subtitle ?? (user ? "خوش آمدید" : "وارد نشده‌اید")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <button
              type="button"
              aria-label="اعلان‌ها"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors active:bg-background"
            >
              <Bell size={20} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-danger" />
            </button>
            <form action={logoutAction}>
              <button
                type="submit"
                aria-label="خروج"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-danger transition-colors active:bg-background"
              >
                <LogOut size={20} />
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/login"
            className="flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground"
          >
            <LogIn size={18} />
            ورود
          </Link>
        )}
      </div>
    </header>
  );
}
