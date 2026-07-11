"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  createLessonPlan,
  updateLessonPlan,
  deleteLessonPlan,
  type LessonPlanInput,
} from "./lesson-plans";

export type LessonPlanFormState = { error?: string } | undefined;

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}

function parseForm(formData: FormData): LessonPlanInput {
  return {
    title: String(formData.get("title") ?? "").trim(),
    subject: String(formData.get("subject") ?? "").trim(),
    grade: String(formData.get("grade") ?? "").trim(),
    duration: String(formData.get("duration") ?? "").trim(),
    objectives: String(formData.get("objectives") ?? "").trim(),
    materials: String(formData.get("materials") ?? "").trim(),
    method: String(formData.get("method") ?? "").trim(),
    evaluation: String(formData.get("evaluation") ?? "").trim(),
  };
}

export async function saveLessonPlanAction(
  _prevState: LessonPlanFormState,
  formData: FormData
): Promise<LessonPlanFormState> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  const input = parseForm(formData);

  if (input.title.length < 2) {
    return { error: "عنوان طرح درس را وارد کنید." };
  }

  if (id) {
    const updated = await updateLessonPlan(userId, id, input);
    if (!updated) return { error: "طرح درس یافت نشد." };
  } else {
    await createLessonPlan(userId, input);
  }

  revalidatePath("/lesson-plan");
  redirect("/lesson-plan");
}

export async function deleteLessonPlanAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    await deleteLessonPlan(userId, id);
    revalidatePath("/lesson-plan");
  }
}
