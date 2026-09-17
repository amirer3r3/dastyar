"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  FileText,
  BookOpen,
  FileQuestion,
  ListOrdered,
  Plus,
  type LucideIcon,
} from "lucide-react";
import DoodlePattern from "@/app/components/home/doodle-pattern";

export type SectionHeaderType =
  | "worksheet"
  | "lesson-plan"
  | "sample-question"
  | "step-by-step";

export type SectionHeaderAction = {
  href: string;
  label: string;
  icon?: LucideIcon;
};

type SectionTheme = {
  title: string;
  subtitle: string;
  gradientClass: string;
  icon: LucideIcon;
  action?: SectionHeaderAction;
};

export const sectionHeaderConfig: Record<SectionHeaderType, SectionTheme> = {
  worksheet: {
    title: "طراحی و مدیریت کاربرگ‌ها",
    subtitle: "کاربرگ آماده را بر اساس پایه و درس پیدا کنید یا کاربرگ تازه بسازید.",
    gradientClass: "bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700",
    icon: FileText,
    action: {
      href: "/worksheets/create",
      label: "طراحی",
      icon: Plus,
    },
  },
  "lesson-plan": {
    title: "طرح درس‌های آماده",
    subtitle: "طرح درس را بر اساس پایه و درس انتخاب کنید یا طرح تازه بنویسید.",
    gradientClass: "bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-600",
    icon: BookOpen,
    action: {
      href: "/lesson-plan/create",
      label: "طراحی",
      icon: Plus,
    },
  },
  "sample-question": {
    title: "بانک نمونه سوال",
    subtitle: "سوالات درس‌به‌درس و آزمون نهایی را برای هر پایه و درس ببینید.",
    gradientClass: "bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600",
    icon: FileQuestion,
    action: {
      href: "/worksheets/create",
      label: "طراحی",
      icon: Plus,
    },
  },
  "step-by-step": {
    title: "حل گام‌به‌گام",
    subtitle: "روش رسیدن به پاسخ را مرحله‌به‌مرحله یاد بگیرید، نه فقط جواب نهایی.",
    gradientClass: "bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500",
    icon: ListOrdered,
  },
};

export type SectionHeaderProps = {
  type: SectionHeaderType;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  actions?: ReactNode;
  stats?: string;
  children?: ReactNode;
};

export default function SectionHeader({
  type,
  title,
  subtitle,
  showBackButton = true,
  actions,
  stats,
  children,
}: SectionHeaderProps) {
  const router = useRouter();
  const theme = sectionHeaderConfig[type];
  const Icon = theme.icon;
  const heading = title ?? theme.title;
  const lead = subtitle ?? theme.subtitle;
  const ActionIcon = theme.action?.icon ?? Plus;

  return (
    <header className="relative" dir="rtl">
      <div
        className={`relative ${theme.gradientClass} pb-10 pt-[max(0.75rem,env(safe-area-inset-top))]`}
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%)",
        }}
      >
        <DoodlePattern
          className="absolute inset-0"
          opacity={0.12}
          patternId={`section-doodle-${type}`}
        />

        <svg
          aria-hidden="true"
          viewBox="0 0 420 48"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 w-full"
        >
          <path
            d="M0 22 C70 8 140 36 210 24 C280 12 350 32 420 18 L420 48 L0 48 Z"
            fill="#ffffff"
            opacity="0.18"
          />
        </svg>

        <div className="relative z-10 flex flex-col gap-3 px-4">
          <div className="flex items-center justify-between gap-3">
            {showBackButton ? (
              <button
                type="button"
                aria-label="بازگشت"
                onClick={() => {
                  if (window.history.length > 1) router.back();
                  else router.push("/");
                }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/25 active:scale-95"
              >
                <ArrowRight size={18} />
              </button>
            ) : (
              <span className="h-10 w-10 shrink-0" />
            )}

            <h1 className="min-w-0 flex-1 text-center text-base font-bold leading-6 text-white">
              {heading}
            </h1>

            {actions ??
              (theme.action ? (
                <Link
                  href={theme.action.href}
                  className="flex h-10 shrink-0 items-center gap-1 rounded-full border border-white/25 bg-white/15 px-3 text-xs font-bold text-white backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/25 active:scale-95"
                >
                  <ActionIcon size={14} />
                  {theme.action.label}
                </Link>
              ) : (
                <span className="h-10 w-10 shrink-0" />
              ))}
          </div>

          <div className="flex items-end justify-between gap-3 pb-1">
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-medium leading-6 text-white/90">
                {lead}
              </p>
              {stats ? (
                <span className="mt-1 inline-flex rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  {stats}
                </span>
              ) : null}
            </div>

            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white shadow-lg shadow-black/10 backdrop-blur-sm">
              <Icon size={26} strokeWidth={2} />
            </span>
          </div>
        </div>
      </div>

      {children ? (
        <div className="relative z-20 -mt-5 px-4">{children}</div>
      ) : null}
    </header>
  );
}
