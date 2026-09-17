"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import {
  ANSWER_RULING_OPTIONS,
  answerRulingBackgroundStyle,
  normalizeAnswerRulingStyle,
  type AnswerRulingStyle,
} from "./answer-ruling-style";

function RulingSwatch({
  kind,
  className = "",
}: {
  kind: AnswerRulingStyle;
  className?: string;
}) {
  return (
    <div
      className={`h-3 min-w-0 flex-1 rounded-sm border border-border/60 bg-white ${className}`}
      style={answerRulingBackgroundStyle(kind, { reserveEditorMin: true })}
      aria-hidden
    />
  );
}

type Props = {
  value: AnswerRulingStyle;
  onChange: (kind: AnswerRulingStyle) => void;
  size?: "default" | "compact";
  className?: string;
};

export default function AnswerRulingSelect({
  value,
  onChange,
  size = "default",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});
  const kind = normalizeAnswerRulingStyle(value);
  const label =
    ANSWER_RULING_OPTIONS.find((o) => o.id === kind)?.label ?? "نوع خط‌کشی";
  const compact = size === "compact";

  const repositionMenu = () => {
    const btn = buttonRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    setMenuStyle({
      position: "fixed",
      top: r.bottom + 4,
      left: r.left,
      width: Math.max(r.width, compact ? 200 : r.width),
      zIndex: 9999,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    repositionMenu();
    window.addEventListener("scroll", repositionMenu, true);
    window.addEventListener("resize", repositionMenu);
    return () => {
      window.removeEventListener("scroll", repositionMenu, true);
      window.removeEventListener("resize", repositionMenu);
    };
  }, [open, compact]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        rootRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const menu = open ? (
    <ul
      ref={menuRef}
      style={menuStyle}
      className="max-h-52 overflow-y-auto rounded-2xl border border-border bg-background py-1 shadow-lg"
      role="listbox"
    >
      {ANSWER_RULING_OPTIONS.map((opt) => {
        const selected = opt.id === kind;
        return (
          <li key={opt.id}>
            <button
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => {
                onChange(opt.id);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-right transition-colors hover:bg-primary/5 ${
                selected ? "bg-primary/10" : ""
              }`}
            >
              <span className="shrink-0 text-xs font-medium text-foreground">
                {opt.label}
              </span>
              <RulingSwatch kind={opt.id} />
            </button>
          </li>
        );
      })}
    </ul>
  ) : null;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`relative flex w-full items-center gap-2 rounded-2xl border border-border bg-background text-right outline-none focus:border-primary ${
          compact
            ? "h-8 min-w-[7.5rem] py-1 pr-2 pl-7"
            : "h-10 py-1.5 pr-3 pl-8"
        } ${open ? "border-primary" : ""}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        title="نوع خط‌کشی فضای پاسخ"
      >
        <ChevronDown
          size={compact ? 12 : 14}
          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-muted"
        />
        <span
          className={`shrink-0 font-medium text-foreground ${
            compact ? "text-[10px]" : "text-sm"
          }`}
        >
          {label}
        </span>
        <RulingSwatch kind={kind} />
      </button>

      {typeof document !== "undefined" && menu
        ? createPortal(menu, document.body)
        : null}
    </div>
  );
}
