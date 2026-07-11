import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { PlannerItem, PlannerItemInput } from "@/app/planner/types";

export type { PlannerItem, PlannerItemInput, PlannerItemType } from "@/app/planner/types";
export {
  plannerTypeLabels,
  dayLabels,
  formatWeekStart,
  getSaturdayOfWeek,
  addDays,
  formatWeekRange,
} from "@/app/planner/types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "planner.json");

async function readAll(): Promise<PlannerItem[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as PlannerItem[];
  } catch {
    return [];
  }
}

async function writeAll(items: PlannerItem[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(items, null, 2), "utf-8");
}

export async function getPlannerItems(
  userId: string,
  weekStart: string
): Promise<PlannerItem[]> {
  const all = await readAll();
  return all
    .filter((item) => item.userId === userId && item.weekStart === weekStart)
    .sort((a, b) => {
      if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
      return a.startTime.localeCompare(b.startTime);
    });
}

export async function createPlannerItem(
  userId: string,
  input: PlannerItemInput
): Promise<PlannerItem> {
  const all = await readAll();
  const now = new Date().toISOString();
  const item: PlannerItem = {
    id: crypto.randomUUID(),
    userId,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  all.push(item);
  await writeAll(all);
  return item;
}

export async function updatePlannerItem(
  userId: string,
  id: string,
  input: PlannerItemInput
): Promise<PlannerItem | null> {
  const all = await readAll();
  const index = all.findIndex((item) => item.id === id && item.userId === userId);
  if (index === -1) return null;
  const updated: PlannerItem = {
    ...all[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  all[index] = updated;
  await writeAll(all);
  return updated;
}

export async function deletePlannerItem(
  userId: string,
  id: string
): Promise<boolean> {
  const all = await readAll();
  const next = all.filter((item) => !(item.id === id && item.userId === userId));
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
}
