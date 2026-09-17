"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import { type WorksheetData } from "./types";
import { defaultQuestionStyle } from "./question-style";
import { paginateStandardExamQuestions } from "./standard-exam-paginate";
import { CARTOON_MAX_PAGES_MESSAGE } from "./worksheet-paginate";
import {
  StandardExamFooter,
  StandardExamPageShell,
  StandardExamQuestions,
} from "./standard-exam-template";

export default function StandardExamPreview({ data }: { data: WorksheetData }) {
  const style = data.questionStyle ?? defaultQuestionStyle();
  const qStyle: CSSProperties = {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    textAlign: "right",
    lineHeight: 1.55,
  };

  const { pages, exceedsMaxPages } = useMemo(
    () =>
      paginateStandardExamQuestions(data.questions, style.fontSize, {
        headerVariant: data.headerVariant ?? "standard",
      }),
    [data.questions, style.fontSize, data.headerVariant]
  );

  const totalPages = pages.length;
  let offset = 0;

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
        className={`persian-nums worksheet-theme-standard school-exam-theme mx-auto flex w-full flex-col gap-4 ${
          totalPages > 1 ? "worksheet-print-multi" : ""
        }`}
        dir="rtl"
        style={{ fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" }}
      >
        {pages.map((pageRows, pageIndex) => {
          const startIndex = offset;
          offset += pageRows.length;
          const isLastPage = pageIndex === totalPages - 1;

          return (
            <StandardExamPageShell
              key={pageIndex}
              showHeader={pageIndex === 0}
              headerData={data}
              headerVariant={data.headerVariant ?? "standard"}
            >
              <StandardExamQuestions
                layoutVariant={data.headerVariant ?? "standard"}
                rows={pageRows}
                startIndex={startIndex}
                qStyle={qStyle}
              />
                {isLastPage ? (
                  <StandardExamFooter message={data.footerMessage} />
                ) : null}
            </StandardExamPageShell>
          );
        })}
      </div>
    </div>
  );
}
