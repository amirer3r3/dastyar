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
  ANSWER_SPACE_MARGIN_TOP_PX,
  CARTOON_QUESTION_TEXT_LINE_HEIGHT_PX,
  normalizeAnswerUnits,
} from "./worksheet-question-layout";
import QuestionDividerLine from "./QuestionDividerLine";
import { formatPersianNumber } from "@/app/lib/persian-digits";
import {
  CARTOON_MAX_PAGES_MESSAGE,
  cartoonPageRole,
  paginateWorksheetQuestions,
} from "./worksheet-paginate";
import CartoonThemeArt from "./cartoon-theme-art";
import {
  CARTOON_CAR1_BOTTOM_MM,
  CARTOON_CAR1_TITLE_HEIGHT_MM,
  CARTOON_CAR1_TITLE_TOP_MM,
  CARTOON_CAR1_TOP_MM,
  CARTOON_CAR2_BOTTOM_MM,
  CARTOON_CAR2_TOP_MM,
  CARTOON_CONTENT_SIDE_MM,
  CARTOON_PAGE_OUTER_MARGIN_MM,
} from "./cartoon-layout";

function AnswerSpace({
  units,
  fillRemaining = false,
}: {
  units: number;
  fillRemaining?: boolean;
}) {
  const base = Math.max(0, units) * ANSWER_SPACE_UNIT_PX;
  if (base <= 0 && !fillRemaining) return null;

  const minHeight = base > 0 ? base : fillRemaining ? 1 : 0;

  return (
    <div
      className={`w-full ${fillRemaining ? "min-h-0 flex-1" : "shrink-0"}`}
      style={{
        marginTop: ANSWER_SPACE_MARGIN_TOP_PX,
        ...(fillRemaining
          ? { minHeight }
          : { height: base }),
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
}: {
  q: WorksheetQuestion;
  index: number;
  qStyle: CSSProperties;
  dividers: boolean;
  dividerKind: ReturnType<typeof normalizeDividerKind>;
  showDividerAfter: boolean;
  fillToPageBottom?: boolean;
}) {
  const units = normalizeAnswerUnits(q.answerLines);

  return (
    <div
      className={
        fillToPageBottom
          ? "flex min-h-0 flex-1 flex-col"
          : "shrink-0"
      }
    >
      <div className="flex shrink-0 items-start gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-500 text-sm font-black text-white shadow-sm">
          {formatPersianNumber(index)}
        </span>
        <p
          className="flex-1 pt-0.5 font-medium text-gray-800"
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
        <AnswerSpace units={units} fillRemaining={fillToPageBottom} />
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

function CartoonPageHeader({ data }: { data: WorksheetData }) {
  if (!data.title) return null;

  return (
    <div
      className="worksheet-cartoon-title"
      style={{
        fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
        fontWeight: 900,
        fontSize: data.titleFontSize || "18px",
      }}
    >
      {data.title}
    </div>
  );
}

export default function CartoonWorksheetPreview({ data }: { data: WorksheetData }) {
  const style = data.questionStyle ?? defaultQuestionStyle();
  const dividers = style.dividersBetweenQuestions;
  const dividerKind = normalizeDividerKind(style.questionDividerKind);
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
        className={`persian-nums mx-auto flex w-full flex-col gap-4 ${
          totalPages > 1 ? "worksheet-print-multi" : ""
        }`}
        style={{ fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" }}
      >
      {pages.map((pageQuestions, pageIndex) => {
        const role = cartoonPageRole(pageIndex, totalPages);
        const startIndex = questionOffset;
        questionOffset += pageQuestions.length;

        const car1 = role === "single" || role === "first";
        const cartoonFrameVars = {
          ["--cartoon-page-outer-margin" as string]: `${CARTOON_PAGE_OUTER_MARGIN_MM}mm`,
          ["--cartoon-content-side" as string]: `${CARTOON_CONTENT_SIDE_MM}mm`,
        };
        const pageInsets = car1
          ? {
              ...cartoonFrameVars,
              ["--cartoon-content-top" as string]: `${CARTOON_CAR1_TOP_MM}mm`,
              ["--cartoon-content-bottom" as string]: `${CARTOON_CAR1_BOTTOM_MM}mm`,
              ["--cartoon-title-top" as string]: `${CARTOON_CAR1_TITLE_TOP_MM}mm`,
              ["--cartoon-title-height" as string]: `${CARTOON_CAR1_TITLE_HEIGHT_MM}mm`,
            }
          : {
              ...cartoonFrameVars,
              ["--cartoon-content-top" as string]: `${CARTOON_CAR2_TOP_MM}mm`,
              ["--cartoon-content-bottom" as string]: `${CARTOON_CAR2_BOTTOM_MM}mm`,
            };

        return (
          <div
            key={`cartoon-page-${pageIndex}`}
            className={`a4-sheet worksheet-cartoon-page worksheet-cartoon-page--${role} relative mx-auto overflow-hidden shadow-xl`}
            style={pageInsets}
          >
            <CartoonThemeArt role={role} />
            {(role === "single" || role === "first") && (
              <CartoonPageHeader data={data} />
            )}

            <div
              className={`worksheet-cartoon-content worksheet-cartoon-content--${role} z-[2] flex flex-col`}
            >
              <div className="worksheet-cartoon-questions flex h-full min-h-0 flex-1 flex-col gap-3">
                {pageQuestions.map((q, i) => {
                  const globalIndex = startIndex + i + 1;
                  const isLastOnPage = i === pageQuestions.length - 1;
                  const showDividerAfter =
                    dividers && !isLastOnPage;
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
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
