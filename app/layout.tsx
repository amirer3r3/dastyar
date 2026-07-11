import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/bottom-nav";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
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
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} antialiased`}>
        <div className="relative mx-auto min-h-screen max-w-md overflow-x-hidden bg-background pb-[calc(6rem+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)] shadow-sm">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
