"use client";

import { useExamDesignerStore } from "./store/exam-designer-store";

export default function AlignmentGuides({
  pageIndex,
  preview,
}: {
  pageIndex: number;
  preview: boolean;
}) {
  const guides = useExamDesignerStore((s) => s.snapGuides);

  if (preview) return null;

  const pageGuide = guides.find((g) => g.page === pageIndex);
  if (!pageGuide) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[45]" aria-hidden>
      {pageGuide.x !== undefined ? (
        <div
          className="absolute top-0 bottom-0 w-px bg-[#ec4899] opacity-90"
          style={{ left: pageGuide.x }}
        />
      ) : null}
      {pageGuide.y !== undefined ? (
        <div
          className="absolute left-0 right-0 h-px bg-[#ec4899] opacity-90"
          style={{ top: pageGuide.y }}
        />
      ) : null}
    </div>
  );
}
