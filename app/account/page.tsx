import { redirect } from "next/navigation";
import { Mail, User as UserIcon, LogOut, GraduationCap } from "lucide-react";
import { auth } from "@/auth";
import { logoutAction } from "@/app/lib/auth-actions";
import { teachingLevelLabels } from "@/app/lib/teaching-levels";
import AppHeader from "@/app/components/app-header";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;
  const teachingLabel =
    user.teachingLevel && user.teachingLevel in teachingLevelLabels
      ? teachingLevelLabels[user.teachingLevel]
      : null;

  return (
    <>
      <AppHeader title="حساب کاربری" subtitle="اطلاعات شما" />
      <main className="flex flex-col gap-5 px-4 pt-2">
        <div className="flex flex-col items-center gap-3 rounded-app border border-border bg-card p-6 shadow-sm">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
            {user.name?.charAt(0) ?? "؟"}
          </span>
          <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
          {teachingLabel ? (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {teachingLabel}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-app border border-border bg-card p-4 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserIcon size={20} />
            </span>
            <div className="flex flex-col">
              <span className="text-xs text-muted">نام</span>
              <span className="text-sm font-medium text-foreground">
                {user.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-app border border-border bg-card p-4 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail size={20} />
            </span>
            <div className="flex flex-col">
              <span className="text-xs text-muted">ایمیل</span>
              <span dir="ltr" className="text-sm font-medium text-foreground">
                {user.email}
              </span>
            </div>
          </div>

          {teachingLabel ? (
            <div className="flex items-center gap-3 rounded-app border border-border bg-card p-4 shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <GraduationCap size={20} />
              </span>
              <div className="flex flex-col">
                <span className="text-xs text-muted">مقطع تدریس</span>
                <span className="text-sm font-medium text-foreground">
                  {teachingLabel}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-app border border-danger/30 bg-danger/10 text-sm font-bold text-danger transition-transform active:scale-[0.98]"
          >
            <LogOut size={20} />
            خروج از حساب
          </button>
        </form>
      </main>
    </>
  );
}
