import type { WorksheetQuestion } from "./types";
import {
  ANSWER_SPACE_UNIT_PX,
  EDITOR_ANSWER_SPACE_UNIT_PX,
  MIN_ANSWER_SPACE_PX,
  type QuestionDividerKind,
  normalizeDividerKind,
} from "./question-style";

/** همان تبدیل mm→px در CSS چاپ / A4 */
export const MM_TO_PX = 96 / 25.4;

/** حاشیهٔ چپ/راست ناحیهٔ سوالات car1 (globals.css) */
export const CARTOON_CONTENT_SIDE_MM = 13;

/** h-8 — ردیف شماره سوال */
export const CARTOON_QUESTION_BADGE_PX = 32;

/** gap-2 بین نشان و متن */
export const CARTOON_QUESTION_INNER_GAP_PX = 8;

/** leading-7 در Tailwind (ثابت rem، مستقل از font-size روی متن) */
export const CARTOON_QUESTION_TEXT_LINE_HEIGHT_PX = 28;

/** pt-0.5 روی پارagraph */
export const CARTOON_QUESTION_TEXT_PT_PX = 2;

/** gap-3 بین بلوک‌های سوال */
export const CARTOON_QUESTION_BLOCK_GAP_PX = 12;

/** mt-2 بالای بلوک فضای پاسخ */
export const ANSWER_SPACE_MARGIN_TOP_PX = 8;

/** بدون رزرو اضافه — ظرفیت = تا خط پایین کادر SVG */
export const CARTOON_PAGE_BOTTOM_SAFE_PX = 0;

/** ارتفاع بلوک دستورالعمل (در صورت نمایش داخل ناحیهٔ سوالات) */
export function estimateInstructionsHeightPx(instructions?: string): number {
  if (!instructions?.trim()) return 0;
  const charsPerLine = 42;
  const lines = Math.max(
    1,
    Math.ceil(instructions.trim().length / charsPerLine)
  );
  return lines * 24 + 12;
}

export function parseFontSizePx(fontSize: string): number {
  const n = parseInt(fontSize.replace("px", ""), 10);
  return Number.isNaN(n) ? 16 : n;
}

export function normalizeAnswerUnits(raw: number | undefined): number {
  const n = typeof raw === "number" && Number.isFinite(raw) ? raw : 0;
  return Math.max(0, Math.min(20, Math.round(n)));
}

/** ارتفاع فضای پاسخ از واحد answerLines — print یا ادیتور حرفه‌ای */
export function answerSpaceHeightPx(
  rawUnits: number | undefined,
  mode: "print" | "editor" = "print"
): number {
  const units = normalizeAnswerUnits(rawUnits);
  if (units === 0) return 0;
  const unitPx =
    mode === "editor" ? EDITOR_ANSWER_SPACE_UNIT_PX : ANSWER_SPACE_UNIT_PX;
  const scaled = units * unitPx;
  if (mode === "editor") {
    return Math.max(scaled, MIN_ANSWER_SPACE_PX);
  }
  return scaled;
}

/** عرض متن سوال داخل car1 (px) */
export function cartoonQuestionTextWidthPx(): number {
  const pageInnerMm = 210 - 2 * CARTOON_CONTENT_SIDE_MM;
  return (
    pageInnerMm * MM_TO_PX -
    CARTOON_QUESTION_BADGE_PX -
    CARTOON_QUESTION_INNER_GAP_PX
  );
}

/** تخمین تعداد سطر متن — بر اساس عرض واقعی و اندازه قلم */
export function estimateQuestionTextLineCount(
  text: string,
  fontSizePx: number
): number {
  const innerW = cartoonQuestionTextWidthPx();
  /** ~۰٫۹۵em برای فارسی — هم‌تراز با charsPerLine≈۴۰ در قلم ۱۶px */
  /** کمی خوش‌بینانه تا صفحه‌بندی سوالات بیشتری جا دهد؛ پایین با flex پر می‌شود */
  const avgCharWidth = Math.max(9, fontSizePx * 1.02);
  const charsPerLine = Math.max(12, Math.floor(innerW / avgCharWidth));
  const len = Math.max(1, (text || "...").trim().length);
  return Math.ceil(len / charsPerLine);
}

/** فقط متن + فضای پاسخ (بدون خط جداکننده) — هم‌تراز QuestionBlock */
export function estimateQuestionBlockHeightPx(
  q: WorksheetQuestion,
  fontSize: string
): number {
  const fs = parseFontSizePx(fontSize);
  const lines = estimateQuestionTextLineCount(q.text, fs);
  const textHeight =
    lines * CARTOON_QUESTION_TEXT_LINE_HEIGHT_PX + CARTOON_QUESTION_TEXT_PT_PX;
  const rowHeight = Math.max(CARTOON_QUESTION_BADGE_PX, textHeight);
  const units = normalizeAnswerUnits(q.answerLines);
  const answerHeight =
    units > 0
      ? ANSWER_SPACE_MARGIN_TOP_PX + units * ANSWER_SPACE_UNIT_PX
      : 0;
  return rowHeight + answerHeight;
}

function dividerBodyHeightPx(kind: QuestionDividerKind): number {
  switch (kind) {
    case "double":
      return 10;
    case "wavy":
    case "wavy-bold":
      return 12;
    case "solid-thick":
    case "dash-dot":
      return 3;
    default:
      return 1;
  }
}

/** خط جداکننده بعد از سوال (داخل همان بلوک) */
export function estimateDividerAfterHeightPx(
  q: WorksheetQuestion,
  dividerKind: QuestionDividerKind
): number {
  const units = normalizeAnswerUnits(q.answerLines);
  const marginTop = Math.max(12, units * 6);
  const marginBottom = 4;
  return marginTop + dividerBodyHeightPx(dividerKind) + marginBottom;
}

export function spacingBeforeQuestionPx(
  questions: WorksheetQuestion[],
  index: number,
  dividersBetween: boolean,
  dividerKind: QuestionDividerKind
): number {
  if (index <= 0) return 0;
  let extra = CARTOON_QUESTION_BLOCK_GAP_PX;
  if (dividersBetween) {
    extra += estimateDividerAfterHeightPx(
      questions[index - 1]!,
      dividerKind
    );
  }
  return extra;
}

/** ارتفاع کل سوالات روی یک صفحه (برای اعتبارسنجی) */
export function estimatePageQuestionsHeightPx(
  page: WorksheetQuestion[],
  fontSize: string,
  dividersBetween: boolean,
  dividerKind: QuestionDividerKind,
  introPx = 0
): number {
  if (page.length === 0) return introPx;
  let used = introPx + estimateQuestionBlockHeightPx(page[0]!, fontSize);
  for (let i = 1; i < page.length; i++) {
    used += spacingBeforeQuestionPx(
      page,
      i,
      dividersBetween,
      dividerKind
    );
    used += estimateQuestionBlockHeightPx(page[i]!, fontSize);
  }
  return used;
}
