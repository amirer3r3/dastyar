"use client";

import { FileText } from "lucide-react";

export default function LessonPdfPanel({
  title,
  pdfUrl,
}: {
  title: string;
  pdfUrl: string | null;
}) {
  return (
    <div className="overflow-hidden rounded-app border border-border bg-card shadow-sm">
      <div className="border-b border-border px-4 py-2.5">
        <span className="text-xs font-bold text-muted">پیش‌نمایش PDF</span>
      </div>

      {pdfUrl ? (
        <div className="aspect-[3/4] w-full bg-background">
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            title={`پیش‌نمایش ${title}`}
            className="h-full w-full border-0"
          />
        </div>
      ) : (
        <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-primary/5 to-background px-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText size={28} />
          </span>
          <p className="text-sm font-bold text-foreground">{title}</p>
          <p className="max-w-xs text-xs leading-6 text-muted">
            فایل PDF این طرح درس هنوز بارگذاری نشده است. پس از افزودن فایل،
            پیش‌نمایش و دانلود فعال می‌شود.
          </p>
          <div className="mt-2 w-full max-w-[220px] space-y-2 opacity-40">
            <div className="h-3 rounded bg-border" />
            <div className="h-3 w-5/6 rounded bg-border" />
            <div className="h-3 w-4/6 rounded bg-border" />
            <div className="mt-4 h-24 rounded-lg border border-dashed border-border" />
          </div>
        </div>
      )}
    </div>
  );
}
