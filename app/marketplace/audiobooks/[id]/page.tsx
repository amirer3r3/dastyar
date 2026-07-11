import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { seedAudiobooks } from "../../audiobooks-data";
import { getRatingSummary, getUserRating } from "@/app/lib/ratings";
import AudiobookDetailClient from "./audiobook-detail";

export default async function AudiobookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = seedAudiobooks.find((b) => b.id === id);
  if (!book) notFound();

  const session = await auth();
  const isLoggedIn = !!session?.user?.id;
  const ratingSummary = await getRatingSummary(
    "audiobook",
    book.id,
    book.seedRating
  );
  const userRating =
    isLoggedIn && session?.user?.id
      ? await getUserRating(session.user.id, "audiobook", book.id)
      : null;

  return (
    <AudiobookDetailClient
      book={book}
      ratingSummary={ratingSummary}
      userRating={userRating}
      isLoggedIn={isLoggedIn}
    />
  );
}
