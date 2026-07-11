import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Plus,
  ClipboardList,
  Pencil,
  Trash2,
  Users,
  BarChart3,
} from "lucide-react";
import { auth } from "@/auth";
import { getQuizzes, getSubmissions } from "@/app/lib/quizzes";
import { deleteQuizAction } from "@/app/lib/quiz-actions";
import { questionTypeLabels } from "./types";

export default async function QuizListPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const quizzes = await getQuizzes(session.user.id);

  const submissionCounts = await Promise.all(
    quizzes.map(async (q) => ({
      id: q.id,
      count: (await getSubmissions(q.id)).length,
    }))
  );
  const countMap = Object.fromEntries(
    submissionCounts.map((s) => [s.id, s.count])
  );

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
            <ClipboardList size={20} className="text-primary" />
            <h1 className="text-base font-bold text-foreground">آزمون‌های من</h1>
          </div>
        </div>
        <Link
          href="/quiz/new"
          className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-md shadow-primary/30"
        >
          <Plus size={16} />
          آزمون جدید
        </Link>
      </header>

      <main className="flex flex-col gap-3 px-4 pt-2 pb-4">
        {quizzes.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <ClipboardList size={36} />
            </span>
            <h2 className="text-base font-bold text-foreground">
              هنوز آزمونی نساخته‌اید
            </h2>
            <p className="max-w-xs text-sm text-muted">
              اولین آزمون آنلاین خود را بسازید و لینک آن را برای دانش‌آموزان
              بفرستید.
            </p>
            <Link
              href="/quiz/new"
              className="mt-2 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
            >
              <Plus size={18} />
              ساخت آزمون
            </Link>
          </div>
        ) : (
          quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex items-center gap-3 rounded-app border border-border bg-card p-4 shadow-sm"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ClipboardList size={22} />
              </span>
              <Link href={`/quiz/${quiz.id}`} className="flex flex-1 flex-col">
                <span className="text-sm font-bold text-foreground">
                  {quiz.title}
                </span>
                <span className="flex items-center gap-2 text-xs text-muted">
                  <span>{quiz.questions.length} سوال</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {countMap[quiz.id] ?? 0} پاسخ
                  </span>
                </span>
                <span className="mt-0.5 text-[11px] text-muted">
                  {quiz.questions
                    .map((q) => questionTypeLabels[q.type])
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .join("، ")}
                </span>
              </Link>
              <div className="flex items-center gap-1">
                <Link
                  href={`/quiz/${quiz.id}/results`}
                  aria-label="نتایج"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-success active:bg-success/10"
                >
                  <BarChart3 size={18} />
                </Link>
                <Link
                  href={`/quiz/${quiz.id}`}
                  aria-label="ویرایش"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-primary active:bg-primary/10"
                >
                  <Pencil size={18} />
                </Link>
                <form action={deleteQuizAction}>
                  <input type="hidden" name="id" value={quiz.id} />
                  <button
                    type="submit"
                    aria-label="حذف"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-danger active:bg-danger/10"
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
