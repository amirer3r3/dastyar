"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

export default function ShareLinkButton({ quizId }: { quizId: string }) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/quiz/${quizId}/take`
      : `/quiz/${quizId}/take`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mx-4 mb-4 rounded-app border border-primary/30 bg-primary/5 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Share2 size={18} className="text-primary" />
        <span className="text-sm font-bold text-foreground">اشتراک‌گذاری لینک</span>
      </div>
      <p className="mb-3 text-xs leading-6 text-muted">
        این لینک را برای دانش‌آموزان بفرستید تا بدون نیاز به ورود، آزمون را پاسخ دهند.
      </p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={url}
          dir="ltr"
          className="h-10 flex-1 rounded-app border border-border bg-card px-3 text-xs text-foreground outline-none"
        />
        <button
          type="button"
          onClick={handleCopy}
          className={`flex h-10 shrink-0 items-center gap-1.5 rounded-app px-4 text-sm font-bold transition-colors ${
            copied
              ? "bg-success text-white"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "کپی شد!" : "کپی لینک"}
        </button>
      </div>
    </div>
  );
}
