"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { WorksheetQuestionStyle } from "./question-style";
import {
  QUESTION_FONT_OPTIONS,
  QUESTION_SIZE_OPTIONS,
  formatSizeLabel,
  normalizeDividerKind,
} from "./question-style";
import DividerKindSelect from "./DividerKindSelect";

type Props = {
  style: WorksheetQuestionStyle;
  onChange: (patch: Partial<WorksheetQuestionStyle>) => void;
  /** طراحی حرفه‌ای — خطکشی از نوار متن اضافه می‌شود */
  hideDividerOptions?: boolean;
};

const selectClass =
  "h-10 w-full appearance-none rounded-2xl border border-border bg-background py-2 pr-3 pl-8 text-sm font-medium text-foreground outline-none focus:border-primary";

function StyleSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

function StylePanelBody({
  style,
  onChange,
  hideDividerOptions,
}: {
  style: WorksheetQuestionStyle;
  onChange: (patch: Partial<WorksheetQuestionStyle>) => void;
  hideDividerOptions?: boolean;
}) {
  return (
    <div className="space-y-2 border-t border-border/70 px-2.5 pb-2.5 pt-2">
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 text-right">
          <span className="text-[10px] font-medium text-muted">فونت</span>
          <StyleSelect
            value={style.fontFamily}
            onChange={(v) => onChange({ fontFamily: v })}
          >
            {QUESTION_FONT_OPTIONS.map((f) => (
              <option key={f.label} value={f.value}>
                {f.label}
              </option>
            ))}
          </StyleSelect>
        </label>

        <label className="flex flex-col gap-1 text-right">
          <span className="text-[10px] font-medium text-muted">اندازه متن</span>
          <StyleSelect
            value={style.fontSize}
            onChange={(v) => onChange({ fontSize: v })}
          >
            {QUESTION_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {formatSizeLabel(s)}
              </option>
            ))}
          </StyleSelect>
        </label>
      </div>

      {hideDividerOptions ? null : (
        <>
          <label className="flex cursor-pointer items-center justify-between gap-2 rounded-xl border border-border bg-background px-2.5 py-2">
            <span className="text-[11px] font-medium text-foreground">
              خطکشی بین سوالات
            </span>
            <input
              type="checkbox"
              checked={style.dividersBetweenQuestions}
              onChange={(e) =>
                onChange({ dividersBetweenQuestions: e.target.checked })
              }
              className="h-4 w-4 shrink-0 accent-primary"
            />
          </label>

          {style.dividersBetweenQuestions ? (
            <label className="flex flex-col gap-1 text-right">
              <span className="text-[10px] font-medium text-muted">نوع خط</span>
              <DividerKindSelect
                value={normalizeDividerKind(style.questionDividerKind)}
                onChange={(questionDividerKind) =>
                  onChange({ questionDividerKind })
                }
              />
            </label>
          ) : null}
        </>
      )}
    </div>
  );
}

export default function QuestionStylePanel({
  style,
  onChange,
  hideDividerOptions,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`mt-3 w-full ${open ? "relative z-40" : ""}`}>
      <div
        className={`rounded-2xl border border-border bg-card shadow-sm ${
          open ? "overflow-visible" : "overflow-hidden"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-start gap-2 px-2.5 py-2.5 text-right transition-colors hover:bg-primary/[0.03]"
          aria-expanded={open}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
            {open ? (
              <ChevronUp size={14} strokeWidth={2.5} aria-hidden />
            ) : (
              <ChevronDown size={14} strokeWidth={2.5} aria-hidden />
            )}
          </span>
          <span className="text-sm font-bold text-foreground">استایل سوالات</span>
        </button>

        {open ? (
          <StylePanelBody
            style={style}
            onChange={onChange}
            hideDividerOptions={hideDividerOptions}
          />
        ) : null}
      </div>
    </div>
  );
}
