import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";

export type SectionBannerType =
  | "worksheet"
  | "lesson-plan"
  | "sample-question"
  | "step-by-step";

export type SectionBannerAction = {
  href: string;
  label: string;
  icon?: LucideIcon;
};

export type SectionBannerTheme = {
  cloudTitle: string;
  cloudTextColor: string;
  /** اگر تنظیم شود، همان تصویر آماده (مثل کاربرگ‌ها) استفاده می‌شود */
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
  gradientStyle?: CSSProperties;
  action?: SectionBannerAction;
};

export const sectionBannerConfig: Record<
  SectionBannerType,
  SectionBannerTheme
> = {
  worksheet: {
    cloudTitle: "کاربرگ‌ها",
    cloudTextColor: "#1e40af",
    imageSrc: "/images/worksheets-header.png",
    imageWidth: 1024,
    imageHeight: 289,
    action: { href: "/worksheets/create", label: "طراحی", icon: Plus },
  },
  "lesson-plan": {
    cloudTitle: "طرح درس",
    cloudTextColor: "#064e3b",
    imageSrc: "/images/lesson-plan-header.png",
    imageWidth: 1024,
    imageHeight: 291,
  },
  "sample-question": {
    cloudTitle: "نمونه سوال",
    cloudTextColor: "#9a3412",
    imageSrc: "/images/sample-question-header.png",
    imageWidth: 1024,
    imageHeight: 291,
    action: { href: "/worksheets/create", label: "طراحی", icon: Plus },
  },
  "step-by-step": {
    cloudTitle: "گام‌به‌گام",
    cloudTextColor: "#0e7490",
    imageSrc: "/images/step-by-step-header.png",
    imageWidth: 1024,
    imageHeight: 298,
  },
};
