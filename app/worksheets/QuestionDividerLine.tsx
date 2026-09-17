import type { QuestionDividerKind } from "./question-style";

type Props = {
  kind: QuestionDividerKind;
  marginTop?: number;
  marginBottom?: number;
};

/** همیشه عرض کامل — داخل flex بدون w-full خط دیده نمی‌شود */
const LINE = "block w-full min-w-0 max-w-full";

export default function QuestionDividerLine({
  kind,
  marginTop = 0,
  marginBottom = 4,
}: Props) {
  const style = { marginTop, marginBottom } as const;

  switch (kind) {
    case "solid-thin":
      return (
        <div
          className={`${LINE} min-h-px border-b border-gray-400`}
          style={style}
          aria-hidden
        />
      );
    case "solid-thick":
      return (
        <div
          className={`${LINE} min-h-px border-b-[3px] border-gray-700`}
          style={style}
          aria-hidden
        />
      );
    case "dotted":
      return (
        <div
          className={`${LINE} min-h-px border-b border-dotted border-gray-500`}
          style={style}
          aria-hidden
        />
      );
    case "dashed":
      return (
        <div
          className={`${LINE} min-h-px border-b border-dashed border-gray-600`}
          style={style}
          aria-hidden
        />
      );
    case "double":
      return (
        <div style={style} className={`${LINE} space-y-1`} aria-hidden>
          <div className="w-full border-b border-gray-500" />
          <div className="w-full border-b border-gray-500" />
        </div>
      );
    case "dash-dot":
      return (
        <div
          className={`${LINE} min-h-px border-b-2 border-dashed border-gray-600`}
          style={style}
          aria-hidden
        />
      );
    case "soft-gradient":
      return (
        <div
          style={style}
          className={`${LINE} h-[2px] bg-gradient-to-l from-transparent via-gray-400 to-transparent`}
          aria-hidden
        />
      );
    case "wavy":
    case "wavy-bold":
      return (
        <svg
          viewBox="0 0 400 12"
          preserveAspectRatio="none"
          className={`${LINE} h-3 text-gray-600`}
          style={style}
          aria-hidden
        >
          <path
            d="M0,6 Q25,0 50,6 T100,6 T150,6 T200,6 T250,6 T300,6 T350,6 T400,6"
            fill="none"
            stroke="currentColor"
            strokeWidth={kind === "wavy-bold" ? 3 : 1.5}
          />
        </svg>
      );
    default:
      return null;
  }
}
