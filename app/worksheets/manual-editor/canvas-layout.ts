import type { ManualBlock } from "./types";
import { normalizeSheetQuestionBlock } from "./types";
import { isManualFloatingBlock } from "./canvas-elements";
import type { WorksheetTheme } from "../types";
import {
  standardExamHeaderHeightPx,
  type ExamHeaderVariant,
} from "../exam-header-variant";
import { cartoonPageRole } from "../worksheet-paginate";
import {
  CARTOON_CAR1_BOTTOM_MM,
  CARTOON_CAR1_TOP_MM,
  CARTOON_CAR2_BOTTOM_MM,
  CARTOON_CAR2_TOP_MM,
} from "../cartoon-layout";
import {
  ASMAN_CONTENT_SIDE_LEFT_MM,
  ASMAN_CONTENT_SIDE_RIGHT_MM,
  ASMAN_PAGE1_BOTTOM_MM,
  ASMAN_PAGE1_TOP_MM,
  ASMAN_PAGE2_BOTTOM_MM,
  ASMAN_PAGE2_TOP_MM,
} from "../asman-layout";
import { ASMAN_A4_HEIGHT_PX } from "../asman-exam-layout";
import { STANDARD_A4_SAFE_MARGIN_PX } from "../standard-exam-layout";

/** ضخامت خط کادر آزمون (خط بیرونی) */
export const STANDARD_EXAM_FRAME_BORDER_PX = 2;
/** پدینگ/فاصله بین خط بیرونی و کادر داخلی — طراحی دوخطی */
export const STANDARD_FRAME_PAD_PX = 3;
/**
 * مجموع ضخامت کادر و پدینگ برای هر سمت برگه
 * (Border + Padding per side)
 */
export const STANDARD_EXAM_FRAME_CHROME_PER_SIDE_PX =
  STANDARD_EXAM_FRAME_BORDER_PX + STANDARD_FRAME_PAD_PX;
/** مجموع فضای اشغال‌شده توسط کادر در دو طرف برگه */
export const STANDARD_EXAM_FRAME_CHROME_TOTAL_PX =
  STANDARD_EXAM_FRAME_CHROME_PER_SIDE_PX * 2;

/** خط داخلی کادر دوخطی (هر طرف، px) */
const STANDARD_EXAM_INNER_BORDER_PX = 1;
/** فاصلهٔ محتوا از کادر داخلی (هر طرف، px) */
const STANDARD_EXAM_CONTENT_INSET_PX = 8;

/** حاشیه سفید A4 + کادر دوخطی + inset محتوا (px) */
const STANDARD_EXAM_SHEET_CHROME_PX =
  STANDARD_A4_SAFE_MARGIN_PX * 2 +
  STANDARD_EXAM_FRAME_CHROME_TOTAL_PX +
  STANDARD_EXAM_INNER_BORDER_PX * 2 +
  STANDARD_EXAM_CONTENT_INSET_PX * 2;

export const A4_WIDTH_PX = 793.7;
export const A4_HEIGHT_PX = 1122.5;
export const SHEET_PAD_X = 10;
/** فاصلهٔ کادر متن از خطوط حاشیهٔ محتوا (هر طرف، px) */
export const STUDIO_BLOCK_EDGE_PAD = 14;
export const PAGE_GAP_PX = 24;

const MM_TO_PX = 96 / 25.4;

/** فضای محتوا در صفحه اول (بعد از هدر) — تم رسمی */
export const PAGE0_CONTENT_Y = 92;
export const PAGE0_CONTENT_MAX_Y = 1080;

/** صفحات بعدی */
export const CONT_PAGE_CONTENT_Y = 28;
export const CONT_PAGE_CONTENT_MAX_Y = 1080;

type StudioLayoutContext = {
  theme: WorksheetTheme;
  pageCount: number;
  headerVariant: ExamHeaderVariant;
};

let studioLayoutCtx: StudioLayoutContext = {
  theme: "formal",
  pageCount: 1,
  headerVariant: "standard",
};

/** Canvas/theme — محدودهٔ قرارگیری بلاک‌ها زیر سربرگ هر تم */
export function setStudioPageLayout(ctx: StudioLayoutContext) {
  studioLayoutCtx = ctx;
}

