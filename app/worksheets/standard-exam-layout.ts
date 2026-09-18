import type { WorksheetQuestion } from "./types";
import {
  standardExamHeaderHeightPx,
  usesStandardExamTableLayout,
  type ExamHeaderVariant,
} from "./exam-header-variant";
import {
  ANSWER_SPACE_UNIT_PX,
  EDITOR_ANSWER_SPACE_UNIT_PX,
} from "./question-style";
import {
  ANSWER_SPACE_MARGIN_TOP_PX,
  MM_TO_PX,
  normalizeAnswerUnits,
  parseFontSizePx,
} from "./worksheet-question-layout";

export const STANDARD_A4_HEIGHT_PX = 297 * MM_TO_PX;
/** حاشیه سفید امن `.a4-page` (هر طرف) — mm */
export const STANDARD_A4_SAFE_MARGIN_MM = 8;
export const STANDARD_A4_SAFE_MARGIN_PX = STANDARD_A4_SAFE_MARGIN_MM * MM_TO_PX;
/** کادر دوخطی: 2px بیرونی + 3px فاصله + 1px داخلی (هر طرف) */
export const STANDARD_EXAM_OUTER_BORDER_PX = 2;
export const STANDARD_EXAM_DOUBLE_FRAME_GAP_PX = 3;
export const STANDARD_EXAM_INNER_BORDER_PX = 1;
export const STANDARD_EXAM_FRAME_CHROME_PER_SIDE_PX =
  STANDARD_EXAM_OUTER_BORDER_PX +
  STANDARD_EXAM_DOUBLE_FRAME_GAP_PX +
  STANDARD_EXAM_INNER_BORDER_PX;
/** @deprecated از STANDARD_EXAM_FRAME_CHROME_PER_SIDE_PX استفاده کنید */
export const STANDARD_EXAM_FRAME_BORDER_PX =
  STANDARD_EXAM_FRAME_CHROME_PER_SIDE_PX;
export const STANDARD_FRAME_PAD_PX = 8;
/** @deprecated از standardExamHeaderHeightPx(variant) استفاده کنید */
export const STANDARD_HEADER_PX = 118;
export const STANDARD_THEAD_PX = 32;
export const STANDARD_FOOTER_PX = 38;
export const STANDARD_ROW_MIN_PX = 44;
export const STANDARD_ROW_PAD_PX = 10;
export const STANDARD_COL_ROW_PX = 50;
export const STANDARD_COL_SCORE_PX = 58;
/** دستگیرهٔ کشیدن فضای پاسخ در ادیتور حرفه‌ای (px) */
export const STANDARD_ANSWER_HANDLE_PX = 14;
/** حاشیهٔ امن برای جلوگیری از بریدگی با `overflow:hidden` صفحه */
export const STANDARD_PAGINATION_SAFETY_PX = 20;
/** فاصلهٔ عمودی بین سوالات در قالب «مینیمال آزاد» (deprecated — از TAIL استفاده می‌شود) */
export const STANDARD_FREE_QUESTION_GAP_PX = 20;
/** padding-bottom + margin-bottom + border — `.standard-exam-free-item` */
export const STANDARD_FREE_ITEM_TAIL_PX = 41;
/** فاصلهٔ زیر اسلات سربرگ مینیمال آزاد */
export const STANDARD_MIN_FREE_HEADER_BODY_GAP_PX = 24;
/** پدینگ `.standard-exam-free-list` — افقی (فقط قالب آزاد، ~1.5mm) */
export const STANDARD_FREE_LIST_PAD_X_MM = 1.5;
export const STANDARD_FREE_LIST_PAD_X_PX =
  STANDARD_FREE_LIST_PAD_X_MM * MM_TO_PX;
export const STANDARD_FREE_LIST_PAD_Y_PX = 12;
/** شماره + gap-2 (۸px) */
export const STANDARD_FREE_NUMBER_COL_PX = 28;

