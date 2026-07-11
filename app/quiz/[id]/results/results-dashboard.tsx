"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useActionState } from "react";
import {
  ArrowRight,
  BarChart3,
  RefreshCw,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
} from "lucide-react";
import type { Quiz, QuizSubmission } from "@/app/quiz/types";
import { questionTypeLabels } from "@/app/quiz/types";
import {
  scoreSubmission,
  formatAnswer,
  DESCRIPTIVE_MAX,
  type SubmissionScore,
} from "@/app/lib/quiz-grading";
import {
  gradeSubmissionAction,
  type GradeFormState,
} from "@/app/lib/quiz-results-actions";

type Props = {
  quiz: Quiz;
  submissions: QuizSubmission[];
};

export default function ResultsDashboard({ quiz, submissions }: Props) {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
      setLastRefresh(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, [router]);

  const scores = submissions.map((s) => scoreSubmission(quiz, s));
  const totalPending = scores.reduce((n, s) => n + s.pendingDescriptive, 0);
  const avgPercent =
    scores.length > 0
      ? Math.round(
          scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length
        )
      : 0;

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <Link
              href="/quiz"
              aria-label="بازگشت"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground"
            >
              <ArrowRight size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-primary" />
              <div>
                <h1 className="text-base font-bold text-foreground">نتایج آزمون</h1>
                <p className="text-xs text-muted">{quiz.title}</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              router.refresh();
              setLastRefresh(new Date());
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted"
            aria-label="بروزرسانی"
          >
            <RefreshCw size={16} />
          </button>
        </div>
        <p className="px-4 pb-2 text-[10px] text-muted">
          بروزرسانی خودکار هر ۱۰ ثانیه · آخرین:{" "}
          {lastRefresh.toLocaleTimeString("fa-IR")}
        </p>
      </header>

      <main className="flex flex-col gap-4 px-4 pt-2 pb-8">
        {/* آمار کلی */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="پاسخ‌ها" value={String(submissions.length)} />
          <StatCard label="میانگین" value={`${avgPercent}٪`} />
          <StatCard
            label="در انتظار تصحیح"
            value={String(totalPending)}
            highlight={totalPending > 0}
          />
        </div>

        {submissions.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <BarChart3 size={48} className="text-muted" />
            <p className="text-sm text-muted">
              هنوز پاسخی ثبت نشده. لینک آزمون را برای دانش‌آموزان بفرستید.
            </p>
            <Link
              href={`/quiz/${quiz.id}`}
              className="text-sm font-bold text-primary"
            >
              رفتن به صفحه اشتراک لینک
            </Link>
          </div>
        ) : (
          scores.map((score) => (
            <SubmissionCard
              key={score.submissionId}
              quiz={quiz}
              submission={
                submissions.find((s) => s.id === score.submissionId)!
              }
              score={score}
              isOpen={openId === score.submissionId}
              onToggle={() =>
                setOpenId((prev) =>
                  prev === score.submissionId ? null : score.submissionId
                )
              }
            />
          ))
        )}
      </main>
    </>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-app border p-3 text-center shadow-sm ${
        highlight
          ? "border-accent/40 bg-accent/10"
          : "border-border bg-card"
      }`}
    >
      <div
        className={`text-lg font-black ${
          highlight ? "text-accent" : "text-foreground"
        }`}
      >
        {value}
      </div>
      <div className="text-[11px] text-muted">{label}</div>
    </div>
  );
}

function SubmissionCard({
  quiz,
  submission,
  score,
  isOpen,
  onToggle,
}: {
  quiz: Quiz;
  submission: QuizSubmission;
  score: SubmissionScore;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const date = new Date(score.submittedAt).toLocaleString("fa-IR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const allGraded = score.pendingDescriptive === 0;

  return (
    <div className="overflow-hidden rounded-app border border-border bg-card shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-4 text-right"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User size={20} />
        </span>
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-bold text-foreground">
            {score.studentName}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted">
            <Clock size={12} />
            {date}
          </span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-sm font-black ${
              score.percentage >= 70
                ? "text-success"
                : score.percentage >= 40
                  ? "text-accent"
                  : "text-danger"
            }`}
          >
            {score.percentage}٪
          </span>
          <span className="text-[11px] text-muted">
            {score.totalScore} از {score.maxScore}
          </span>
        </div>
        {allGraded ? (
          <CheckCircle2 size={18} className="text-success" />
        ) : (
          <AlertCircle size={18} className="text-accent" />
        )}
        <ChevronDown
          size={18}
          className={`text-muted transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div className="border-t border-border p-4">
          <SubmissionDetail
            quiz={quiz}
            submission={submission}
            score={score}
          />
        </div>
      ) : null}
    </div>
  );
}

function SubmissionDetail({
  quiz,
  submission,
  score,
}: {
  quiz: Quiz;
  submission: QuizSubmission;
  score: SubmissionScore;
}) {
  const descriptiveQuestions = quiz.questions.filter(
    (q) => q.type === "descriptive"
  );

  return (
    <div className="flex flex-col gap-4">
      {quiz.questions.map((question, index) => {
        const qScore = score.questionScores.find(
          (qs) => qs.questionId === question.id
        )!;
        const answer = submission.answers.find(
          (a) => a.questionId === question.id
        )?.value;

        return (
          <div
            key={question.id}
            className="rounded-app border border-border bg-background p-3"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <div>
                  <span className="text-[11px] font-bold text-muted">
                    {questionTypeLabels[question.type]}
                  </span>
                  <p className="text-sm leading-6 text-foreground">
                    {question.text}
                  </p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                  qScore.needsGrading
                    ? "bg-accent/10 text-accent"
                    : qScore.correct === true
                      ? "bg-success/10 text-success"
                      : qScore.correct === false
                        ? "bg-danger/10 text-danger"
                        : "bg-primary/10 text-primary"
                }`}
              >
                {qScore.score}/{qScore.maxScore}
              </span>
            </div>
            <p className="mr-8 text-sm leading-7 text-muted">
              <span className="font-bold text-foreground">پاسخ: </span>
              {formatAnswer(question, answer ?? "")}
            </p>
          </div>
        );
      })}

      {descriptiveQuestions.length > 0 ? (
        <GradeForm
          quizId={quiz.id}
          submissionId={submission.id}
          questions={descriptiveQuestions}
          currentGrades={submission.manualGrades ?? {}}
        />
      ) : null}
    </div>
  );
}

