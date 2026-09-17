import localFont from "next/font/local";

export const farCompsBd = localFont({
  src: "../fonts/far/Far_CompsBd.ttf",
  variable: "--font-far-comps-bd",
  display: "swap",
});

export const farKoodkBd = localFont({
  src: "../fonts/far/Far_KoodkBd.ttf",
  variable: "--font-far-koodk-bd",
  display: "swap",
});

export const farZiba = localFont({
  src: "../fonts/far/Far_Ziba.ttf",
  variable: "--font-far-ziba",
  display: "swap",
});

export const farTitrBd = localFont({
  src: "../fonts/far/Far_TitrBd.ttf",
  variable: "--font-far-titr-bd",
  display: "swap",
});

export const aBank = localFont({
  src: "../fonts/far/a-bank.ttf",
  variable: "--font-a-bank",
  display: "swap",
});

/** متغیرهای فونت که روی `<body>` از layout ست می‌شوند (برای چاپ/PDF) */
export const FONT_CSS_VARIABLES = [
  "--font-vazirmatn",
  "--font-lalezar",
  "--font-far-comps-bd",
  "--font-far-koodk-bd",
  "--font-far-ziba",
  "--font-far-titr-bd",
  "--font-a-bank",
] as const;

/** کلاس‌های CSS variable برای `<body>` */
export const localFontVariableClasses = [
  farCompsBd.variable,
  farKoodkBd.variable,
  farZiba.variable,
  farTitrBd.variable,
  aBank.variable,
].join(" ");

export type ProjectFontOption = {
  label: string;
  value: string;
};

/** فونت‌های قابل انتخاب در کاربرگ (سریع + حرفه‌ای) */
export const WORKSHEET_FONT_OPTIONS: ProjectFontOption[] = [
  { label: "وزیرمتن", value: "var(--font-vazirmatn), Tahoma, sans-serif" },
  { label: "لاله‌زار", value: "var(--font-lalezar), Tahoma, sans-serif" },
  { label: "کامپ‌ست", value: "var(--font-far-comps-bd), Tahoma, sans-serif" },
  { label: "کودک", value: "var(--font-far-koodk-bd), Tahoma, sans-serif" },
  { label: "زیبا", value: "var(--font-far-ziba), Tahoma, sans-serif" },
  { label: "تیتر", value: "var(--font-far-titr-bd), Tahoma, sans-serif" },
  { label: "A بانک", value: "var(--font-a-bank), Tahoma, sans-serif" },
  { label: "Tahoma", value: "Tahoma, sans-serif" },
];
