import type { WorksheetTheme } from "./types";

/** تم‌هایی که در استودیو «سوال برگه + فضای پاسخ + متن شناور» دارند */
export function usesSheetQuestionStudio(theme: WorksheetTheme): boolean {
  return theme === "standard" || theme === "asman";
}
