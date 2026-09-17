"use client";

import { useState } from "react";
import {
  Sigma,
  Smile,
  Table2,
  Type,
  Minus,
  Square,
  Circle,
  ArrowUpRight,
  Star,
} from "lucide-react";
import { useExamDesignerStore } from "./store/exam-designer-store";
import type { DesignerToolTab, ShapeKind } from "./types";

const TABS: Array<{ id: DesignerToolTab; label: string }> = [
  { id: "text", label: "ویرایشگر متن" },
  { id: "table", label: "جدول" },
  { id: "shapes", label: "شکل‌ها" },
  { id: "formula", label: "فرمول ریاضی" },
];

const SHAPES: Array<{ id: ShapeKind; label: string; icon: React.ReactNode }> = [
  { id: "line", label: "خط", icon: <Minus size={18} /> },
  { id: "rectangle", label: "مستطیل", icon: <Square size={18} /> },
  { id: "circle", label: "دایره", icon: <Circle size={18} /> },
  { id: "arrow", label: "پیکان", icon: <ArrowUpRight size={18} /> },
  { id: "star", label: "ستاره", icon: <Star size={18} /> },
];

type Props = {
  onOpenFormula: () => void;
};

export default function MainToolbar({ onOpenFormula }: Props) {
  const toolTab = useExamDesignerStore((s) => s.toolTab);
  const setToolTab = useExamDesignerStore((s) => s.setToolTab);
  const addTableBlock = useExamDesignerStore((s) => s.addTableBlock);
  const addShapeBlock = useExamDesignerStore((s) => s.addShapeBlock);
  const [tableOpen, setTableOpen] = useState(false);
  const [shapeOpen, setShapeOpen] = useState(false);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  return (
    <div className="relative shrink-0 px-2 sm:px-3">
      <p className="mb-2 mt-1 text-center text-[10px] font-medium text-muted sm:mb-2.5 sm:text-[11px]">
        ابزارها
      </p>
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {TABS.map((tab) => {
          const active = toolTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setToolTab(tab.id);
                setTableOpen(tab.id === "table");
                setShapeOpen(tab.id === "shapes");
                if (tab.id === "formula") onOpenFormula();
              }}
              className={`flex min-h-10 flex-col items-center justify-center gap-0.5 rounded-xl border px-1 py-1.5 text-[10px] font-bold transition sm:min-h-16 sm:rounded-2xl sm:py-2.5 sm:text-xs ${
                active
                  ? "border-transparent bg-[#0E7048] text-white shadow-md shadow-[#0E7048]/25"
                  : "border-border bg-white text-foreground hover:bg-[#e7f6ee]"
              }`}
            >
              {tab.id === "formula" ? <Sigma size={18} /> : null}
              {tab.id === "shapes" ? <Smile size={18} /> : null}
              {tab.id === "table" ? <Table2 size={18} /> : null}
              {tab.id === "text" ? (
                <span className="text-sm font-black leading-none sm:text-lg">Tt</span>
              ) : null}
              <span className="leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {tableOpen && toolTab === "table" ? (
        <div className="mt-2 rounded-2xl border border-border bg-white p-3 shadow-sm">
          <p className="mb-2 text-xs font-bold">اندازه جدول</p>
          <div className="flex items-center gap-2">
            <label className="flex flex-1 flex-col gap-1 text-[10px] text-muted">
              ردیف
              <input
                type="number"
                min={2}
                max={10}
                value={rows}
                onChange={(e) => setRows(Number(e.target.value) || 2)}
                className="h-10 rounded-xl border border-border px-2 text-sm"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-[10px] text-muted">
              ستون
              <input
                type="number"
                min={2}
                max={10}
                value={cols}
                onChange={(e) => setCols(Number(e.target.value) || 2)}
                className="h-10 rounded-xl border border-border px-2 text-sm"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                addTableBlock(rows, cols);
                setTableOpen(false);
              }}
              className="mt-4 h-10 rounded-xl bg-[#0E7048] px-3 text-xs font-bold text-white"
            >
              درج
            </button>
          </div>
        </div>
      ) : null}

      {shapeOpen && toolTab === "shapes" ? (
        <div className="mt-2 grid grid-cols-5 gap-1.5 rounded-2xl border border-border bg-white p-2 shadow-sm">
          {SHAPES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                addShapeBlock(s.id);
                setShapeOpen(false);
              }}
              className="flex min-h-10 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] font-bold transition hover:bg-[#e7f6ee]"
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
