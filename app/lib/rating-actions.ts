"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { setRating } from "./ratings";
import type { RatingTarget } from "./ratings";

export type RatingFormState = { error?: string; success?: string } | undefined;

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}

export async function rateItemAction(
  _prevState: RatingFormState,
  formData: FormData
): Promise<RatingFormState> {
  const userId = await requireUserId();
  const targetType = String(formData.get("targetType") ?? "") as RatingTarget;
  const targetId = String(formData.get("targetId") ?? "").trim();
  const score = Number(formData.get("score") ?? 0);

  if (targetType !== "package" && targetType !== "audiobook") {
    return { error: "نوع نامعتبر." };
  }
  if (!targetId) return { error: "آیتم نامعتبر." };
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    return { error: "امتیاز باید بین ۱ تا ۵ باشد." };
  }

  await setRating(userId, targetType, targetId, score);

  if (targetType === "package") {
    revalidatePath("/marketplace");
    revalidatePath(`/marketplace/${targetId}`);
  } else {
    revalidatePath("/marketplace");
    revalidatePath(`/marketplace/audiobooks/${targetId}`);
  }

  return { success: "امتیاز شما ثبت شد." };
}
