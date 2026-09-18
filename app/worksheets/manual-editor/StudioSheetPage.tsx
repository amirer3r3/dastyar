"use client";

import type { ReactNode } from "react";
import { A4_HEIGHT_PX } from "./canvas-layout";
import { useExamDesignerStore } from "./store/exam-designer-store";
import CartoonThemeArt from "../cartoon-theme-art";
import AsmanThemeArt from "../asman-theme-art";
import AsmanPageHeader from "../asman-page-header";
import { cartoonPageRole } from "../worksheet-paginate";
import {
  CARTOON_CAR1_BOTTOM_MM,
  CARTOON_CAR1_TITLE_HEIGHT_MM,
  CARTOON_CAR1_TITLE_TOP_MM,
  CARTOON_CAR1_TOP_MM,
  CARTOON_CAR2_BOTTOM_MM,
  CARTOON_CAR2_TOP_MM,
} from "../cartoon-layout";
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
} from "../asman-layout";

type Props = {
  pageIndex: number;
  pageCount: number;
  preview: boolean;
  header: ReactNode;
  continuationHeader: ReactNode;
  children: ReactNode;
};

export default function StudioSheetPage({
  pageIndex,
  pageCount,
  preview,
  header,
  continuationHeader,
  children,
}: Props) {
  const theme = useExamDesignerStore((s) => s.worksheetTheme);
  const title = useExamDesignerStore((s) => s.title);
  const subject = useExamDesignerStore((s) => s.subject);
  const grade = useExamDesignerStore((s) => s.grade);
  const titleFontSize = useExamDesignerStore((s) => s.titleFontSize);
  const bismillah = useExamDesignerStore((s) => s.bismillah);

  const sheetStyle = {
    height: A4_HEIGHT_PX,
    minHeight: A4_HEIGHT_PX,
  };

  if (theme === "cartoon") {
    const role = cartoonPageRole(pageIndex, pageCount);
    const car1 = role === "single" || role === "first";
    const pageInsets = car1
      ? {
          ["--cartoon-content-top" as string]: `${CARTOON_CAR1_TOP_MM}mm`,
          ["--cartoon-content-bottom" as string]: `${CARTOON_CAR1_BOTTOM_MM}mm`,
          ["--cartoon-title-top" as string]: `${CARTOON_CAR1_TITLE_TOP_MM}mm`,
          ["--cartoon-title-height" as string]: `${CARTOON_CAR1_TITLE_HEIGHT_MM}mm`,
        }
      : {
          ["--cartoon-content-top" as string]: `${CARTOON_CAR2_TOP_MM}mm`,
          ["--cartoon-content-bottom" as string]: `${CARTOON_CAR2_BOTTOM_MM}mm`,
        };

    return (
      <section
        className={`studio-sheet a4-sheet worksheet-cartoon-page worksheet-cartoon-page--${role} relative overflow-hidden`}
        style={{ ...sheetStyle, ...pageInsets, borderRadius: 18 }}
      >
        <CartoonThemeArt role={role} />
        {car1 && title ? (
          <div
            className="worksheet-cartoon-title"
            style={{
              fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
              fontWeight: 900,
              fontSize: titleFontSize || "18px",
            }}
          >
            {title}
          </div>
        ) : null}
        <div className="relative z-[2]" style={{ height: A4_HEIGHT_PX }}>
          {children}
        </div>
      </section>
    );
  }

  if (theme === "standard") {
    void title;
    void sheetStyle;
    /* StandardExamPageShell خودش لایه A4 + exam-outer-border را رندر می‌کند */
    return <div className="studio-sheet studio-sheet--standard">{children}</div>;
  }

  if (theme === "asman") {
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
      <section
        className={`studio-sheet a4-sheet worksheet-asman-page worksheet-asman-page--studio relative w-[210mm] min-h-[297mm] overflow-visible bg-transparent ${
          pageOne ? "worksheet-asman-page--first" : "worksheet-asman-page--next"
        }`}
        style={{ ...sheetStyle, ...pageInsets, borderRadius: 18 }}
      >
        <AsmanThemeArt pageIndex={pageIndex} />
        <div
          className="relative z-10 h-full w-full bg-transparent"
          style={{ minHeight: A4_HEIGHT_PX }}
        >
          {pageOne ? (
            <AsmanPageHeader
              bismillah={bismillah}
              title={title}
              titleFontSize={titleFontSize}
            />
          ) : null}
          <div className="absolute inset-0 bg-transparent">{children}</div>
        </div>
      </section>
    );
  }

  if (theme === "floral") {
    return (
      <section
        className="studio-sheet a4-sheet worksheet-theme-floral relative overflow-hidden bg-white"
        style={sheetStyle}
      >
        {pageIndex === 0 && title ? (
          <div className="worksheet-floral-title">
            {title}
            {subject ? (
              <span className="mt-1 block text-[10pt] font-semibold text-emerald-800">
                {subject}
              </span>
            ) : null}
          </div>
        ) : null}
        {pageIndex === 0 && grade ? (
          <div className="worksheet-floral-grade">{grade}</div>
        ) : null}
        <div className="relative z-[1]" style={{ height: A4_HEIGHT_PX }}>
          {children}
        </div>
      </section>
    );
  }

  return (
    <section
      className="studio-sheet a4-sheet relative overflow-hidden"
      style={sheetStyle}
    >
      <div className="studio-sheet-ornament" />
      {pageIndex === 0 ? header : continuationHeader}
      <div className="relative" style={{ height: A4_HEIGHT_PX }}>
        {children}
      </div>
    </section>
  );
}
