const PERSIAN = "۰۱۲۳۴۵۶۷۸۹";
const ENGLISH = "0123456789";
const ARABIC_INDIC = "٠١٢٣٤٥٦٧٨٩";

/** تبدیل رقم انگلیسی/عربی به فارسی (۰–۹) */
export function toPersianDigits(input: string | number): string {
  const s = String(input);
  return s
    .replace(/[0-9]/g, (d) => PERSIAN[ENGLISH.indexOf(d)] ?? d)
    .replace(/[٠-٩]/g, (d) => {
      const i = ARABIC_INDIC.indexOf(d);
      return i >= 0 ? PERSIAN[i]! : d;
    });
}

/** تبدیل رقم فارسی/عربی به انگلیسی (برای ذخیره، محاسبه، id) */
export function toEnglishDigits(input: string): string {
  return input
    .replace(/[۰-۹]/g, (c) => {
      const i = PERSIAN.indexOf(c);
      return i >= 0 ? ENGLISH[i]! : c;
    })
    .replace(/[٠-٩]/g, (c) => {
      const i = ARABIC_INDIC.indexOf(c);
      return i >= 0 ? ENGLISH[i]! : c;
    });
}

/** عدد با جداکنندهٔ هزارگان و ارقام فارسی */
export function formatPersianNumber(
  value: number,
  options?: { grouping?: boolean }
): string {
  const grouping = options?.grouping !== false;
  const raw = grouping
    ? Math.trunc(value).toLocaleString("en-US")
    : String(Math.trunc(value));
  return toPersianDigits(raw);
}

/** پارس عدد از ورودی با ارقام فارسی/عربی/لاتین */
export function parsePersianNumber(raw: string): number {
  const normalized = toEnglishDigits(raw).replace(/[^\d.-]/g, "");
  const n = parseInt(normalized, 10);
  return Number.isNaN(n) ? 0 : n;
}