function formalPageBounds(page: number) {
  if (page === 0) {
    return {
      minY: PAGE0_CONTENT_Y,
      maxY: PAGE0_CONTENT_MAX_Y,
      minX: SHEET_PAD_X,
      maxX: A4_WIDTH_PX - SHEET_PAD_X,
    };
  }
  return {
    minY: CONT_PAGE_CONTENT_Y,
    maxY: CONT_PAGE_CONTENT_MAX_Y,
    minX: SHEET_PAD_X,
    maxX: A4_WIDTH_PX - SHEET_PAD_X,
  };
}

function themedPageBounds(page: number) {
  const { theme, pageCount } = studioLayoutCtx;

  if (theme === "cartoon") {
    const role = cartoonPageRole(page, Math.max(1, pageCount));
    const car1 = role === "single" || role === "first";
    const topMm = car1 ? CARTOON_CAR1_TOP_MM : CARTOON_CAR2_TOP_MM;
    const bottomMm = car1 ? CARTOON_CAR1_BOTTOM_MM : CARTOON_CAR2_BOTTOM_MM;
    const sideMm = 5;
    return {
      minY: topMm * MM_TO_PX,
      maxY: A4_HEIGHT_PX - bottomMm * MM_TO_PX,
      minX: sideMm * MM_TO_PX,
      maxX: A4_WIDTH_PX - sideMm * MM_TO_PX,
    };
  }

  if (theme === "asman") {
    const pageOne = page === 0;
    const topMm = pageOne ? ASMAN_PAGE1_TOP_MM : ASMAN_PAGE2_TOP_MM;
    const bottomMm = pageOne ? ASMAN_PAGE1_BOTTOM_MM : ASMAN_PAGE2_BOTTOM_MM;
    return {
      minY: topMm * MM_TO_PX,
      maxY: A4_HEIGHT_PX - bottomMm * MM_TO_PX,
      minX: ASMAN_CONTENT_SIDE_LEFT_MM * MM_TO_PX,
      maxX: A4_WIDTH_PX - ASMAN_CONTENT_SIDE_RIGHT_MM * MM_TO_PX,
    };
  }

  if (theme === "standard") {
    const topMm = page === 0 ? 56 : 14;
    const bottomMm = page === 0 ? 36 : 28;
    const sideMm = 8;
    return {
      minY: topMm * MM_TO_PX,
      maxY: A4_HEIGHT_PX - bottomMm * MM_TO_PX,
      minX: sideMm * MM_TO_PX,
      maxX: A4_WIDTH_PX - sideMm * MM_TO_PX,
    };
  }

  if (theme === "floral") {
    const topMm = page === 0 ? 56 : 28;
    const bottomMm = page === 0 ? 40 : 32;
    const sideMm = 5;
    return {
      minY: topMm * MM_TO_PX,
      maxY: A4_HEIGHT_PX - bottomMm * MM_TO_PX,
      minX: sideMm * MM_TO_PX,
      maxX: A4_WIDTH_PX - sideMm * MM_TO_PX,
    };
  }

  return formalPageBounds(page);
}

export const DEFAULT_TEXT_W = 280;
export const DEFAULT_TEXT_H = 72;
export const MIN_BLOCK_W = 48;
export const MIN_BLOCK_H = 32;
export const DIVIDER_BLOCK_H = 14;
export const DIVIDER_MIN_H = 8;
export const DIVIDER_MIN_W = 64;

export type ClampLimits = { minW?: number; minH?: number };

export function pageContentBounds(page: number) {
  if (studioLayoutCtx.theme === "formal") {
    return formalPageBounds(page);
  }
  return themedPageBounds(page);
}

/** ارتفاع سربرگ صفحه اول — از ctx استور */
export function currentStandardExamHeaderPx(): number {
  return standardExamHeaderHeightPx(studioLayoutCtx.headerVariant);
}

/** @deprecated از currentStandardExamHeaderPx استفاده کنید */
export const STANDARD_EXAM_HEADER_PX = 118;

/** ارتفاع `.standard-exam-body` — y=0 یعنی لبهٔ بالای جدول (زیر سربرگ) */
export function standardExamBodyHeightPx(page: number): number {
  const innerHeight = A4_HEIGHT_PX - STANDARD_EXAM_SHEET_CHROME_PX;
  const headerPx = page === 0 ? currentStandardExamHeaderPx() : 0;
  return Math.max(200, innerHeight - headerPx);
}

/**
 * محدودهٔ قرارگیری عناصر شناور در تم standard:
 * مختصات نسبت به `.standard-exam-body` (بلافاصله زیر سربرگ)، نه کل A4.
 */
