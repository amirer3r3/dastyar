import type { SectionBannerType } from "./section-banner-config";
import type { SectionBannerTheme } from "./section-banner-config";

/** آیکون‌های پراکنده پس‌زمینه — شبیه بنر کاربرگ‌ها */
function SectionBannerDoodles({ patternId }: { patternId: string }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id={`${patternId}-glow`}>
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${patternId}-glow)`}
      >
        <path d="M52 42c0-8 6-14 14-14s14 6 14 14c0 5-2 9-5 12v5H57v-5c-3-3-5-7-5-12z" />
        <path d="M57 64h14" />
        <path d="M118 28c8-4 16-4 24 0v22c-8-4-16-4-24 0V28z" />
        <path d="M130 28v22" />
        <path d="M196 36l16-16 8 8-16 16-10 2 2-10z" />
        <path d="M248 52l28-10-28-10-28 10 28 10z" />
        <path d="M248 52v16" />
        <path d="M262 60v10" />
        <circle cx="320" cy="44" r="11" />
        <path d="M328 52l10 10" />
        <path d="M380 34l2 6 6 1-4 4 1 6-5-3-5 3 1-6-4-4 6-1z" />
        <circle cx="48" cy="118" r="14" />
        <path d="M34 118h28M48 104v28M38 108c8 4 16 4 20 0M38 128c8-4 16-4 20 0" />
        <path d="M108 108l34-34 6 6-34 34-8 2 2-8z" />
        <path d="M178 132V98h34" />
        <path d="M248 108c0-7 5-12 12-12s12 5 12 12c0 4-2 8-4 10v4h-16v-4c-2-2-4-6-4-10z" />
        <path d="M308 98c10-6 20-6 30 0v26c-10-6-20-6-30 0V98z" />
        <path d="M323 98v26" />
        <path d="M378 118l14-14 6 6-14 14-8 2 2-8z" />
      </g>
    </svg>
  );
}

function BannerCloud({
  title,
  textColor,
}: {
  title: string;
  textColor: string;
}) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[56%] z-[1] w-[58%] max-w-[240px] -translate-x-1/2 -translate-y-1/2">
      <svg
        viewBox="0 0 240 96"
        className="h-auto w-full drop-shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
        aria-hidden="true"
      >
        <path
          d="M44 58 C24 58 14 42 26 28 C18 12 40 8 56 20 C66 6 88 8 98 24 C114 14 136 20 140 36 C158 32 174 42 170 58 C186 64 180 82 160 82 C164 98 142 98 126 86 C114 98 92 94 82 80 C64 88 46 82 40 66 C24 70 20 54 36 48 C30 34 44 30 44 58 Z"
          fill="#ffffff"
          stroke="rgba(186,230,253,0.9)"
          strokeWidth="2"
        />
      </svg>
      <p
        className="absolute inset-0 flex items-center justify-center pt-0.5 text-[1.35rem] leading-none font-bold tracking-tight"
        style={{ color: textColor, fontFamily: "var(--font-lalezar)" }}
      >
        {title}
      </p>
    </div>
  );
}

export function SectionBannerArt({
  type,
  theme,
}: {
  type: SectionBannerType;
  theme: SectionBannerTheme;
}) {
  if (theme.imageSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={theme.imageSrc}
        alt={theme.cloudTitle}
        width={theme.imageWidth}
        height={theme.imageHeight}
        className="section-banner-image"
      />
    );
  }

  return (
    <div
      className="section-banner-art relative aspect-[1024/289] w-full overflow-hidden rounded-b-[28px]"
      style={theme.gradientStyle}
    >
      <SectionBannerDoodles patternId={`banner-${type}`} />
      <BannerCloud title={theme.cloudTitle} textColor={theme.cloudTextColor} />
    </div>
  );
}
