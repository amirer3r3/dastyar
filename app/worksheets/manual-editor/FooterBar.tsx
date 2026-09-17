"use client";

import {
  Undo2,
  Redo2,
  Hand,
  Minus,
  Plus,
  Eye,
  Save,
} from "lucide-react";
import { formatPersianNumber } from "@/app/lib/persian-digits";
import ExamHeaderVariantSwitcher from "../ExamHeaderVariantSwitcher";
import type { ExamHeaderVariant } from "../types";
import { useExamDesignerStore } from "./store/exam-designer-store";

type Props = {
  onSave: () => void;
  onHeaderVariantChange?: (variant: ExamHeaderVariant) => void;
};

export default function FooterBar({ onSave, onHeaderVariantChange }: Props) {
  const zoom = useExamDesignerStore((s) => s.zoom);
  const panMode = useExamDesignerStore((s) => s.panMode);
  const past = useExamDesignerStore((s) => s.past);
  const future = useExamDesignerStore((s) => s.future);
  const previewOpen = useExamDesignerStore((s) => s.previewOpen);
  const undo = useExamDesignerStore((s) => s.undo);
  const redo = useExamDesignerStore((s) => s.redo);
  const togglePan = useExamDesignerStore((s) => s.togglePan);
  const nudgeZoom = useExamDesignerStore((s) => s.nudgeZoom);
  const setPreviewOpen = useExamDesignerStore((s) => s.setPreviewOpen);
  const worksheetTheme = useExamDesignerStore((s) => s.worksheetTheme);
  const headerVariant = useExamDesignerStore((s) => s.headerVariant);
  const prevHeaderVariant = useExamDesignerStore((s) => s.prevHeaderVariant);
  const nextHeaderVariant = useExamDesignerStore((s) => s.nextHeaderVariant);

  const pushVariantToParent = () => {
    const variant = useExamDesignerStore.getState().headerVariant;
    onHeaderVariantChange?.(variant);
  };

  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 px-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] sm:px-3">
      {worksheetTheme === "standard" ? (
        <div className="pointer-events-auto w-full max-w-[520px] rounded-2xl border border-border bg-white/95 px-2 py-2 shadow-md backdrop-blur">
          <ExamHeaderVariantSwitcher
            variant={headerVariant}
            onPrev={() => {
              prevHeaderVariant();
              pushVariantToParent();
            }}
            onNext={() => {
              nextHeaderVariant();
              pushVariantToParent();
            }}
          />
        </div>
      ) : null}
      <div className="pointer-events-auto mx-auto flex w-full max-w-[520px] items-center gap-0.5 rounded-[28px] border border-border bg-white/95 px-1.5 py-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur sm:gap-1 sm:px-2 sm:py-2">
        <FootBtn
          label="بازگشت"
          disabled={past.length === 0}
          onClick={undo}
        >
          <Undo2 size={18} />
        </FootBtn>
        <FootBtn label="جلو" disabled={future.length === 0} onClick={redo}>
          <Redo2 size={18} />
        </FootBtn>
        <FootBtn label="جابه‌جایی" active={panMode} onClick={togglePan}>
          <Hand size={18} />
        </FootBtn>

        <div className="mx-0.5 flex min-w-0 flex-1 items-center justify-center gap-0.5 sm:gap-1.5">
          <button
            type="button"
            aria-label="کوچک‌نمایی"
            disabled={zoom <= 50}
            onClick={() => nudgeZoom(-10)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#0E7048] disabled:opacity-30"
          >
            <Minus size={16} />
          </button>
          <span className="min-w-[2.6rem] text-center text-[11px] font-bold text-[#0E7048] sm:min-w-[3rem] sm:text-xs">
            {formatPersianNumber(zoom)}٪
          </span>
          <button
            type="button"
            aria-label="بزرگ‌نمایی"
            disabled={zoom >= 150}
            onClick={() => nudgeZoom(10)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#0E7048] disabled:opacity-30"
          >
            <Plus size={16} />
          </button>
        </div>

        <FootBtn
          label="پیش‌نمایش"
          active={previewOpen}
          onClick={() => setPreviewOpen(true)}
        >
          <Eye size={18} />
        </FootBtn>
        <button
          type="button"
          onClick={onSave}
          className="flex h-10 items-center gap-1 rounded-2xl bg-[#0E7048] px-3 text-[11px] font-bold text-white shadow-md shadow-[#0E7048]/30 transition hover:brightness-110 sm:h-11 sm:px-3.5 sm:text-xs"
        >
          <Save size={16} />
          ذخیره
        </button>
      </div>
    </footer>
  );
}

function FootBtn({
  children,
  label,
  onClick,
  active,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-10 min-w-10 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[9px] font-medium transition disabled:opacity-30 sm:min-w-[3.1rem] ${
        active ? "bg-[#e7f6ee] text-[#0E7048]" : "text-muted"
      }`}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
