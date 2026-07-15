export type TeachingLevel =
  | "preschool"
  | "elementary"
  | "middle"
  | "high";

export const teachingLevelLabels: Record<TeachingLevel, string> = {
  preschool: "مربی پیش‌دبستانی",
  elementary: "آموزگار ابتدایی",
  middle: "دبیر متوسطه اول",
  high: "دبیر متوسطه دوم",
};

export const teachingLevelOptions = Object.entries(teachingLevelLabels) as [
  TeachingLevel,
  string,
][];

export function isTeachingLevel(value: string): value is TeachingLevel {
  return value in teachingLevelLabels;
}
