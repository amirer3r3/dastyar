import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import { auth } from "@/auth";
import { getLessonPlan } from "@/app/lib/lesson-plans";
import LessonPlanForm from "../lesson-plan-form";

export default async function EditLessonPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const plan = await getLessonPlan(session.user.id, id);
  if (!plan) {
    notFound();
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center gap-2 bg-background/90 px-4 py-3 backdrop-blur">
        <Link
          href="/lesson-plan"
          aria-label="بازگشت"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground"
        >
          <ArrowRight size={18} />
        </Link>
        <div className="flex items-center gap-2">
          <BookOpen size={20} className="text-primary" />
          <h1 className="text-base font-bold text-foreground">ویرایش طرح درس</h1>
        </div>
      </header>

      <LessonPlanForm plan={plan} />
    </>
  );
}
