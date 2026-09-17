import {
  Home,
  Users,
  Plus,
  Store,
  CalendarDays,
  FileText,
  BookOpen,
  FileQuestion,
  ListOrdered,
  Award,
  Mic,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  primary?: boolean;
};

export const bottomNavItems: NavItem[] = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/my-class", label: "کلاس من", icon: Users },
  { href: "/create", label: "ایجاد", icon: Plus, primary: true },
  { href: "/marketplace", label: "بازارچه", icon: Store },
  { href: "/planner", label: "برنامه‌ریز", icon: CalendarDays },
];

export type ContentCard = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  /** گرادیان کارت‌های محتوای آموزشی: [شروع، پایان] */
  gradient?: [string, string];
  /** پس‌زمینه‌ی پاستلی آیکون در ابزارهای معلم */
  tint?: string;
};

export type TeacherTool = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** کلاس گرادیان Tailwind */
  gradientClass: string;
  variant: "tall" | "compact";
};

export const educationalContent: ContentCard[] = [
  {
    href: "/worksheets",
    title: "کاربرگ",
    description: "کاربرگ بر اساس پایه و درس",
    icon: FileText,
    color: "#4f6fe5",
    gradient: ["#5b7cfa", "#3b6fe0"],
  },
  {
    href: "/lesson-plan",
    title: "طرح درس",
    description: "طرح درس بر اساس پایه و درس",
    icon: BookOpen,
    color: "#16a34a",
    gradient: ["#34d399", "#16a34a"],
  },
  {
    href: "/question-bank",
    title: "نمونه سوال",
    description: "درس به درس و آزمون نهایی",
    icon: FileQuestion,
    color: "#f59e0b",
    gradient: ["#fbbf24", "#f97316"],
  },
  {
    href: "/step-by-step",
    title: "گام به گام",
    description: "حل مرحله‌ای",
    icon: ListOrdered,
    color: "#14b8a6",
    gradient: ["#2dd4bf", "#0d9488"],
  },
];

export const teacherTools: TeacherTool[] = [
  {
    href: "/worksheets/create",
    title: "طراحی کاربرگ و نمونه سوال",
    description: "ایجاد کاربرگ و سوالات امتحانی",
    icon: FileText,
    gradientClass: "bg-gradient-to-b from-[#6358DE] via-[#5651E5] to-[#4572EE]",
    variant: "tall",
  },
  {
    href: "/certificate",
    title: "تقدیرنامه و برچسب",
    description: "طراحی لوح تقدیر",
    icon: Award,
    gradientClass: "bg-gradient-to-r from-[#FF517A] to-[#FF8B4C]",
    variant: "compact",
  },
  {
    href: "/sound-meter",
    title: "صدا سنج کلاس",
    description: "ابزار سنجش و ضبط صدا",
    icon: Mic,
    gradientClass: "bg-gradient-to-r from-[#05C9B3] to-[#25D366]",
    variant: "compact",
  },
];
