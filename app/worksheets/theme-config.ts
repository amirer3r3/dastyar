import type { WorksheetTheme } from "./types";

export type WorksheetThemeOption = {
  id: WorksheetTheme;
  label: string;
  hint: string;
  emoji?: string;
  previewSrc?: string;
  activeClass: string;
};

export const worksheetThemeOptions: WorksheetThemeOption[] = [
  {
    id: "standard",
    label: "آزمون مدارس",
    hint: "فرم استاندارد",
    emoji: "🏫",
    activeClass: "border-slate-700 bg-slate-50 font-bold text-slate-800",
  },
  {
    id: "cartoon",
    label: "کارتونی",
    hint: "ابتدایی",
    previewSrc: "/worksheets/themes/car1.svg",
    activeClass: "border-pink-500 bg-pink-50 font-bold text-pink-600",
  },
  {
    id: "floral",
    label: "گل و برگ",
    hint: "تم طراحی‌شده",
    previewSrc: "/worksheets/themes/floral.webp",
    activeClass: "border-emerald-500 bg-emerald-50 font-bold text-emerald-700",
  },
  {
    id: "asman",
    label: "آسمان",
    hint: "تم گرافیکی",
    previewSrc: "/themes/asman1.svg",
    activeClass: "border-sky-500 bg-sky-50 font-bold text-sky-700",
  },
];
