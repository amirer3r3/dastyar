import "server-only";
import { promises as fs } from "fs";
import path from "path";

export type RatingTarget = "package" | "audiobook";

export type Rating = {
  id: string;
  userId: string;
  targetType: RatingTarget;
  targetId: string;
  score: number;
  createdAt: string;
};

export type RatingSummary = {
  average: number;
  count: number;
};

const DATA_DIR = path.join(process.cwd(), "data");
const RATINGS_FILE = path.join(DATA_DIR, "ratings.json");

async function readAll(): Promise<Rating[]> {
  try {
    const raw = await fs.readFile(RATINGS_FILE, "utf-8");
    return JSON.parse(raw) as Rating[];
  } catch {
    return [];
  }
}

async function writeAll(ratings: Rating[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(RATINGS_FILE, JSON.stringify(ratings, null, 2), "utf-8");
}

function summarize(
  all: Rating[],
  targetType: RatingTarget,
  targetId: string,
  seedRating = 0
): RatingSummary {
  const relevant = all.filter(
    (r) => r.targetType === targetType && r.targetId === targetId
  );

  if (relevant.length === 0) {
    return seedRating > 0
      ? { average: seedRating, count: 0 }
      : { average: 0, count: 0 };
  }

  const sum = relevant.reduce((s, r) => s + r.score, 0);
  return {
    average: Math.round((sum / relevant.length) * 10) / 10,
    count: relevant.length,
  };
}

export async function getRatingSummary(
  targetType: RatingTarget,
  targetId: string,
  seedRating = 0
): Promise<RatingSummary> {
  const all = await readAll();
  return summarize(all, targetType, targetId, seedRating);
}

/** یک بار فایل را می‌خواند و چند خلاصه برمی‌گرداند (جلوگیری از N+1 روی Vercel) */
export async function getRatingSummaries(
  items: Array<{
    targetType: RatingTarget;
    targetId: string;
    seedRating?: number;
  }>
): Promise<RatingSummary[]> {
  const all = await readAll();
  return items.map((item) =>
    summarize(all, item.targetType, item.targetId, item.seedRating ?? 0)
  );
}

export async function getUserRating(
  userId: string,
  targetType: RatingTarget,
  targetId: string
): Promise<number | null> {
  const all = await readAll();
  const found = all.find(
    (r) =>
      r.userId === userId &&
      r.targetType === targetType &&
      r.targetId === targetId
  );
  return found ? found.score : null;
}

export async function setRating(
  userId: string,
  targetType: RatingTarget,
  targetId: string,
  score: number
): Promise<Rating> {
  const all = await readAll();
  const index = all.findIndex(
    (r) =>
      r.userId === userId &&
      r.targetType === targetType &&
      r.targetId === targetId
  );

  const rating: Rating = {
    id: index >= 0 ? all[index].id : crypto.randomUUID(),
    userId,
    targetType,
    targetId,
    score,
    createdAt: new Date().toISOString(),
  };

  if (index >= 0) {
    all[index] = rating;
  } else {
    all.push(rating);
  }

  await writeAll(all);
  return rating;
}
