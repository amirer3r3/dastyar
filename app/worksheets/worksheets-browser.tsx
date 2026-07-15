"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  FileText,
  Pencil,
  BookOpen,
} from "lucide-react";
import {
  worksheetGrades,
  getSubject,
} from "./curriculum-data";

export default function WorksheetsBrowser() {
  const [gradeId, setGradeId] = useState(worksheetGrades[0]?.id ?? "");
  const [subjectId, setSubjectId] = useState("");
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
    setGradeId(next);
    setSubjectId("");
    setOpenChapters({});
  }

  function handleSubjectChange(next: string) {
    setSubjectId(next);
    setOpenChapters({});
  }

  function toggleChapter(id: string) {
    setOpenChapters((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="pb-8">
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
            <FileText size={20} className="text-primary" />
            <h1 className="text-base font-bold text-foreground">کاربرگ‌ها</h1>
          </div>
        </div>
        <Link
          href="/worksheets/create"
          className="flex h-9 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-bold text-foreground"
        >
          <Pencil size={14} />
          طراحی
        </Link>
      </header>

      <main className="flex flex-col gap-4 px-4 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">پایه</span>
            <select
              value={gradeId}
              onChange={(e) => handleGradeChange(e.target.value)}
              className="h-11 rounded-app border border-border bg-card px-3 text-sm outline-none focus:border-primary"
            >
              {worksheetGrades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">درس</span>
            <select
              value={subjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              disabled={!gradeId}
              className="h-11 rounded-app border border-border bg-card px-3 text-sm outline-none focus:border-primary disabled:opacity-50"
            >
              <option value="">انتخاب درس...</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {!subjectId ? (
          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <BookOpen size={28} />
            </span>
            <p className="max-w-xs text-sm leading-7 text-muted">
              ابتدا پایه و سپس درس را انتخاب کنید تا فهرست مطالب نمایش داده شود.
            </p>
          </div>
        ) : selectedSubject ? (
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-foreground">
              {selectedGrade?.title} · {selectedSubject.title}
            </h2>

            {selectedSubject.chapters.map((chapter) => {
              const hasChildren = (chapter.children?.length ?? 0) > 0;
              const isOpen = !!openChapters[chapter.id];

              if (!hasChildren) {
                return (
                  <Link
                    key={chapter.id}
                    href={`/worksheets/${chapter.id}`}
                    className="flex items-center justify-between rounded-app border border-border bg-card px-4 py-3 text-sm font-medium shadow-sm active:scale-[0.99]"
                  >
                    {chapter.title}
                    <FileText size={16} className="text-primary" />
                  </Link>
                );
              }

              return (
                <div
                  key={chapter.id}
                  className="overflow-hidden rounded-app border border-border bg-card shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleChapter(chapter.id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-right"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-bold text-foreground">
                      {chapter.title}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-muted transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen ? (
                    <ul className="border-t border-border">
                      {chapter.children!.map((item, index) => (
                        <li key={item.id}>
                          <Link
                            href={`/worksheets/${item.id}`}
                            className={`flex items-center justify-between gap-3 px-4 py-3 text-sm text-foreground transition-colors active:bg-primary/5 ${
                              index < chapter.children!.length - 1
                                ? "border-b border-border/70"
                                : ""
                            }`}
                          >
                            <span className="leading-6">{item.title}</span>
                            <FileText
                              size={15}
                              className="shrink-0 text-primary"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </main>
    </div>
  );
}
