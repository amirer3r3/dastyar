import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { ContentPdfKind } from "./content-pdf-kinds";

export type { ContentPdfKind } from "./content-pdf-kinds";

type ContentPdfStore = Record<ContentPdfKind, Record<string, string>>;

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "content-pdfs.json");

const emptyStore = (): ContentPdfStore => ({
  worksheets: {},
  "question-bank": {},
  "lesson-plan": {},
});

async function readStore(): Promise<ContentPdfStore> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<ContentPdfStore>;
    return {
      worksheets: parsed.worksheets ?? {},
      "question-bank": parsed["question-bank"] ?? {},
      "lesson-plan": parsed["lesson-plan"] ?? {},
    };
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: ContentPdfStore): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("writeContentPdfs failed:", err);
    throw new Error("STORAGE_ERROR");
  }
}

export async function getContentPdfUrl(
  kind: ContentPdfKind,
  itemId: string
): Promise<string | null> {
  const store = await readStore();
  const url = store[kind][itemId]?.trim();
  return url ? url : null;
}

export async function setContentPdfUrl(
  kind: ContentPdfKind,
  itemId: string,
  url: string | null
): Promise<void> {
  const store = await readStore();
  const trimmed = url?.trim() ?? "";

  if (!trimmed) {
    delete store[kind][itemId];
  } else {
    store[kind][itemId] = trimmed;
  }

  await writeStore(store);
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
