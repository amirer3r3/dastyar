import type { WorksheetQuestion } from "./types";
import { WORKSHEET_MAX_PAGES } from "./worksheet-paginate";
import type { StandardRowEstimateOptions } from "./standard-exam-layout";
import {
  asmanPageCapacityPx,
  asmanPageUsedHeightPx,
} from "./asman-exam-layout";

export type AsmanExamPagination = {
  pages: WorksheetQuestion[][];
  exceedsMaxPages: boolean;
};

export type PaginateAsmanExamOptions = StandardRowEstimateOptions & {
  htmlByQuestionId?: Map<string, string>;
};

function fillAsmanPage(
  questions: WorksheetQuestion[],
  fontSize: string,
  pageIndex: number,
  startIdx: number,
  options?: PaginateAsmanExamOptions
): { page: WorksheetQuestion[]; nextIdx: number } {
  const remaining = questions.length - startIdx;
  if (remaining <= 0) return { page: [], nextIdx: startIdx };

  const cap = asmanPageCapacityPx(pageIndex);
  let best = 0;
  for (let count = remaining; count >= 1; count--) {
    const trial = questions.slice(startIdx, startIdx + count);
    const used = asmanPageUsedHeightPx(trial, fontSize, options);
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

export function paginateAsmanExamQuestions(
  questions: WorksheetQuestion[],
  fontSize: string,
  options?: PaginateAsmanExamOptions
): AsmanExamPagination {
  if (questions.length === 0) {
    return { pages: [[]], exceedsMaxPages: false };
  }

  const pages: WorksheetQuestion[][] = [];
  let idx = 0;

  while (idx < questions.length && pages.length < WORKSHEET_MAX_PAGES) {
    const pageIndex = pages.length;
    const { page, nextIdx } = fillAsmanPage(
      questions,
      fontSize,
      pageIndex,
      idx,
      options
    );
    pages.push(page);
    idx = nextIdx;
  }

  return {
    pages: pages.length > 0 ? pages : [questions],
    exceedsMaxPages: idx < questions.length,
  };
}
