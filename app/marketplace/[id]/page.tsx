import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getPackage, hasPurchased } from "@/app/lib/marketplace";
import { getRatingSummary, getUserRating } from "@/app/lib/ratings";
import PackageDetailClient from "../package-detail";

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pkg = await getPackage(id);
  if (!pkg) notFound();

  const session = await auth();
  const isLoggedIn = !!session?.user?.id;
  let owned = false;
  if (isLoggedIn && session.user.id) {
    owned = await hasPurchased(session.user.id, id);
  }

  const ratingSummary = await getRatingSummary("package", id, pkg.rating);
  const displayRating =
    ratingSummary.count > 0 ? ratingSummary.average : pkg.rating;
  const userRating =
    isLoggedIn && session?.user?.id
      ? await getUserRating(session.user.id, "package", id)
      : null;

  return (
    <PackageDetailClient
      pkg={pkg}
      owned={owned}
      isLoggedIn={isLoggedIn}
      displayRating={displayRating}
      ratingSummary={ratingSummary}
      userRating={userRating}
    />
  );
}
