"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import { defaultQuestionStyle } from "../question-style";
import type { WorksheetQuestion } from "../types";
import { paginateAsmanExamQuestions } from "../asman-exam-paginate";
import { StandardExamAnswerSpace, StandardExamFreeQuestions } from "../standard-exam-template";
import QuestionAnswerSpaceHandle from "./QuestionAnswerSpaceHandle";
import {
  blocksToWorksheetQuestions,
  type ManualBlock,
} from "./types";
import { useShallow } from "zustand/react/shallow";
import { useExamDesignerStore } from "./store/exam-designer-store";
import {
  StudioQuestionBody,
  StudioQuestionCheckboxOptions,
} from "./standard-exam-studio";
import {
  FREE_SHEET_QUESTION_IDLE_CLASS,
  FREE_SHEET_QUESTION_SELECTED_CLASS,
} from "./free-question-selection";
import { QUESTION_TEXT_BOX_CONSTRAINT_CLASS } from "../question-text-constraints";
import StudioSheetQuestionInset from "./StudioSheetQuestionInset";

type Props = {
  pageIndex: number;
  pageCount: number;
  pageRows: WorksheetQuestion[];
  startIndex: number;
  preview: boolean;
  blocksById: Map<string, ManualBlock>;
};

export function useAsmanExamPages(blocks: ManualBlock[], fontSize: string) {
  const geometrySnap = useExamDesignerStore((s) => s.geometrySnap);
  const layoutBlocks = geometrySnap?.blocks ?? blocks;

  return useMemo(() => {
    const questions = blocksToWorksheetQuestions(layoutBlocks);
    const htmlByQuestionId = new Map<string, string>();
    for (const b of layoutBlocks) {
      if (
        b.type === "question" ||
        b.type === "bank-question" ||
        b.type === "checkbox-question"
      ) {
        htmlByQuestionId.set(b.id, b.html);
      }
    }
    return paginateAsmanExamQuestions(questions, fontSize, {
      includeAnswerHandle: true,
      htmlByQuestionId,
    });
  }, [layoutBlocks, fontSize]);
}

export default function AsmanExamStudioPage({
  pageRows,
  startIndex,
  preview,
  blocksById,
}: Props) {
  const questionStyle = useExamDesignerStore(
    useShallow((s) => ({
      fontFamily: s.questionStyle.fontFamily,
      fontSize: s.questionStyle.fontSize,
    }))
  );
  const style = questionStyle ?? defaultQuestionStyle();
  const qStyle: CSSProperties = {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    textAlign: "right",
    lineHeight: 1.55,
  };
  const selectedId = useExamDesignerStore((s) => s.selectedId);
  const selectSheetQuestion = useExamDesignerStore((s) => s.selectSheetQuestion);
  const answerRulingStyle = useExamDesignerStore((s) => s.answerRulingStyle);

  return (
    <div
      className={`worksheet-asman-free-studio ${QUESTION_TEXT_BOX_CONSTRAINT_CLASS} min-h-0 flex-1 overflow-x-clip overflow-y-visible`}
    >
      <StudioSheetQuestionInset>
      <StandardExamFreeQuestions
        rows={pageRows}
        startIndex={startIndex}
        qStyle={qStyle}
        renderAnswerSpaceArea={(q, units) => (
          <div className="standard-exam-answer-space-wrap asman-answer-space-wrap">
            <StandardExamAnswerSpace
              units={units}
              reserveEditorMin={!preview}
              rulingStyle={answerRulingStyle}
              className="border-none bg-transparent shadow-none outline-none"
            />
            <QuestionAnswerSpaceHandle
              questionId={q.id}
              preview={preview}
              variant="asman"
            />
          </div>
        )}
        renderQuestionBody={(q) => {
          const block = blocksById.get(q.id);
          if (!block) {
            return (
              <span className="standard-exam-q-text">
                {q.text?.trim() || "..."}
              </span>
            );
          }
          return (
            <StudioQuestionBody
              block={block}
              preview={preview}
              qStyle={qStyle}
              freeLayout
            />
          );
        }}
        renderQuestionExtra={(q) => {
          const block = blocksById.get(q.id);
          if (!block) return null;
          return (
            <StudioQuestionCheckboxOptions block={block} preview={preview} />
          );
        }}
        getFreeQuestionItemProps={
          preview
            ? undefined
            : (q) => {
                const isSelected = selectedId === q.id;
                return {
                  className: isSelected
                    ? FREE_SHEET_QUESTION_SELECTED_CLASS
                    : FREE_SHEET_QUESTION_IDLE_CLASS,
                  onPointerDown: (e) => {
                    e.stopPropagation();
                  },
                  onClick: (e) => {
                    e.stopPropagation();
                    selectSheetQuestion(q.id);
                  },
                };
              }
        }
      />
      </StudioSheetQuestionInset>
    </div>
  );
}
