"use client";

import { X } from "lucide-react";
import { useExamDesignerStore } from "./store/exam-designer-store";
import Canvas from "./Canvas";

export default function PreviewModal() {
  const open = useExamDesignerStore((s) => s.previewOpen);
  const setPreviewOpen = useExamDesignerStore((s) => s.setPreviewOpen);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-sm font-bold text-[#0E7048]">پیش‌نمایش</span>
        <button
          type="button"
          aria-label="بستن"
          onClick={() => setPreviewOpen(false)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border"
        >
          <X size={18} />
        </button>
      </div>
      <Canvas preview />
    </div>
  );
}
