import {
  formatPersianNumber,
  parsePersianNumber,
  toPersianDigits,
} from "@/app/lib/persian-digits";

export type QuestionDividerKind =
  | "solid-thin"
  | "solid-thick"
  | "dotted"
  | "dashed"
  | "double"
  | "wavy"
  | "wavy-bold"
  | "dash-dot"
  | "soft-gradient";

export type WorksheetQuestionStyle = {
  fontFamily: string;
  fontSize: string;
  dividersBetweenQuestions: boolean;
  questionDividerKind: QuestionDividerKind;
};

export { WORKSHEET_FONT_OPTIONS as QUESTION_FONT_OPTIONS } from "@/app/lib/project-fonts";

export const QUESTION_SIZE_OPTIONS = [
  "14px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px",
  "26px",
  "28px",
  "30px",
];

export const QUESTION_DIVIDER_OPTIONS: Array<{
  id: QuestionDividerKind;
  label: string;
}> = [
  { id: "solid-thin", label: "صاف نازک" },
  { id: "solid-thick", label: "صاف ضخیم" },
  { id: "dotted", label: "نقطه‌چین" },
  { id: "dashed", label: "خط‌چین" },
  { id: "double", label: "دو خطی" },
  { id: "wavy", label: "موجی" },
  { id: "wavy-bold", label: "موجی ضخیم" },
  { id: "dash-dot", label: "خط و نقطه" },
  { id: "soft-gradient", label: "محو شونده" },
];

export const defaultQuestionStyle = (): WorksheetQuestionStyle => ({
  fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
  fontSize: "16px",
  dividersBetweenQuestions: true,
  questionDividerKind: "dotted",
});

/** هر واحد «فضای پاسخ» ≈ این ارتفاع در پیش‌نمایش / چاپ */
export const ANSWER_SPACE_UNIT_PX = 28;
/** گام ریزتر در طراحی حرفه‌ای (همان answerLines، ارتفاع کمتر) */
export const EDITOR_ANSWER_SPACE_UNIT_PX = 8;
/** حداقل ارتفاع فضای پاسخ در ادیتور — فقط برای نگه‌داشتن دستگیره */
export const MIN_ANSWER_SPACE_PX = 8;

export { toPersianDigits, toEnglishDigits } from "@/app/lib/persian-digits";

export function formatPersianDigits(value: number): string {
  return formatPersianNumber(value);
}

export function parsePersianDigits(raw: string): number {
  return parsePersianNumber(raw);
}

export function normalizeDividerKind(
  kind: QuestionDividerKind | string
): QuestionDividerKind {
  if (kind === "cartoon") return "dotted";
  if (QUESTION_DIVIDER_OPTIONS.some((o) => o.id === kind)) {
    return kind as QuestionDividerKind;
  }
  return "dotted";
}

export function formatSizeLabel(px: string): string {
  const n = parseInt(px.replace("px", ""), 10);
  if (Number.isNaN(n)) return px;
  return `${toPersianDigits(n)} px`;
}

export function questionStylesEqual(
  a: WorksheetQuestionStyle,
  b: WorksheetQuestionStyle
): boolean {
  return (
    a.fontFamily === b.fontFamily &&
    a.fontSize === b.fontSize &&
    a.dividersBetweenQuestions === b.dividersBetweenQuestions &&
    normalizeDividerKind(a.questionDividerKind) ===
      normalizeDividerKind(b.questionDividerKind)
  );
}
