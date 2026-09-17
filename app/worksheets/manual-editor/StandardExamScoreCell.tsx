"use client";

import { useEffect, useState } from "react";
import {
  formatExamScore,
  parsePersianDecimal,
} from "../exam-score";
import { useExamDesignerStore } from "./store/exam-designer-store";

type Props = {
  questionId: string;
  score: number | null;
  preview?: boolean;
};

export default function StandardExamScoreCell({
  questionId,
  score,
  preview = false,
}: Props) {
  const setQuestionScore = useExamDesignerStore((s) => s.setQuestionScore);
  const [draft, setDraft] = useState(() => formatExamScore(score));

  useEffect(() => {
    setDraft(formatExamScore(score));
  }, [score]);

  if (preview) {
    return (
      <span className="standard-exam-score-display">{formatExamScore(score)}</span>
    );
  }

  const commit = () => {
    const parsed = parsePersianDecimal(draft);
    setQuestionScore(questionId, parsed);
    setDraft(formatExamScore(parsed));
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      dir="ltr"
      aria-label="بارم"
      value={draft}
      placeholder="—"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          commit();
          (e.target as HTMLInputElement).blur();
        }
      }}
      className="standard-exam-score-input persian-nums w-full min-w-0 border-0 bg-transparent px-0.5 py-0.5 text-center text-[11pt] font-bold text-black outline-none focus:ring-1 focus:ring-[#0E7048]/40"
    />
  );
}
