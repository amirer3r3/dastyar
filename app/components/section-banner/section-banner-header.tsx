"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";
import {
  sectionBannerConfig,
  type SectionBannerType,
} from "./section-banner-config";
import { SectionBannerArt } from "./section-banner-art";

export default function SectionBannerHeader({
  type,
}: {
  type: SectionBannerType;
}) {
  const router = useRouter();
  const theme = sectionBannerConfig[type];
  const ActionIcon = theme.action?.icon ?? Plus;

  return (
    <header className="section-banner-header relative" dir="rtl">
      <div className="relative w-full">
        <SectionBannerArt type={type} theme={theme} />

        <div className="absolute inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-10 flex items-center justify-between gap-3 px-4">
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

          {theme.action ? (
            <Link
              href={theme.action.href}
              className="flex h-10 shrink-0 items-center gap-1 rounded-full border border-white/25 bg-white/15 px-3 text-xs font-bold text-white backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/25 active:scale-95"
            >
              <ActionIcon size={14} />
              {theme.action.label}
            </Link>
          ) : (
            <span className="h-10 w-10 shrink-0" aria-hidden="true" />
          )}
        </div>
      </div>
    </header>
  );
}
