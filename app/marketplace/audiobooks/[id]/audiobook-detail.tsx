"use client";

import Link from "next/link";
import { ArrowRight, Clock, User, Headphones } from "lucide-react";
import AudioPlayer from "@/app/components/audio-player";
import { StarDisplay } from "@/app/components/star-rating";
import ProductCover from "@/app/components/product-cover";
import RatingWidget from "../../rating-widget";
import type { Audiobook } from "../../audiobooks-data";
import { audiobookCategoryLabels } from "../../audiobooks-data";
import type { RatingSummary } from "@/app/lib/ratings";

export default function AudiobookDetailClient({
  book,
  ratingSummary,
  userRating,
  isLoggedIn,
}: {
  book: Audiobook;
  ratingSummary: RatingSummary;
  userRating: number | null;
  isLoggedIn: boolean;
}) {
  const displayRating =
    ratingSummary.count > 0 ? ratingSummary.average : book.seedRating;

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
        <div className="flex items-center gap-2">
          <Headphones size={20} className="text-primary" />
          <h1 className="text-base font-bold text-foreground">کتاب صوتی</h1>
        </div>
      </header>

      <main className="flex flex-col gap-5 px-4 pt-2 pb-8">
        <div className="flex flex-col items-center gap-3 rounded-app border border-border bg-card p-6 text-center shadow-sm">
          <ProductCover
            coverImage={book.coverImage}
            coverEmoji={book.coverEmoji}
            alt={book.title}
            size="lg"
            className="bg-purple-100"
          />
          <h2 className="text-lg font-bold text-foreground">{book.title}</h2>
          <StarDisplay
            rating={displayRating}
            count={ratingSummary.count}
            size={16}
          />
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {book.duration}
            </span>
            <span className="rounded-full bg-purple-100 px-2 py-0.5 font-bold text-purple-700">
              {audiobookCategoryLabels[book.category]}
            </span>
          </div>
        </div>

        <AudioPlayer src={book.audioUrl} title={book.title} />

        <div className="rounded-app border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-2 text-sm font-bold text-foreground">درباره</h3>
          <p className="text-sm leading-7 text-muted">{book.description}</p>
        </div>

        <div className="flex items-center gap-3 rounded-app border border-border bg-card p-4 shadow-sm">
          <User size={20} className="text-primary" />
          <div>
            <span className="text-xs text-muted">گوینده / نویسنده</span>
            <p className="text-sm font-bold text-foreground">{book.author}</p>
          </div>
        </div>

        <RatingWidget
          targetType="audiobook"
          targetId={book.id}
          userRating={userRating}
          isLoggedIn={isLoggedIn}
        />
      </main>
    </>
  );
}
