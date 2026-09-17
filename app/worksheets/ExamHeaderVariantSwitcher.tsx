"use client";

import type { ComponentType } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, List, Table2 } from "lucide-react";
import {
  EXAM_HEADER_VARIANT_LABELS,
  EXAM_HEADER_VARIANT_SHORT_LABELS,
  EXAM_HEADER_VARIANTS,
  type ExamHeaderVariant,
} from "./exam-header-variant";

const VARIANT_ICONS: Record<
  ExamHeaderVariant,
  ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>
> = {
  standard: LayoutGrid,
  minimal: Table2,
  "minimal-free": List,
};

type Props = {
  variant: ExamHeaderVariant;
  onPrev: () => void;
  onNext: () => void;
  onSelect?: (variant: ExamHeaderVariant) => void;
  layout?: "cycle" | "segmented";
  className?: string;
  compact?: boolean;
};

export default function ExamHeaderVariantSwitcher({
  variant,
  onPrev,
  onNext,
  onSelect,
  layout = "cycle",
  className = "",
  compact = false,
}: Props) {
  if (layout === "segmented" && onSelect) {
    return (
      <div className={`flex flex-col gap-2 ${className}`} dir="rtl">
        <span className="text-center text-[11px] font-semibold text-muted-foreground">
          قالب برگه آزمون
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          {EXAM_HEADER_VARIANTS.map((v) => {
            const Icon = VARIANT_ICONS[v];
            const active = v === variant;
            return (
              <button
                key={v}
                type="button"
                onClick={() => onSelect(v)}
                aria-pressed={active}
                className={`flex flex-col items-center gap-1 rounded-xl border px-1.5 py-2 text-[10px] font-bold leading-5 transition ${
                  active
                    ? "border-[#0E7048] bg-[#e7f6ee] text-[#0E7048] shadow-sm"
                    : "border-border bg-white text-foreground hover:bg-muted/40"
                }`}
              >
                <Icon size={18} aria-hidden />
                <span className="text-center">
                  {EXAM_HEADER_VARIANT_SHORT_LABELS[v]}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-center text-[10px] font-medium leading-5 text-[#0E7048]">
          {EXAM_HEADER_VARIANT_LABELS[variant]}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center gap-2 ${className}`}
      dir="rtl"
    >
      <button
        type="button"
        aria-label="قالب قبلی"
        onClick={onPrev}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-white text-[#0E7048] shadow-sm transition hover:bg-[#e7f6ee]"
      >
        <ChevronRight size={18} aria-hidden />
      </button>
      <span
        className={`min-w-0 text-center font-bold text-[#0E7048] ${
          compact
            ? "max-w-[9rem] text-[10px] leading-5"
            : "max-w-[11rem] text-xs leading-6"
        }`}
      >
        {EXAM_HEADER_VARIANT_LABELS[variant]}
      </span>
      <button
        type="button"
        aria-label="قالب بعدی"
        onClick={onNext}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-white text-[#0E7048] shadow-sm transition hover:bg-[#e7f6ee]"
      >
        <ChevronLeft size={18} aria-hidden />
      </button>
    </div>
  );
}
