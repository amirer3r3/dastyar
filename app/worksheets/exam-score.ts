import { toEnglishDigits, toPersianDigits } from "@/app/lib/persian-digits";

/** نرمال‌سازی بارم از state قدیمی (رشته) یا عدد */
export function normalizeQuestionScore(raw: unknown): number | null {
  if (raw == null || raw === "") return null;
  if (typeof raw === "number") {
    return Number.isFinite(raw) ? raw : null;
  }
  if (typeof raw === "string") {
    return parsePersianDecimal(raw);
  }
  return null;
}

/** پارس بارم با پشتیبانی اعشار (۰.۲۵ / 0.25) */
export function parsePersianDecimal(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const normalized = toEnglishDigits(trimmed)
    .replace(/,/g, ".")
    .replace(/[^\d.-]/g, "");
  if (!normalized || normalized === "-" || normalized === ".") return null;
  const n = parseFloat(normalized);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 1000) / 1000;
}

/** نمایش بارم در برگه / چاپ */
export function formatExamScore(score: number | null | undefined): string {
  if (score == null || !Number.isFinite(score)) return "";
  const s =
    Math.abs(score - Math.trunc(score)) < 1e-9
      ? String(Math.trunc(score))
      : String(score).replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.$/, "");
  return toPersianDigits(s);
}
