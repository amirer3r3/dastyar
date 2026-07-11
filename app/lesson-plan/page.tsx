import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Plus, BookOpen, Pencil, Trash2, Clock } from "lucide-react";
import { auth } from "@/auth";
import { getLessonPlans } from "@/app/lib/lesson-plans";
import { deleteLessonPlanAction } from "@/app/lib/lesson-plan-actions";

export default async function LessonPlanListPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const plans = await getLessonPlans(session.user.id);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-background/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            aria-label="بازگشت"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground"
          >
            <ArrowRight size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-primary" />
            <h1 className="text-base font-bold text-foreground">طرح درس‌ها</h1>
          </div>
        </div>
        <Link
          href="/lesson-plan/new"
          className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-md shadow-primary/30"
        >
          <Plus size={16} />
          جدید
        </Link>
      </header>

      <main className="flex flex-col gap-3 px-4 pt-2">
        {plans.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <BookOpen size={36} />
            </span>
            <h2 className="text-base font-bold text-foreground">
              هنوز طرح درسی ندارید
            </h2>
            <p className="max-w-xs text-sm text-muted">
              اولین طرح درس خود را بسازید تا در آرشیو شما ذخیره شود.
            </p>
            <Link
              href="/lesson-plan/new"
              className="mt-2 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
            >
              <Plus size={18} />
              ساخت طرح درس
            </Link>
          </div>
        ) : (
          plans.map((plan) => (
            <div
              key={plan.id}
              className="flex items-center gap-3 rounded-app border border-border bg-card p-4 shadow-sm"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BookOpen size={22} />
              </span>
              <Link href={`/lesson-plan/${plan.id}`} className="flex flex-1 flex-col">
                <span className="text-sm font-bold text-foreground">
                  {plan.title}
                </span>
                <span className="flex items-center gap-2 text-xs text-muted">
                  {plan.subject ? <span>{plan.subject}</span> : null}
                  {plan.grade ? <span>· {plan.grade}</span> : null}
                  {plan.duration ? (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {plan.duration}
                    </span>
                  ) : null}
                </span>
              </Link>
              <div className="flex items-center gap-1">
                <Link
                  href={`/lesson-plan/${plan.id}`}
                  aria-label="ویرایش"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-primary transition-colors active:bg-primary/10"
                >
                  <Pencil size={18} />
                </Link>
                <form action={deleteLessonPlanAction}>
                  <input type="hidden" name="id" value={plan.id} />
                  <button
                    type="submit"
                    aria-label="حذف"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-danger transition-colors active:bg-danger/10"
                  >
                    <Trash2 size={18} />
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </main>
    </>
  );
}
