"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import {
  StandardExamFooter,
  StandardExamQuestions,
  type StandardExamHeaderData,
} from "../standard-exam-template";
import { paginateStandardExamQuestions } from "../standard-exam-paginate";
import { defaultQuestionStyle } from "../question-style";
import type { WorksheetQuestion } from "../types";
import {
  blocksToWorksheetQuestions,
  type ManualBlock,
} from "./types";
import { useShallow } from "zustand/react/shallow";
import { useExamDesignerStore } from "./store/exam-designer-store";
import RichTextField from "./rich-text-field";
import QuestionAnswerSpaceHandle from "./QuestionAnswerSpaceHandle";
import {
  FREE_SHEET_QUESTION_IDLE_CLASS,
  FREE_SHEET_QUESTION_SELECTED_CLASS,
} from "./free-question-selection";
import StandardExamScoreCell from "./StandardExamScoreCell";
import { StandardExamAnswerSpace } from "../standard-exam-template";

type Props = {
  pageIndex: number;
  pageCount: number;
  pageRows: WorksheetQuestion[];
  startIndex: number;
  preview: boolean;
  blocksById: Map<string, ManualBlock>;
};

export function StudioQuestionCheckboxOptions({
  block,
  preview,
}: {
  block: ManualBlock;
  preview: boolean;
}) {
  const updateBlock = useExamDesignerStore((s) => s.updateBlock);
  if (block.type !== "checkbox-question") return null;
  return (
    <div className="flex flex-col gap-1 text-sm">
      {(block.options ?? []).map((opt, i) => (
        <label key={opt.label} className="flex items-center gap-2">
          <span>{opt.label}</span>
          <input
            type="checkbox"
            checked={opt.checked}
            disabled={preview}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              const next = [...(block.options ?? [])];
              next[i] = { ...opt, checked: e.target.checked };
              updateBlock(block.id, { options: next });
            }}
            className="h-4 w-4 accent-[#0E7048]"
          />
        </label>
      ))}
    </div>
  );
}

export function StudioQuestionBody({
  block,
  preview,
  qStyle,
  freeLayout = false,
}: {
  block: ManualBlock;
  preview: boolean;
  qStyle: CSSProperties;
  freeLayout?: boolean;
}) {
  const selectSheetQuestion = useExamDesignerStore((s) => s.selectSheetQuestion);
  const selectedId = useExamDesignerStore((s) => s.selectedId);
  const updateBlock = useExamDesignerStore((s) => s.updateBlock);
  const selected = selectedId === block.id && !preview;
  const isSheetQuestion =
    block.type === "bank-question" ||
    block.type === "question" ||
    block.type === "checkbox-question";
  const canEdit = !preview && selected && isSheetQuestion;

  const typography = {
    fontFamily:
      (typeof block.style?.fontFamily === "string"
        ? block.style.fontFamily
        : undefined) ??
      (typeof qStyle.fontFamily === "string" ? qStyle.fontFamily : undefined),
    fontSize:
      (typeof block.style?.fontSize === "string"
        ? block.style.fontSize
        : undefined) ??
      (typeof qStyle.fontSize === "string" ? qStyle.fontSize : undefined),
    lineHeight: qStyle.lineHeight ?? 1.55,
  };

  const shellClass = freeLayout
    ? "standard-exam-q-text-rich block w-full min-w-0"
    : `standard-exam-q-text min-w-0 w-full ${selected ? "ring-1 ring-[#0E7048]/40 ring-offset-1" : ""}`;

  return (
    <div
      className={shellClass}
      style={freeLayout ? typography : { ...qStyle, ...typography }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        if (preview) return;
        selectSheetQuestion(block.id);
      }}
    >
      <RichTextField
        html={block.html}
        onChange={(html) => updateBlock(block.id, { html })}
        editable={canEdit}
        fillWidth={!freeLayout}
        typography={typography}
        placeholder="متن سؤال..."
        className={
          freeLayout
            ? "min-h-[1.25em] border-none outline-none"
            : "min-h-[1.25em] w-full border-none outline-none"
        }
        onFocus={() => {
          if (!preview) selectSheetQuestion(block.id);
        }}
      />
      {!freeLayout && block.type === "checkbox-question" ? (
        <StudioQuestionCheckboxOptions block={block} preview={preview} />
      ) : null}
    </div>
  );
}

export function buildStandardExamHeaderFromStore(state: {
  title: string;
  bismillah: string;
  worksheetDate: string;
  schoolName: string;
  examDistrict: string;
  examCity: string;
  examDuration: string;
}): StandardExamHeaderData {
  return {
    bismillah: state.bismillah,
    title: state.title,
    worksheetDate: state.worksheetDate,
    schoolName: state.schoolName,
    examDistrict: state.examDistrict,
    examCity: state.examCity,
    examDuration: state.examDuration,
  };
}

export function useStandardExamPages(blocks: ManualBlock[], fontSize: string) {
  const geometrySnap = useExamDesignerStore((s) => s.geometrySnap);
  const headerVariant = useExamDesignerStore((s) => s.headerVariant);
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
    return paginateStandardExamQuestions(questions, fontSize, {
      includeAnswerHandle: true,
      htmlByQuestionId,
      headerVariant,
    });
  }, [layoutBlocks, fontSize, headerVariant]);
}

export default function StandardExamStudioPage({
  pageIndex,
  pageCount,
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

  const headerVariant = useExamDesignerStore((s) => s.headerVariant);
  const selectedId = useExamDesignerStore((s) => s.selectedId);
  const selectSheetQuestion = useExamDesignerStore((s) => s.selectSheetQuestion);
  const isFreeLayout = headerVariant === "minimal-free";
  const footerMessage = useExamDesignerStore((s) => s.footerMessage);
  const isLastPage = pageIndex === pageCount - 1;

  return (
    <>
      <StandardExamQuestions
        layoutVariant={headerVariant}
        rows={pageRows}
        startIndex={startIndex}
        qStyle={qStyle}
        renderAnswerSpaceArea={(q, units) => (
          <div className="standard-exam-answer-space-wrap">
            <StandardExamAnswerSpace
              units={units}
              reserveEditorMin={!preview}
              ruled={isFreeLayout}
            />
            <QuestionAnswerSpaceHandle questionId={q.id} preview={preview} />
          </div>
        )}
        renderScoreCell={(q) => (
          <StandardExamScoreCell
            questionId={q.id}
            score={q.score}
            preview={preview}
          />
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
              freeLayout={isFreeLayout}
            />
          );
        }}
        renderQuestionExtra={
          isFreeLayout
            ? (q) => {
                const block = blocksById.get(q.id);
                if (!block) return null;
                return (
                  <StudioQuestionCheckboxOptions
                    block={block}
                    preview={preview}
                  />
                );
              }
            : undefined
        }
        getFreeQuestionItemProps={
          isFreeLayout && !preview
            ? (q) => {
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
            : undefined
        }
      />
      {isLastPage ? <StandardExamFooter message={footerMessage} /> : null}
    </>
  );
}
