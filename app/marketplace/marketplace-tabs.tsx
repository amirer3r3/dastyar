"use client";

import { useState } from "react";
import Link from "next/link";
import { Store, Headphones } from "lucide-react";
import MarketplaceClient from "./marketplace-client";
import AudiobooksList, {
  type AudiobookWithRating,
} from "./audiobooks-list";
import type { PackageWithRating } from "./marketplace-client";

type Tab = "packages" | "audiobooks";

export default function MarketplaceTabs({
  packages,
  audiobooks,
  paymentMode,
}: {
  packages: PackageWithRating[];
  audiobooks: AudiobookWithRating[];
  paymentMode: string;
}) {
  const [tab, setTab] = useState<Tab>("packages");

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <Store size={22} className="text-primary" />
            <h1 className="text-base font-bold text-foreground">بازارچه</h1>
          </div>
          {tab === "packages" ? (
            <Link
              href="/marketplace/upload"
              className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              + آپلود پکیج
            </Link>
          ) : null}
        </div>

        <div className="mx-4 mb-3 flex rounded-full border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => setTab("packages")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium ${
              tab === "packages"
                ? "bg-primary text-primary-foreground"
                : "text-muted"
            }`}
          >
            <Store size={16} />
            پکیج‌ها
          </button>
          <button
            type="button"
            onClick={() => setTab("audiobooks")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium ${
              tab === "audiobooks"
                ? "bg-primary text-primary-foreground"
                : "text-muted"
            }`}
          >
            <Headphones size={16} />
            کتاب صوتی
          </button>
        </div>
      </header>

      {tab === "packages" ? (
        <MarketplaceClient
          packages={packages}
          paymentMode={paymentMode}
          hideHeader
        />
      ) : (
        <main className="px-4 pb-4">
          <AudiobooksList audiobooks={audiobooks} />
        </main>
      )}
    </>
  );
}
