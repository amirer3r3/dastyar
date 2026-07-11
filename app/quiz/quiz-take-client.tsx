"use client";

import { useState } from "react";
import { useActionState } from "react";
import { AlertCircle, CheckCircle2, ClipboardList } from "lucide-react";
import type { Quiz, QuizQuestion } from "./types";
import { questionTypeLabels } from "./types";
import { submitQuizAction, type QuizFormState } from "@/app/lib/quiz-actions";
import AuthSubmit from "@/app/components/auth-submit";

export default function QuizTakeClient({ quiz }: { quiz: Quiz }) {
  const [studentName, setStudentName] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [state, formAction] = useActionState<QuizFormState, FormData>(
    submitQuizAction,
    undefined
  );

  const setAnswer = (questionId: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

  const submitted = !!state?.success;

  if (submitted) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-success/10 text-success">
          <CheckCircle2 size={40} />
        </span>
        <h2 className="text-lg font-bold text-foreground">آزمون ارسال شد!</h2>
        <p className="max-w-xs text-sm leading-7 text-muted">{state.success}</p>
      </main>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/90 px-4 py-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <ClipboardList size={22} className="text-primary" />
          <div>
            <h1 className="text-base font-bold text-foreground">{quiz.title}</h1>
            {quiz.description ? (
              <p className="text-xs text-muted">{quiz.description}</p>
            ) : null}
          </div>
        </div>
      </header>

      <form action={formAction} className="flex flex-col gap-5 px-4 pt-2 pb-8">
        <input type="hidden" name="quizId" value={quiz.id} />
        <input
          type="hidden"
          name="answers"
          value={JSON.stringify(
            quiz.questions.map((q) => ({
              questionId: q.id,
              value: answers[q.id] ?? "",
            }))
          )}
          readOnly
        />

        <div className="rounded-app border border-border bg-card p-4 shadow-sm">
          <label className="mb-1.5 block text-xs font-medium text-foreground">
            نام و نام خانوادگی
          </label>
          <input
            name="studentName"
            type="text"
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="نام خود را وارد کنید"
            className="h-11 w-full rounded-app border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted"
          />
        </div>

        {quiz.questions.map((q, index) => (
          <QuestionTake
            key={q.id}
            question={q}
            index={index}
            value={answers[q.id] ?? ""}
            onChange={(v) => setAnswer(q.id, v)}
          />
        ))}

        {state?.error ? (
          <div className="flex items-center gap-2 rounded-app bg-danger/10 px-3 py-2.5 text-xs font-medium text-danger">
            <AlertCircle size={16} />
            <span>{state.error}</span>
          </div>
        ) : null}

        <AuthSubmit label="ارسال پاسخ‌ها" />
      </form>
    </>
  );
}

function QuestionTake({
  question,
  index,
  value,
  onChange,
}: {
  question: QuizQuestion;
  index: number;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-app border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-start gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {index + 1}
        </span>
        <div className="flex-1">
          <span className="mb-1 block text-[11px] font-bold text-muted">
            {questionTypeLabels[question.type]}
          </span>
          <p className="text-sm font-medium leading-7 text-foreground">
            {question.text}
          </p>
        </div>
      </div>

      {question.type === "multiple_choice" ? (
        <div className="mr-9 flex flex-col gap-2">
          {(question.options ?? [])
            .filter((o) => o.trim())
            .map((opt, i) => (
              <label
                key={i}
                className={`flex cursor-pointer items-center gap-2 rounded-app border px-3 py-2.5 transition-colors ${
                  value === String(i)
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${question.id}`}
                  checked={value === String(i)}
                  onChange={() => onChange(String(i))}
                  className="accent-primary"
                />
                <span className="text-sm text-foreground">{opt}</span>
              </label>
            ))}
        </div>
      ) : null}

      {question.type === "descriptive" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          required
          placeholder="پاسخ خود را بنویسید..."
          className="mr-9 w-[calc(100%-2.25rem)] rounded-app border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted"
        />
      ) : null}

      {question.type === "matching" ? (
        <div className="mr-9 flex flex-col gap-3">
          {(question.pairs ?? [])
            .filter((p) => p.left.trim() && p.right.trim())
            .map((pair) => {
              const parsed: Record<string, string> = (() => {
                try {
                  return JSON.parse(value || "{}");
                } catch {
                  return {};
                }
              })();

              return (
                <div key={pair.id} className="flex items-center gap-2">
                  <span className="flex-1 rounded-app border border-border bg-background px-3 py-2 text-sm text-foreground">
                    {pair.left}
                  </span>
                  <span className="text-muted">←</span>
                  <select
                    value={parsed[pair.id] ?? ""}
                    onChange={(e) => {
                      const next = { ...parsed, [pair.id]: e.target.value };
                      onChange(JSON.stringify(next));
                    }}
                    required
                    className="flex-1 rounded-app border border-border bg-background px-2 py-2 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="">انتخاب کنید...</option>
                    {(question.pairs ?? [])
                      .filter((p) => p.right.trim())
                      .map((p) => (
                        <option key={p.id} value={p.right}>
                          {p.right}
                        </option>
                      ))}
                  </select>
                </div>
              );
            })}
        </div>
      ) : null}
    </div>
  );
}
