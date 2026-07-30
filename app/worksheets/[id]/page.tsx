import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";
import { findWorksheetItem } from "../curriculum-data";
import WorksheetPdfPanel from "./worksheet-pdf-panel";
import ContentPdfSection from "@/app/components/content-pdf-section";

export const dynamic = "force-dynamic";

export default async function WorksheetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meta = findWorksheetItem(id);
  if (!meta) notFound();

  const title = `کاربرگ ${meta.subjectTitle} — ${meta.item.title}`;

  return (
    <div className="pb-8">
      <header className="sticky top-0 z-40 flex items-center gap-2 bg-background/90 px-4 py-3 backdrop-blur">
        <Link
          href="/worksheets"
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
            <FileText size={18} />
            <span className="text-xs font-bold">عنوان کاربرگ</span>
          </div>
          <h2 className="text-base font-bold leading-7 text-foreground">
            {title}
          </h2>
        </div>

        <ContentPdfSection
          kind="worksheets"
          itemId={id}
          title={title}
          PdfPanel={WorksheetPdfPanel}
        />
      </main>
    </div>
  );
}
