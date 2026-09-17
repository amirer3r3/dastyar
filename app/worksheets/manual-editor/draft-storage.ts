import type { DesignerDocument } from "./types";

export const DRAFTS_STORAGE_KEY = "dastyar.manual-exam.drafts.v1";
export const MAX_MANUAL_DRAFTS = 3;

export type StoredManualDraft = {
  id: string;
  updatedAt: number;
  title: string;
  doc: DesignerDocument;
};

export function readManualDrafts(): StoredManualDraft[] {
  try {
    const raw = localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredManualDraft[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((d) => d?.id && d.doc?.blocks)
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, MAX_MANUAL_DRAFTS);
  } catch {
    return [];
  }
}

export function getManualDraft(id: string): StoredManualDraft | null {
  return readManualDrafts().find((d) => d.id === id) ?? null;
}

export function upsertManualDraft(
  doc: DesignerDocument,
  draftId?: string | null,
  titleHint?: string
): string {
  const now = Date.now();
  const drafts = readManualDrafts();
  const label =
    titleHint?.trim() ||
    doc.title?.trim() ||
    `پیش‌نویس ${new Date(now).toLocaleDateString("fa-IR")}`;

  if (draftId) {
    const idx = drafts.findIndex((d) => d.id === draftId);
    const next: StoredManualDraft = {
      id: draftId,
      updatedAt: now,
      title: label,
      doc,
    };
    if (idx >= 0) {
      drafts[idx] = next;
    } else {
      drafts.unshift(next);
    }
    localStorage.setItem(
      DRAFTS_STORAGE_KEY,
      JSON.stringify(drafts.slice(0, MAX_MANUAL_DRAFTS))
    );
    return draftId;
  }

  const id = crypto.randomUUID();
  const created: StoredManualDraft = {
    id,
    updatedAt: now,
    title: label,
    doc,
  };
  const merged = [created, ...drafts].slice(0, MAX_MANUAL_DRAFTS);
  localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(merged));
  return id;
}

export function removeManualDraft(id: string): void {
  const next = readManualDrafts().filter((d) => d.id !== id);
  localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(next));
}

export function formatDraftSubtitle(updatedAt: number): string {
  return new Date(updatedAt).toLocaleString("fa-IR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
