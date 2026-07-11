export type PlannerItemType = "class" | "homework" | "event";

export type PlannerItem = {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: PlannerItemType;
  dayOfWeek: number;
  weekStart: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
};

export type PlannerItemInput = Omit<
  PlannerItem,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export const plannerTypeLabels: Record<PlannerItemType, string> = {
  class: "ساعت تدریس",
  homework: "تکلیف",
  event: "رویداد کلاسی",
};

export const dayLabels = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
] as const;

export function formatWeekStart(date: Date): string {
  const saturday = getSaturdayOfWeek(date);
  return saturday.toISOString().slice(0, 10);
}

export function getSaturdayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const daysSinceSaturday = day === 6 ? 0 : day + 1;
  d.setDate(d.getDate() - daysSinceSaturday);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function formatWeekRange(weekStart: string): string {
  const start = new Date(weekStart + "T12:00:00");
  const end = new Date(weekStart + "T12:00:00");
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const startStr = start.toLocaleDateString("fa-IR", opts);
  const endStr = end.toLocaleDateString("fa-IR", {
    ...opts,
    year: "numeric",
  });
  return `${startStr} – ${endStr}`;
}
