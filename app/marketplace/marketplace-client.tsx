"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Download, Search } from "lucide-react";
import type { MarketplacePackage, PackageCategory } from "./types";
import { categoryLabels } from "./types";
import { StarDisplay } from "@/app/components/star-rating";
import ProductCover from "@/app/components/product-cover";
import type { RatingSummary } from "@/app/lib/ratings";

const categories: (PackageCategory | "all")[] = [
  "all",
  "worksheets",
  "lesson-plans",
  "exams",
  "other",
];

export type PackageWithRating = MarketplacePackage & {
  ratingSummary: RatingSummary;
  displayRating: number;
};

function formatPrice(price: number): string {
  if (price === 0) return "رایگان";
  return `${price.toLocaleString("fa-IR")} تومان`;
}

export default function MarketplaceClient({
  packages,
  paymentMode,
  hideHeader = false,
}: {
  packages: PackageWithRating[];
  paymentMode: string;
  hideHeader?: boolean;
}) {
  const [category, setCategory] = useState<PackageCategory | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return packages.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (search) {
        const s = search.trim().toLowerCase();
        if (
          !p.title.toLowerCase().includes(s) &&
          !p.description.toLowerCase().includes(s)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [packages, category, search]);

  return (
    <>
      {!hideHeader ? (
        <header className="sticky top-0 z-40 bg-background/90 backdrop-blur">
          <div className="px-4 py-3">
            <h1 className="text-base font-bold">بازارچه</h1>
          </div>
        </header>
      ) : null}

      {paymentMode === "sandbox" ? (
        <div className="mx-4 mb-2 rounded-app bg-accent/10 px-3 py-2 text-xs leading-6 text-accent">
          حالت آزمایشی: درگاه پرداخت هنوز وصل نشده. خریدها بدون پرداخت واقعی
          ثبت می‌شوند.
        </div>
      ) : null}

      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 rounded-app border border-border bg-card px-3 py-2.5">
          <Search size={18} className="text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در پکیج‌ها..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              category === cat
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted"
            }`}
          >
            {cat === "all" ? "همه" : categoryLabels[cat]}
          </button>
        ))}
      </div>

      <main className="flex flex-col gap-3 px-4 pb-4">
        {filtered.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted">
            پکیجی پیدا نشد.
          </p>
        ) : (
          filtered.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/marketplace/${pkg.id}`}
              className="flex gap-3 rounded-app border border-border bg-card p-4 shadow-sm transition-transform active:scale-[0.98]"
            >
              <ProductCover
                coverImage={pkg.coverImage}
                coverEmoji={pkg.coverEmoji}
                alt={pkg.title}
                size="sm"
              />
              <div className="flex flex-1 flex-col gap-1">
                <span className="text-sm font-bold text-foreground">
                  {pkg.title}
                </span>
                <span className="line-clamp-2 text-xs leading-5 text-muted">
                  {pkg.description}
                </span>
                <div className="mt-1 flex items-center gap-3">
                  <StarDisplay
                    rating={pkg.displayRating}
                    count={pkg.ratingSummary.count}
                    size={12}
                  />
                  <span className="flex items-center gap-0.5 text-xs text-muted">
                    <Download size={12} />
                    {pkg.downloadCount}
                  </span>
                  <span className="text-xs font-bold text-primary">
                    {formatPrice(pkg.price)}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </main>
    </>
  );
}
