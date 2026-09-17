"use client";

import { useEffect, useState } from "react";
import katex from "katex";
import { X, Check } from "lucide-react";
import "katex/dist/katex.min.css";

type Props = {
  open: boolean;
  initialLatex?: string;
  onClose: () => void;
  onInsert: (latex: string) => void;
};

const PRESETS = [
  { label: "جمع", latex: "\\sum_{i=1}^{n} i" },
  { label: "کسر", latex: "\\frac{a}{b}" },
  { label: "جذر", latex: "\\sqrt{x}" },
  { label: "توان", latex: "x^{2}" },
  { label: "معادله", latex: "x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}" },
];

export default function FormulaModal({
  open,
  initialLatex = "",
  onClose,
  onInsert,
}: Props) {
  const [latex, setLatex] = useState(initialLatex);
  const [previewHtml, setPreviewHtml] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) setLatex(initialLatex);
  }, [open, initialLatex]);

  useEffect(() => {
    if (!latex.trim()) {
      setPreviewHtml("");
      setError(null);
      return;
    }
    try {
      setPreviewHtml(
        katex.renderToString(latex, {
          throwOnError: true,
          displayMode: true,
        })
      );
      setError(null);
    } catch {
      setPreviewHtml("");
      setError("فرمول LaTeX نامعتبر است");
    }
  }, [latex]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-3xl border border-border bg-card p-5 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">درج فرمول ریاضی</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted"
            aria-label="بستن"
          >
            <X size={16} />
          </button>
        </div>

        <label className="mb-1.5 block text-xs font-medium text-muted">
          کد LaTeX
        </label>
        <textarea
          dir="ltr"
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
          rows={3}
          placeholder="e.g. \\frac{a}{b}"
          className="mb-3 w-full rounded-2xl border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary"
        />

        <div className="mb-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setLatex(p.latex)}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="mb-4 min-h-[72px] rounded-2xl border border-dashed border-border bg-background px-3 py-4 text-center">
          {error ? (
            <p className="text-xs text-danger">{error}</p>
          ) : previewHtml ? (
            <div
              className="overflow-x-auto text-foreground"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          ) : (
            <p className="text-xs text-muted">پیش‌نمایش فرمول</p>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-11 flex-1 rounded-full border border-border text-sm font-bold text-muted"
          >
            انصراف
          </button>
          <button
            type="button"
            disabled={!!error || !latex.trim()}
            onClick={() => {
              onInsert(latex.trim());
              onClose();
            }}
            className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-primary text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            <Check size={16} />
            درج فرمول
          </button>
        </div>
      </div>
    </div>
  );
}