/** عرض ستون «شرح سؤال و پاسخ» */
export function standardQuestionColWidthPx(): number {
  const pageW = 210 * MM_TO_PX;
  const inner =
    pageW -
    STANDARD_A4_SAFE_MARGIN_PX * 2 -
    STANDARD_EXAM_FRAME_CHROME_PER_SIDE_PX * 2 -
    STANDARD_FRAME_PAD_PX * 2 -
    STANDARD_COL_ROW_PX -
    STANDARD_COL_SCORE_PX;
  return Math.max(200, inner);
}

/** عرض متن سوال در قالب بدون جدول (تمام‌عرض داخل کادر) */
export function standardFreeQuestionColWidthPx(): number {
  const pageW = 210 * MM_TO_PX;
  return Math.max(
    200,
    pageW -
      STANDARD_A4_SAFE_MARGIN_PX * 2 -
      STANDARD_EXAM_FRAME_CHROME_PER_SIDE_PX * 2 -
      STANDARD_FRAME_PAD_PX * 2 -
      STANDARD_FREE_LIST_PAD_X_PX * 2 -
      STANDARD_FREE_NUMBER_COL_PX
  );
}

function estimateTextLines(text: string, fontSizePx: number, widthPx: number): number {
  const avgCharWidth = Math.max(8.5, fontSizePx * 0.95);
  const charsPerLine = Math.max(14, Math.floor(widthPx / avgCharWidth));
  const len = Math.max(1, (text || "...").trim().length);
  return Math.ceil(len / charsPerLine);
}

function htmlToPlainForEstimate(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n+/g, "\n")
    .trim();
}

export type StandardRowEstimateOptions = {
  /** HTML سوال (ادیتور) — برای تخمین دقیق‌تر از متن ساده */
  html?: string;
  /** دستگیرهٔ فضای پاسخ در طراحی حرفه‌ای */
  includeAnswerHandle?: boolean;
  /** گزینه‌های چندگزینه‌ای / extra زیر متن */
  extraRowHeightPx?: number;
};

export function estimateStandardRowHeightPx(
  q: WorksheetQuestion,
  fontSize: string,
  options?: StandardRowEstimateOptions
): number {
  const fs = parseFontSizePx(fontSize);
  const lineH = Math.max(22, Math.round(fs * 1.55));
  const colW = standardQuestionColWidthPx();
  const plain =
    options?.html?.trim() && options.html.trim().length > 0
      ? htmlToPlainForEstimate(options.html)
      : q.text;
  const wrapped = estimateTextLines(plain || q.text || "...", fs, colW);
  const textH = wrapped * lineH;
  const units = normalizeAnswerUnits(q.answerLines);
  const answerMargin = units > 0 ? 8 : 0;
  const unitPx = options?.includeAnswerHandle
    ? EDITOR_ANSWER_SPACE_UNIT_PX
    : ANSWER_SPACE_UNIT_PX;
  const answerH = units > 0 ? answerMargin + units * unitPx : 0;
  const handleH =
    options?.includeAnswerHandle && units > 0 ? STANDARD_ANSWER_HANDLE_PX : 0;
  return Math.max(
    STANDARD_ROW_MIN_PX,
    STANDARD_ROW_PAD_PX * 2 + textH + answerH + handleH
  );
}

