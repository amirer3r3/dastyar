import Link from "next/link";
import { Search } from "lucide-react";
import AppHeader from "./components/app-header";
import {
  SectionTitle,
  ContentCardTile,
  ToolRow,
} from "./components/section";
import { educationalContent, teacherTools } from "./lib/navigation";

export default function Home() {
  return (
    <>
      <AppHeader subtitle="امروز چه کمکی از دستم برمیاد؟" />

      <main className="flex flex-col gap-6 px-4 pt-2">
        <div className="flex items-center gap-2 rounded-app border border-border bg-card px-4 py-3 shadow-sm">
          <Search size={20} className="text-muted" />
          <input
            type="text"
            placeholder="جستجو در کاربرگ‌ها، سوالات و ابزارها..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
          />
        </div>

        <section>
          <SectionTitle title="محتوای آموزشی" />
          <div className="grid grid-cols-2 gap-3">
            {educationalContent.map((card) => (
              <ContentCardTile key={card.href} card={card} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="ابزارهای معلم" />
          <div className="flex flex-col gap-3">
            {teacherTools.map((card) => (
              <ToolRow key={card.title} card={card} />
            ))}
          </div>
        </section>

        <section>
          <Link
            href="/marketplace"
            className="block rounded-app bg-primary p-5 text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-[0.98]"
          >
            <h3 className="text-base font-bold">بازارچه معلمان</h3>
            <p className="mt-1 text-sm opacity-90">
              پکیج‌های آموزشی، کاربرگ آماده و کتاب صوتی را کشف کنید.
            </p>
          </Link>
        </section>
      </main>
    </>
  );
}
