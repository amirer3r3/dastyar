import type { ManualBlock, ManualBlockType } from "./types";

/** انواع عنصر روی بوم (تم آزمون مدارس و سایر تم‌ها) */
export type CanvasElementKind =
  | "question"
  | "floating-text"
  | "image"
  | "shape";

export type CanvasFloatingPosition = {
  x: number;
  y: number;
};

/** نمای ساده برای مستندات / آداپتر — در استور همان ManualBlock است */
export type CanvasElement = {
  id: string;
  type: CanvasElementKind;
  content: string;
  isFloating?: boolean;
  position?: CanvasFloatingPosition;
  width?: number;
  height?: number;
  score?: number | null;
  answerSpace?: number;
  page?: number;
};

export function manualBlockToCanvasElement(block: ManualBlock): CanvasElement {
  const kind: CanvasElementKind =
    block.type === "floating-text"
      ? "floating-text"
      : block.type === "question" ||
          block.type === "bank-question" ||
          block.type === "checkbox-question"
        ? "question"
        : block.type === "image"
          ? "image"
          : block.type === "shape"
            ? "shape"
            : "floating-text";

  return {
    id: block.id,
    type: kind,
    content: block.html,
    isFloating: isManualFloatingBlock(block),
    position:
      typeof block.x === "number" && typeof block.y === "number"
        ? { x: block.x, y: block.y }
        : undefined,
    width: block.width,
    height: block.height,
    score: block.score ?? null,
    answerSpace: block.answerLines,
    page: block.page,
  };
}

export function isManualFloatingBlock(block: ManualBlock): boolean {
  if (block.type === "floating-text") return true;
  if (block.isFloating) return true;
  if (block.type === "text" && typeof block.x === "number") return true;
  return (
    block.type === "image" ||
    block.type === "shape" ||
    block.type === "formula" ||
    block.type === "table" ||
    block.type === "divider" ||
    block.type === "box" ||
    block.type === "answer-lines"
  );
}

export function isStandardExamTableBlockType(type: ManualBlockType): boolean {
  return (
    type === "question" ||
    type === "bank-question" ||
    type === "checkbox-question"
  );
}
