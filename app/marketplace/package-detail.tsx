"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Download,
  User,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { MarketplacePackage } from "./types";
import { categoryLabels, PAYMENT_MODE } from "./types";
import {
  purchasePackageAction,
  type MarketplaceFormState,
} from "@/app/lib/marketplace-actions";
import { StarDisplay } from "@/app/components/star-rating";
import ProductCover from "@/app/components/product-cover";
import RatingWidget from "./rating-widget";
import type { RatingSummary } from "@/app/lib/ratings";

function formatPrice(price: number): string {
  if (price === 0) return "رایگان";
  return `${price.toLocaleString("fa-IR")} تومان`;
}

export default function PackageDetailClient({
  pkg,
  owned,
  isLoggedIn,
  displayRating,
  ratingSummary,
  userRating,
}: {
  pkg: MarketplacePackage;
  owned: boolean;
  isLoggedIn: boolean;
  displayRating: number;
  ratingSummary: RatingSummary;
  userRating: number | null;
}) {
  const [state, formAction] = useActionState<
    MarketplaceFormState,
    FormData
  >(purchasePackageAction, undefined);

  const canDownload = owned || state?.success === "purchased";

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center gap-2 bg-background/90 px-4 py-3 backdrop-blur">
        <Link
          href="/marketplace"
          aria-label="بازگشت"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card"
        >
          <ArrowRight size={18} />
        </Link>
        <h1 className="text-base font-bold text-foreground">جزئیات پکیج</h1>
      </header>

      <main className="flex flex-col gap-5 px-4 pt-2 pb-8">
        <div className="flex flex-col items-center gap-3 rounded-app border border-border bg-card p-6 text-center shadow-sm">
          <ProductCover
            coverImage={pkg.coverImage}
            coverEmoji={pkg.coverEmoji}
            alt={pkg.title}
            size="lg"
          />
          <h2 className="text-lg font-bold text-foreground">{pkg.title}</h2>
          <div className="flex items-center gap-4 text-sm text-muted">
            <StarDisplay
              rating={displayRating}
              count={ratingSummary.count}
              size={14}
            />
            <span className="flex items-center gap-1">
              <Download size={14} />
              {pkg.downloadCount} دانلود
            </span>
          </div>
          <span className="text-xl font-black text-primary">
            {formatPrice(pkg.price)}
          </span>
        </div>

        <div className="rounded-app border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-bold text-foreground">توضیحات</h3>
          <p className="text-sm leading-7 text-muted">{pkg.description}</p>
        </div>

        <div className="flex items-center gap-3 rounded-app border border-border bg-card p-4 shadow-sm">
          <User size={20} className="text-primary" />
          <div>
            <span className="text-xs text-muted">فروشنده</span>
            <p className="text-sm font-bold text-foreground">{pkg.sellerName}</p>
          </div>
          <span className="mr-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            {categoryLabels[pkg.category]}
          </span>
        </div>

        <RatingWidget
          targetType="package"
          targetId={pkg.id}
          userRating={userRating}
          isLoggedIn={isLoggedIn}
        />

        {canDownload ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-app bg-success/10 px-4 py-3 text-sm font-medium text-success">
              <CheckCircle2 size={18} />
              {pkg.price === 0 ? "این پکیج رایگان است." : "شما این پکیج را دارید."}
            </div>
            {isLoggedIn ? (
              <a
                href={`/api/marketplace/download/${pkg.id}`}
                className="flex h-12 items-center justify-center gap-2 rounded-app bg-success text-sm font-bold text-white shadow-lg"
              >
                <Download size={20} />
                دانلود فایل ({pkg.fileName})
              </a>
            ) : (
              <Link
                href="/login"
                className="flex h-12 items-center justify-center rounded-app bg-primary text-sm font-bold text-primary-foreground"
              >
                برای دانلود وارد شوید
              </Link>
            )}
          </div>
        ) : !isLoggedIn ? (
          <Link
            href="/login"
            className="flex h-12 items-center justify-center gap-2 rounded-app bg-primary text-sm font-bold text-primary-foreground"
          >
            <ShoppingCart size={20} />
            برای خرید وارد شوید
          </Link>
        ) : (
          <form action={formAction} className="flex flex-col gap-3">
            <input type="hidden" name="packageId" value={pkg.id} />
            {state?.error ? (
              <div className="flex items-center gap-2 rounded-app bg-danger/10 px-3 py-2.5 text-xs text-danger">
                <AlertCircle size={16} />
                {state.error}
              </div>
            ) : null}
            <button
              type="submit"
              className="flex h-12 items-center justify-center gap-2 rounded-app bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30"
            >
              <ShoppingCart size={20} />
              {PAYMENT_MODE === "sandbox"
                ? `خرید آزمایشی — ${formatPrice(pkg.price)}`
                : `خرید — ${formatPrice(pkg.price)}`}
            </button>
            {PAYMENT_MODE === "sandbox" ? (
              <p className="text-center text-[11px] text-muted">
                بدون پرداخت واقعی — فقط برای تست سیستم
              </p>
            ) : null}
          </form>
        )}
      </main>
    </>
  );
}
