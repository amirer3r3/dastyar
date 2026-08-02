export type ManualBlockType =
  | "question"
  | "box"
  | "answer-lines"
  | "image"
  | "formula"
  | "bank-question";

export type ManualBlock = {
  id: string;
  type: ManualBlockType;
  /** HTML content for rich-text / question / box */
  html: string;
  /** خطوط پاسخ زیر بلاک سوال */
  answerLines: number;
  /** LaTeX خام برای بلاک فرمول */
  latex?: string;
  /** آدرس تصویر */
  imageUrl?: string;
  /** برچسب اختیاری */
  label?: string;
};

export type ManualLayout = {
  columns: 1 | 2;
  blocks: ManualBlock[];
};

export function createBlockId(): string {
  return crypto.randomUUID();
}

export function createEmptyQuestionBlock(
  text = "متن سوال را اینجا بنویسید..."
): ManualBlock {
  return {
    id: createBlockId(),
    type: "question",
    html: `<p>${text}</p>`,
    answerLines: 3,
  };
}

export function createBoxBlock(): ManualBlock {
  return {
    id: createBlockId(),
    type: "box",
    html: "<p>متن داخل کادر...</p>",
    answerLines: 0,
    label: "کادر",
  };
}

export function createAnswerLinesBlock(lines = 4): ManualBlock {
  return {
    id: createBlockId(),
    type: "answer-lines",
    html: "",
    answerLines: lines,
    label: "خطوط پاسخ",
  };
}

export function createFormulaBlock(latex = "\\sum_{i=1}^{n} i"): ManualBlock {
  return {
    id: createBlockId(),
    type: "formula",
    html: "",
    answerLines: 0,
    latex,
  };
}

export function createImageBlock(imageUrl = ""): ManualBlock {
  return {
    id: createBlockId(),
    type: "image",
    html: "",
    answerLines: 0,
    imageUrl,
  };
}

export function createBankQuestionBlock(): ManualBlock {
  return {
    id: createBlockId(),
    type: "bank-question",
    html: "<p>سوال انتخاب‌شده از بانک سوالات اینجا نمایش داده می‌شود.</p>",
    answerLines: 2,
    label: "از بانک سوالات",
  };
}

export function defaultManualLayout(): ManualLayout {
  return {
    columns: 1,
    blocks: [
      createEmptyQuestionBlock("حاصل جمع ۱۲ + ۲۵ چند می‌شود؟"),
      createEmptyQuestionBlock("یک مثال از عدد زوج بنویسید."),
    ],
  };
}

/** همگام‌سازی بلاک‌ها با آرایه سوالات قدیمی برای پیش‌نمایش/PDF */
export function blocksToQuestions(
  blocks: ManualBlock[]
): Array<{ id: string; text: string; answerLines: number }> {
  return blocks
    .filter((b) => b.type === "question" || b.type === "bank-question")
    .map((b) => ({
      id: b.id,
      text: htmlToPlainText(b.html),
      answerLines: b.answerLines,
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
