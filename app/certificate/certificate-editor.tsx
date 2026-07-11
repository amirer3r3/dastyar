"use client";

import { useRef, useState, useLayoutEffect } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import {
  ArrowRight,
  Award,
  Download,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  type CertificateData,
  type TemplateId,
  templates,
  defaultCertificateData,
} from "./types";
import CertificatePreview, { isBadgeTemplate } from "./certificate-preview";

export default function CertificateEditor() {
  const [data, setData] = useState<CertificateData>(defaultCertificateData);
  const [downloading, setDownloading] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  const update = <K extends keyof CertificateData>(
    key: K,
    value: CertificateData[K]
  ) => setData((prev) => ({ ...prev, [key]: value }));

  const isBadge = isBadgeTemplate(data.templateId);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = isBadge ? 400 : 800;
    const recompute = () => {
      setScale(Math.min(1, container.clientWidth / width));
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(container);
    return () => ro.disconnect();
  }, [isBadge]);

  const handleDownload = async () => {
    const node = exportRef.current;
    if (!node) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      const safeName = data.studentName.trim() || "دانش‌آموز";
      link.download = `تقدیر-${safeName}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert("خطا در ساخت تصویر. دوباره تلاش کنید.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="pb-8">
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-background/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            aria-label="بازگشت"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground"
          >
            <ArrowRight size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <Award size={20} className="text-primary" />
            <h1 className="text-base font-bold text-foreground">
              تقدیرنامه و برچسب
            </h1>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-md shadow-primary/30 disabled:opacity-60"
        >
          {downloading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          {downloading ? "در حال ساخت..." : "دانلود PNG"}
        </button>
      </header>

      <main className="flex flex-col gap-5 px-4 pt-2">
        {/* انتخاب قالب */}
        <section className="rounded-app border border-border bg-card p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-accent" />
            <h2 className="text-sm font-bold text-foreground">انتخاب قالب</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => update("templateId", t.id as TemplateId)}
                className={`flex flex-col items-center gap-1 rounded-app border-2 p-3 text-center transition-colors ${
                  data.templateId === t.id
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <span className="text-2xl">{t.emoji}</span>
                <span className="text-xs font-bold text-foreground">
                  {t.name}
                </span>
                <span className="text-[10px] text-muted">{t.description}</span>
              </button>
            ))}
          </div>
        </section>

        {/* فرم */}
        <section className="flex flex-col gap-3 rounded-app border border-border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-bold text-foreground">اطلاعات</h2>
          <Field
            label="نام دانش‌آموز"
            value={data.studentName}
            onChange={(v) => update("studentName", v)}
            placeholder="مثلاً علی رضایی"
            required
          />
          {!isBadge ? (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground">
                متن تقدیر
              </label>
              <textarea
                value={data.message}
                onChange={(e) => update("message", e.target.value)}
                rows={3}
                placeholder="دلیل تقدیر..."
                className="rounded-app border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted"
              />
            </div>
          ) : null}
          <Field
            label="نام معلم (اختیاری)"
            value={data.teacherName}
            onChange={(v) => update("teacherName", v)}
            placeholder="نام شما"
          />
        </section>

        {/* پیش‌نمایش */}
        <section>
          <h2 className="mb-3 text-sm font-bold text-foreground">پیش‌نمایش</h2>
          <div ref={containerRef} className="w-full overflow-hidden">
            <div
              className="origin-top-right"
              style={{
                transform: `scale(${scale})`,
                height: (isBadge ? 400 : 560) * scale,
              }}
            >
              <div ref={exportRef}>
                <CertificatePreview data={data} />
              </div>
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] text-muted">
            خروجی با کیفیت بالا (۲x) برای چاپ یا ارسال در شاد
          </p>
        </section>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>
      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-app border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted"
      />
    </div>
  );
}
