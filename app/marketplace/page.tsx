import { getPackages } from "@/app/lib/marketplace";
import { getRatingSummary, getUserRating } from "@/app/lib/ratings";
import { seedAudiobooks } from "./audiobooks-data";
import { PAYMENT_MODE } from "./types";
import MarketplaceTabs from "./marketplace-tabs";
import type { PackageWithRating } from "./marketplace-client";
import type { AudiobookWithRating } from "./audiobooks-list";

export default async function MarketplacePage() {
  const packages = await getPackages();

  const packagesWithRatings: PackageWithRating[] = await Promise.all(
    packages.map(async (pkg) => {
      const ratingSummary = await getRatingSummary("package", pkg.id, pkg.rating);
      const displayRating =
        ratingSummary.count > 0 ? ratingSummary.average : pkg.rating;
      return { ...pkg, ratingSummary, displayRating };
    })
  );

  const audiobooksWithRatings: AudiobookWithRating[] = await Promise.all(
    seedAudiobooks.map(async (book) => {
      const ratingSummary = await getRatingSummary(
        "audiobook",
        book.id,
        book.seedRating
      );
      return { ...book, ratingSummary };
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
