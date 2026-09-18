import type { ManualBlock } from "./types";

/**
 * صفحه‌بندی سوالات روی برگه باید همیشه از blocks زنده استفاده کند.
 * geometrySnap هنگام drag فضای پاسخ، answerLines قدیمی نگه می‌دارد.
 */
export function blocksForSheetExamPagination(blocks: ManualBlock[]): ManualBlock[] {
  return blocks;
}
