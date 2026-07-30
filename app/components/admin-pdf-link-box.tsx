"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link2, Upload, Shield } from "lucide-react";
import type { ContentPdfKind } from "@/app/lib/content-pdf-kinds";
import {
  saveContentPdfLink,
  type SavePdfLinkState,
} from "@/app/lib/content-pdf-actions";

const initial: SavePdfLinkState = { ok: false, message: "" };

export default function AdminPdfLinkBox({
  kind,
  itemId,
  currentUrl,
}: {
  kind: ContentPdfKind;
  itemId: string;
  currentUrl: string | null;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState(saveContentPdfLink, initial);

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state, router]);

  return (
    <div className="rounded-app border-2 border-dashed border-amber-500/50 bg-amber-50/80 p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-amber-800">
        <Shield size={16} />
        <span className="text-xs font-bold">پنل ادمین — لینک PDF</span>
      </div>

      <p className="mb-3 text-xs leading-6 text-amber-900/80">
        لینک فایل PDF روی سرور خودتان را وارد کنید و ذخیره بزنید. کاربران عادی
        فقط دکمه دانلود را می‌بینند.
      </p>

      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="kind" value={kind} />
        <input type="hidden" name="itemId" value={itemId} />

        <label className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-amber-900/70">
            آدرس PDF
          </span>
          <div className="relative">
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-amber-700/60">
              <Link2 size={16} />
            </span>
            <input
              name="url"
              type="url"
              dir="ltr"
              defaultValue={currentUrl ?? ""}
              placeholder="https://example.com/file.pdf"
              className="h-11 w-full rounded-xl border border-amber-300/60 bg-white py-2 pr-10 pl-3 text-sm text-foreground outline-none focus:border-amber-500"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-amber-600 text-sm font-bold text-white disabled:opacity-60"
        >
          <Upload size={16} />
          {pending ? "در حال ذخیره…" : "ذخیره لینک PDF"}
        </button>

        {state.message ? (
          <p
            className={`text-xs font-medium ${
              state.ok ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {state.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
