import { formatPersianNumber } from "@/app/lib/persian-digits";
import type {
  QuestionDividerKind,
  WorksheetQuestionStyle,
} from "../question-style";
import type { WorksheetQuestion, WorksheetTheme } from "../types";

export type DesignerToolTab = "text" | "table" | "shapes" | "formula";

export type TextAlign = "right" | "center" | "left";

export type ShapeKind = "line" | "rectangle" | "circle" | "arrow" | "star";

export type BlockStyle = {
  color: string;
  fontSize: string;
  fontFamily: string;
  align: TextAlign;
  bold: boolean;
  italic: boolean;
};

export type ManualBlockType =
  | "text"
  | "floating-text"
  | "question"
  | "box"
  | "answer-lines"
  | "image"
  | "formula"
  | "bank-question"
  | "table"
  | "shape"
  | "divider"
  | "checkbox-question";

export type CheckboxOption = {
  label: string;
  checked: boolean;
};

export type ManualBlock = {
  id: string;
  type: ManualBlockType;
  html: string;
  answerLines: number;
  latex?: string;
  imageUrl?: string;
  label?: string;
  style?: BlockStyle;
  rows?: number;
  cols?: number;
  cells?: string[][];
  shape?: ShapeKind;
  /** موقعیت آزاد روی برگه (پیکسل) */
  x?: number;
  y?: number;
  page?: number;
  width?: number;
  height?: number;
  options?: CheckboxOption[];
  /** شمارهٔ سوال: undefined = خودکار، "" = بدون شماره، متن = شمارهٔ دلخواه */
  questionNumber?: string;
  /** نوع خطکشی (بلوک divider) */
  dividerKind?: QuestionDividerKind;
  /** بارم — تم آزمون مدارس */
  score?: number | null;
  /** فقط برای رفرنس — سوال کپی‌شده از بانک روی برگه */
  bankQuestionId?: string;
  /** متن/عنصر شناور روی برگه (تم آزمون مدارس) */
  isFloating?: boolean;
};

export type ManualLayout = {
  columns: 1 | 2;
  blocks: ManualBlock[];
};

export type DesignerDocument = {
  blocks: ManualBlock[];
  columns: 1 | 2;
  zoom: number;
  title: string;
  subject: string;
  grade: string;
  worksheetTheme?: import("../types").WorksheetTheme;
  titleFontSize?: string;
  questionStyle?: WorksheetQuestionStyle;
  /** تم standard — همگام با کاربرگ طراحی سریع */
  bismillah?: string;
  worksheetDate?: string;
  schoolName?: string;
  examDistrict?: string;
  examCity?: string;
  examDuration?: string;
  footerMessage?: string;
  headerVariant?: import("../exam-header-variant").ExamHeaderVariant;
  /** تم آسمان — خط‌کشی فضای پاسخ سوالات */
  answerRulingStyle?: import("../answer-ruling-style").AnswerRulingStyle;
};

export const STORAGE_KEY = "dastyar.manual-exam.v1";
export const TEMPLATE_KEY = "dastyar.manual-exam.template";

export const defaultBlockStyle = (): BlockStyle => ({
  color: "#111827",
  fontSize: "16px",
  fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
  align: "right",
  bold: false,
  italic: false,
});

export function createBlockId(): string {
  return crypto.randomUUID();
}

export function createTextBlock(): ManualBlock {
  return {
    id: createBlockId(),
    type: "text",
    html: "<p></p>",
    answerLines: 0,
    style: defaultBlockStyle(),
  };
}

/** متن شناور — موقعیت آزاد روی برگه آزمون مدارس */
export function createFloatingTextBlock(
  html = "<p>متن شناور</p>"
): ManualBlock {
  return {
    id: createBlockId(),
    type: "floating-text",
    html,
    answerLines: 0,
    isFloating: true,
    style: defaultBlockStyle(),
    width: 220,
    height: 56,
  };
}

