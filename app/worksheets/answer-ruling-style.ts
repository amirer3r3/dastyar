import type { CSSProperties } from "react";
import {
  ANSWER_SPACE_UNIT_PX,
  EDITOR_ANSWER_SPACE_UNIT_PX,
} from "./question-style";

export type AnswerRulingStyle = "none" | "ruled" | "grid" | "dots";

export const ANSWER_RULING_OPTIONS: Array<{
  id: AnswerRulingStyle;
  label: string;
}> = [
  { id: "none", label: "بدون خط" },
  { id: "ruled", label: "دفترچه" },
  { id: "grid", label: "شطرنجی" },
  { id: "dots", label: "نقطه‌ای" },
];

export function normalizeAnswerRulingStyle(
  value: AnswerRulingStyle | string | undefined | null
): AnswerRulingStyle {
  if (value && ANSWER_RULING_OPTIONS.some((o) => o.id === value)) {
    return value as AnswerRulingStyle;
  }
  return "none";
}

export function answerRulingStepPx(reserveEditorMin: boolean): number {
  return reserveEditorMin
    ? EDITOR_ANSWER_SPACE_UNIT_PX
    : ANSWER_SPACE_UNIT_PX;
}

/** پس‌زمینهٔ فضای پاسخ — شفاف برای none */
export function answerRulingBackgroundStyle(
  ruling: AnswerRulingStyle,
  options?: { reserveEditorMin?: boolean; lineColor?: string }
): CSSProperties {
  const kind = normalizeAnswerRulingStyle(ruling);
  if (kind === "none") return {};

  const step = answerRulingStepPx(!!options?.reserveEditorMin);
  const color = options?.lineColor ?? "#cbd5e1";

  if (kind === "ruled") {
    return {
      backgroundImage: `repeating-linear-gradient(transparent, transparent ${
        step - 1
      }px, ${color} ${step}px)`,
      backgroundSize: `100% ${step}px`,
    };
  }

  if (kind === "grid") {
    return {
      backgroundImage: [
        `repeating-linear-gradient(0deg, transparent, transparent ${
          step - 1
        }px, ${color} ${step}px)`,
        `repeating-linear-gradient(90deg, transparent, transparent ${
          step - 1
        }px, ${color} ${step}px)`,
      ].join(", "),
      backgroundSize: `${step}px ${step}px`,
    };
  }

  return {
    backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
    backgroundSize: `${step}px ${step}px`,
  };
}
