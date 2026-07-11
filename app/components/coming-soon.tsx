import Link from "next/link";
import { ArrowRight, Hammer } from "lucide-react";
import AppHeader from "./app-header";

export default function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <AppHeader title={title} subtitle="در حال ساخت" />
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Hammer size={36} />
        </span>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <p className="max-w-xs text-sm leading-7 text-muted">
          این بخش در مراحل بعدی توسعه ساخته می‌شود.
        </p>
        <Link
          href="/"
          className="mt-2 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          <ArrowRight size={18} />
          بازگشت به خانه
        </Link>
      </main>
    </>
  );
}
