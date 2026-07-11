"use client";

import Link from "next/link";
import { Headphones, Clock } from "lucide-react";
import type { Audiobook } from "./audiobooks-data";
import { audiobookCategoryLabels } from "./audiobooks-data";
import { StarDisplay } from "@/app/components/star-rating";
import ProductCover from "@/app/components/product-cover";
import type { RatingSummary } from "@/app/lib/ratings";

export type AudiobookWithRating = Audiobook & {
  ratingSummary: RatingSummary;
};

export default function AudiobooksList({
  audiobooks,
}: {
  audiobooks: AudiobookWithRating[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {audiobooks.map((book) => {
        const rating =
          book.ratingSummary.count > 0
            ? book.ratingSummary.average
            : book.seedRating;

        return (
          <Link
            key={book.id}
            href={`/marketplace/audiobooks/${book.id}`}
            className="flex gap-3 rounded-app border border-border bg-card p-4 shadow-sm transition-transform active:scale-[0.98]"
          >
            <ProductCover
              coverImage={book.coverImage}
              coverEmoji={book.coverEmoji}
              alt={book.title}
              size="sm"
              className="bg-purple-100"
            />
            <div className="flex flex-1 flex-col gap-1">
              <span className="text-sm font-bold text-foreground">
                {book.title}
              </span>
              <span className="line-clamp-2 text-xs leading-5 text-muted">
                {book.description}
              </span>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <StarDisplay
                  rating={rating}
                  count={book.ratingSummary.count}
                  size={12}
                />
                <span className="flex items-center gap-0.5 text-[11px] text-muted">
                  <Clock size={11} />
                  {book.duration}
                </span>
                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                  {audiobookCategoryLabels[book.category]}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