/** پیش‌فرض تم آزمون مدارس — سوال دستی جدید */
export const SCHOOL_EXAM_DEFAULT_SCORE = 1;
export const SCHOOL_EXAM_DEFAULT_ANSWER_LINES = 4;
export const SCHOOL_EXAM_DEFAULT_QUESTION_TEXT =
  "متن سوال را اینجا بنویسید...";

export function createEmptyQuestionBlock(
  text = SCHOOL_EXAM_DEFAULT_QUESTION_TEXT
): ManualBlock {
  return {
    id: createBlockId(),
    type: "question",
    html: `<p>${text}</p>`,
    answerLines: 3,
    score: null,
    style: defaultBlockStyle(),
  };
}

/** سوال جدید روی برگه — با پیش‌فرض تم standard در صورت نیاز */
export function createSheetQuestionBlock(forStandardExam = false): ManualBlock {
  const block = createEmptyQuestionBlock(SCHOOL_EXAM_DEFAULT_QUESTION_TEXT);
  return {
    ...structuredClone(block),
    id: crypto.randomUUID(),
    answerLines: forStandardExam
      ? SCHOOL_EXAM_DEFAULT_ANSWER_LINES
      : block.answerLines,
    score: forStandardExam ? SCHOOL_EXAM_DEFAULT_SCORE : null,
  };
}

