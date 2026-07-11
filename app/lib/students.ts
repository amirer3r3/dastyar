import "server-only";
import { promises as fs } from "fs";
import path from "path";

export type Student = {
  id: string;
  userId: string;
  name: string;
  grade: string;
  studentNumber: string;
  finalGrade: number | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type StudentInput = Omit<
  Student,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "students.json");

async function readAll(): Promise<Student[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as Student[];
  } catch {
    return [];
  }
}

async function writeAll(students: Student[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(students, null, 2), "utf-8");
}

export async function getStudents(userId: string): Promise<Student[]> {
  const all = await readAll();
  return all
    .filter((s) => s.userId === userId)
    .sort((a, b) => a.name.localeCompare(b.name, "fa"));
}

export async function getStudent(
  userId: string,
  id: string
): Promise<Student | undefined> {
  const all = await readAll();
  return all.find((s) => s.id === id && s.userId === userId);
}

export async function createStudent(
  userId: string,
  input: StudentInput
): Promise<Student> {
  const all = await readAll();
  const now = new Date().toISOString();
  const student: Student = {
    id: crypto.randomUUID(),
    userId,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  all.push(student);
  await writeAll(all);
  return student;
}

export async function updateStudent(
  userId: string,
  id: string,
  input: StudentInput
): Promise<Student | null> {
  const all = await readAll();
  const index = all.findIndex((s) => s.id === id && s.userId === userId);
  if (index === -1) return null;
  const updated: Student = {
    ...all[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  all[index] = updated;
  await writeAll(all);
  return updated;
}

export async function deleteStudent(
  userId: string,
  id: string
): Promise<boolean> {
  const all = await readAll();
  const next = all.filter((s) => !(s.id === id && s.userId === userId));
  if (next.length === all.length) return false;
  await writeAll(next);
  return true;
}

export function getClassStats(students: Student[]) {
  const graded = students.filter((s) => s.finalGrade !== null);
  const average =
    graded.length > 0
      ? graded.reduce((sum, s) => sum + (s.finalGrade ?? 0), 0) / graded.length
      : null;
  return {
    total: students.length,
    gradedCount: graded.length,
    average,
  };
}
