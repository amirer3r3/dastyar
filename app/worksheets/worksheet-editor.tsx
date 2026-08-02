"use client";

import { useMemo, useState, useRef, useLayoutEffect, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Printer,
  Eye,
  Pencil,
  Sparkles,
  FileText,
  ChevronDown,
  GraduationCap,
  BookOpen,
  Library,
  Plus,
} from "lucide-react";
import {
  type WorksheetData,
  type WorksheetTheme,
  defaultWorksheet,
} from "./types";
import WorksheetPreview from "./worksheet-preview";
import {
  bankGrades,
  bankSubjects,
  filterBankQuestions,
  type BankQuestion,
} from "./sample-bank";
import ManualDesignEditor from "./manual-editor";
import {
  defaultManualLayout,
  blocksToQuestions,
  createEmptyQuestionBlock,
  type ManualLayout,
} from "./manual-editor/types";

type QuestionsTab = "bank" | "manual";

export default function WorksheetEditor() {
  const [data, setData] = useState<WorksheetData>(defaultWorksheet);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [questionsTab, setQuestionsTab] = useState<QuestionsTab>("bank");
  const [bankGrade, setBankGrade] = useState("پایه سوم");
  const [bankSubject, setBankSubject] = useState("ریاضی");
  const [flash, setFlash] = useState<string | null>(null);
  const [manualLayout, setManualLayout] = useState<ManualLayout>(() =>
    defaultManualLayout()
  );

  const update = <K extends keyof WorksheetData>(
    key: K,
    value: WorksheetData[K]
  ) => setData((prev) => ({ ...prev, [key]: value }));

  const setTheme = (theme: WorksheetTheme) => update("theme", theme);

  const syncManualLayout = (layout: ManualLayout) => {
    setManualLayout(layout);
    setData((prev) => ({
      ...prev,
      questions: blocksToQuestions(layout.blocks),
    }));
  };

  const showFlash = (message: string) => {
    setFlash(message);
    window.setTimeout(() => setFlash(null), 1800);
  };

  const addBankQuestion = (item: BankQuestion, target: "manual" | "sample") => {
    const block = createEmptyQuestionBlock(item.text);
    block.answerLines = item.answerLines;

    setManualLayout((prev) => {
      const exists = prev.blocks.some(
        (b) =>
          (b.type === "question" || b.type === "bank-question") &&
          b.html.includes(item.text)
      );
      if (exists) return prev;
      return { ...prev, blocks: [...prev.blocks, block] };
    });

    setData((prev) => {
      const exists = prev.questions.some(
        (q) => q.text.trim() === item.text.trim()
      );
      if (exists) return prev;
      return {
        ...prev,
        questions: [
          ...prev.questions,
          {
            id: block.id,
            text: item.text,
            answerLines: item.answerLines,
          },
        ],
        grade: prev.grade || bankGrade,
        subject: prev.subject || bankSubject,
      };
    });

    showFlash(
      target === "sample"
        ? "به نمونه سوال اضافه شد"
        : "به طراحی دستی اضافه شد"
    );
    if (target === "manual") setQuestionsTab("manual");
  };

  const bankQuestions = useMemo(
    () => filterBankQuestions(bankGrade, bankSubject),
    [bankGrade, bankSubject]
  );

  const handlePrint = () => window.print();

  return (
    <div className="pb-8">
      <header className="no-print sticky top-0 z-40 flex items-center justify-between gap-3 bg-background/90 px-4 py-3 backdrop-blur">
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
            <h1 className="text-base font-bold text-foreground">طراحی کاربرگ</h1>
          </div>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-md shadow-primary/30 transition-transform active:scale-95"
        >
          <Printer size={16} />
          خروجی PDF
        </button>
      </header>

      <div className="no-print mx-4 mt-2 flex rounded-full border border-border bg-card p-1 md:hidden">
        <button
          type="button"
          onClick={() => setMobileView("edit")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition-colors ${
            mobileView === "edit"
              ? "bg-primary text-primary-foreground"
              : "text-muted"
          }`}
        >
          <Pencil size={16} />
          ویرایش
        </button>
        <button
          type="button"
          onClick={() => setMobileView("preview")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition-colors ${
            mobileView === "preview"
              ? "bg-primary text-primary-foreground"
              : "text-muted"
          }`}
        >
          <Eye size={16} />
          پیش‌نمایش
        </button>
      </div>

      {flash ? (
        <div className="no-print mx-4 mt-3 rounded-2xl bg-primary/10 px-4 py-2 text-center text-xs font-bold text-primary">
          {flash}
        </div>
      ) : null}

      <div className="mt-4 gap-6 px-4 md:flex md:items-start">
        <div
          className={`no-print flex flex-col gap-5 ${
            questionsTab === "manual" ? "w-full" : "md:w-[380px] md:shrink-0"
          } ${mobileView === "edit" ? "flex" : "hidden md:flex"}`}
        >
          <div className="rounded-app border border-border bg-card p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-accent" />
              <h2 className="text-sm font-bold text-foreground">تم کاربرگ</h2>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setTheme("formal")}
                className={`flex flex-1 flex-col items-center gap-1 rounded-app border-2 p-3 text-sm transition-colors ${
                  data.theme === "formal"
                    ? "border-primary bg-primary/5 font-bold text-primary"
                    : "border-border text-muted"
                }`}
              >
                <span className="text-lg">📄</span>
                رسمی
                <span className="text-[10px] font-normal text-muted">
                  مقاطع بالا
                </span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("cartoon")}
                className={`flex flex-1 flex-col items-center gap-1 rounded-app border-2 p-3 text-sm transition-colors ${
                  data.theme === "cartoon"
                    ? "border-pink-500 bg-pink-50 font-bold text-pink-600"
                    : "border-border text-muted"
                }`}
              >
                <span className="text-lg">🎨</span>
                کارتونی
                <span className="text-[10px] font-normal text-muted">
                  ابتدایی
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-app border border-border bg-card p-4 shadow-sm">
            <h2 className="text-sm font-bold text-foreground">اطلاعات کاربرگ</h2>
            <Field
              label="عنوان"
              value={data.title}
              onChange={(v) => update("title", v)}
              placeholder="مثلاً کاربرگ ریاضی فصل ۲"
            />
            <div className="flex gap-3">
              <Field
                label="درس"
                value={data.subject}
                onChange={(v) => update("subject", v)}
                placeholder="ریاضی"
              />
              <Field
                label="پایه"
                value={data.grade}
                onChange={(v) => update("grade", v)}
                placeholder="سوم"
              />
            </div>
            <Field
              label="نام معلم"
              value={data.teacher}
              onChange={(v) => update("teacher", v)}
              placeholder="اختیاری"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                دستورالعمل
              </label>
              <textarea
                value={data.instructions}
                onChange={(e) => update("instructions", e.target.value)}
                rows={2}
                placeholder="راهنمای پاسخ‌دهی..."
                className="rounded-app border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-app border border-border bg-card p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-primary/5 p-1">
              <button
                type="button"
                onClick={() => setQuestionsTab("bank")}
                className={`rounded-xl py-2.5 text-sm font-bold transition-colors ${
                  questionsTab === "bank"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted"
                }`}
              >
                بانک سوالات
              </button>
              <button
                type="button"
                onClick={() => setQuestionsTab("manual")}
                className={`rounded-xl py-2.5 text-sm font-bold transition-colors ${
                  questionsTab === "manual"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted"
                }`}
              >
                طراحی دستی
              </button>
            </div>

            {questionsTab === "bank" ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <FilterSelect
                    icon={<GraduationCap size={16} />}
                    value={bankGrade}
                    onChange={setBankGrade}
                    options={bankGrades}
                  />
                  <FilterSelect
                    icon={<BookOpen size={16} />}
                    value={bankSubject}
                    onChange={setBankSubject}
                    options={bankSubjects}
                  />
                </div>

                <h2 className="text-sm font-bold text-foreground">
                  سوالات ({bankQuestions.length.toLocaleString("fa-IR")})
                </h2>

                {bankQuestions.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-6 text-center">
                    <Library size={22} className="text-muted" />
                    <p className="text-xs leading-6 text-muted">
                      برای این پایه و درس هنوز سوالی در بانک نیست.
                    </p>
                  </div>
                ) : (
                  bankQuestions.map((item, index) => (
                    <BankQuestionCard
                      key={item.id}
                      index={index}
                      item={item}
                      onAddToSample={() => addBankQuestion(item, "sample")}
                      onAddToManual={() => addBankQuestion(item, "manual")}
                    />
                  ))
                )}
              </>
            ) : (
              <ManualDesignEditor
                layout={manualLayout}
                onChange={syncManualLayout}
                sheetTitle={data.title}
                meta={{
                  subject: data.subject,
                  grade: data.grade,
                  teacher: data.teacher,
                }}
              />
            )}
          </div>
        </div>

        {questionsTab === "bank" ? (
          <div
            className={`flex-1 ${
              mobileView === "preview" ? "block" : "hidden md:block"
            }`}
          >
            <ScaledPreview>
              <WorksheetPreview data={data} />
            </ScaledPreview>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FilterSelect({
  icon,
  value,
  onChange,
  options,
}: {
  icon: ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-primary">
        {icon}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full appearance-none rounded-2xl border border-border bg-background py-2 pr-9 pl-8 text-sm font-medium text-foreground outline-none focus:border-primary"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

function BankQuestionCard({
  index,
  item,
  onAddToSample,
  onAddToManual,
}: {
  index: number;
  item: BankQuestion;
  onAddToSample: () => void;
  onAddToManual: () => void;
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-app border border-border bg-background p-3 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="pt-0.5 text-xs font-bold text-muted">
          سوال {(index + 1).toLocaleString("fa-IR")}
        </span>
        <div className="flex flex-col items-stretch gap-1.5">
          <button
            type="button"
            onClick={onAddToSample}
            className="flex items-center justify-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary"
          >
            <Plus size={11} />
            افزودن به نمونه سوال
          </button>
          <button
            type="button"
            onClick={onAddToManual}
            className="flex items-center justify-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary"
          >
            <Plus size={11} />
            افزودن به طراحی دستی
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card px-3 py-3 text-center text-sm leading-7 text-foreground">
        {item.text}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted">خطوط پاسخ:</span>
        <span className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-bold text-foreground">
          {item.answerLines.toLocaleString("fa-IR")}
        </span>
      </div>
    </div>
  );
}

const A4_WIDTH_PX = 793.7;

function ScaledPreview({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const sheet = sheetRef.current;
    if (!container || !sheet) return;

    const recompute = () => {
      const available = container.clientWidth;
      const nextScale = Math.min(1, available / A4_WIDTH_PX);
      setScale(nextScale);
      setHeight(sheet.offsetHeight * nextScale);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(container);
    ro.observe(sheet);
    return () => ro.disconnect();
  });

  return (
    <div ref={containerRef} className="w-full">
      <div style={{ height }} className="relative w-full">
        <div
          ref={sheetRef}
          className="sheet-scaler absolute right-0 top-0 origin-top-right"
          style={{ transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-app border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted"
      />
    </div>
  );
}