export function standardExamFloatingBounds(page: number) {
  const sideMm = 8;
  const sidePx = sideMm * MM_TO_PX + 12;
  const bodyHeight = standardExamBodyHeightPx(page);
  const bottomReserve = 8;

  return {
    minX: sidePx,
    maxX: A4_WIDTH_PX - sidePx,
    minY: 0,
    maxY: Math.max(160, bodyHeight - bottomReserve),
  };
}

/** محدودهٔ متن شناور در تم آسمان — کل برگه A4 (مختصات نسبت به لایهٔ شناور) */
export function asmanExamFloatingBounds(page: number) {
  const minX = ASMAN_CONTENT_SIDE_LEFT_MM * MM_TO_PX;
  const maxX = A4_WIDTH_PX - ASMAN_CONTENT_SIDE_RIGHT_MM * MM_TO_PX;
  const topMm = page === 0 ? ASMAN_PAGE1_TOP_MM : ASMAN_PAGE2_TOP_MM;
  const bottomMm = page === 0 ? ASMAN_PAGE1_BOTTOM_MM : ASMAN_PAGE2_BOTTOM_MM;
  const minY = Math.max(0, topMm * MM_TO_PX - 12);
  const maxY = Math.max(
    minY + 120,
    ASMAN_A4_HEIGHT_PX - bottomMm * MM_TO_PX - 8
  );

  return {
    minX,
    maxX,
    minY,
    maxY,
  };
}

function examFloatingBoundsForTheme(page: number) {
  if (studioLayoutCtx.theme === "asman") {
    return asmanExamFloatingBounds(page);
  }
  return standardExamFloatingBounds(page);
}

export function blockPageBounds(block: ManualBlock, page: number) {
  if (
    (studioLayoutCtx.theme === "standard" ||
      studioLayoutCtx.theme === "asman") &&
    isManualFloatingBlock(block)
  ) {
    return examFloatingBoundsForTheme(page);
  }
  return pageContentBounds(page);
}

export function studioFullWidthTextGeometry(
  page: number,
  y: number,
  height: number
) {
  const b = pageContentBounds(page);
  const x = b.minX + STUDIO_BLOCK_EDGE_PAD;
  const width = b.maxX - b.minX - STUDIO_BLOCK_EDGE_PAD * 2;
  return clampGeometry(x, y, width, height, page);
}

/** خطکشی تمام‌عرض محتوا (قابل کوتاه/بلند کردن با width) */
export function studioDividerGeometry(
  page: number,
  y: number,
  width?: number
) {
  const b = pageContentBounds(page);
  const x = b.minX + STUDIO_BLOCK_EDGE_PAD;
  const fullW = b.maxX - b.minX - STUDIO_BLOCK_EDGE_PAD * 2;
  return clampGeometry(x, y, width ?? fullW, DIVIDER_BLOCK_H, page, {
    minW: DIVIDER_MIN_W,
    minH: DIVIDER_MIN_H,
  });
}

export function clampGeometry(
  x: number,
  y: number,
  width: number,
  height: number,
  page: number,
  limits?: ClampLimits,
  boundsOverride?: ReturnType<typeof pageContentBounds>
) {
  const b = boundsOverride ?? pageContentBounds(page);
  const minW = limits?.minW ?? MIN_BLOCK_W;
  const minH = limits?.minH ?? MIN_BLOCK_H;
  const w = Math.max(minW, width);
  const h = Math.max(minH, height);
  const maxW = b.maxX - b.minX;
  const cx = Math.min(Math.max(x, b.minX), b.maxX - w);
  const cy = Math.min(Math.max(y, b.minY), b.maxY - h);
  return { x: cx, y: cy, width: Math.min(w, maxW), height: h, page };
}

function normalizeStandardFloatingY(block: ManualBlock): ManualBlock {
  if (
    (studioLayoutCtx.theme !== "standard" &&
      studioLayoutCtx.theme !== "asman") ||
    !isManualFloatingBlock(block) ||
    typeof block.y !== "number"
  ) {
    return block;
  }
  const page = block.page ?? 0;
  const b = examFloatingBoundsForTheme(page);
  let y = block.y;
  if (studioLayoutCtx.theme === "standard") {
    const page0ContentY = 56 * MM_TO_PX;
    if (page === 0 && y >= page0ContentY * 0.7) {
      const asBody = y - currentStandardExamHeaderPx();
      if (asBody >= b.minY && asBody <= b.maxY) {
        y = asBody;
      }
    }
  }
  const w = block.width ?? defaultWidth(block);
  const h = block.height ?? defaultHeight(block);
  const clamped = clampGeometry(
    block.x ?? b.minX,
    y,
    w,
    h,
    page,
    undefined,
    b
  );
  return { ...block, ...clamped };
}

