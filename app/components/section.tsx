import Link from "next/link";
import type { ContentCard } from "@/app/lib/navigation";

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-3 flex items-center justify-between px-1">
      <h2 className="text-base font-bold text-foreground">{title}</h2>
      {action ? (
        <Link href={action.href} className="text-xs font-medium text-primary">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function ContentCardTile({ card }: { card: ContentCard }) {
  const Icon = card.icon;
  return (
    <Link
      href={card.href}
      className="flex flex-col gap-3 rounded-app border border-border bg-card p-4 shadow-sm transition-transform active:scale-[0.98]"
    >
      <span
        className="flex h-11 w-11 items-center justify-center rounded-xl"
        style={{ backgroundColor: hexToRgba(card.color, 0.14), color: card.color }}
      >
        <Icon size={22} />
      </span>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold text-foreground">{card.title}</span>
        <span className="text-xs text-muted">{card.description}</span>
      </div>
    </Link>
  );
}

export function ToolRow({ card }: { card: ContentCard }) {
  const Icon = card.icon;
  return (
    <Link
      href={card.href}
      className="flex items-center gap-3 rounded-app border border-border bg-card p-3 shadow-sm transition-transform active:scale-[0.98]"
    >
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: hexToRgba(card.color, 0.14), color: card.color }}
      >
        <Icon size={24} />
      </span>
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-sm font-bold text-foreground">{card.title}</span>
        <span className="text-xs text-muted">{card.description}</span>
      </div>
    </Link>
  );
}
