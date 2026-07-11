"use client";

import { useActionState } from "react";
import Link from "next/link";
import { GraduationCap, AlertCircle } from "lucide-react";
import { loginAction } from "@/app/lib/auth-actions";
import AuthSubmit from "@/app/components/auth-submit";

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, undefined);

  return (
    <main className="flex min-h-screen flex-col justify-center px-6 pb-28 pt-10">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
          <GraduationCap size={32} />
        </span>
        <h1 className="text-xl font-bold text-foreground">ورود به دستیار معلم</h1>
        <p className="text-sm text-muted">
          برای دسترسی به کلاس‌ها و ابزارهای خود وارد شوید
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            ایمیل
          </label>
          <input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            required
            placeholder="example@mail.com"
            className="h-12 rounded-app border border-border bg-card px-4 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            رمز عبور
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="h-12 rounded-app border border-border bg-card px-4 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted"
          />
        </div>

        {state?.error ? (
          <div className="flex items-center gap-2 rounded-app bg-danger/10 px-3 py-2.5 text-xs font-medium text-danger">
            <AlertCircle size={16} />
            <span>{state.error}</span>
          </div>
        ) : null}

        <AuthSubmit label="ورود" />
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        حساب کاربری ندارید؟{" "}
        <Link href="/register" className="font-bold text-primary">
          ثبت‌نام کنید
        </Link>
      </p>
    </main>
  );
}
