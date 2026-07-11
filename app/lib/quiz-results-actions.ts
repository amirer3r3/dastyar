"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getQuiz, updateSubmissionGrades } from "./quizzes";
import { DESCRIPTIVE_MAX } from "./quiz-grading";

export type GradeFormState = { error?: string; success?: string } | undefined;

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}

export async function gradeSubmissionAction(
  _prevState: GradeFormState,
  formData: FormData
): Promise<GradeFormState> {
  const userId = await requireUserId();
  const quizId = String(formData.get("quizId") ?? "").trim();
  const submissionId = String(formData.get("submissionId") ?? "").trim();
  const gradesRaw = String(formData.get("grades") ?? "{}");

  const quiz = await getQuiz(userId, quizId);
  if (!quiz) return { error: "آزمون یافت نشد." };

  let grades: Record<string, number>;
  try {
    grades = JSON.parse(gradesRaw);
  } catch {
    return { error: "خطا در ثبت نمرات." };
  }

  for (const [qId, score] of Object.entries(grades)) {
    const num = Number(score);
    if (Number.isNaN(num) || num < 0 || num > DESCRIPTIVE_MAX) {
      return { error: `نمره باید بین ۰ تا ${DESCRIPTIVE_MAX} باشد.` };
    }
    const question = quiz.questions.find((q) => q.id === qId);
    if (!question || question.type !== "descriptive") {
      return { error: "نمره فقط برای سوالات تشریحی مجاز است." };
    }
    grades[qId] = num;
  }

  const updated = await updateSubmissionGrades(quizId, submissionId, grades);
  if (!updated) return { error: "پاسخ دانش‌آموز یافت نشد." };

  revalidatePath(`/quiz/${quizId}/results`);
  return { success: "نمرات با موفقیت ثبت شد." };
}
