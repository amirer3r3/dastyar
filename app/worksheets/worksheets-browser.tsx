"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  FileText,
  Pencil,
  BookOpen,
  GraduationCap,
  Image as ImageIcon,
  FileSpreadsheet,
} from "lucide-react";
import {
  worksheetGrades,
  getSubject,
  getFlatLessons,
  type WorksheetChapter,
} from "./curriculum-data";

function chapterIcon(title: string) {
  if (title.includes("نگاره")) return ImageIcon;
  return BookOpen;
}

export default function WorksheetsBrowser() {
  const [gradeId, setGradeId] = useState(worksheetGrades[0]?.id ?? "");
  const [subjectId, setSubjectId] = useState(
    worksheetGrades[0]?.subjects[0]?.id ?? ""
  );
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>(
    {}
  );

  const selectedGrade = useMemo(
    () => worksheetGrades.find((g) => g.id === gradeId),
    [gradeId]
  );

  const subjects = selectedGrade?.subjects ?? [];

  const selectedSubject = useMemo(() => {
    if (!gradeId || !subjectId) return undefined;
    return getSubject(gradeId, subjectId);
  }, [gradeId, subjectId]);

  function handleGradeChange(next: string) {
    const grade = worksheetGrades.find((g) => g.id === next);
    setGradeId(next);
    setSubjectId(grade?.subjects[0]?.id ?? "");
    setOpenChapters({});
  }

  function handleSubjectChange(next: string) {
    setSubjectId(next);
    setOpenChapters({});
  }

  function toggleChapter(id: string) {
    setOpenChapters((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const anyChapterOpen =
    selectedSubject?.layout === "accordion" &&
    selectedSubject.chapters.some((c) => openChapters[c.id]);

  return (
    <div className="pb-8">
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            aria-label="بازگشت"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground"
          >
            <ArrowRight size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            <h1 className="text-base font-bold text-foreground">کاربرگ‌ها</h1>
          </div>
        </div>
        <Link
          href="/worksheets/create"
          className="flex h-9 items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3.5 text-xs font-bold text-primary"
        >
          <Pencil size={14} />
          طراحی
        </Link>
      </header>

      <main className="flex flex-col gap-4 px-4 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <label className="relative flex flex-col">
            <span className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-primary">
              <GraduationCap size={18} />
            </span>
            <select
              value={gradeId}
              onChange={(e) => handleGradeChange(e.target.value)}
              className="h-12 appearance-none rounded-2xl border border-border bg-card py-2 pr-10 pl-8 text-sm font-medium text-foreground shadow-sm outline-none focus:border-primary"
            >
              {worksheetGrades.map((g) => (
                <option key={g.id} value={g.id}>
                  پایه: {g.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
          </label>

          <label className="relative flex flex-col">
            <span className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-primary">
              <BookOpen size={18} />
            </span>
            <select
              value={subjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              disabled={!gradeId || subjects.length === 0}
              className="h-12 appearance-none rounded-2xl border border-border bg-card py-2 pr-10 pl-8 text-sm font-medium text-foreground shadow-sm outline-none focus:border-primary disabled:opacity-50"
            >
              {subjects.length === 0 ? (
                <option value="">انتخاب درس...</option>
              ) : null}
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  درس: {s.title}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
          </label>
        </div>

        {selectedGrade && selectedSubject ? (
          <div className="flex justify-center">
            <span className="rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
              {selectedGrade.title} • {selectedSubject.title}
            </span>
          </div>
        ) : null}

        {!selectedSubject ? (
          <EmptyState text="ابتدا پایه و سپس درس را انتخاب کنید." />
        ) : selectedSubject.layout === "flat" ? (
          <FlatLessonList lessons={getFlatLessons(selectedSubject)} />
        ) : (
          <div className="flex flex-col gap-3">
            {selectedSubject.chapters.map((chapter) => (
              <AccordionChapter
                key={chapter.id}
                chapter={chapter}
                isOpen={!!openChapters[chapter.id]}
                onToggle={() => toggleChapter(chapter.id)}
              />
            ))}

            {!anyChapterOpen ? (
              <EmptyState text="برای مشاهده کاربرگ‌ها، یک فصل را باز کنید" />
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}

function AccordionChapter({
  chapter,
  isOpen,
  onToggle,
}: {
  chapter: WorksheetChapter;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = chapterIcon(chapter.title);
  const children = chapter.children ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-4 text-right"
        aria-expanded={isOpen}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon size={20} />
        </span>
        <span className="flex-1 text-sm font-bold text-foreground">
          {chapter.title}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && children.length > 0 ? (
        <ul className="border-t border-border bg-background/50">
          {children.map((item, index) => (
            <li key={item.id}>
              <Link
                href={`/worksheets/${item.id}`}
                className={`flex items-center justify-between gap-3 px-4 py-3.5 text-sm text-foreground transition-colors active:bg-primary/5 ${
                  index < children.length - 1 ? "border-b border-border/60" : ""
                }`}
              >
                <span className="leading-6">{item.title}</span>
                <FileText size={15} className="shrink-0 text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function FlatLessonList({
  lessons,
}: {
  lessons: Array<{ id: string; title: string }>;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {lessons.map((item, index) => (
        <Link
          key={item.id}
          href={`/worksheets/${item.id}`}
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
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 px-4 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/5 text-primary/50">
        <FileSpreadsheet size={32} strokeWidth={1.5} />
      </span>
      <p className="max-w-xs text-sm leading-7 text-muted">{text}</p>
    </div>
  );
}
