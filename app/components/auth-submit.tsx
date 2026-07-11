"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export default function AuthSubmit({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-app bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-[0.98] disabled:opacity-60"
    >
      {pending ? <Loader2 size={20} className="animate-spin" /> : null}
      {pending ? "لطفاً صبر کنید..." : label}
    </button>
  );
}
