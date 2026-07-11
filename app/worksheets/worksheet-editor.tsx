"use client";

import { useState, useRef, useLayoutEffect, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Plus,
  Trash2,
  Printer,
  Eye,
  Pencil,
  Sparkles,
  FileText,
} from "lucide-react";
import {
  type WorksheetData,
  type WorksheetTheme,
  defaultWorksheet,
  emptyQuestion,
} from "./types";
import WorksheetPreview from "./worksheet-preview";

export default function WorksheetEditor() {
  const [data, setData] = useState<WorksheetData>(defaultWorksheet);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");

  const update = <K extends keyof WorksheetData>(
    key: K,
    value: WorksheetData[K]
  ) => setData((prev) => ({ ...prev, [key]: value }));

  const setTheme = (theme: WorksheetTheme) => update("theme", theme);

  const addQuestion = () =>
    setData((prev) => ({
      ...prev,
      questions: [...prev.questions, emptyQuestion()],
    }));

  const removeQuestion = (id: string) =>
    setData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));

  const updateQuestion = (
    id: string,
    field: "text" | "answerLines",
    value: string | number
  ) =>
    setData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    }));

  const handlePrint = () => window.print();

  return (
    <div className="pb-8">
      {/* هدر ابزار */}
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

      {/* سوییچ موبایل بین ویرایش و پیش‌نمایش */}
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

      <div className="mt-4 gap-6 px-4 md:flex md:items-start">
        {/* ستون ویرایش */}
        <div
          className={`no-print flex flex-col gap-5 md:w-[380px] md:shrink-0 ${
            mobileView === "edit" ? "flex" : "hidden md:flex"
          }`}
        >
          {/* انتخاب تم */}
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

          {/* اطلاعات کاربرگ */}
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

          {/* سوالات */}
          <div className="flex flex-col gap-3 rounded-app border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">
                سوالات ({data.questions.length})
              </h2>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary"
              >
                <Plus size={14} />
                افزودن
              </button>
            </div>

            {data.questions.map((q, index) => (
              <div
                key={q.id}
                className="flex flex-col gap-2 rounded-app border border-border bg-background p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted">
                    سوال {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeQuestion(q.id)}
                    aria-label="حذف سوال"
                    className="text-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <textarea
                  value={q.text}
                  onChange={(e) => updateQuestion(q.id, "text", e.target.value)}
                  rows={2}
                  placeholder="متن سوال را بنویسید..."
                  className="rounded-app border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                />
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted">خطوط پاسخ:</label>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={q.answerLines}
                    onChange={(e) =>
                      updateQuestion(
                        q.id,
                        "answerLines",
                        Number(e.target.value)
                      )
                    }
                    className="w-16 rounded-app border border-border bg-card px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>
            ))}

            {data.questions.length === 0 ? (
              <p className="py-2 text-center text-xs text-muted">
                هنوز سوالی اضافه نکرده‌اید.
              </p>
            ) : null}
          </div>
        </div>

        {/* ستون پیش‌نمایش */}
        <div
          className={`flex-1 ${
            mobileView === "preview" ? "block" : "hidden md:block"
          }`}
        >
          <ScaledPreview>
            <WorksheetPreview data={data} />
          </ScaledPreview>
        </div>
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
