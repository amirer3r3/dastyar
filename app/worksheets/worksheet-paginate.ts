import type { WorksheetQuestion } from "./types";
import {
  CARTOON_CAR1_BOTTOM_MM,
  CARTOON_CAR1_TOP_MM,
  CARTOON_CAR2_BOTTOM_MM,
  CARTOON_CAR2_TOP_MM,
} from "./cartoon-layout";
import type { QuestionDividerKind } from "./question-style";
import { normalizeDividerKind } from "./question-style";
import {
  CARTOON_PAGE_BOTTOM_SAFE_PX,
  MM_TO_PX,
  estimateInstructionsHeightPx,
  estimatePageQuestionsHeightPx,
} from "./worksheet-question-layout";

/** حداکثر تعداد برگه در یک کاربرگ / نمونه سوال */
export const WORKSHEET_MAX_PAGES = 4;

const A4_HEIGHT_PX = 297 * MM_TO_PX;

/** ارتفاع قابل استفاده برای سوالات (هم‌تراز globals.css + cartoon-layout.ts) */
const CONTENT_HEIGHT = {
  car1: A4_HEIGHT_PX - CARTOON_CAR1_TOP_MM * MM_TO_PX - CARTOON_CAR1_BOTTOM_MM * MM_TO_PX,
  car2Body:
    A4_HEIGHT_PX - CARTOON_CAR2_TOP_MM * MM_TO_PX - CARTOON_CAR2_BOTTOM_MM * MM_TO_PX,
} as const;

export type PaginateWorksheetOptions = {
  instructions?: string;
  questionDividerKind?: QuestionDividerKind | string;
};

export type WorksheetPagination = {
  pages: WorksheetQuestion[][];
  exceedsMaxPages: boolean;
};

export { estimateInstructionsHeightPx, estimateQuestionBlockHeightPx } from "./worksheet-question-layout";

export function cartoonPageContentCapacityPx(
  pageIndex: number,
  introPx = 0
): number {
  const raw =
    pageIndex === 0 ? CONTENT_HEIGHT.car1 - introPx : CONTENT_HEIGHT.car2Body;
  return Math.max(0, raw - CARTOON_PAGE_BOTTOM_SAFE_PX);
}

function capacityForPage(pageIndex: number, introPx: number): number {
  return cartoonPageContentCapacityPx(pageIndex, introPx);
}

function pageUsedHeightPx(
  page: WorksheetQuestion[],
  pageIndex: number,
  fontSize: string,
  dividersBetween: boolean,
  dividerKind: QuestionDividerKind,
  introPx: number
): number {
  return estimatePageQuestionsHeightPx(
    page,
    fontSize,
    dividersBetween,
    dividerKind,
    pageIndex === 0 ? introPx : 0
  );
}

/** حداکثر سوالاتی که در ظرفیت صفحه جا می‌شوند */
function fillPage(
  questions: WorksheetQuestion[],
  fontSize: string,
  dividersBetween: boolean,
  dividerKind: QuestionDividerKind,
  pageIndex: number,
  idx: number,
  capacity: number,
  introPx: number
): { page: WorksheetQuestion[]; nextIdx: number } {
  const remaining = questions.length - idx;
  if (remaining <= 0) return { page: [], nextIdx: idx };

  let bestCount = 0;
  for (let count = remaining; count >= 1; count--) {
    const trial = questions.slice(idx, idx + count);
    const used = pageUsedHeightPx(
      trial,
      pageIndex,
      fontSize,
      dividersBetween,
      dividerKind,
      introPx
    );
    if (used <= capacity) {
      bestCount = count;
      break;
    }
  }

  if (bestCount === 0) {
    return { page: [questions[idx]!], nextIdx: idx + 1 };
  }

  return {
    page: questions.slice(idx, idx + bestCount),
    nextIdx: idx + bestCount,
  };
}

/** سوالات صفحهٔ بعد را به صفحهٔ قبل منتقل می‌کند تا فضای پایین خالی نماند */
function compactPages(
  pages: WorksheetQuestion[][],
  fontSize: string,
  dividersBetween: boolean,
  dividerKind: QuestionDividerKind,
  introPx: number
): WorksheetQuestion[][] {
  const result = pages.map((p) => [...p]);

  for (let p = 0; p < result.length - 1; p++) {
    while (result[p + 1]!.length > 0) {
      const trial = [...result[p]!, result[p + 1]![0]!];
      const cap = capacityForPage(p, p === 0 ? introPx : 0);
      const used = pageUsedHeightPx(
        trial,
        p,
        fontSize,
        dividersBetween,
        dividerKind,
        introPx
      );
      if (used <= cap) {
        result[p]!.push(result[p + 1]!.shift()!);
      } else {
        break;
      }
    }
  }

  return result.filter((p) => p.length > 0);
}

/** بسته‌بندی سوالات در برگه‌ها با حداکثر ۴ صفحه */
export function paginateWorksheetQuestions(
  questions: WorksheetQuestion[],
  fontSize: string,
  dividersBetween: boolean,
  options?: PaginateWorksheetOptions
): WorksheetPagination {
  if (questions.length === 0) {
    return { pages: [[]], exceedsMaxPages: false };
  }

  const introPx = estimateInstructionsHeightPx(options?.instructions);
  const dividerKind = normalizeDividerKind(
    options?.questionDividerKind ?? "dotted"
  );

  const pages: WorksheetQuestion[][] = [];
  let idx = 0;

  while (idx < questions.length && pages.length < WORKSHEET_MAX_PAGES) {
    const pageIndex = pages.length;
    const capacity = capacityForPage(pageIndex, introPx);
    const { page, nextIdx } = fillPage(
      questions,
      fontSize,
      dividersBetween,
      dividerKind,
      pageIndex,
      idx,
      capacity,
      introPx
    );
    pages.push(page);
    idx = nextIdx;
  }

  const exceedsMaxPages = idx < questions.length;

  const compacted = compactPages(
    pages,
    fontSize,
    dividersBetween,
    dividerKind,
    introPx
  );

  return {
    pages: compacted.length > 0 ? compacted : [questions],
    exceedsMaxPages,
  };
}

export type CartoonPageRole = "single" | "first" | "middle" | "last";

export function cartoonPageRole(
  pageIndex: number,
  totalPages: number
): CartoonPageRole {
  if (totalPages <= 1) return "single";
  if (pageIndex === 0) return "first";
  if (pageIndex === totalPages - 1) return "last";
  return "middle";
}

export const CARTOON_MAX_PAGES_MESSAGE =
  "این کاربرگ بیش از ۴ صفحه می‌شود. حداکثر ۴ صفحه مجاز است؛ لطفاً تعداد سوالات، فضای پاسخ یا اندازهٔ قلم را کم کنید.";
