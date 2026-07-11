"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function StarDisplay({
  rating,
  count,
  size = 14,
}: {
  rating: number;
  count?: number;
  size?: number;
}) {
  if (rating <= 0) {
    return <span className="text-xs text-muted">بدون امتیاز</span>;
  }

  return (
    <span className="flex items-center gap-1 text-amber-500">
      <span className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            fill={i < Math.round(rating) ? "currentColor" : "none"}
            className={i < Math.round(rating) ? "" : "text-gray-300"}
          />
        ))}
      </span>
      <span className="text-xs font-bold">{rating.toFixed(1)}</span>
      {count !== undefined && count > 0 ? (
        <span className="text-[10px] text-muted">({count})</span>
      ) : null}
    </span>
  );
}

export function StarInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (score: number) => void;
  disabled?: boolean;
}) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const score = i + 1;
        return (
          <button
            key={score}
            type="button"
            disabled={disabled}
            onMouseEnter={() => setHover(score)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(score)}
            className="text-amber-500 transition-transform active:scale-110 disabled:opacity-50"
            aria-label={`${score} ستاره`}
          >
            <Star
              size={28}
              fill={score <= active ? "currentColor" : "none"}
              className={score <= active ? "" : "text-gray-300"}
            />
          </button>
        );
      })}
    </div>
  );
}
