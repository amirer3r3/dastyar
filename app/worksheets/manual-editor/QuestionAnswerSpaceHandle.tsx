"use client";

import { useRef } from "react";
import { EDITOR_ANSWER_SPACE_UNIT_PX } from "../question-style";
import { normalizeAnswerUnits } from "../worksheet-question-layout";
import { useExamDesignerStore } from "./store/exam-designer-store";

type Props = {
  questionId: string;
  preview?: boolean;
  variant?: "standard" | "asman";
};

/** دستگیرهٔ کشیدن برای تغییر فضای پاسخ (واحد answerLines) */
export default function QuestionAnswerSpaceHandle({
  questionId,
  preview = false,
  variant = "standard",
}: Props) {
  const beginAnswerSpaceDrag = useExamDesignerStore(
    (s) => s.beginAnswerSpaceDrag
  );
  const setQuestionAnswerSpace = useExamDesignerStore(
    (s) => s.setQuestionAnswerSpace
  );
  const commitAnswerSpaceDrag = useExamDesignerStore(
    (s) => s.commitAnswerSpaceDrag
  );
  const dragRef = useRef<{ startY: number; startUnits: number } | null>(null);

  if (preview) return null;

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const block = useExamDesignerStore
      .getState()
      .blocks.find((b) => b.id === questionId);
    if (!block) return;

    beginAnswerSpaceDrag();
    const startUnits = normalizeAnswerUnits(block.answerLines);
    dragRef.current = { startY: e.clientY, startUnits };

    const onMove = (ev: PointerEvent) => {
      if (!dragRef.current) return;
      const scale = useExamDesignerStore.getState().canvasScale;
      const deltaPx =
        (ev.clientY - dragRef.current.startY) / (scale > 0 ? scale : 1);
      const deltaUnits = Math.round(deltaPx / EDITOR_ANSWER_SPACE_UNIT_PX);
      const next = normalizeAnswerUnits(
        dragRef.current.startUnits + deltaUnits
      );
      setQuestionAnswerSpace(questionId, next, { recordHistory: false });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      dragRef.current = null;
      commitAnswerSpaceDrag();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      aria-label="تغییر فاصله پاسخ بین سوالات"
      onPointerDown={onPointerDown}
      className="no-print group relative z-[6] flex min-h-[14px] w-full shrink-0 cursor-row-resize touch-none items-center justify-center py-0.5"
    >
      <span
        className={
          variant === "asman"
            ? "h-[3px] w-20 max-w-[45%] rounded-full border border-sky-400/40 bg-sky-200/80 transition group-hover:border-sky-500/70 group-hover:bg-sky-300/90 group-active:bg-sky-400/80"
            : "h-[3px] w-20 max-w-[45%] rounded-full border border-[#0E7048]/30 bg-[#0E7048]/15 transition group-hover:border-[#0E7048]/60 group-hover:bg-[#0E7048]/35 group-active:bg-[#0E7048]/50"
        }
      />
    </div>
  );
}
