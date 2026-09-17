export type ExamHeaderVariant = "standard" | "minimal" | "minimal-free";

export const EXAM_HEADER_VARIANTS: ExamHeaderVariant[] = [
  "standard",
  "minimal",
  "minimal-free",
];

export const EXAM_HEADER_VARIANT_LABELS: Record<ExamHeaderVariant, string> = {
  standard: "سربرگ رسمی",
  minimal: "مینیمال (جدول)",
  "minimal-free": "مینیمال آزاد",
};

export const EXAM_HEADER_VARIANT_SHORT_LABELS: Record<
  ExamHeaderVariant,
  string
> = {
  standard: "رسمی",
  minimal: "مینیمال",
  "minimal-free": "آزاد",
};

export function normalizeExamHeaderVariant(
  value: unknown
): ExamHeaderVariant {
  if (value === "minimal-free") return "minimal-free";
  if (value === "minimal") return "minimal";
  return "standard";
}

export function usesMinimalExamHeader(variant: ExamHeaderVariant): boolean {
  return variant === "minimal" || variant === "minimal-free";
}

export function usesStandardExamTableLayout(
  variant: ExamHeaderVariant
): boolean {
  return variant === "standard" || variant === "minimal";
}

export function nextExamHeaderVariant(
  current: ExamHeaderVariant
): ExamHeaderVariant {
  const idx = EXAM_HEADER_VARIANTS.indexOf(current);
  return EXAM_HEADER_VARIANTS[(idx + 1) % EXAM_HEADER_VARIANTS.length]!;
}

export function prevExamHeaderVariant(
  current: ExamHeaderVariant
): ExamHeaderVariant {
  const idx = EXAM_HEADER_VARIANTS.indexOf(current);
  return EXAM_HEADER_VARIANTS[
    (idx - 1 + EXAM_HEADER_VARIANTS.length) % EXAM_HEADER_VARIANTS.length
  ]!;
}

/** ارتفاع تقریبی سربرگ (px) برای صفحه‌بندی */
export function standardExamHeaderHeightPx(
  variant: ExamHeaderVariant
): number {
  return usesMinimalExamHeader(variant) ? 168 : 118;
}
