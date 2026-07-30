import type { ComponentType } from "react";
import { Download } from "lucide-react";
import { auth } from "@/auth";
import { getContentPdfUrl } from "@/app/lib/content-pdfs";
import type { ContentPdfKind } from "@/app/lib/content-pdf-kinds";
import AdminPdfLinkBox from "@/app/components/admin-pdf-link-box";

export default async function ContentPdfSection({
  kind,
  itemId,
  title,
  PdfPanel,
}: {
  kind: ContentPdfKind;
  itemId: string;
  title: string;
  PdfPanel: ComponentType<{ title: string; pdfUrl: string | null }>;
}) {
  const [session, pdfUrl] = await Promise.all([
    auth(),
    getContentPdfUrl(kind, itemId),
  ]);
  const isAdmin = session?.user?.isAdmin === true;

  return (
    <>
      <PdfPanel title={title} pdfUrl={pdfUrl} />

      {isAdmin ? (
        <AdminPdfLinkBox kind={kind} itemId={itemId} currentUrl={pdfUrl} />
      ) : null}

      {pdfUrl ? (
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
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
    </>
  );
}
