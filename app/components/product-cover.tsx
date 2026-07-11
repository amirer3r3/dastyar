import Image from "next/image";

const sizeMap = {
  sm: { box: "h-14 w-14", px: 56, text: "text-3xl" },
  md: { box: "h-20 w-20", px: 80, text: "text-4xl" },
  lg: { box: "h-28 w-28", px: 112, text: "text-5xl" },
} as const;

export default function ProductCover({
  coverImage,
  coverEmoji,
  alt,
  size = "sm",
  className = "",
}: {
  coverImage?: string | null;
  coverEmoji: string;
  alt: string;
  size?: keyof typeof sizeMap;
  className?: string;
}) {
  const { box, px, text } = sizeMap[size];

  if (coverImage) {
    return (
      <div
        className={`relative shrink-0 overflow-hidden rounded-2xl bg-primary/5 ${box} ${className}`}
      >
        <Image
          src={coverImage}
          alt={alt}
          width={px}
          height={px}
          className="h-full w-full object-cover"
          sizes={`${px}px`}
        />
      </div>
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-primary/10 ${box} ${text} ${className}`}
      aria-hidden={!alt}
    >
      {coverEmoji}
    </span>
  );
}
