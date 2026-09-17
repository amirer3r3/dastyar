import type { Metadata, Viewport } from "next";
import { Vazirmatn, Lalezar } from "next/font/google";
import { localFontVariableClasses } from "./lib/project-fonts";
import "./globals.css";
import BottomNav from "./components/bottom-nav";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const lalezar = Lalezar({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-lalezar",
  display: "swap",
});

export const metadata: Metadata = {
  title: "دستیار معلم",
  description:
    "پلتفرم دستیار معلم؛ ابزارهای آموزشی، آزمون آنلاین، کاربرگ، طرح درس و بازارچه برای معلمان.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#3b6fe0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body
        className={`${vazirmatn.variable} ${lalezar.variable} ${localFontVariableClasses} bg-page antialiased`}
      >
        <div className="app-shell relative mx-auto min-h-screen max-w-[420px] overflow-x-hidden bg-background pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)] shadow-xl">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
