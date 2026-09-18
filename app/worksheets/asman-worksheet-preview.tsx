"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import type { WorksheetData, WorksheetQuestion } from "./types";
import {
  ANSWER_SPACE_UNIT_PX,
  defaultQuestionStyle,
  normalizeDividerKind,
} from "./question-style";
import {
  answerRulingBackgroundStyle,
  normalizeAnswerRulingStyle,
} from "./answer-ruling-style";
import {
  ANSWER_SPACE_MARGIN_TOP_PX,
  CARTOON_QUESTION_TEXT_LINE_HEIGHT_PX,
  normalizeAnswerUnits,
} from "./worksheet-question-layout";
import QuestionDividerLine from "./QuestionDividerLine";
import { formatPersianNumber } from "@/app/lib/persian-digits";
import {
  CARTOON_MAX_PAGES_MESSAGE,
  paginateWorksheetQuestions,
} from "./worksheet-paginate";
import AsmanThemeArt from "./asman-theme-art";
import AsmanPageHeader from "./asman-page-header";
import {
  ASMAN_CONTENT_SIDE_LEFT_MM,
  ASMAN_CONTENT_SIDE_RIGHT_MM,
  ASMAN_CONTENT_SIDE_MM,
  ASMAN_PAGE1_BOTTOM_MM,
  ASMAN_PAGE1_TITLE_HEIGHT_MM,
  ASMAN_PAGE1_TITLE_TOP_MM,
  ASMAN_PAGE1_TOP_MM,
  ASMAN_PAGE2_BOTTOM_MM,
  ASMAN_PAGE2_TOP_MM,
  ASMAN_QUESTION_INSET_HORIZONTAL_MM,
  ASMAN_TITLE_NUDGE_Y_MM,
} from "./asman-layout";

function AnswerSpace({
  units,
  fillRemaining = false,
  rulingStyle,
}: {
  units: number;
  fillRemaining?: boolean;
  rulingStyle: ReturnType<typeof normalizeAnswerRulingStyle>;
}) {
  const base = Math.max(0, units) * ANSWER_SPACE_UNIT_PX;
  if (base <= 0 && !fillRemaining) return null;

  const minHeight = base > 0 ? base : fillRemaining ? 1 : 0;
  const ruling = normalizeAnswerRulingStyle(rulingStyle);
  const hasRuling = ruling !== "none";

  return (
    <div
      className={`w-full ${fillRemaining ? "min-h-0 flex-1" : "shrink-0"} ${
        hasRuling ? "standard-exam-answer-space--ruled" : ""
      }`}
      style={{
        marginTop: ANSWER_SPACE_MARGIN_TOP_PX,
        ...(fillRemaining ? { minHeight } : { height: base }),
        ...answerRulingBackgroundStyle(ruling, { reserveEditorMin: false }),
      }}
      aria-hidden
    />
  );
}

function QuestionBlock({
  q,
  index,
  qStyle,
  dividers,
  dividerKind,
  showDividerAfter,
  fillToPageBottom = false,
  answerRulingStyle,
}: {
  q: WorksheetQuestion;
  index: number;
  qStyle: CSSProperties;
  dividers: boolean;
  dividerKind: ReturnType<typeof normalizeDividerKind>;
  showDividerAfter: boolean;
  fillToPageBottom?: boolean;
  answerRulingStyle: ReturnType<typeof normalizeAnswerRulingStyle>;
}) {
  const units = normalizeAnswerUnits(q.answerLines);

  return (
    <div
      className={
        fillToPageBottom ? "flex min-h-0 flex-1 flex-col" : "shrink-0"
      }
    >
      <div className="flex shrink-0 items-start gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm font-black text-white shadow-sm">
          {formatPersianNumber(index)}
        </span>
        <p
          className="flex-1 pt-0.5 font-medium text-sky-950"
          style={{
            ...qStyle,
            lineHeight: `${CARTOON_QUESTION_TEXT_LINE_HEIGHT_PX}px`,
          }}
        >
          {q.text || "..."}
        </p>
      </div>
      <div
        className={
          fillToPageBottom
            ? "flex min-h-0 flex-1 flex-col pr-10"
            : "pr-10"
        }
      >
        <AnswerSpace
          units={units}
          fillRemaining={fillToPageBottom}
          rulingStyle={answerRulingStyle}
        />
      </div>
      {showDividerAfter ? (
        <QuestionDividerLine
          kind={dividerKind}
          marginTop={Math.max(12, units * 6)}
          marginBottom={4}
        />
      ) : null}
    </div>
  );
}

