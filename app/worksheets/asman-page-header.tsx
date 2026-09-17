const DEFAULT_ASMAN_BISMILLAH = "به نام خدای زیبایی‌ها";

type Props = {
  bismillah?: string;
  title?: string;
  titleFontSize?: string;
};

export default function AsmanPageHeader({
  bismillah = DEFAULT_ASMAN_BISMILLAH,
  title,
  titleFontSize,
}: Props) {
  const bismillahText = bismillah.trim() || DEFAULT_ASMAN_BISMILLAH;

  return (
    <div className="worksheet-asman-title">
      <div className="flex flex-col items-center justify-center text-center">
        <span className="mb-0.5 text-xs font-semibold text-sky-700">
          {bismillahText}
        </span>
        <h1
          className="text-base font-black tracking-tight text-sky-900 sm:text-lg"
          style={{
            fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
            ...(titleFontSize ? { fontSize: titleFontSize } : {}),
          }}
        >
          {title?.trim() || "عنوان کاربرگ"}
        </h1>
      </div>
    </div>
  );
}
