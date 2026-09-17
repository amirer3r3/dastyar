"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const HEADER_SRC = "/images/worksheet-design-header.png?v=3";
const HEADER_WIDTH = 993;
const HEADER_HEIGHT = 311;

export default function WorksheetDesignHeader() {
  const router = useRouter();

  return (
    <header className="worksheet-design-header no-print relative" dir="rtl">
      <div className="worksheet-design-header-inner relative w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HEADER_SRC}
          alt=""
          aria-hidden="true"
          width={HEADER_WIDTH}
          height={HEADER_HEIGHT}
          decoding="async"
          className="worksheet-design-header-banner"
        />

        <div
          className="worksheet-design-header-fade pointer-events-none absolute inset-x-0 bottom-0"
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 top-[max(0.65rem,env(safe-area-inset-top))] z-10 flex items-center justify-between px-4">
          <button
            type="button"
            aria-label="بازگشت"
            onClick={() => {
              if (window.history.length > 1) router.back();
              else router.push("/worksheets");
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-violet-200/80 bg-white/90 text-slate-700 shadow-sm backdrop-blur-sm transition-transform active:scale-95"
          >
            <ArrowRight size={18} />
          </button>
          <span className="h-10 w-10 shrink-0" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
}
