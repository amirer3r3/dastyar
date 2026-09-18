import type { CSSProperties, ReactNode } from "react";

/** فاصلهٔ افقی سوالات از خط حاشیهٔ داخلی برگه (mm — با اسکیل موبایل هم‌نسبت می‌ماند) */
export const STUDIO_SHEET_QUESTION_INSET_MM = 6;

const insetStyle: CSSProperties = {
  paddingLeft: `${STUDIO_SHEET_QUESTION_INSET_MM}mm`,
  paddingRight: `${STUDIO_SHEET_QUESTION_INSET_MM}mm`,
  boxSizing: "border-box",
};

/** کانتینر محتوای سوالات داخل A4 — جلوگیری از بیرون‌زدگی width+padding */
export default function StudioSheetQuestionInset({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="studio-sheet-question-inset w-full max-w-full min-w-0 box-border overflow-x-clip"
      style={insetStyle}
    >
      <div className="studio-sheet-question-stack relative w-full max-w-full min-w-0 box-border">
        {children}
      </div>
    </div>
  );
}
