"use client";

import {
  Type,
  Table2,
  Minus,
  Library,
  GripVertical,
} from "lucide-react";
import type { ManualBlockType } from "./types";

const ITEMS: Array<{
  type: ManualBlockType;
  title: string;
  desc: string;
  icon: React.ReactNode;
}> = [
  {
    type: "question",
    title: "سوال متنی جدید",
    desc: "بلاک سوال با خطوط پاسخ",
    icon: <Type size={16} />,
  },
  {
    type: "box",
    title: "جدول / کادر",
    desc: "کادر محتوایی قابل ویرایش",
    icon: <Table2 size={16} />,
  },
  {
    type: "answer-lines",
    title: "فضای خالی / خطوط پاسخ",
    desc: "خطوط نقطه‌چین برای نوشتن",
    icon: <Minus size={16} />,
  },
  {
    type: "bank-question",
    title: "سوال از بانک سوالات",
    desc: "اتصال به بانک (آماده توسعه)",
    icon: <Library size={16} />,
  },
];

type Props = {
  onAdd: (type: ManualBlockType) => void;
};

export default function ElementsSidebar({ onAdd }: Props) {
  return (
    <aside className="rounded-2xl border border-border bg-card p-3 shadow-sm">
      <h3 className="mb-2 text-xs font-bold text-foreground">پنل المان‌ها</h3>
      <p className="mb-3 text-[11px] leading-5 text-muted">
        روی هر مورد بزنید تا به بوم A4 اضافه شود. بعداً می‌توانید با کشیدن جابه‌جا
        کنید.
      </p>
      <div className="flex flex-col gap-2">
        {ITEMS.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => onAdd(item.type)}
            className="flex items-start gap-2 rounded-xl border border-border bg-background p-2.5 text-right transition-colors active:bg-primary/5"
          >
            <span className="mt-0.5 text-muted">
              <GripVertical size={14} />
            </span>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {item.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-foreground">
                {item.title}
              </span>
              <span className="mt-0.5 block text-[10px] leading-4 text-muted">
                {item.desc}
              </span>
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
