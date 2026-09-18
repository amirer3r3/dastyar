import type { ExamHeaderVariant } from "./exam-header-variant";
import {
  paginateStandardExamQuestions,
  type StandardExamPagination,
} from "./standard-exam-paginate";
import type { ManualBlock } from "./manual-editor/types";
import { blocksToWorksheetQuestions } from "./manual-editor/types";
import { blocksForSheetExamPagination } from "./manual-editor/sheet-exam-pagination-blocks";

export type StandardExamPaginationInput = {
  blocks: ManualBlock[];
  fontSize: string;
  headerVariant: ExamHeaderVariant;
  /** طراحی حرفه‌ای — دستگیره + واحد ۸px */
  includeAnswerHandle?: boolean;
};

/** HTML / extra height maps — مشترک استودیو و پیش‌نمایش */
export function buildStandardExamPaginationMaps(blocks: ManualBlock[]) {
  const htmlByQuestionId = new Map<string, string>();
  const extraRowHeightByQuestionId = new Map<string, number>();

  for (const b of blocks) {
    if (
      b.type === "question" ||
      b.type === "bank-question" ||
      b.type === "checkbox-question"
    ) {
      htmlByQuestionId.set(b.id, b.html);
    }
    if (b.type === "checkbox-question" && (b.options?.length ?? 0) > 0) {
      extraRowHeightByQuestionId.set(
        b.id,
        8 + (b.options?.length ?? 0) * 26
      );
    }
  }

  return { htmlByQuestionId, extraRowHeightByQuestionId };
}

/**
 * صفحه‌بندی یکپارچه آزمون مدارس — رسمی، مینیمال (جدول)، قالب آزاد.
 * همان fillStandardPage / standardPageCapacityPx / standardPageUsedHeightPx.
 */
export function paginateStandardExamFromBlocks(
  input: StandardExamPaginationInput
): StandardExamPagination {
  const blocks = blocksForSheetExamPagination(input.blocks);
  const questions = blocksToWorksheetQuestions(blocks);
  const { htmlByQuestionId, extraRowHeightByQuestionId } =
    buildStandardExamPaginationMaps(blocks);

  return paginateStandardExamQuestions(questions, input.fontSize, {
    includeAnswerHandle: input.includeAnswerHandle ?? false,
    htmlByQuestionId,
    extraRowHeightByQuestionId,
    headerVariant: input.headerVariant,
  });
}
