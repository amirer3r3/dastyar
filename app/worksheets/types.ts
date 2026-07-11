export type WorksheetTheme = "formal" | "cartoon";

export type WorksheetQuestion = {
  id: string;
  text: string;
  answerLines: number;
};

export type WorksheetData = {
  title: string;
  subject: string;
  grade: string;
  teacher: string;
  instructions: string;
  theme: WorksheetTheme;
  questions: WorksheetQuestion[];
};

export const emptyQuestion = (): WorksheetQuestion => ({
  id: crypto.randomUUID(),
  text: "",
  answerLines: 3,
});

export const defaultWorksheet = (): WorksheetData => ({
  title: "کاربرگ ریاضی",
  subject: "ریاضی",
  grade: "پایه سوم",
  teacher: "",
  instructions: "به سوالات زیر با دقت پاسخ دهید.",
  theme: "formal",
  questions: [
    { id: crypto.randomUUID(), text: "حاصل جمع ۱۲ + ۲۵ چند می‌شود؟", answerLines: 2 },
    { id: crypto.randomUUID(), text: "یک مثال از عدد زوج بنویسید.", answerLines: 2 },
  ],
});
