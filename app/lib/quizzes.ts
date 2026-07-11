import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { Quiz, QuizInput, QuizSubmission } from "@/app/quiz/types";

const DATA_DIR = path.join(process.cwd(), "data");
const QUIZZES_FILE = path.join(DATA_DIR, "quizzes.json");
const SUBMISSIONS_FILE = path.join(DATA_DIR, "quiz-submissions.json");

async function readQuizzes(): Promise<Quiz[]> {
  try {
    const raw = await fs.readFile(QUIZZES_FILE, "utf-8");
    return JSON.parse(raw) as Quiz[];
  } catch {
    return [];
  }
}

async function writeQuizzes(quizzes: Quiz[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(QUIZZES_FILE, JSON.stringify(quizzes, null, 2), "utf-8");
}

async function readSubmissions(): Promise<QuizSubmission[]> {
  try {
    const raw = await fs.readFile(SUBMISSIONS_FILE, "utf-8");
    return JSON.parse(raw) as QuizSubmission[];
  } catch {
    return [];
  }
}

async function writeSubmissions(submissions: QuizSubmission[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    SUBMISSIONS_FILE,
    JSON.stringify(submissions, null, 2),
    "utf-8"
  );
}

export async function getQuizzes(userId: string): Promise<Quiz[]> {
  const all = await readQuizzes();
  return all
    .filter((q) => q.userId === userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getQuiz(
  userId: string,
  id: string
): Promise<Quiz | undefined> {
  const all = await readQuizzes();
  return all.find((q) => q.id === id && q.userId === userId);
}

export async function getQuizById(id: string): Promise<Quiz | undefined> {
  const all = await readQuizzes();
  return all.find((q) => q.id === id);
}

export async function createQuiz(
  userId: string,
  input: QuizInput
): Promise<Quiz> {
  const all = await readQuizzes();
  const now = new Date().toISOString();
  const quiz: Quiz = {
    id: crypto.randomUUID(),
    userId,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  all.push(quiz);
  await writeQuizzes(all);
  return quiz;
}

export async function updateQuiz(
  userId: string,
  id: string,
  input: QuizInput
): Promise<Quiz | null> {
  const all = await readQuizzes();
  const index = all.findIndex((q) => q.id === id && q.userId === userId);
  if (index === -1) return null;

  all[index] = {
    ...all[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  await writeQuizzes(all);
  return all[index];
}

export async function deleteQuiz(userId: string, id: string): Promise<boolean> {
  const all = await readQuizzes();
  const next = all.filter((q) => !(q.id === id && q.userId === userId));
  if (next.length === all.length) return false;
  await writeQuizzes(next);

  const submissions = await readSubmissions();
  await writeSubmissions(submissions.filter((s) => s.quizId !== id));
  return true;
}

export async function getSubmissions(quizId: string): Promise<QuizSubmission[]> {
  const all = await readSubmissions();
  return all
    .filter((s) => s.quizId === quizId)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

export async function createSubmission(
  quizId: string,
  studentName: string,
  answers: QuizSubmission["answers"]
): Promise<QuizSubmission> {
  const all = await readSubmissions();
  const submission: QuizSubmission = {
    id: crypto.randomUUID(),
    quizId,
    studentName: studentName.trim(),
    answers,
    submittedAt: new Date().toISOString(),
    manualGrades: {},
  };
  all.push(submission);
  await writeSubmissions(all);
  return submission;
}

export async function getSubmission(
  quizId: string,
  submissionId: string
): Promise<QuizSubmission | undefined> {
  const all = await readSubmissions();
  return all.find((s) => s.quizId === quizId && s.id === submissionId);
}

export async function updateSubmissionGrades(
  quizId: string,
  submissionId: string,
  manualGrades: Record<string, number>
): Promise<QuizSubmission | null> {
  const all = await readSubmissions();
  const index = all.findIndex(
    (s) => s.quizId === quizId && s.id === submissionId
  );
  if (index === -1) return null;

  all[index] = {
    ...all[index],
    manualGrades: { ...all[index].manualGrades, ...manualGrades },
    gradedAt: new Date().toISOString(),
  };
  await writeSubmissions(all);
  return all[index];
}
