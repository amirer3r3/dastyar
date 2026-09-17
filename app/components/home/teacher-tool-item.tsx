import Link from "next/link";
import type { TeacherTool } from "@/app/lib/navigation";

function CardWaves({ tall }: { tall: boolean }) {
  if (tall) {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 180 220"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <path
          d="M0 148 C40 128 70 168 110 150 C140 136 160 158 180 146 L180 220 L0 220 Z"
          fill="#ffffff"
          opacity="0.16"
        />
        <path
          d="M0 176 C50 158 90 196 130 178 C155 166 168 184 180 176 L180 220 L0 220 Z"
          fill="#ffffff"
          opacity="0.1"
        />
        <circle cx="148" cy="28" r="34" fill="#ffffff" opacity="0.08" />
        <circle cx="22" cy="58" r="22" fill="#ffffff" opacity="0.07" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 88"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <path
        d="M0 54 C40 34 80 70 120 50 C155 34 180 62 200 48 L200 88 L0 88 Z"
        fill="#ffffff"
        opacity="0.16"
      />
      <path
        d="M0 68 C50 52 90 80 130 64 C160 52 180 72 200 66 L200 88 L0 88 Z"
        fill="#ffffff"
        opacity="0.1"
      />
      <circle cx="172" cy="16" r="22" fill="#ffffff" opacity="0.1" />
    </svg>
  );
}

export default function TeacherToolCard({
  tool,
  index = 0,
}: {
  tool: TeacherTool;
  index?: number;
}) {
  const Icon = tool.icon;
  const isTall = tool.variant === "tall";

  return (
    <Link
      href={tool.href}
      style={{ animationDelay: `${index * 70}ms` }}
      className={`fade-up relative flex h-full flex-col items-center justify-center overflow-hidden text-center text-white shadow-sm shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-md active:scale-[0.99] ${
        isTall ? "gap-2 rounded-[20px] px-3 py-3.5" : "gap-1.5 rounded-[20px] px-2.5 py-2.5"
      } ${tool.gradientClass}`}
    >
      <CardWaves tall={isTall} />

      <span
        className={`relative z-10 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm ${
          isTall ? "h-11 w-11" : "h-9 w-9"
        }`}
      >
        <Icon size={isTall ? 20 : 16} strokeWidth={2} />
      </span>

      <span className="relative z-10 flex flex-col gap-0.5">
        <span
          className={`font-bold leading-5 ${
            isTall ? "text-[13px]" : "text-xs"
          }`}
        >
          {tool.title}
        </span>
        <span className="text-[10px] leading-4 text-white/80">
          {tool.description}
        </span>
      </span>
    </Link>
  );
}
