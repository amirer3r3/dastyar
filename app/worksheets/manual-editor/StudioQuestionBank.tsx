"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  ListChecks,
  Plus,
} from "lucide-react";
import {
  formatPersianNumber,
  toEnglishDigits,
} from "@/app/lib/persian-digits";
import {
  getQBFlatLessons,
  questionBankGrades,
} from "@/app/question-bank/curriculum-data";
import {
  bankGrades,
  bankSubjects,
  filterBankQuestions,
  type BankQuestion,
} from "../sample-bank";
import QuestionStylePanel from "../QuestionStylePanel";
import { useExamDesignerStore } from "./store/exam-designer-store";

type BankSessionEdit = {
  text: string;
  answerSpace: number;
};

function FilterSelect({
  icon,
  value,
  onChange,
  options,
  disabled,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-[#0E7048]">
        {icon}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-10 w-full appearance-none rounded-xl border border-border bg-white py-2 pr-9 pl-8 text-sm font-medium text-foreground outline-none focus:border-[#0E7048] disabled:opacity-50"
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

function PersianNumberInput({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      value={formatPersianNumber(value, { grouping: false })}
      onChange={(e) => {
        const digits = toEnglishDigits(e.target.value).replace(/[^\d]/g, "");
        if (!digits) {
          onChange(min);
          return;
        }
        const n = parseInt(digits, 10);
        onChange(Math.min(max, Math.max(min, n)));
      }}
      className="flex h-7 w-9 items-center justify-center border-0 border-x border-border bg-transparent px-0 text-center text-[11px] font-bold leading-none"
    />
  );
}

function StudioBankCard({
  index,
  edit,
  onEditText,
  onEditAnswerSpace,
  onAdd,
}: {
  index: number;
  edit: BankSessionEdit;
  onEditText: (text: string) => void;
  onEditAnswerSpace: (space: number) => void;
  onAdd: () => void;
}) {
  return (
    <div className="flex shrink-0 flex-col gap-2 rounded-xl border border-border bg-white p-2.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-bold text-muted">
          سوال {formatPersianNumber(index + 1)}
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="flex shrink-0 items-center gap-1 rounded-full bg-[#0E7048] px-3 py-1.5 text-[10px] font-bold text-white"
        >
          <Plus size={11} />
          افزودن به برگه
        </button>
      </div>
      <textarea
        value={edit.text}
        onChange={(e) => onEditText(e.target.value)}
        rows={3}
        dir="rtl"
        className="w-full resize-none rounded-lg border border-border bg-[#f7fbf8] px-3 py-2 text-right text-sm leading-7 outline-none focus:border-[#0E7048]"
      />
      <div className="flex items-center justify-start gap-1.5">
        <span className="text-[11px] text-muted">فضای پاسخ:</span>
        <div className="flex items-center rounded-md border border-border">
          <button
            type="button"
            onClick={() =>
              onEditAnswerSpace(Math.max(0, edit.answerSpace - 1))
            }
            className="flex h-7 w-6 items-center justify-center text-muted"
          >
            <ChevronDown size={14} />
          </button>
          <PersianNumberInput
            value={edit.answerSpace}
            min={0}
            max={20}
            onChange={onEditAnswerSpace}
          />
          <button
            type="button"
            onClick={() =>
              onEditAnswerSpace(Math.min(20, edit.answerSpace + 1))
            }
            className="flex h-7 w-6 items-center justify-center text-muted"
          >
            <ChevronUp size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function StudioQuestionBankToggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-1 py-1">
      <div className="flex items-center justify-center gap-2.5">
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onChange(!enabled)}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
            enabled ? "bg-[#0E7048]" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              enabled ? "right-0.5" : "right-[calc(100%-1.625rem)]"
            }`}
          />
        </button>
        <span className="text-sm font-bold text-foreground">
          استفاده از بانک سوالات
        </span>
      </div>
      {enabled ? (
        <p className="text-center text-[11px] font-medium leading-5 text-muted">
          باکس سوالات در پایین صفحه قرار دارد
        </p>
      ) : null}
    </div>
  );
}

/** زیر برگهٔ A4 در همان اسکرول — حدود ۴ کارت visible، بقیه اسکرول داخل لیست */
const BANK_LIST_MAX_PX = 704;

export function StudioQuestionBankPanel({
  initialGrade,
  initialSubject,
}: {
  initialGrade?: string;
  initialSubject?: string;
}) {
  const addQuestionFromBank = useExamDesignerStore((s) => s.addQuestionFromBank);
  const questionStyle = useExamDesignerStore((s) => s.questionStyle);
  const setQuestionStyle = useExamDesignerStore((s) => s.setQuestionStyle);
  const [bankGrade, setBankGrade] = useState(
    initialGrade && bankGrades.includes(initialGrade)
      ? initialGrade
      : bankGrades[0] ?? ""
  );
  const [bankSubject, setBankSubject] = useState(
    initialSubject && bankSubjects.includes(initialSubject)
      ? initialSubject
      : bankSubjects[0] ?? ""
  );
  const [bankLesson, setBankLesson] = useState("");
  const [bankEdits, setBankEdits] = useState<
    Record<string, BankSessionEdit>
  >({});

  const bankQuestions = useMemo(
    () => filterBankQuestions(bankGrade, bankSubject),
    [bankGrade, bankSubject]
  );

  const bankLessonOptions = useMemo(() => {
    const grade = questionBankGrades.find((g) => g.title === bankGrade);
    const subject = grade?.subjects.find((s) => s.title === bankSubject);
    if (!subject) return [];
    return getQBFlatLessons(subject).map((l) => l.title);
  }, [bankGrade, bankSubject]);

  useEffect(() => {
    setBankLesson((prev) => {
      if (bankLessonOptions.length === 0) return "";
      if (bankLessonOptions.includes(prev)) return prev;
      return bankLessonOptions[0] ?? "";
    });
  }, [bankGrade, bankSubject, bankLessonOptions]);

  const getBankEdit = useCallback(
    (item: BankQuestion): BankSessionEdit =>
      bankEdits[item.id] ?? {
        text: item.text,
        answerSpace: item.answerLines,
      },
    [bankEdits]
  );

  const patchBankEdit = useCallback(
    (item: BankQuestion, patch: Partial<BankSessionEdit>) => {
      setBankEdits((prev) => {
        const base = prev[item.id] ?? {
          text: item.text,
          answerSpace: item.answerLines,
        };
        return { ...prev, [item.id]: { ...base, ...patch } };
      });
    },
    []
  );

  return (
    <div className="mt-6 rounded-2xl border border-border bg-[#f7fbf8] p-3 shadow-sm">
      <p className="mb-2 text-center text-xs font-bold text-[#0E7048]">
        بانک سوالات — برای افزودن به برگه بالا، سوال را انتخاب کنید
      </p>
      <div className="grid grid-cols-2 gap-2">
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
      <div className="mt-2">
        <FilterSelect
          icon={<ListChecks size={16} />}
          value={
            bankLesson ||
            (bankLessonOptions[0] ?? "درسی برای این ترکیب نیست")
          }
          onChange={setBankLesson}
          options={
            bankLessonOptions.length > 0
              ? bankLessonOptions
              : ["درسی برای این ترکیب نیست"]
          }
          disabled={bankLessonOptions.length === 0}
        />
      </div>

      <QuestionStylePanel
        style={questionStyle}
        onChange={(patch) => setQuestionStyle(patch)}
        hideDividerOptions
      />

      <div
        className="mt-2 flex flex-col gap-2 overflow-y-auto overscroll-contain"
        style={{ maxHeight: BANK_LIST_MAX_PX }}
      >
        {bankQuestions.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted">
            برای این پایه و درس سوالی در بانک نیست.
          </p>
        ) : (
          bankQuestions.map((item, index) => {
            const edit = getBankEdit(item);
            return (
              <StudioBankCard
                key={item.id}
                index={index}
                edit={edit}
                onEditText={(text) => patchBankEdit(item, { text })}
                onEditAnswerSpace={(answerSpace) =>
                  patchBankEdit(item, { answerSpace })
                }
                onAdd={() =>
                  addQuestionFromBank(edit.text, edit.answerSpace, item.id)
                }
              />
            );
          })
        )}
      </div>
    </div>
  );
}
