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
  ClipboardList,
  Award,
  CalendarRange,
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
};

export const educationalContent: ContentCard[] = [
  {
    href: "/worksheets",
    title: "کاربرگ",
    description: "طراحی و خروجی PDF",
    icon: FileText,
    color: "#3b82f6",
  },
  {
    href: "/lesson-plan",
    title: "طرح درس",
    description: "فرمت‌های آماده",
    icon: BookOpen,
    color: "#16a34a",
  },
  {
    href: "/question-bank",
    title: "نمونه سوال",
    description: "بانک سوالات",
    icon: FileQuestion,
    color: "#f59e0b",
  },
  {
    href: "/step-by-step",
    title: "گام به گام",
    description: "حل مرحله‌ای",
    icon: ListOrdered,
    color: "#8b5cf6",
  },
];

export const teacherTools: ContentCard[] = [
  {
    href: "/quiz",
    title: "آزمون آنلاین",
    description: "ساخت و اشتراک‌گذاری آزمون",
    icon: ClipboardList,
    color: "#ec4899",
  },
  {
    href: "/certificate",
    title: "تقدیرنامه و برچسب",
    description: "طراحی کارت تشویقی",
    icon: Award,
    color: "#14b8a6",
  },
  {
    href: "/planner",
    title: "برنامه هفتگی",
    description: "تقویم و زمان‌بندی کلاس",
    icon: CalendarRange,
    color: "#6366f1",
  },
];
