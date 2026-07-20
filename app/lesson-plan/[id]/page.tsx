import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Download, BookOpen } from "lucide-react";
import {
  findWorksheetItem,
  getAllWorksheetItemIds,
} from "@/app/worksheets/curriculum-data";
import LessonPdfPanel from "./lesson-pdf-panel";

export function generateStaticParams() {
  return getAllWorksheetItemIds().map((id) => ({ id }));
}

export default async function LessonPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meta = findWorksheetItem(id);
  if (!meta) notFound();

  const title = `طرح درس ${meta.subjectTitle} — ${meta.item.title}`;
  const pdfUrl = meta.item.pdfUrl ?? null;

  return (
    <div className="pb-8">
      <header className="sticky top-0 z-40 flex items-center gap-2 bg-background/90 px-4 py-3 backdrop-blur">
        <Link
          href="/lesson-plan"
          aria-label="بازگشت"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card"
        >
          <ArrowRight size={18} />
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold text-foreground">
            {meta.item.title}
          </h1>
          <p className="truncate text-xs text-muted">
            {meta.gradeTitle} · {meta.subjectTitle} · {meta.chapterTitle}
          </p>
        </div>
      </header>

      <main className="flex flex-col gap-4 px-4 pt-2">
        <div className="rounded-app border border-border bg-card p-4 shadow-sm">
          <div className="mb-1 flex items-center gap-2 text-primary">
            <BookOpen size={18} />
            <span className="text-xs font-bold">عنوان طرح درس</span>
          </div>
          <h2 className="text-base font-bold leading-7 text-foreground">
            {title}
          </h2>
        </div>

        <LessonPdfPanel title={title} pdfUrl={pdfUrl} />

        {pdfUrl ? (
          <a
            href={pdfUrl}
            download
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md shadow-primary/30"
          >
            <Download size={18} />
            دانلود PDF
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-muted/30 text-sm font-bold text-muted"
          >
            <Download size={18} />
            فایل PDF به‌زودی اضافه می‌شود
          </button>
        )}
      </main>
    </div>
  );
}
