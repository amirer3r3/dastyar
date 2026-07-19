import { getPackages } from "@/app/lib/marketplace";
import { getRatingSummaries } from "@/app/lib/ratings";
import { seedAudiobooks } from "./audiobooks-data";
import { PAYMENT_MODE } from "./types";
import MarketplaceTabs from "./marketplace-tabs";
import type { PackageWithRating } from "./marketplace-client";
import type { AudiobookWithRating } from "./audiobooks-list";

export default async function MarketplacePage() {
  const packages = await getPackages();

  const packageSummaries = await getRatingSummaries(
    packages.map((pkg) => ({
      targetType: "package" as const,
      targetId: pkg.id,
      seedRating: pkg.rating,
    }))
  );

  const packagesWithRatings: PackageWithRating[] = packages.map((pkg, i) => {
    const ratingSummary = packageSummaries[i];
    const displayRating =
      ratingSummary.count > 0 ? ratingSummary.average : pkg.rating;
    return { ...pkg, ratingSummary, displayRating };
  });

  const audiobookSummaries = await getRatingSummaries(
    seedAudiobooks.map((book) => ({
      targetType: "audiobook" as const,
      targetId: book.id,
      seedRating: book.seedRating,
    }))
  );

  const audiobooksWithRatings: AudiobookWithRating[] = seedAudiobooks.map(
    (book, i) => ({
      ...book,
      ratingSummary: audiobookSummaries[i],
    })
  );

  return (
    <MarketplaceTabs
      packages={packagesWithRatings}
      audiobooks={audiobooksWithRatings}
      paymentMode={PAYMENT_MODE}
    />
  );
}
