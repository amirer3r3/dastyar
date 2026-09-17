import type { CSSProperties } from "react";

/** پس‌زمینهٔ صفحه اول — public/themes */
export const ASMAN_PAGE1_SRC = "/themes/asman1.svg";
/** پس‌زمینهٔ صفحات بعدی */
export const ASMAN_PAGE2_SRC = "/themes/asman2.svg";

const PRINT_BG_STYLE: CSSProperties = {
  printColorAdjust: "exact",
  WebkitPrintColorAdjust: "exact",
};

export default function AsmanThemeArt({ pageIndex }: { pageIndex: number }) {
  const src = pageIndex === 0 ? ASMAN_PAGE1_SRC : ASMAN_PAGE2_SRC;
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full select-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="پس‌زمینه آسمان"
        className="h-full w-full object-cover print:block"
        style={PRINT_BG_STYLE}
      />
    </div>
  );
}
