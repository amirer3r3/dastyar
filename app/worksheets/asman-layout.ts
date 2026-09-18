/**
 * ناحیهٔ محتوا تم آسمان — viewBox asman1: 593.94 × 840.94 (A4).
 */

const ASMAN1_VIEW_H = 840.94;
const ASMAN2_VIEW_H = 840.94;

function svgYToMm(y: number, viewH: number): number {
  return Math.round((y / viewH) * 297 * 10) / 10;
}

/** ابر مرکزی — «به نام…» + عنوان */
const ASMAN1_TITLE_TOP_Y = 102;
const ASMAN1_TITLE_BOTTOM_Y = 168;

export const ASMAN_PAGE1_TITLE_TOP_MM = svgYToMm(ASMAN1_TITLE_TOP_Y, ASMAN1_VIEW_H);
export const ASMAN_PAGE1_TITLE_HEIGHT_MM =
  svgYToMm(ASMAN1_TITLE_BOTTOM_Y, ASMAN1_VIEW_H) -
  svgYToMm(ASMAN1_TITLE_TOP_Y, ASMAN1_VIEW_H);

/** شروع سوالات — نزدیک به پایان ناحیهٔ عنوان (کاهش فاصلهٔ خالی زیر ابر) */
const ASMAN1_CONTENT_TOP_Y = 176;
const ASMAN1_CONTENT_BOTTOM_Y = 812;

export const ASMAN_PAGE1_TOP_MM = svgYToMm(ASMAN1_CONTENT_TOP_Y, ASMAN1_VIEW_H);
export const ASMAN_PAGE1_BOTTOM_MM =
  Math.round(
    ((ASMAN1_VIEW_H - ASMAN1_CONTENT_BOTTOM_Y) / ASMAN1_VIEW_H) * 297 * 10
  ) / 10;

/** asman2 — صفحات بعد */
const ASMAN2_CONTENT_TOP_Y = 40;
const ASMAN2_CONTENT_BOTTOM_Y = 802;

export const ASMAN_PAGE2_TOP_MM = svgYToMm(ASMAN2_CONTENT_TOP_Y, ASMAN2_VIEW_H);
export const ASMAN_PAGE2_BOTTOM_MM =
  Math.round(
    ((ASMAN2_VIEW_H - ASMAN2_CONTENT_BOTTOM_Y) / ASMAN2_VIEW_H) * 297 * 10
  ) / 10;

/** فاصلهٔ ناحیهٔ محتوا تا خط آبی حاشیه — راست و چپ (متقارن) */
export const ASMAN_CONTENT_SIDE_RIGHT_MM = 5;
export const ASMAN_CONTENT_SIDE_LEFT_MM = 5;
/** @deprecated از LEFT/RIGHT استفاده کنید */
export const ASMAN_CONTENT_SIDE_MM = ASMAN_CONTENT_SIDE_RIGHT_MM;

/** پدینگ افقی کادر سوالات نسبت به ناحیهٔ محتوا (استودیو + پیش‌نمایش) */
export const ASMAN_QUESTION_INSET_HORIZONTAL_MM = 8;

/** جابه‌جایی عمودی عنوان صفحهٔ اول (منفی = بالا) */
export const ASMAN_TITLE_NUDGE_Y_MM = -17;
