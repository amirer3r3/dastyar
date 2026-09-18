type Props = {
  /** نگه‌داری سازگاری API؛ در تم آسمان نمایش داده نمی‌شود */
  bismillah?: string;
  title?: string;
  titleFontSize?: string;
};

export default function AsmanPageHeader({
  title,
  titleFontSize,
}: Props) {
  return (
    <div className="worksheet-asman-title">
      <div className="flex flex-col items-center justify-center text-center">
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