export function estimateStandardFreeQuestionHeightPx(
  q: WorksheetQuestion,
  fontSize: string,
  options?: StandardRowEstimateOptions
): number {
  const fs = parseFontSizePx(fontSize);
  const lineH = Math.max(22, Math.round(fs * 1.55));
  const colW = standardFreeQuestionColWidthPx();
  const plain =
    options?.html?.trim() && options.html.trim().length > 0
      ? htmlToPlainForEstimate(options.html)
      : q.text;
  const wrapped = estimateTextLines(plain || q.text || "...", fs, colW);
  const textH = wrapped * lineH;
  const units = normalizeAnswerUnits(q.answerLines);
  const answerMargin = units > 0 ? ANSWER_SPACE_MARGIN_TOP_PX : 0;
  const unitPx = options?.includeAnswerHandle
    ? EDITOR_ANSWER_SPACE_UNIT_PX
    : ANSWER_SPACE_UNIT_PX;
  const answerH = units > 0 ? answerMargin + units * unitPx : 0;
  const handleH =
    options?.includeAnswerHandle && units > 0 ? STANDARD_ANSWER_HANDLE_PX : 0;
  const extra = options?.extraRowHeightPx ?? 0;
  return Math.max(
    STANDARD_ROW_MIN_PX,
    textH + answerH + handleH + extra + STANDARD_FREE_ITEM_TAIL_PX
  );
}

/** تخمین ارتفاع یک سوال — ورود واحد برای همهٔ قالب‌های آزمون مدارس */
export function estimateStandardQuestionRowHeightPx(
  q: WorksheetQuestion,
  fontSize: string,
  headerVariant: ExamHeaderVariant,
  options?: StandardRowEstimateOptions
): number {
  if (headerVariant === "minimal-free") {
    return estimateStandardFreeQuestionHeightPx(q, fontSize, options);
  }
  return estimateStandardRowHeightPx(q, fontSize, options);
}

export function standardPageCapacityPx(
  pageIndex: number,
  isLastPage: boolean,
  headerVariant: ExamHeaderVariant = "standard"
): number {
  const frame =
    STANDARD_A4_SAFE_MARGIN_PX * 2 +
    STANDARD_EXAM_FRAME_CHROME_PER_SIDE_PX * 2 +
    STANDARD_FRAME_PAD_PX * 2;
  const header =
    pageIndex === 0 ? standardExamHeaderHeightPx(headerVariant) : 0;
  const thead = usesStandardExamTableLayout(headerVariant)
    ? STANDARD_THEAD_PX
    : 0;
  const freeListPadY =
    headerVariant === "minimal-free" ? STANDARD_FREE_LIST_PAD_Y_PX * 2 : 0;
  const minFreeHeaderGap =
    pageIndex === 0 && headerVariant === "minimal-free"
      ? STANDARD_MIN_FREE_HEADER_BODY_GAP_PX
      : 0;
  const footer = isLastPage ? STANDARD_FOOTER_PX : 0;
  return (
    STANDARD_A4_HEIGHT_PX -
    frame -
    header -
    thead -
    freeListPadY -
    minFreeHeaderGap -
    footer -
    STANDARD_PAGINATION_SAFETY_PX
  );
}

/** ارتفاع مفید محتوا — صفحهٔ اول (با سربرگ) */
export function standardFirstPageContentCapacityPx(isLastPage: boolean): number {
  return standardPageCapacityPx(0, isLastPage);
}

/** ارتفاع مفید — صفحات بعد (بدون سربرگ کامل) */
export function standardContinuationPageContentCapacityPx(
  isLastPage: boolean
): number {
  return standardPageCapacityPx(1, isLastPage);
}

export function standardPageUsedHeightPx(
  rows: WorksheetQuestion[],
  fontSize: string,
  options?: StandardRowEstimateOptions & {
    htmlByQuestionId?: Map<string, string>;
    extraRowHeightByQuestionId?: Map<string, number>;
    headerVariant?: ExamHeaderVariant;
  }
): number {
  if (rows.length === 0) return 0;
  const headerVariant = options?.headerVariant ?? "standard";
  return rows.reduce((sum, q) => {
    const html = options?.htmlByQuestionId?.get(q.id);
    const extraRowHeightPx =
      options?.extraRowHeightByQuestionId?.get(q.id) ?? 0;
    const rowH = estimateStandardQuestionRowHeightPx(
      q,
      fontSize,
      headerVariant,
      {
        html,
        includeAnswerHandle: options?.includeAnswerHandle,
        extraRowHeightPx,
      }
    );
    return sum + rowH;
  }, 0);
}
