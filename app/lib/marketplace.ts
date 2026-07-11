import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type {
  MarketplacePackage,
  PackageCategory,
  Purchase,
} from "@/app/marketplace/types";

const DATA_DIR = path.join(process.cwd(), "data");
const PACKAGES_FILE = path.join(DATA_DIR, "marketplace-packages.json");
const PURCHASES_FILE = path.join(DATA_DIR, "purchases.json");
export const UPLOADS_DIR = path.join(DATA_DIR, "marketplace-uploads");

const SEED_PACKAGES: MarketplacePackage[] = [
  {
    id: "seed-1",
    sellerId: "system",
    sellerName: "دستیار معلم",
    title: "پکیج کاربرگ ریاضی پایه سوم",
    description:
      "شامل ۲۰ کاربرگ آماده ریاضی با موضوعات جمع، تفریق، ضرب و مسئله‌نویسی.",
    category: "worksheets",
    price: 0,
    coverEmoji: "📐",
    coverImage: "/marketplace/covers/math-worksheets.svg",
    fileName: "math-grade3-worksheets.pdf",
    filePath: null,
    rating: 4.8,
    downloadCount: 124,
    createdAt: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "seed-2",
    sellerId: "system",
    sellerName: "دستیار معلم",
    title: "پکیج طرح درس علوم پایه چهارم",
    description: "۱۰ طرح درس کامل علوم تجربی با اهداف، روش تدریس و ارزشیابی.",
    category: "lesson-plans",
    price: 45000,
    coverEmoji: "🔬",
    coverImage: "/marketplace/covers/science-lessons.svg",
    fileName: "science-grade4-lessons.zip",
    filePath: null,
    rating: 4.6,
    downloadCount: 87,
    createdAt: "2026-01-20T10:00:00.000Z",
  },
  {
    id: "seed-3",
    sellerId: "system",
    sellerName: "معلم نمونه",
    title: "بانک سوال ریاضی پایه پنجم",
    description: "۵۰ نمونه سوال تستی و تشریحی با پاسخنامه.",
    category: "exams",
    price: 35000,
    coverEmoji: "📝",
    coverImage: "/marketplace/covers/math-exams.svg",
    fileName: "math-grade5-questions.pdf",
    filePath: null,
    rating: 4.5,
    downloadCount: 56,
    createdAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "seed-4",
    sellerId: "system",
    sellerName: "دستیار معلم",
    title: "کاربرگ‌های فانتزی فارسی",
    description: "۱۵ کاربرگ با طرح کارتونی برای تقویت مهارت‌های زبانی.",
    category: "worksheets",
    price: 0,
    coverEmoji: "🎨",
    coverImage: "/marketplace/covers/farsi-worksheets.svg",
    fileName: "farsi-fun-worksheets.pdf",
    filePath: null,
    rating: 4.9,
    downloadCount: 203,
    createdAt: "2026-02-10T10:00:00.000Z",
  },
];

async function readPackages(): Promise<MarketplacePackage[]> {
  try {
    const raw = await fs.readFile(PACKAGES_FILE, "utf-8");
    const parsed = JSON.parse(raw) as MarketplacePackage[];
    return parsed.map((pkg) => ({
      ...pkg,
      coverImage: pkg.coverImage ?? null,
    }));
  } catch {
    return [...SEED_PACKAGES];
  }
}

async function writePackages(packages: MarketplacePackage[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(PACKAGES_FILE, JSON.stringify(packages, null, 2), "utf-8");
}

async function readPurchases(): Promise<Purchase[]> {
  try {
    const raw = await fs.readFile(PURCHASES_FILE, "utf-8");
    return JSON.parse(raw) as Purchase[];
  } catch {
    return [];
  }
}

async function writePurchases(purchases: Purchase[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(PURCHASES_FILE, JSON.stringify(purchases, null, 2), "utf-8");
}

export async function getPackages(
  category?: PackageCategory
): Promise<MarketplacePackage[]> {
  const all = await readPackages();
  const filtered = category ? all.filter((p) => p.category === category) : all;
  return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPackage(
  id: string
): Promise<MarketplacePackage | undefined> {
  const all = await readPackages();
  return all.find((p) => p.id === id);
}

export async function createPackage(
  input: Omit<
    MarketplacePackage,
    "id" | "rating" | "downloadCount" | "createdAt"
  >
): Promise<MarketplacePackage> {
  const all = await readPackages();
  const pkg: MarketplacePackage = {
    id: crypto.randomUUID(),
    ...input,
    rating: 0,
    downloadCount: 0,
    createdAt: new Date().toISOString(),
  };
  all.push(pkg);
  await writePackages(all);
  return pkg;
}

export async function hasPurchased(
  userId: string,
  packageId: string
): Promise<boolean> {
  const pkg = await getPackage(packageId);
  if (!pkg) return false;
  if (pkg.price === 0) return true;

  const purchases = await readPurchases();
  return purchases.some(
    (p) => p.userId === userId && p.packageId === packageId
  );
}

export async function recordPurchase(
  userId: string,
  packageId: string,
  amount: number,
  mode: "sandbox" | "gateway"
): Promise<Purchase> {
  const purchases = await readPurchases();
  const existing = purchases.find(
    (p) => p.userId === userId && p.packageId === packageId
  );
  if (existing) return existing;

  const purchase: Purchase = {
    id: crypto.randomUUID(),
    userId,
    packageId,
    amount,
    mode,
    purchasedAt: new Date().toISOString(),
  };
  purchases.push(purchase);
  await writePurchases(purchases);
  return purchase;
}

export async function incrementDownload(packageId: string): Promise<void> {
  const all = await readPackages();
  const index = all.findIndex((p) => p.id === packageId);
  if (index === -1) return;
  all[index].downloadCount += 1;
  await writePackages(all);
}

export async function getUserPurchases(userId: string): Promise<Purchase[]> {
  const purchases = await readPurchases();
  return purchases.filter((p) => p.userId === userId);
}
