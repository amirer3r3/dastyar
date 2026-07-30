export type ContentPdfKind = "worksheets" | "question-bank" | "lesson-plan";

export const contentPdfKinds: ContentPdfKind[] = [
  "worksheets",
  "question-bank",
  "lesson-plan",
];

export function isContentPdfKind(value: string): value is ContentPdfKind {
  return (contentPdfKinds as string[]).includes(value);
}
