import Link from "next/link";
import type { ContentCard as ContentCardData } from "@/app/lib/navigation";

export default function ContentCard({
  card,
  index = 0,
}: {
  card: ContentCardData;
  index?: number;
}) {
  const Icon = card.icon;
  const [from, to] = card.gradient ?? [card.color, card.color];

  return (
    <Link
      href={card.href}
      style={{
        backgroundImage: `linear-gradient(250deg, ${from} 0%, ${to} 100%)`,
        animationDelay: `${index * 70}ms`,
      }}
      className="fade-up relative flex h-[68px] items-center gap-3 overflow-hidden rounded-[20px] px-3.5 shadow-sm shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 340 68"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <path
          d="M0 46 C70 22 130 62 190 40 C250 20 300 52 340 34 L340 72 L0 72 Z"
          fill="#ffffff"
          opacity="0.14"
        />
      </svg>

      <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/20 text-white">
        <Icon size={22} strokeWidth={2} />
      </span>

      <span className="relative z-10 flex min-w-0 flex-1 flex-col gap-0.5 text-right">
        <span className="text-[15px] font-bold leading-6 text-white">
          {card.title}
        </span>
        <span className="truncate text-[11px] leading-5 text-white/85">
          {card.description}
        </span>
      </span>
    </Link>
  );
}
