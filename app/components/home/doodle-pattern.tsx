/** بافت آیکون‌های آموزشی: پرگار، خط‌کش، گونیا، ذره‌بین، مداد، ستاره */
export default function DoodlePattern({
  className = "",
  opacity = 0.12,
  patternId = "doodle-tile",
}: {
  className?: string;
  opacity?: number;
  patternId?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="100%"
      height="100%"
      style={{ opacity }}
    >
      <defs>
        <pattern
          id={patternId}
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-5)"
        >
          <g
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* پرگار */}
            <path d="M12 18 L12 28 M12 18 A6 6 0 0 1 24 18" />
            <path d="M12 28 L8 34" />

            {/* گونیا */}
            <path d="M38 10 L52 24 L48 28 L34 14 Z" />
            <path d="M39 17 L42 20 M44 22 L47 25" />

            {/* خط‌کش */}
            <path d="M68 8 L84 24 L79 29 L63 13 Z" />
            <path d="M69 15 L72 18" />

            {/* ذره‌بین */}
            <circle cx="18" cy="58" r="7" />
            <path d="M23 63 L29 69" />

            {/* مداد */}
            <path d="M44 52 L55 41 L59 45 L48 56 L43 57 Z" />

            {/* ستاره */}
            <path d="M78 48 L79.8 53 L84.8 54.6 L79.8 56.2 L78 61 L76.2 56.2 L71.2 54.6 L76.2 53 Z" />
            <path d="M88 78 L89 81 L92 82 L89 83 L88 86 L87 83 L84 82 L87 81 Z" />

            {/* نقاله */}
            <path d="M58 72 A12 12 0 0 1 82 72 Z" />
            <path d="M64 72 A6 6 0 0 1 76 72" />

            {/* کتاب */}
            <path d="M8 82 C14 78 20 78 26 82 C32 78 38 78 44 82 L44 94 C38 90 32 90 26 94 C20 90 14 90 8 94 Z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
