import type { CSSProperties, ReactNode } from "react";
import { ASMAN_QUESTION_INSET_HORIZONTAL_MM } from "../asman-layout";

/** فاصلهٔ افقی — تم‌های دیگر (legacy) */
export const STUDIO_SHEET_QUESTION_INSET_MM = 6;
/** تم آسمان — همان ثابت layout */
export const STUDIO_SHEET_QUESTION_INSET_ASMAN_MM =
  ASMAN_QUESTION_INSET_HORIZONTAL_MM;
/** فاصلهٔ افقی — آزمون مدارس (جدول / مینیمال با جدول) */
export const STUDIO_SHEET_QUESTION_INSET_STANDARD_MM = 4;
/** فاصلهٔ افقی — فقط قالب آزاد (مینیمال آزاد) */
export const STUDIO_SHEET_QUESTION_INSET_SCHOOL_FREE_MM = 1.5;

/** کانتینر محتوای سوالات داخل A4 — جلوگیری از بیرون‌زدگی width+padding */
export default function StudioSheetQuestionInset({
  children,
  insetMm = STUDIO_SHEET_QUESTION_INSET_MM,
  className = "",
}: {
  children: ReactNode;
  /** فاصله از حاشیه داخلی (mm) */
  insetMm?: number;
  className?: string;
}) {
  const insetStyle: CSSProperties = {
    paddingLeft: `${insetMm}mm`,
    paddingRight: `${insetMm}mm`,
    boxSizing: "border-box",
  };

  return (
    <div
      className={`studio-sheet-question-inset w-full max-w-full min-w-0 box-border overflow-x-clip ${className}`.trim()}
      style={insetStyle}
    >
      <div className="studio-sheet-question-stack relative w-full max-w-full min-w-0 box-border">
        {children}
      </div>
    </div>
  );
}
