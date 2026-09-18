import {
  defaultQuestionStyle,
  type WorksheetQuestionStyle,
} from "./question-style";
import {
  normalizeAnswerRulingStyle,
  type AnswerRulingStyle,
} from "./answer-ruling-style";
import { normalizeQuestionScore } from "./exam-score";
import {
  normalizeExamHeaderVariant,
  type ExamHeaderVariant,
} from "./exam-header-variant";

export type WorksheetTheme =
  | "formal"
  | "cartoon"
  | "floral"
  | "standard"
  | "asman";
export type { ExamHeaderVariant };

export type WorksheetQuestion = {
  id: string;
  text: string;
  /** واحد فضای خالی پاسخ (بدون خط) */
  answerLines: number;
  /** اگر از بانک «طراحی سریع» اضافه شده */
  bankQuestionId?: string;
  /** بارم (تم آزمون مدارس) */
  score: number | null;
};

export type WorksheetData = {
  /** متن بالای کاربرگ، مثلاً «به نام خدا» */
  bismillah: string;
  title: string;
  /** اندازه متن عنوان (تم کارتونی و سایر تم‌ها) */
  titleFontSize: string;
  subject: string;
  grade: string;
  teacherName: string;
  worksheetDate: string;
  /** تم standard — نام مدرسه */
  schoolName: string;
  /** تم standard — ناحیه */
  examDistrict: string;
  /** تم standard — شهرستان */
  examCity: string;
  /** تم standard — زمان پاسخ‌دهی (سربرگ مینیمال)، مثلاً «۹۰ دقیقه» */
  examDuration: string;
  /** تم standard — پیام پایانی برگه (پاورقی) */
  footerMessage: string;
  instructions: string;
  theme: WorksheetTheme;
  /** تم آزمون مدارس — قالب برگه (سربرگ + چیدمان سوالات) */
  headerVariant: ExamHeaderVariant;
  questions: WorksheetQuestion[];
  questionStyle: WorksheetQuestionStyle;
  /** تم آسمان — نوع خط‌کشی زیر سوالات (چاپ / طراحی سریع) */
  answerRulingStyle: AnswerRulingStyle;
};

export type { AnswerRulingStyle };

export type { WorksheetQuestionStyle };

export const emptyQuestion = (): WorksheetQuestion => ({
  id: crypto.randomUUID(),
  text: "",
  answerLines: 3,
  score: null,
});

export const defaultWorksheet = (): WorksheetData => ({
  bismillah: "به نام خدا",
  title: "کاربرگ ریاضی",
  titleFontSize: "18px",
  subject: "ریاضی",
  grade: "پایه سوم",
  teacherName: "",
  worksheetDate: "",
  schoolName: "",
  examDistrict: "",
  examCity: "",
  examDuration: "",
  footerMessage: "موفق و سربلند باشید",
  instructions: "به سوالات زیر با دقت پاسخ دهید.",
  theme: "standard",
  headerVariant: "standard",
  questionStyle: defaultQuestionStyle(),
  answerRulingStyle: "none",
  questions: [],
});

/** state قدیمی یا ناقص را با پیش‌فرض‌ها یکی می‌کند (برای inputهای controlled) */
export function normalizeWorksheetData(
  partial: Partial<WorksheetData> | WorksheetData
): WorksheetData {
  const base = defaultWorksheet();
  return {
    ...base,
    ...partial,
    bismillah: partial.bismillah ?? base.bismillah,
    title: partial.title ?? base.title,
    titleFontSize: partial.titleFontSize ?? base.titleFontSize,
    subject: partial.subject ?? base.subject,
    grade: partial.grade ?? base.grade,
    teacherName: partial.teacherName ?? base.teacherName,
    worksheetDate: partial.worksheetDate ?? base.worksheetDate,
    schoolName: partial.schoolName ?? base.schoolName,
    examDistrict: partial.examDistrict ?? base.examDistrict,
    examCity: partial.examCity ?? base.examCity,
    examDuration: partial.examDuration ?? base.examDuration,
    footerMessage: partial.footerMessage ?? base.footerMessage,
    instructions: partial.instructions ?? base.instructions,
    theme: partial.theme ?? base.theme,
    headerVariant: normalizeExamHeaderVariant(
      partial.headerVariant ?? base.headerVariant
    ),
    questionStyle: {
      ...base.questionStyle,
      ...partial.questionStyle,
    },
    answerRulingStyle: normalizeAnswerRulingStyle(
      partial.answerRulingStyle ?? base.answerRulingStyle
    ),
    questions: (partial.questions ?? base.questions).map((q) => ({
      ...q,
      score: normalizeQuestionScore(
        (q as { score?: unknown }).score
      ),
    })),
  };
}
