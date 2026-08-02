export type BankQuestion = {
  id: string;
  text: string;
  answerLines: number;
  grade: string;
  subject: string;
};

/** نمونه سوالات آماده برای انتخاب در طراحی کاربرگ */
export const sampleBankQuestions: BankQuestion[] = [
  {
    id: "bq-1",
    text: "حاصل جمع ۱۲ + ۲۵ چند می‌شود؟",
    answerLines: 2,
    grade: "پایه سوم",
    subject: "ریاضی",
  },
  {
    id: "bq-2",
    text: "یک مثال از عدد زوج بنویسید.",
    answerLines: 2,
    grade: "پایه سوم",
    subject: "ریاضی",
  },
  {
    id: "bq-3",
    text: "عدد ۴۵۷ را به حروف بنویسید.",
    answerLines: 2,
    grade: "پایه سوم",
    subject: "ریاضی",
  },
  {
    id: "bq-4",
    text: "محیط یک مربع به ضلع ۵ سانتی‌متر چقدر است؟",
    answerLines: 3,
    grade: "پایه سوم",
    subject: "ریاضی",
  },
  {
    id: "bq-5",
    text: "معنی واژه «کوشا» چیست؟",
    answerLines: 2,
    grade: "پایه دوم",
    subject: "فارسی",
  },
  {
    id: "bq-6",
    text: "یک جمله با کلمه «مدرسه» بنویسید.",
    answerLines: 3,
    grade: "پایه دوم",
    subject: "فارسی",
  },
  {
    id: "bq-7",
    text: "آب در چه دمایی به جوش می‌آید؟",
    answerLines: 2,
    grade: "پایه چهارم",
    subject: "علوم",
  },
  {
    id: "bq-8",
    text: "سه حالت ماده را نام ببرید.",
    answerLines: 3,
    grade: "پایه چهارم",
    subject: "علوم",
  },
  {
    id: "bq-9",
    text: "حاصل ضرب ۷ × ۸ چند است؟",
    answerLines: 2,
    grade: "پایه چهارم",
    subject: "ریاضی",
  },
  {
    id: "bq-10",
    text: "یک کسر بزرگ‌تر از ۱/۲ بنویسید.",
    answerLines: 2,
    grade: "پایه پنجم",
    subject: "ریاضی",
  },
];

export const bankGrades = [
  "پایه اول",
  "پایه دوم",
  "پایه سوم",
  "پایه چهارم",
  "پایه پنجم",
  "پایه ششم",
];

export const bankSubjects = [
  "ریاضی",
  "فارسی",
  "علوم",
  "قرآن",
  "هدیه‌ها",
  "مطالعات اجتماعی",
];

export function filterBankQuestions(
  grade: string,
  subject: string
): BankQuestion[] {
  return sampleBankQuestions.filter(
    (q) => q.grade === grade && q.subject === subject
  );
}
