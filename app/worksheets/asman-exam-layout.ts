import type { WorksheetQuestion } from "./types";
import {
  ASMAN_PAGE1_BOTTOM_MM,
  ASMAN_PAGE1_TOP_MM,
  ASMAN_PAGE2_BOTTOM_MM,
  ASMAN_PAGE2_TOP_MM,
} from "./asman-layout";
import { MM_TO_PX } from "./worksheet-question-layout";
import {
  STANDARD_FREE_QUESTION_GAP_PX,
  STANDARD_PAGINATION_SAFETY_PX,
  estimateStandardFreeQuestionHeightPx,
  type StandardRowEstimateOptions,
} from "./standard-exam-layout";

export const ASMAN_A4_HEIGHT_PX = 297 * MM_TO_PX;
export const ASMAN_QUESTION_GAP_PX = STANDARD_FREE_QUESTION_GAP_PX;

export function asmanPageCapacityPx(pageIndex: number): number {
  const topMm = pageIndex === 0 ? ASMAN_PAGE1_TOP_MM : ASMAN_PAGE2_TOP_MM;
  const bottomMm =
    pageIndex === 0 ? ASMAN_PAGE1_BOTTOM_MM : ASMAN_PAGE2_BOTTOM_MM;
  return (
    ASMAN_A4_HEIGHT_PX -
    topMm * MM_TO_PX -
    bottomMm * MM_TO_PX -
    STANDARD_PAGINATION_SAFETY_PX
  );
}

export function estimateAsmanQuestionHeightPx(
  q: WorksheetQuestion,
  fontSize: string,
  options?: StandardRowEstimateOptions
): number {
  return estimateStandardFreeQuestionHeightPx(q, fontSize, options);
}

export function asmanPageUsedHeightPx(
  rows: WorksheetQuestion[],
  fontSize: string,
  options?: StandardRowEstimateOptions & {
    htmlByQuestionId?: Map<string, string>;
  }
): number {
  if (rows.length === 0) return 0;
  return rows.reduce((sum, q, index) => {
    const html = options?.htmlByQuestionId?.get(q.id);
    const rowH = estimateAsmanQuestionHeightPx(q, fontSize, {
      html,
      includeAnswerHandle: options?.includeAnswerHandle,
    });
    const gap = index > 0 ? ASMAN_QUESTION_GAP_PX : 0;
    return sum + rowH + gap;
  }, 0);
}
