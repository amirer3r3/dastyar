/**
 * ناحیهٔ سوالات تم کارتونی — هم‌تراز با viewBox فایل‌های SVG (A4 = 210×297mm).
 * car1 viewBox: 578.94 × 827.7
 */

const CAR1_VIEW_H = 827.7;

/** ناحیهٔ عنوان در ابر car1 (بین «به نام…» و «نام زیبایت») */
const CAR1_TITLE_SLOT_TOP_Y = 122;
const CAR1_TITLE_SLOT_BOTTOM_Y = 140;

function svgYToMm(y: number): number {
  return Math.round((y / CAR1_VIEW_H) * 297 * 10) / 10;
}

export const CARTOON_CAR1_TITLE_TOP_MM = svgYToMm(CAR1_TITLE_SLOT_TOP_Y);
export const CARTOON_CAR1_TITLE_HEIGHT_MM =
  svgYToMm(CAR1_TITLE_SLOT_BOTTOM_Y) - svgYToMm(CAR1_TITLE_SLOT_TOP_Y);

/** زیر سربرگ — فاصلهٔ سوال اول */
const CAR1_CONTENT_TOP_Y = 215;
/** تا خط‌چین پایین کادر — حداکثر فضای سوالات */
const CAR1_CONTENT_BOTTOM_Y = 812;

export const CARTOON_CAR1_TOP_MM =
  Math.round((CAR1_CONTENT_TOP_Y / CAR1_VIEW_H) * 297 * 10) / 10;

export const CARTOON_CAR1_BOTTOM_MM =
  Math.round(((CAR1_VIEW_H - CAR1_CONTENT_BOTTOM_Y) / CAR1_VIEW_H) * 297 * 10) /
  10;

/** car2 viewBox: 595.28 × 841.89 */
const CAR2_VIEW_H = 841.89;
const CAR2_CONTENT_TOP_Y = 40;
/** بالای نوار پاورقی — تا خط‌چین داخلی */
const CAR2_CONTENT_BOTTOM_Y = 802;

export const CARTOON_CAR2_TOP_MM =
  Math.round((CAR2_CONTENT_TOP_Y / CAR2_VIEW_H) * 297 * 10) / 10;

export const CARTOON_CAR2_BOTTOM_MM =
  Math.round(((CAR2_VIEW_H - CAR2_CONTENT_BOTTOM_Y) / CAR2_VIEW_H) * 297 * 10) /
  10;