export function migrateBlockGeometry(
  block: ManualBlock,
  index: number
): ManualBlock {
  if (
    typeof block.x === "number" &&
    typeof block.y === "number" &&
    typeof block.page === "number"
  ) {
    const height =
      block.type === "divider"
        ? DIVIDER_BLOCK_H
        : (block.height ?? defaultHeight(block));
    return normalizeStandardFloatingY({
      ...block,
      width: block.width ?? defaultWidth(block),
      height,
    });
  }
  const page = 0;
  const y = PAGE0_CONTENT_Y + index * 96;
  return {
    ...block,
    x: SHEET_PAD_X + (index % 2) * 24,
    y,
    width: block.width ?? defaultWidth(block),
    height: block.height ?? defaultHeight(block),
    page,
  };
}

function defaultWidth(block: ManualBlock): number {
  if (block.type === "shape") return block.width ?? 120;
  if (block.type === "divider") return A4_WIDTH_PX - SHEET_PAD_X * 2;
  if (block.type === "table") return 320;
  if (block.type === "formula") return 240;
  return DEFAULT_TEXT_W;
}

function defaultHeight(block: ManualBlock): number {
  if (block.type === "shape") return block.height ?? 80;
  if (block.type === "divider") return DIVIDER_BLOCK_H;
  if (block.type === "table") return 160;
  if (block.type === "formula") return 56;
  return DEFAULT_TEXT_H;
}

export function computePageCount(blocks: ManualBlock[]): number {
  if (blocks.length === 0) return 1;
  let pages = 1;
  for (const block of blocks) {
    const page = block.page ?? 0;
    const b = pageContentBounds(page);
    const bottom = (block.y ?? PAGE0_CONTENT_Y) + (block.height ?? DEFAULT_TEXT_H);
    pages = Math.max(pages, page + 1);
    if (bottom > b.maxY - 8) {
      pages = Math.max(pages, page + 2);
    }
  }
  return pages;
}

export function nextBlockPlacement(blocks: ManualBlock[]): {
  x: number;
  y: number;
  page: number;
} {
  const pageCount = computePageCount(blocks);
  const page = pageCount - 1;
  const onPage = blocks.filter((b) => (b.page ?? 0) === page);
  const b = pageContentBounds(page);
  if (onPage.length === 0) {
    return {
      x: b.minX + STUDIO_BLOCK_EDGE_PAD,
      y: b.minY + 4,
      page,
    };
  }
  const last = onPage[onPage.length - 1];
  const nextY =
    (last.y ?? b.minY) + (last.height ?? DEFAULT_TEXT_H) + 10;
  if (nextY + DEFAULT_TEXT_H <= b.maxY) {
    return { x: last.x ?? b.minX, y: nextY, page };
  }
  return {
    x: b.minX + STUDIO_BLOCK_EDGE_PAD,
    y: b.minY + 4,
    page: page + 1,
  };
}

/** موقعیت اولیهٔ متن شناور — مختصات body (y از ۰ = بالای سوال اول) */
export function nextStandardFloatingPlacement(
  blocks: ManualBlock[],
  blockHeight = DEFAULT_TEXT_H
): { x: number; y: number; page: number } {
  const pageCount = Math.max(1, computePageCount(blocks));
  const page = pageCount - 1;
  const bounds = examFloatingBoundsForTheme(page);
  const floats = blocks.filter(
    (b) =>
      isManualFloatingBlock(b) &&
      b.type === "floating-text" &&
      (b.page ?? 0) === page
  );

  if (floats.length === 0) {
    return {
      x: bounds.minX + STUDIO_BLOCK_EDGE_PAD,
      y: bounds.minY + 6,
      page,
    };
  }

  const last = floats[floats.length - 1];
  let x = last.x ?? bounds.minX + STUDIO_BLOCK_EDGE_PAD;
  let y =
    (last.y ?? bounds.minY) + (last.height ?? blockHeight) + 10;

  if (y + blockHeight > bounds.maxY) {
    y = bounds.minY + 6;
    x = Math.min(bounds.maxX - 120, x + 32);
  }

  return { x, y, page };
}

export function migrateBlocks(blocks: ManualBlock[]): ManualBlock[] {
  return blocks
    .map((b, i) => migrateBlockGeometry(b, i))
    .map(normalizeSheetQuestionBlock);
}
