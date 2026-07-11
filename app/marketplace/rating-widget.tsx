"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { StarInput } from "@/app/components/star-rating";
import { rateItemAction, type RatingFormState } from "@/app/lib/rating-actions";
import type { RatingTarget } from "@/app/lib/ratings";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import AuthSubmit from "@/app/components/auth-submit";

export default function RatingWidget({
  targetType,
  targetId,
  userRating,
  isLoggedIn,
}: {
  targetType: RatingTarget;
  targetId: string;
  userRating: number | null;
  isLoggedIn: boolean;
}) {
  const [state, formAction] = useActionState<RatingFormState, FormData>(
    rateItemAction,
    undefined
  );
  const [score, setScore] = useState(userRating ?? 0);

  if (!isLoggedIn) {
    return (
      <div className="rounded-app border border-border bg-card p-4 text-center">
        <p className="text-sm text-muted">
          <Link href="/login" className="font-bold text-primary">
            وارد شوید
          </Link>{" "}
          تا امتیاز دهید
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-app border border-border bg-card p-4">
      <h3 className="mb-2 text-sm font-bold text-foreground">امتیاز شما</h3>
      <input type="hidden" name="targetType" value={targetType} />
      <input type="hidden" name="targetId" value={targetId} />
      <input type="hidden" name="score" value={score} readOnly />
      <div className="flex justify-center">
        <StarInput value={score} onChange={setScore} />
      </div>
      {state?.error ? (
        <p className="mt-2 flex items-center justify-center gap-1 text-xs text-danger">
          <AlertCircle size={14} />
          {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="mt-2 flex items-center justify-center gap-1 text-xs text-success">
          <CheckCircle2 size={14} />
          {state.success}
        </p>
      ) : null}
      <div className="mt-3">
        <AuthSubmit label="ثبت امتیاز" />
      </div>
    </form>
  );
}
