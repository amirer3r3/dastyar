"use client";

import { formatPersianNumber } from "@/app/lib/persian-digits";
import { FileEdit, Trash2 } from "lucide-react";
import {
  formatDraftSubtitle,
  MAX_MANUAL_DRAFTS,
  removeManualDraft,
  type StoredManualDraft,
} from "./draft-storage";

type Props = {
  drafts: StoredManualDraft[];
  onResume: (id: string) => void;
  onRefresh: () => void;
};

export default function ManualDraftsPanel({
  drafts,
  onResume,
  onRefresh,
}: Props) {
  if (drafts.length === 0) return null;

  return (
    <div className="mt-2 w-full rounded-2xl border border-dashed border-primary/25 bg-primary/5 p-3 text-right">
      <p className="mb-2 text-xs font-bold text-foreground">
        پیش‌نویس‌های طراحی حرفه‌ای ({formatPersianNumber(drafts.length)}/
        {formatPersianNumber(MAX_MANUAL_DRAFTS)})
      </p>
      <ul className="flex flex-col gap-2">
        {drafts.map((draft) => (
          <li
            key={draft.id}
            className="flex items-center gap-2 rounded-xl border border-border bg-card p-2.5 shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-foreground">
                {draft.title}
              </p>
              <p className="text-[10px] text-muted">
                {formatDraftSubtitle(draft.updatedAt)} ·{" "}
                {formatPersianNumber(draft.doc.blocks.length)} عنصر
              </p>
            </div>
            <button
              type="button"
              onClick={() => onResume(draft.id)}
              className="flex h-9 shrink-0 items-center gap-1 rounded-full bg-[#0E7048] px-3 text-[10px] font-bold text-white"
            >
              <FileEdit size={14} />
              ادامه
            </button>
            <button
              type="button"
              aria-label="حذف پیش‌نویس"
              onClick={() => {
                if (window.confirm("این پیش‌نویس حذف شود؟")) {
                  removeManualDraft(draft.id);
                  onRefresh();
                }
              }}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-danger hover:bg-red-50"
            >
              <Trash2 size={15} />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10px] leading-5 text-muted">
        حداکثر ۳ پیش‌نویس ذخیره می‌شود. با خروج از ادیتور، کار ناتمام اینجا
        می‌ماند.
      </p>
    </div>
  );
}
