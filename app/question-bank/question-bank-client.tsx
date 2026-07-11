"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  FileQuestion,
  Search,
  X,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  type Question,
  type Difficulty,
  grades,
  subjects,
  difficulties,
  difficultyLabel,
  difficultyColor,
} from "./data";

type Filters = {
  grade: string;
  subject: string;
  difficulty: Difficulty | "";
  search: string;
};

const emptyFilters: Filters = {
  grade: "",
  subject: "",
  difficulty: "",
  search: "",
};

export default function QuestionBankClient({
  questions,
}: {
  questions: Question[];
}) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (filters.grade && q.grade !== filters.grade) return false;
      if (filters.subject && q.subject !== filters.subject) return false;
      if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
      if (filters.search) {
        const s = filters.search.trim().toLowerCase();
        if (
          !q.text.toLowerCase().includes(s) &&
          !q.answer.toLowerCase().includes(s)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [questions, filters]);

  const hasActiveFilters =
    filters.grade || filters.subject || filters.difficulty || filters.search;

  const clearFilters = () => setFilters(emptyFilters);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              aria-label="بازگشت"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground"
            >
              <ArrowRight size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <FileQuestion size={20} className="text-primary" />
              <h1 className="text-base font-bold text-foreground">بانک سوالات</h1>
            </div>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {filtered.length} سوال
          </span>
        </div>

        {/* جستجو */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 rounded-app border border-border bg-card px-3 py-2.5 shadow-sm">
            <Search size={18} className="shrink-0 text-muted" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => set("search", e.target.value)}
              placeholder="جستجو در متن سوال یا پاسخ..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
            />
            {filters.search ? (
              <button
                type="button"
                onClick={() => set("search", "")}
                aria-label="پاک کردن جستجو"
                className="text-muted"
              >
                <X size={16} />
              </button>
            ) : null}
          </div>
        </div>

        {/* فیلترها */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-3">
          <FilterSelect
            label="پایه"
            value={filters.grade}
            options={grades}
            onChange={(v) => set("grade", v)}
          />
          <FilterSelect
            label="درس"
            value={filters.subject}
            options={subjects}
            onChange={(v) => set("subject", v)}
          />
          <FilterSelect
            label="سختی"
            value={filters.difficulty}
            options={difficulties.map((d) => d.value)}
            labels={Object.fromEntries(
              difficulties.map((d) => [d.value, d.label])
            )}
            onChange={(v) => set("difficulty", v as Difficulty | "")}
          />
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="flex shrink-0 items-center gap-1 rounded-full border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-bold text-danger"
            >
              <X size={14} />
              پاک کردن
            </button>
          ) : null}
        </div>
      </header>

      <main className="flex flex-col gap-3 px-4 pt-1 pb-4">
        {filtered.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <FileQuestion size={48} className="text-muted" />
            <p className="text-sm font-medium text-muted">
              سوالی با این فیلترها پیدا نشد.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-bold text-primary"
            >
              پاک کردن فیلترها
            </button>
          </div>
        ) : (
          filtered.map((q) => <QuestionCard key={q.id} question={q} />)
        )}
      </main>
    </>
  );
}

function FilterSelect({
  label,
  value,
  options,
  labels,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  labels?: Record<string, string>;
  onChange: (v: string) => void;
}) {
  const display = value ? (labels?.[value] ?? value) : label;

  return (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none rounded-full border py-2 pl-8 pr-3 text-xs font-medium outline-none transition-colors ${
          value
            ? "border-primary bg-primary/10 text-primary"
            : "border-border bg-card text-muted"
        }`}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {labels?.[opt] ?? opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
      />
      <span className="sr-only">{display}</span>
    </div>
  );
}

function QuestionCard({ question }: { question: Question }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const color = difficultyColor(question.difficulty);

  return (
    <article className="rounded-app border border-border bg-card p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
          {question.grade}
        </span>
        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-bold text-accent">
          {question.subject}
        </span>
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {difficultyLabel(question.difficulty)}
        </span>
      </div>

      <p className="text-sm font-medium leading-7 text-foreground">
        {question.text}
      </p>

      <button
        type="button"
        onClick={() => setShowAnswer((v) => !v)}
        className="mt-3 flex items-center gap-1.5 text-xs font-bold text-primary"
      >
        {showAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
        {showAnswer ? "مخفی کردن پاسخ" : "نمایش پاسخ"}
      </button>

      {showAnswer ? (
        <div className="mt-2 rounded-app bg-success/10 px-3 py-2 text-sm leading-7 text-success">
          <span className="font-bold">پاسخ: </span>
          {question.answer}
        </div>
      ) : null}
    </article>
  );
}
