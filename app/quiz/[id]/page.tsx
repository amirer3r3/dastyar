import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, ClipboardList, BarChart3 } from "lucide-react";
import { auth } from "@/auth";
import { getQuiz } from "@/app/lib/quizzes";
import QuizBuilder from "../quiz-builder";
import ShareLinkButton from "../share-link";

export default async function EditQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const quiz = await getQuiz(session.user.id, id);
  if (!quiz) {
    notFound();
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between gap-2 bg-background/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <Link
            href="/quiz"
            aria-label="بازگشت"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground"
          >
            <ArrowRight size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <ClipboardList size={20} className="text-primary" />
            <h1 className="text-base font-bold text-foreground">ویرایش آزمون</h1>
          </div>
        </div>
        <Link
          href={`/quiz/${quiz.id}/results`}
          className="flex h-9 items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 text-sm font-bold text-success"
        >
          <BarChart3 size={16} />
          نتایج
        </Link>
      </header>

      <ShareLinkButton quizId={quiz.id} />
      <QuizBuilder quiz={quiz} />
    </>
  );
}
