"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isValidHttpUrl, setContentPdfUrl } from "./content-pdfs";
import {
  isContentPdfKind,
  type ContentPdfKind,
} from "./content-pdf-kinds";

export type SavePdfLinkState = {
  ok: boolean;
  message: string;
};

export async function saveContentPdfLink(
  _prev: SavePdfLinkState,
  formData: FormData
): Promise<SavePdfLinkState> {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return { ok: false, message: "فقط ادمین می‌تواند لینک PDF را ذخیره کند." };
  }

  const kindRaw = String(formData.get("kind") ?? "");
  const itemId = String(formData.get("itemId") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();

  if (!isContentPdfKind(kindRaw) || !itemId) {
    return { ok: false, message: "اطلاعات درس نامعتبر است." };
  }

  if (url && !isValidHttpUrl(url)) {
    return {
      ok: false,
      message: "لینک باید با http یا https شروع شود.",
    };
  }

  try {
    await setContentPdfUrl(kindRaw, itemId, url || null);
  } catch {
    return {
      ok: false,
      message: "ذخیره لینک ممکن نشد. فضای ذخیره‌سازی را بررسی کنید.",
    };
  }

  const pathMap: Record<ContentPdfKind, string> = {
    worksheets: `/worksheets/${itemId}`,
    "question-bank": `/question-bank/${itemId}`,
    "lesson-plan": `/lesson-plan/${itemId}`,
  };

  revalidatePath(pathMap[kindRaw]);

  return {
    ok: true,
    message: url ? "لینک PDF ذخیره شد." : "لینک PDF حذف شد.",
  };
}