function GradeForm({
  quizId,
  submissionId,
  questions,
  currentGrades,
}: {
  quizId: string;
  submissionId: string;
  questions: Quiz["questions"];
  currentGrades: Record<string, number>;
}) {
  const [grades, setGrades] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const q of questions) {
      init[q.id] =
        currentGrades[q.id] !== undefined ? String(currentGrades[q.id]) : "";
    }
    return init;
  });

  const [state, formAction] = useActionState<GradeFormState, FormData>(
    gradeSubmissionAction,
    undefined
  );

  return (
    <form action={formAction} className="rounded-app border border-primary/30 bg-primary/5 p-4">
      <h3 className="mb-3 text-sm font-bold text-foreground">
        نمره‌دهی سوالات تشریحی (۰ تا {DESCRIPTIVE_MAX})
      </h3>
      <input type="hidden" name="quizId" value={quizId} />
      <input type="hidden" name="submissionId" value={submissionId} />
      <input
        type="hidden"
        name="grades"
        value={JSON.stringify(
          Object.fromEntries(
            Object.entries(grades)
              .filter(([, v]) => v !== "")
              .map(([k, v]) => [k, Number(v)])
          )
        )}
        readOnly
      />

      <div className="flex flex-col gap-3">
        {questions.map((q, i) => (
          <div key={q.id} className="flex items-center gap-3">
            <span className="flex-1 text-xs text-foreground">
              سوال {i + 1}: {q.text.slice(0, 50)}
              {q.text.length > 50 ? "..." : ""}
            </span>
            <input
              type="number"
              min={0}
              max={DESCRIPTIVE_MAX}
              value={grades[q.id]}
              onChange={(e) =>
                setGrades((prev) => ({ ...prev, [q.id]: e.target.value }))
              }
              placeholder="نمره"
              className="w-16 rounded-app border border-border bg-card px-2 py-1.5 text-center text-sm outline-none focus:border-primary"
            />
          </div>
        ))}
      </div>

      {state?.error ? (
        <p className="mt-2 text-xs font-medium text-danger">{state.error}</p>
      ) : null}
      {state?.success ? (
        <p className="mt-2 text-xs font-medium text-success">{state.success}</p>
      ) : null}

      <button
        type="submit"
        className="mt-3 flex h-10 w-full items-center justify-center rounded-app bg-primary text-sm font-bold text-primary-foreground"
      >
        ثبت نمرات تشریحی
      </button>
    </form>
  );
}
