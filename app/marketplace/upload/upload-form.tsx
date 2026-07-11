"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ArrowRight, Upload, AlertCircle } from "lucide-react";
import { uploadPackageAction } from "@/app/lib/marketplace-actions";
import type { MarketplaceFormState } from "@/app/lib/marketplace-actions";
import { categoryLabels } from "@/app/marketplace/types";
import type { PackageCategory } from "@/app/marketplace/types";
import AuthSubmit from "@/app/components/auth-submit";

export default function UploadPackageForm() {
  const [state, formAction] = useActionState<
    MarketplaceFormState,
    FormData
  >(uploadPackageAction, undefined);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center gap-2 bg-background/90 px-4 py-3 backdrop-blur">
        <Link
          href="/marketplace"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card"
        >
          <ArrowRight size={18} />
        </Link>
        <div className="flex items-center gap-2">
          <Upload size={20} className="text-primary" />
          <h1 className="text-base font-bold text-foreground">آپلود پکیج</h1>
        </div>
      </header>

      <form
        action={formAction}
        encType="multipart/form-data"
        className="flex flex-col gap-4 px-4 pt-2 pb-8"
      >
        <div className="rounded-app bg-primary/5 px-4 py-3 text-xs leading-6 text-muted">
          پکیج آموزشی خود را آپلود کنید. فایل PDF یا ZIP (حداکثر ۱۰ مگابایت).
          قیمت ۰ = رایگان.
        </div>

        <Field label="عنوان پکیج" name="title" required placeholder="مثلاً پکیج کاربرگ ریاضی" />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">توضیحات</label>
          <textarea
            name="description"
            required
            rows={3}
            placeholder="محتوای پکیج را توضیح دهید..."
            className="rounded-app border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-xs font-medium">دسته‌بندی</label>
            <select
              name="category"
              className="h-11 rounded-app border border-border bg-card px-3 text-sm outline-none"
            >
              {(Object.keys(categoryLabels) as PackageCategory[]).map((c) => (
                <option key={c} value={c}>
                  {categoryLabels[c]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <label className="text-xs font-medium">قیمت (تومان)</label>
            <input
              name="price"
              type="number"
              min={0}
              defaultValue={0}
              placeholder="۰ = رایگان"
              className="h-11 rounded-app border border-border bg-card px-3 text-sm outline-none"
            />
          </div>
        </div>

        <Field label="ایموجی جلد (پشتیبان)" name="coverEmoji" placeholder="📦" defaultValue="📦" />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">تصویر جلد (اختیاری)</label>
          <input
            name="cover"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml,.jpg,.jpeg,.png,.webp,.svg"
            className="rounded-app border border-border bg-card px-3 py-2 text-sm file:ml-2 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-bold file:text-white"
          />
          <p className="text-[11px] text-muted">
            JPG، PNG، WebP یا SVG — حداکثر ۲ مگابایت. با next/image بهینه نمایش داده می‌شود.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium">فایل پکیج (PDF یا ZIP)</label>
          <input
            name="file"
            type="file"
            required
            accept=".pdf,.zip,application/pdf,application/zip"
            className="rounded-app border border-border bg-card px-3 py-2 text-sm file:ml-2 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-bold file:text-white"
          />
        </div>

        {state?.error ? (
          <div className="flex items-center gap-2 rounded-app bg-danger/10 px-3 py-2.5 text-xs text-danger">
            <AlertCircle size={16} />
            {state.error}
          </div>
        ) : null}

        <AuthSubmit label="انتشار پکیج" />
      </form>
    </>
  );
}

function Field({
  label,
  name,
  placeholder,
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium">{label}</label>
      <input
        name={name}
        type="text"
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-11 rounded-app border border-border bg-card px-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
