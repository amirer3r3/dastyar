"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  GraduationCap,
  BookOpen,
  ListChecks,
  FileText,
  ClipboardList,
} from "lucide-react";
import SectionBannerHeader from "@/app/components/section-banner/section-banner-header";
import {
  questionBankGrades,
  getQBSubject,
  getQBFlatLessons,
  type QBSubject,
} from "./curriculum-data";

type Tab = "lesson" | "final";

export default function QuestionBankClient() {
  const [tab, setTab] = useState<Tab>("lesson");
  const [gradeId, setGradeId] = useState(questionBankGrades[0]?.id ?? "");
  const [subjectId, setSubjectId] = useState(
    questionBankGrades[0]?.subjects[0]?.id ?? ""
  );

  const selectedGrade = useMemo(
    () => questionBankGrades.find((g) => g.id === gradeId),
    [gradeId]
  );

  const subjects = selectedGrade?.subjects ?? [];

  const selectedSubject = useMemo(() => {
    if (!gradeId || !subjectId) return undefined;
    return getQBSubject(gradeId, subjectId);
  }, [gradeId, subjectId]);

  function handleGradeChange(next: string) {
    const grade = questionBankGrades.find((g) => g.id === next);
    setGradeId(next);
    setSubjectId(grade?.subjects[0]?.id ?? "");
  }

  const lessons = selectedSubject ? getQBFlatLessons(selectedSubject) : [];

  return (
    <div className="pb-8">
      <SectionBannerHeader type="sample-question" />

      <main className="flex flex-col gap-4 px-4 pt-1">
        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-primary/5 p-1">
          <button
            type="button"
            onClick={() => setTab("lesson")}
            className={`rounded-xl py-2.5 text-sm font-bold transition-colors ${
              tab === "lesson"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted"
            }`}
          >
            درس به درس
          </button>
          <button
            type="button"
            onClick={() => setTab("final")}
            className={`rounded-xl py-2.5 text-sm font-bold transition-colors ${
              tab === "final"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted"
            }`}
          >
            آزمون نهایی
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-muted">
              پایه تحصیلی
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-primary">
                <GraduationCap size={18} />
              </span>
              <select
                value={gradeId}
                onChange={(e) => handleGradeChange(e.target.value)}
                className="h-12 w-full appearance-none rounded-2xl border border-border bg-card py-2 pr-10 pl-8 text-sm font-medium text-foreground shadow-sm outline-none focus:border-primary"
              >
                {questionBankGrades.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-muted">درس</span>
            <div className="relative">
              <span className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-primary">
                <BookOpen size={18} />
              </span>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                disabled={!gradeId || subjects.length === 0}
                className="h-12 w-full appearance-none rounded-2xl border border-border bg-card py-2 pr-10 pl-8 text-sm font-medium text-foreground shadow-sm outline-none focus:border-primary disabled:opacity-50"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
            </div>
          </label>
        </div>

        {selectedGrade && selectedSubject ? (
          <div className="flex justify-center">
            <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
              {selectedGrade.title} • {selectedSubject.title}
            </span>
          </div>
        ) : null}

        {tab === "final" ? (
          <FinalExamEmpty />
        ) : selectedSubject ? (
          <LessonList subject={selectedSubject} lessons={lessons} />
        ) : null}
      </main>
    </div>
  );
}

function LessonList({
  subject,
  lessons,
}: {
  subject: QBSubject;
  lessons: Array<{ id: string; title: string }>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <ListChecks size={16} className="text-primary" />
        <h2 className="text-sm font-bold text-foreground">
          سوالات درس به درس · {subject.title}
        </h2>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {lessons.map((item, index) => (
          <Link
            key={item.id}
            href={`/question-bank/${item.id}`}
            className={`flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-foreground transition-colors active:bg-primary/5 ${
              index < lessons.length - 1 ? "border-b border-border/60" : ""
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
              {(index + 1).toLocaleString("fa-IR")}
            </span>
            <span className="flex-1 leading-6">{item.title}</span>
            <FileText size={15} className="shrink-0 text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function FinalExamEmpty() {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
        <ClipboardList size={28} />
      </span>
      <h2 className="text-sm font-bold text-foreground">آزمون نهایی</h2>
      <p className="max-w-xs text-sm leading-7 text-muted">
        محتوای آزمون نهایی به‌زودی اضافه می‌شود. فعلاً از تب «درس به درس»
        استفاده کنید.
      </p>
    </div>
  );
}