/** متن سؤال بانک → HTML امن برای برگه (کپی مستقل از بانک) */
export function sheetQuestionHtmlFromPlainText(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const withBreaks = escaped
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${line}</p>`)
    .join("");
  return withBreaks || "<p></p>";
}

/** نسخهٔ قابل‌ویرایش روی برگه — id جدید، بدون readonly */
export function createSheetQuestionFromBank(
  text: string,
  answerLines: number,
  bankQuestionId: string,
  style?: BlockStyle
): ManualBlock {
  const units = Math.max(0, Math.min(20, Math.round(answerLines)));
  const base = createEmptyQuestionBlock("");
  return {
    ...structuredClone(base),
    id: crypto.randomUUID(),
    type: "question",
    html: sheetQuestionHtmlFromPlainText(text),
    answerLines: units,
    score: null,
    questionNumber: "",
    bankQuestionId,
    style: style ?? base.style,
  };
}

/** سوالات قدیمی bank-question روی برگه → question (همچنان قابل ویرایش) */
export function normalizeSheetQuestionBlock(block: ManualBlock): ManualBlock {
  if (block.type !== "bank-question") return block;
  return { ...block, type: "question" };
}

export function createBoxBlock(): ManualBlock {
  return {
    id: createBlockId(),
    type: "box",
    html: "<p>متن داخل کادر...</p>",
    answerLines: 0,
    label: "کادر",
    style: defaultBlockStyle(),
  };
}

export function createAnswerLinesBlock(lines = 4): ManualBlock {
  return {
    id: createBlockId(),
    type: "answer-lines",
    html: "",
    answerLines: lines,
    label: "خطوط پاسخ",
    style: defaultBlockStyle(),
  };
}

export function createFormulaBlock(latex = "\\sum_{i=1}^{n} i"): ManualBlock {
  return {
    id: createBlockId(),
    type: "formula",
    html: "",
    answerLines: 0,
    latex,
    style: defaultBlockStyle(),
  };
}

export function createImageBlock(imageUrl = ""): ManualBlock {
  return {
    id: createBlockId(),
    type: "image",
    html: "",
    answerLines: 0,
    imageUrl,
    style: defaultBlockStyle(),
  };
}

export function createTableBlock(rows = 3, cols = 3): ManualBlock {
  const safeRows = Math.min(10, Math.max(2, rows));
  const safeCols = Math.min(10, Math.max(2, cols));
  const cells = Array.from({ length: safeRows }, (_, r) =>
    Array.from({ length: safeCols }, (_, c) =>
      r === 0 ? `ستون ${formatPersianNumber(c + 1)}` : ""
    )
  );
  return {
    id: createBlockId(),
    type: "table",
    html: "",
    answerLines: 0,
    label: "جدول",
    rows: safeRows,
    cols: safeCols,
    cells,
    style: defaultBlockStyle(),
  };
}

export function createShapeBlock(shape: ShapeKind): ManualBlock {
  return {
    id: createBlockId(),
    type: "shape",
    html: "",
    answerLines: 0,
    shape,
    width: shape === "line" ? 240 : 120,
    height: shape === "line" ? 8 : 80,
    style: defaultBlockStyle(),
  };
}

export function createDividerBlock(
  dividerKind: QuestionDividerKind = "dotted"
): ManualBlock {
  return {
    id: createBlockId(),
    type: "divider",
    html: "",
    answerLines: 0,
    dividerKind,
    style: defaultBlockStyle(),
  };
}

export function createCheckboxQuestionBlock(): ManualBlock {
  return {
    id: createBlockId(),
    type: "checkbox-question",
    html: "<p>درستی یا نادرستی عبارت زیر را مشخص کنید.</p>",
    answerLines: 0,
    score: null,
    options: [
      { label: "درست", checked: false },
      { label: "نادرست", checked: false },
    ],
    style: defaultBlockStyle(),
  };
}

export function createBankQuestionBlock(): ManualBlock {
  return {
    id: createBlockId(),
    type: "bank-question",
    html: "<p>سوال انتخاب‌شده از بانک سوالات اینجا نمایش داده می‌شود.</p>",
    answerLines: 2,
    score: null,
    label: "از بانک سوالات",
    style: defaultBlockStyle(),
  };
}

export function defaultManualLayout(): ManualLayout {
  return { columns: 1, blocks: [] };
}

export type ManualLayoutFingerprintContext = {
  theme?: WorksheetTheme;
  questionStyle?: WorksheetQuestionStyle;
};

/** کلید متنی برای مقادیر مؤثر روی ارتفاع / صفحه‌بندی — بدون وابستگی به رفرنس آرایه */
export function manualLayoutFingerprint(
  layout: ManualLayout,
  ctx?: ManualLayoutFingerprintContext
): string {
  const qs = ctx?.questionStyle;
  return JSON.stringify({
    theme: ctx?.theme,
    columns: layout.columns,
    questionStyle: qs
      ? {
          fontFamily: qs.fontFamily,
          fontSize: qs.fontSize,
          dividersBetweenQuestions: qs.dividersBetweenQuestions,
          questionDividerKind: qs.questionDividerKind,
        }
      : undefined,
    items: layout.blocks.map((b) => ({
      id: b.id,
      type: b.type,
      answerLines: b.answerLines,
      htmlLength: b.html?.length ?? 0,
      page: b.page ?? 0,
      x: b.x,
      y: b.y,
      width: b.width,
      height: b.height,
      score: b.score ?? null,
      optionsCount: b.options?.length ?? 0,
      styleFontSize: b.style?.fontSize,
      styleFontFamily: b.style?.fontFamily,
    })),
  });
}

/** جلوگیری از حلقهٔ sync والد↔فرزند (رفرنس یا fingerprint) */
export function manualLayoutsEqual(
  a: ManualLayout,
  b: ManualLayout,
  ctx?: ManualLayoutFingerprintContext
): boolean {
  if (a.columns !== b.columns) return false;
  if (a.blocks === b.blocks) return true;
  if (!ctx) return false;
  return manualLayoutFingerprint(a, ctx) === manualLayoutFingerprint(b, ctx);
}

export function blocksToQuestions(
  blocks: ManualBlock[]
): Array<{ id: string; text: string; answerLines: number }> {
  return blocksToWorksheetQuestions(blocks);
}

export function blocksToWorksheetQuestions(
  blocks: ManualBlock[]
): WorksheetQuestion[] {
  return blocks
    .filter(
      (b) =>
        b.type === "question" ||
        b.type === "bank-question" ||
        b.type === "checkbox-question"
    )
    .map((b) => ({
      id: b.id,
      text: htmlToPlainText(b.html),
      answerLines: b.answerLines,
      score: b.score ?? null,
    }));
}

export function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .trim();
}

export function cloneBlocks(blocks: ManualBlock[]): ManualBlock[] {
  return JSON.parse(JSON.stringify(blocks)) as ManualBlock[];
}
