"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  createSubmission,
  getQuizById,
} from "./quizzes";
import type { QuizQuestion } from "@/app/quiz/types";

export type QuizFormState = { error?: string; success?: string } | undefined;

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}

function parseQuestions(raw: string): QuizQuestion[] {
  try {
    return JSON.parse(raw) as QuizQuestion[];
  } catch {
    return [];
  }
}

export async function saveQuizAction(
  _prevState: QuizFormState,
  formData: FormData
): Promise<QuizFormState> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const questions = parseQuestions(String(formData.get("questions") ?? "[]"));

  if (title.length < 2) {
    return { error: "عنوان آزمون را وارد کنید." };
  }
  if (questions.length === 0) {
    return { error: "حداقل یک سوال اضافه کنید." };
  }

  for (const q of questions) {
    if (!q.text.trim()) {
      return { error: "متن همه سوالات را کامل کنید." };
    }
    if (q.type === "multiple_choice") {
      const filled = (q.options ?? []).filter((o) => o.trim()).length;
      if (filled < 2) {
        return { error: "هر سوال چهارگزینه‌ای حداقل ۲ گزینه نیاز دارد." };
      }
    }
    if (q.type === "matching") {
      const valid = (q.pairs ?? []).filter(
        (p) => p.left.trim() && p.right.trim()
      ).length;
      if (valid < 2) {
        return { error: "هر سوال وصل‌کردنی حداقل ۲ جفت نیاز دارد." };
      }
    }
  }

  if (id) {
    const updated = await updateQuiz(userId, id, {
      title,
      description,
      questions,
    });
    if (!updated) return { error: "آزمون یافت نشد." };
  } else {
    await createQuiz(userId, { title, description, questions });
  }

  revalidatePath("/quiz");
  redirect("/quiz");
}

export async function deleteQuizAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    await deleteQuiz(userId, id);
    revalidatePath("/quiz");
  }
}

export async function submitQuizAction(
  _prevState: QuizFormState,
  formData: FormData
): Promise<QuizFormState> {
  const quizId = String(formData.get("quizId") ?? "").trim();
  const studentName = String(formData.get("studentName") ?? "").trim();
  const answersRaw = String(formData.get("answers") ?? "[]");

  if (!quizId) return { error: "آزمون نامعتبر است." };
  if (studentName.length < 2) {
    return { error: "نام خود را وارد کنید." };
  }

  const quiz = await getQuizById(quizId);
  if (!quiz) return { error: "آزمون یافت نشد یا حذف شده است." };

  let answers: { questionId: string; value: string }[];
  try {
    answers = JSON.parse(answersRaw);
  } catch {
    return { error: "خطا در ارسال پاسخ‌ها." };
  }

  if (answers.length < quiz.questions.length) {
    return { error: "لطفاً به همه سوالات پاسخ دهید." };
  }

  await createSubmission(quizId, studentName, answers);
  return { success: "پاسخ‌های شما با موفقیت ثبت شد!" };
}
