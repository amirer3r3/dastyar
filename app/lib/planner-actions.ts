"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { PlannerItemInput, PlannerItemType } from "@/app/planner/types";
import {
  createPlannerItem,
  updatePlannerItem,
  deletePlannerItem,
} from "./planner";

export type PlannerFormState = { error?: string } | undefined;

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}

function parseForm(formData: FormData): PlannerItemInput {
  const type = String(formData.get("type") ?? "class") as PlannerItemType;
  const dayOfWeek = Number(formData.get("dayOfWeek") ?? 0);
  const weekStart = String(formData.get("weekStart") ?? "").trim();

  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    type: ["class", "homework", "event"].includes(type) ? type : "class",
    dayOfWeek: Number.isFinite(dayOfWeek) && dayOfWeek >= 0 && dayOfWeek <= 6
      ? dayOfWeek
      : 0,
    weekStart,
    startTime: String(formData.get("startTime") ?? "").trim(),
    endTime: String(formData.get("endTime") ?? "").trim(),
  };
}

export async function savePlannerItemAction(
  _prevState: PlannerFormState,
  formData: FormData
): Promise<PlannerFormState> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  const input = parseForm(formData);

  if (input.title.length < 2) {
    return { error: "عنوان را وارد کنید." };
  }
  if (!input.weekStart) {
    return { error: "هفته مشخص نیست." };
  }

  if (id) {
    const updated = await updatePlannerItem(userId, id, input);
    if (!updated) return { error: "آیتم یافت نشد." };
  } else {
    await createPlannerItem(userId, input);
  }

  revalidatePath("/planner");
  return undefined;
}

export async function deletePlannerItemAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "").trim();
  if (id) {
    await deletePlannerItem(userId, id);
    revalidatePath("/planner");
  }
}
