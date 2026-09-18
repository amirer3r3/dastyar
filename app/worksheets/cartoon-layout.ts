/**
 * ناحیهٔ سوالات تم کارتونی — هم‌تراز با viewBox فایل‌های SVG (A4 = 210×297mm).
 * car1 viewBox: 578.94 × 827.7
 */

/** فاصلهٔ لبهٔ A4 تا کادر اصلی تم (car1 / car2) — چاپ و برش */
export const CARTOON_PAGE_OUTER_MARGIN_MM = 8;

const A4_HEIGHT_MM = 297;

const CAR1_VIEW_H = 827.7;

function printableHeightMm(): number {
  return A4_HEIGHT_MM - 2 * CARTOON_PAGE_OUTER_MARGIN_MM;
}

/** Y در SVG → فاصله از بالای برگه (mm) با inset پس‌زمینه */
function svgYToPageMm(y: number, viewH: number): number {
  return (
    CARTOON_PAGE_OUTER_MARGIN_MM + (y / viewH) * printableHeightMm()
  );
}

/** فاصله از پایین برگه (mm) */
function svgYToPageBottomMm(yFromBottom: number, viewH: number): number {
  return (
    CARTOON_PAGE_OUTER_MARGIN_MM +
    (yFromBottom / viewH) * printableHeightMm()
  );
}

function roundMm(mm: number): number {
  return Math.round(mm * 10) / 10;
}

/** ناحیهٔ عنوان در ابر car1 (بین «به نام…» و «نام زیبایت») */
const CAR1_TITLE_SLOT_TOP_Y = 122;
const CAR1_TITLE_SLOT_BOTTOM_Y = 140;

export const CARTOON_CAR1_TITLE_TOP_MM = roundMm(
  svgYToPageMm(CAR1_TITLE_SLOT_TOP_Y, CAR1_VIEW_H)
);
export const CARTOON_CAR1_TITLE_HEIGHT_MM = roundMm(
  svgYToPageMm(CAR1_TITLE_SLOT_BOTTOM_Y, CAR1_VIEW_H) -
    svgYToPageMm(CAR1_TITLE_SLOT_TOP_Y, CAR1_VIEW_H)
);

/** زیر سربرگ — فاصلهٔ سوال اول */
const CAR1_CONTENT_TOP_Y = 215;
/** تا خط‌چین پایین کادر — حداکثر فضای سوالات */
const CAR1_CONTENT_BOTTOM_Y = 812;

export const CARTOON_CAR1_TOP_MM = roundMm(
  svgYToPageMm(CAR1_CONTENT_TOP_Y, CAR1_VIEW_H)
);

export const CARTOON_CAR1_BOTTOM_MM = roundMm(
  svgYToPageBottomMm(CAR1_VIEW_H - CAR1_CONTENT_BOTTOM_Y, CAR1_VIEW_H)
);

/** car2 viewBox: 595.28 × 841.89 */
const CAR2_VIEW_H = 841.89;
const CAR2_CONTENT_TOP_Y = 40;
/** بالای نوار پاورقی — تا خط‌چین داخلی */
const CAR2_CONTENT_BOTTOM_Y = 802;

export const CARTOON_CAR2_TOP_MM = roundMm(
  svgYToPageMm(CAR2_CONTENT_TOP_Y, CAR2_VIEW_H)
);

export const CARTOON_CAR2_BOTTOM_MM = roundMm(
  svgYToPageBottomMm(CAR2_VIEW_H - CAR2_CONTENT_BOTTOM_Y, CAR2_VIEW_H)
);

/** ۵mm داخل کادر تم، بعد از حاشیهٔ ۸mm برگه */
export const CARTOON_CONTENT_SIDE_MM = roundMm(
  CARTOON_PAGE_OUTER_MARGIN_MM + 5
);
