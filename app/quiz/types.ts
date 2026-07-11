export type QuestionType = "multiple_choice" | "descriptive" | "matching";

export type MatchingPair = {
  id: string;
  left: string;
  right: string;
};

export type QuizQuestion = {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctOption?: number;
  pairs?: MatchingPair[];
};

export type Quiz = {
  id: string;
  userId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
};

export type QuizInput = {
  title: string;
  description: string;
  questions: QuizQuestion[];
};

export type QuizAnswer = {
  questionId: string;
  value: string;
};

export type QuizSubmission = {
  id: string;
  quizId: string;
  studentName: string;
  answers: QuizAnswer[];
  submittedAt: string;
  /** نمره دستی معلم برای سوالات تشریحی (questionId → نمره) */
  manualGrades?: Record<string, number>;
  gradedAt?: string;
};

export const questionTypeLabels: Record<QuestionType, string> = {
  multiple_choice: "چهارگزینه‌ای",
  descriptive: "تشریحی",
  matching: "وصل‌کردنی",
};

export const emptyQuestion = (type: QuestionType = "multiple_choice"): QuizQuestion => {
  const id = crypto.randomUUID();
  if (type === "multiple_choice") {
    return {
      id,
      type,
      text: "",
      options: ["", "", "", ""],
      correctOption: 0,
    };
  }
  if (type === "matching") {
    return {
      id,
      type,
      text: "",
      pairs: [
        { id: crypto.randomUUID(), left: "", right: "" },
        { id: crypto.randomUUID(), left: "", right: "" },
      ],
    };
  }
  return { id, type, text: "" };
};
