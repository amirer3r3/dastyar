export type PackageCategory =
  | "worksheets"
  | "lesson-plans"
  | "exams"
  | "other";

export const categoryLabels: Record<PackageCategory, string> = {
  worksheets: "کاربرگ",
  "lesson-plans": "طرح درس",
  exams: "آزمون",
  other: "سایر",
};

export type MarketplacePackage = {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  category: PackageCategory;
  price: number;
  coverEmoji: string;
  coverImage: string | null;
  fileName: string;
  filePath: string | null;
  rating: number;
  downloadCount: number;
  createdAt: string;
};

export type Purchase = {
  id: string;
  userId: string;
  packageId: string;
  amount: number;
  mode: "sandbox" | "gateway";
  purchasedAt: string;
};

export const PAYMENT_MODE =
  process.env.PAYMENT_MODE === "gateway" ? "gateway" : "sandbox";
