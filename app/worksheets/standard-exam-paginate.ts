import type { ExamHeaderVariant } from "./exam-header-variant";
import type { WorksheetQuestion } from "./types";
import { WORKSHEET_MAX_PAGES } from "./worksheet-paginate";
import {
  standardPageCapacityPx,
  standardPageUsedHeightPx,
  type StandardRowEstimateOptions,
} from "./standard-exam-layout";

export type StandardExamPagination = {
  pages: WorksheetQuestion[][];
  exceedsMaxPages: boolean;
};

export type PaginateStandardExamOptions = StandardRowEstimateOptions & {
  htmlByQuestionId?: Map<string, string>;
  headerVariant?: ExamHeaderVariant;
};

function measureOptions(
  options?: PaginateStandardExamOptions
): PaginateStandardExamOptions | undefined {
  if (!options) return undefined;
  return {
    includeAnswerHandle: options.includeAnswerHandle,
    htmlByQuestionId: options.htmlByQuestionId,
    headerVariant: options.headerVariant,
  };
}

function fillStandardPage(
  questions: WorksheetQuestion[],
  fontSize: string,
  pageIndex: number,
  startIdx: number,
  options?: PaginateStandardExamOptions
): { page: WorksheetQuestion[]; nextIdx: number } {
  const remaining = questions.length - startIdx;
  if (remaining <= 0) return { page: [], nextIdx: startIdx };

  const measure = measureOptions(options);

  let best = 0;
  for (let count = remaining; count >= 1; count--) {
    const trial = questions.slice(startIdx, startIdx + count);
    const isLast = startIdx + count >= questions.length;
    const cap = standardPageCapacityPx(
      pageIndex,
      isLast,
      options?.headerVariant ?? "standard"
    );
    const used = standardPageUsedHeightPx(trial, fontSize, measure);
    if (used <= cap) {
      best = count;
      break;
    }
  }

  if (best === 0) {
    return { page: [questions[startIdx]!], nextIdx: startIdx + 1 };
  }

  return {
    page: questions.slice(startIdx, startIdx + best),
    nextIdx: startIdx + best,
  };
}

/**
 * توزیع سوالات بین صفحات A4 — هر سوال کامل به صفحه بعد می‌رود (بدون شکستن ردیف).
 */
export function paginateStandardExamQuestions(
  questions: WorksheetQuestion[],
  fontSize: string,
  options?: PaginateStandardExamOptions
): StandardExamPagination {
  if (questions.length === 0) {
    return { pages: [[]], exceedsMaxPages: false };
  }

  const pages: WorksheetQuestion[][] = [];
  let idx = 0;

  while (idx < questions.length && pages.length < WORKSHEET_MAX_PAGES) {
    const pageIndex = pages.length;
    const { page, nextIdx } = fillStandardPage(
      questions,
      fontSize,
      pageIndex,
      idx,
      options
    );
    pages.push(page);
    idx = nextIdx;
  }

  const exceedsMaxPages = idx < questions.length;

  return {
    pages: pages.length > 0 ? pages : [questions],
    exceedsMaxPages,
  };
}

/** نام مستعار برای مستندات / استفادهٔ خارجی */
export const paginateExamQuestions = paginateStandardExamQuestions;