export default function AsmanWorksheetPreview({ data }: { data: WorksheetData }) {
  const style = data.questionStyle ?? defaultQuestionStyle();
  const dividers = style.dividersBetweenQuestions;
  const dividerKind = normalizeDividerKind(style.questionDividerKind);
  const answerRulingStyle = normalizeAnswerRulingStyle(data.answerRulingStyle);
  const qStyle: CSSProperties = {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    textAlign: "right",
  };

  const { pages, exceedsMaxPages } = useMemo(
    () =>
      paginateWorksheetQuestions(data.questions, style.fontSize, dividers, {
        questionDividerKind: dividerKind,
      }),
    [data.questions, style.fontSize, dividers, dividerKind]
  );

  const totalPages = pages.length;
  let questionOffset = 0;

  return (
    <div className="mx-auto w-[210mm]">
      {exceedsMaxPages ? (
        <div
          className="mb-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-center text-xs font-semibold leading-6 text-amber-950 print:hidden"
          role="status"
        >
          {CARTOON_MAX_PAGES_MESSAGE}
        </div>
      ) : null}
      <div
        id="print-area"
        className={`persian-nums worksheet-theme-asman mx-auto flex w-full flex-col gap-4 ${
          totalPages > 1 ? "worksheet-print-multi" : ""
        }`}
        style={{
          fontFamily:
            "var(--font-vazirmatn), Tahoma, sans-serif",
        }}
      >
        {pages.map((pageQuestions, pageIndex) => {
          const startIndex = questionOffset;
          questionOffset += pageQuestions.length;

          const pageOne = pageIndex === 0;
          const pageInsets = {
            ["--asman-content-side" as string]: `${ASMAN_CONTENT_SIDE_MM}mm`,
            ["--asman-content-side-left" as string]: `${ASMAN_CONTENT_SIDE_LEFT_MM}mm`,
            ["--asman-content-side-right" as string]: `${ASMAN_CONTENT_SIDE_RIGHT_MM}mm`,
            ["--asman-question-inset-x" as string]: `${ASMAN_QUESTION_INSET_HORIZONTAL_MM}mm`,
            ...(pageOne
              ? {
                  ["--asman-content-top" as string]: `${ASMAN_PAGE1_TOP_MM}mm`,
                  ["--asman-content-bottom" as string]: `${ASMAN_PAGE1_BOTTOM_MM}mm`,
                  ["--asman-title-top" as string]: `${ASMAN_PAGE1_TITLE_TOP_MM}mm`,
                  ["--asman-title-height" as string]: `${ASMAN_PAGE1_TITLE_HEIGHT_MM}mm`,
                  ["--asman-title-nudge-y" as string]: `${ASMAN_TITLE_NUDGE_Y_MM}mm`,
                }
              : {
                  ["--asman-content-top" as string]: `${ASMAN_PAGE2_TOP_MM}mm`,
                  ["--asman-content-bottom" as string]: `${ASMAN_PAGE2_BOTTOM_MM}mm`,
                }),
          };

          return (
            <div
              key={`asman-page-${pageIndex}`}
              className={`a4-sheet worksheet-asman-page relative mx-auto w-[210mm] min-h-[297mm] overflow-hidden bg-transparent shadow-xl print:bg-white ${
                pageOne ? "worksheet-asman-page--first" : "worksheet-asman-page--next"
              }`}
              style={pageInsets}
            >
              <AsmanThemeArt pageIndex={pageIndex} />

              <div className="relative z-10 h-full min-h-[297mm] w-full bg-transparent">
                {pageOne ? (
                  <AsmanPageHeader
                    bismillah={data.bismillah}
                    title={data.title}
                    titleFontSize={data.titleFontSize}
                  />
                ) : null}

                <div className="worksheet-asman-content flex flex-col">
                  <div className="worksheet-asman-questions flex h-full min-h-0 flex-1 flex-col gap-3">
                  {pageQuestions.map((q, i) => {
                    const globalIndex = startIndex + i + 1;
                    const isLastOnPage = i === pageQuestions.length - 1;
                    const showDividerAfter = dividers && !isLastOnPage;
                    return (
                      <QuestionBlock
                        key={q.id}
                        q={q}
                        index={globalIndex}
                        qStyle={qStyle}
                        dividers={dividers}
                        dividerKind={dividerKind}
                        showDividerAfter={showDividerAfter}
                        fillToPageBottom={isLastOnPage}
                        answerRulingStyle={answerRulingStyle}
                      />
                    );
                  })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
