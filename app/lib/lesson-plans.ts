import "server-only";
import { promises as fs } from "fs";
import path from "path";

export type LessonPlan = {
  id: string;
  userId: string;
  title: string;
  subject: string;
  grade: string;
  duration: string;
  objectives: string;
  materials: string;
  method: string;
  evaluation: string;
  createdAt: string;
  updatedAt: string;
};

export type LessonPlanInput = Omit<
  LessonPlan,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "lesson-plans.json");

async function readAll(): Promise<LessonPlan[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as LessonPlan[];
  } catch {
    return [];
  }
}

async function writeAll(plans: LessonPlan[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(plans, null, 2), "utf-8");
}

export async function getLessonPlans(userId: string): Promise<LessonPlan[]> {
  const all = await readAll();
  return all
    .filter((p) => p.userId === userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getLessonPlan(
  userId: string,
  id: string
): Promise<LessonPlan | undefined> {
  const all = await readAll();
  return all.find((p) => p.id === id && p.userId === userId);
}

export async function createLessonPlan(
  userId: string,
  input: LessonPlanInput
): Promise<LessonPlan> {
  const all = await readAll();
  const now = new Date().toISOString();
  const plan: LessonPlan = {
    id: crypto.randomUUID(),
    userId,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  all.push(plan);
  await writeAll(all);
  return plan;
}

export async function updateLessonPlan(
  userId: string,
  id: string,
  input: LessonPlanInput
): Promise<LessonPlan | null> {
  const all = await readAll();
  const index = all.findIndex((p) => p.id === id && p.userId === userId);
  if (index === -1) return null;

  all[index] = {
    ...all[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  await writeAll(all);
  return all[index];
}

export async function deleteLessonPlan(
  userId: string,
  id: string
): Promise<boolean> {
  const all = await readAll();
  const next = all.filter((p) => !(p.id === id && p.userId === userId));
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
}
