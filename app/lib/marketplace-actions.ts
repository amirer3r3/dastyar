"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import { auth } from "@/auth";
import {
  createPackage,
  getPackage,
  hasPurchased,
  recordPurchase,
  UPLOADS_DIR,
} from "./marketplace";
import { PAYMENT_MODE } from "@/app/marketplace/types";
import type { PackageCategory } from "@/app/marketplace/types";

export type MarketplaceFormState = { error?: string; success?: string } | undefined;

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session.user.id;
}

export async function uploadPackageAction(
  _prevState: MarketplaceFormState,
  formData: FormData
): Promise<MarketplaceFormState> {
  const userId = await requireUserId();
  const session = await auth();
  const sellerName = session?.user?.name ?? "معلم";

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "other") as PackageCategory;
  const price = Number(formData.get("price") ?? 0);
  const coverEmoji = String(formData.get("coverEmoji") ?? "📦").trim();
  const file = formData.get("file") as File | null;
  const cover = formData.get("cover") as File | null;

  if (title.length < 3) return { error: "عنوان باید حداقل ۳ حرف باشد." };
  if (description.length < 10) {
    return { error: "توضیحات باید حداقل ۱۰ حرف باشد." };
  }
  if (Number.isNaN(price) || price < 0) {
    return { error: "قیمت نامعتبر است." };
  }
  if (!file || file.size === 0) {
    return { error: "فایل پکیج را انتخاب کنید." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { error: "حداکثر حجم فایل ۱۰ مگابایت است." };
  }

  const allowed = [
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
  ];
  if (!allowed.includes(file.type) && !file.name.endsWith(".pdf") && !file.name.endsWith(".zip")) {
    return { error: "فقط فایل PDF یا ZIP مجاز است." };
  }

  const pkgId = crypto.randomUUID();
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const safeName = file.name.replace(/[^a-zA-Z0-9._\-\u0600-\u06FF]/g, "_");
  const storedName = `${pkgId}-${safeName}`;
  const filePath = path.join(UPLOADS_DIR, storedName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  let coverImage: string | null = null;
  if (cover && cover.size > 0) {
    if (cover.size > 2 * 1024 * 1024) {
      return { error: "حداکثر حجم تصویر جلد ۲ مگابایت است." };
    }
    const coverTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
    ];
    const coverExt = cover.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const validExt = ["jpg", "jpeg", "png", "webp", "svg"].includes(coverExt);
    if (!coverTypes.includes(cover.type) && !validExt) {
      return { error: "فرمت تصویر جلد باید JPG، PNG، WebP یا SVG باشد." };
    }
    const ext = coverExt === "jpeg" ? "jpg" : coverExt;
    const coverStoredName = `${pkgId}-cover.${ext}`;
    const coverBuffer = Buffer.from(await cover.arrayBuffer());
    await fs.writeFile(path.join(UPLOADS_DIR, coverStoredName), coverBuffer);
    coverImage = `/api/marketplace/cover/${coverStoredName}`;
  }

  await createPackage({
    sellerId: userId,
    sellerName,
    title,
    description,
    category,
    price,
    coverEmoji: coverEmoji || "📦",
    coverImage,
    fileName: file.name,
    filePath: storedName,
  });

  revalidatePath("/marketplace");
  redirect("/marketplace");
}

export async function purchasePackageAction(
  _prevState: MarketplaceFormState,
  formData: FormData
): Promise<MarketplaceFormState> {
  const userId = await requireUserId();
  const packageId = String(formData.get("packageId") ?? "").trim();

  const pkg = await getPackage(packageId);
  if (!pkg) return { error: "پکیج یافت نشد." };

  if (await hasPurchased(userId, packageId)) {
    return { success: "already_owned" };
  }

  if (pkg.price === 0) {
    await recordPurchase(userId, packageId, 0, "sandbox");
    revalidatePath(`/marketplace/${packageId}`);
    return { success: "purchased" };
  }

  if (PAYMENT_MODE === "gateway") {
    // TODO: اتصال به زرین‌پال / آیدی‌پی
    return {
      error:
        "درگاه پرداخت هنوز پیکربندی نشده. PAYMENT_MODE را در .env.local تنظیم کنید.",
    };
  }

  // حالت آزمایشی: خرید بدون پرداخت واقعی
  await recordPurchase(userId, packageId, pkg.price, "sandbox");
  revalidatePath(`/marketplace/${packageId}`);
  return { success: "purchased" };
}
