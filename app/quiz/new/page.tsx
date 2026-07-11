import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import QuizBuilder from "../quiz-builder";

export default function NewQuizPage() {
  return (
    <>
      <header className="sticky top-0 z-40 flex items-center gap-2 bg-background/90 px-4 py-3 backdrop-blur">
        <Link
          href="/quiz"
          aria-label="بازگشت"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground"
        >
          <ArrowRight size={18} />
        </Link>
        <div className="flex items-center gap-2">
          <ClipboardList size={20} className="text-primary" />
          <h1 className="text-base font-bold text-foreground">آزمون جدید</h1>
        </div>
      </header>

      <QuizBuilder />
    </>
  );
}
