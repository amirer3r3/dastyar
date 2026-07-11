"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ListOrdered, ChevronDown, CheckCircle2 } from "lucide-react";
import type { SubjectGuide, Chapter, Exercise } from "./data";

export default function StepGuideClient({
  guides,
}: {
  guides: SubjectGuide[];
}) {
  const [openSubject, setOpenSubject] = useState<string | null>(guides[0]?.id ?? null);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center gap-2 bg-background/90 px-4 py-3 backdrop-blur">
        <Link
          href="/"
          aria-label="بازگشت"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground"
        >
          <ArrowRight size={18} />
        </Link>
        <div className="flex items-center gap-2">
          <ListOrdered size={20} className="text-primary" />
          <h1 className="text-base font-bold text-foreground">گام به گام</h1>
        </div>
      </header>

      <main className="flex flex-col gap-3 px-4 pt-2 pb-4">
        <p className="rounded-app bg-primary/5 px-4 py-3 text-xs leading-6 text-muted">
          در این بخش، حل تمرین‌ها به‌صورت مرحله‌به‌مرحله و آموزشی ارائه شده است تا
          روش رسیدن به پاسخ را یاد بگیرید، نه فقط پاسخ نهایی.
        </p>

        {guides.map((subject) => (
          <SubjectAccordion
            key={subject.id}
            subject={subject}
            isOpen={openSubject === subject.id}
            onToggle={() =>
              setOpenSubject((prev) =>
                prev === subject.id ? null : subject.id
              )
            }
          />
        ))}
      </main>
    </>
  );
}

function SubjectAccordion({
  subject,
  isOpen,
  onToggle,
}: {
  subject: SubjectGuide;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-app border border-border bg-card shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 p-4 text-right"
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
          style={{ backgroundColor: `${subject.color}18` }}
        >
          {subject.icon}
        </span>
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-bold text-foreground">
            {subject.title}
          </span>
          <span className="text-xs text-muted">
            {subject.chapters.length} فصل
          </span>
        </div>
        <ChevronDown
          size={20}
          className={`text-muted transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div className="flex flex-col gap-2 border-t border-border bg-background/50 p-3">
          {subject.chapters.map((chapter) => (
            <ChapterAccordion key={chapter.id} chapter={chapter} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ChapterAccordion({ chapter }: { chapter: Chapter }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-app border border-border bg-card">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center gap-2 p-3 text-right"
      >
        <span className="flex-1 text-sm font-bold text-foreground">
          {chapter.title}
        </span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
          {chapter.exercises.length} تمرین
        </span>
        <ChevronDown
          size={18}
          className={`text-muted transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div className="flex flex-col gap-2 border-t border-border p-3">
          {chapter.exercises.map((exercise) => (
            <ExerciseAccordion key={exercise.id} exercise={exercise} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ExerciseAccordion({ exercise }: { exercise: Exercise }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-app border border-border bg-background">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center gap-2 p-3 text-right"
      >
        <span className="flex-1 text-sm font-medium text-foreground">
          {exercise.title}
        </span>
        <ChevronDown
          size={18}
          className={`text-muted transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div className="flex flex-col gap-4 border-t border-border p-4">
          {/* صورت مسئله */}
          <div className="rounded-app bg-primary/5 p-3">
            <span className="mb-1 block text-xs font-bold text-primary">
              صورت سوال
            </span>
            <p className="text-sm leading-7 text-foreground">
              {exercise.problem}
            </p>
          </div>

          {/* مراحل حل */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold text-muted">مراحل حل:</span>
            {exercise.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <p className="pt-0.5 text-sm leading-7 text-foreground">
                  {step}
                </p>
              </div>
            ))}
          </div>

          {/* پاسخ نهایی */}
          <div className="flex items-center gap-2 rounded-app bg-success/10 px-3 py-2.5">
            <CheckCircle2 size={18} className="shrink-0 text-success" />
            <p className="text-sm font-bold text-success">
              پاسخ نهایی: {exercise.finalAnswer}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
