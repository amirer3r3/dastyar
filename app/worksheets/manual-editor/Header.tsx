"use client";

import { ArrowRight, MoreVertical } from "lucide-react";
import { useExamDesignerStore } from "./store/exam-designer-store";

type Props = {
  onClose: () => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onSaveTemplate: () => void;
  onClearSheet: () => void;
};

export default function Header({
  onClose,
  menuOpen,
  onToggleMenu,
  onSaveTemplate,
  onClearSheet,
}: Props) {
  const dirty = useExamDesignerStore((s) => s.dirty);

  return (
    <header className="relative shrink-0 px-2 pb-3 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-3 sm:pb-4">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          aria-label="بازگشت"
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0E7048] transition hover:bg-[#e7f6ee]"
        >
          <ArrowRight size={22} />
        </button>
        <div className="min-w-0 flex-1 pt-1 text-center">
          <h1 className="truncate text-[15px] font-bold text-[#0E7048] sm:text-[17px]">
            طراح آزمون حرفه‌ای
            {dirty ? <span className="mr-1 text-[10px] text-muted">•</span> : null}
          </h1>
          <p className="mt-0.5 hidden text-[11px] leading-5 text-muted sm:block">
            سوالات آزمون خود را ایجاد و مدیریت کنید
          </p>
        </div>
        <button
          type="button"
          aria-label="منو"
          onClick={onToggleMenu}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#0E7048] transition hover:bg-[#e7f6ee]"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {menuOpen ? (
        <div className="absolute left-2 top-12 z-30 w-48 overflow-hidden rounded-2xl border border-border bg-white py-1 shadow-lg sm:left-3">
          <button
            type="button"
            className="block w-full px-3 py-2.5 text-right text-xs font-medium transition hover:bg-[#e7f6ee]"
            onClick={onSaveTemplate}
          >
            ذخیره به‌عنوان قالب
          </button>
          <button
            type="button"
            className="block w-full px-3 py-2.5 text-right text-xs font-medium text-danger transition hover:bg-red-50"
            onClick={onClearSheet}
          >
            پاک کردن برگه
          </button>
          <button
            type="button"
            className="block w-full px-3 py-2.5 text-right text-xs font-medium transition hover:bg-[#e7f6ee]"
            onClick={onClose}
          >
            خروج
          </button>
        </div>
      ) : null}
    </header>
  );
}
