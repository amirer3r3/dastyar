"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  createStudent,
  updateStudent,
  deleteStudent,
  type StudentInput,
} from "./students";

export type ClassFormState = { error?: string } | undefined;

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}

function parseGrade(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value < 0 || value > 20) return null;
  return Math.round(value * 10) / 10;
}

function parseForm(formData: FormData): StudentInput {
  return {
    name: String(formData.get("name") ?? "").trim(),
    grade: String(formData.get("grade") ?? "").trim(),
    studentNumber: String(formData.get("studentNumber") ?? "").trim(),
    finalGrade: parseGrade(String(formData.get("finalGrade") ?? "")),
    notes: String(formData.get("notes") ?? "").trim(),
  };
}

export async function saveStudentAction(
  _prevState: ClassFormState,
  formData: FormData
): Promise<ClassFormState> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  const input = parseForm(formData);

  if (input.name.length < 2) {
    return { error: "نام دانش‌آموز را وارد کنید." };
  }

  const rawGrade = String(formData.get("finalGrade") ?? "").trim();
  if (rawGrade && input.finalGrade === null) {
    return { error: "نمره باید بین ۰ تا ۲۰ باشد." };
  }

  if (id) {
    const updated = await updateStudent(userId, id, input);
    if (!updated) return { error: "دانش‌آموز یافت نشد." };
  } else {
    await createStudent(userId, input);
  }

  revalidatePath("/my-class");
  return undefined;
}

export async function deleteStudentAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    await deleteStudent(userId, id);
    revalidatePath("/my-class");
  }
}

export async function updateStudentGradeAction(
  formData: FormData
): Promise<ClassFormState> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  const grade = parseGrade(String(formData.get("finalGrade") ?? ""));

  if (!id) return { error: "شناسه نامعتبر است." };
  if (grade === null) return { error: "نمره باید بین ۰ تا ۲۰ باشد." };

  const { getStudent } = await import("./students");
  const existing = await getStudent(userId, id);
  if (!existing) return { error: "دانش‌آموز یافت نشد." };

  await updateStudent(userId, id, {
    name: existing.name,
    grade: existing.grade,
    studentNumber: existing.studentNumber,
    finalGrade: grade,
    notes: existing.notes,
  });

  revalidatePath("/my-class");
  return undefined;
}
