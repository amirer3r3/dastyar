"use client";

import { useActionState } from "react";
import { AlertCircle, Target, Wrench, Presentation, ClipboardCheck } from "lucide-react";
import {
  saveLessonPlanAction,
  type LessonPlanFormState,
} from "@/app/lib/lesson-plan-actions";
import type { LessonPlan } from "@/app/lib/lesson-plans";
import AuthSubmit from "@/app/components/auth-submit";

export default function LessonPlanForm({ plan }: { plan?: LessonPlan }) {
  const [state, formAction] = useActionState<LessonPlanFormState, FormData>(
    saveLessonPlanAction,
    undefined
  );

  return (
    <form action={formAction} className="flex flex-col gap-5 px-4 pt-2">
      {plan ? <input type="hidden" name="id" value={plan.id} /> : null}

      {/* اطلاعات کلی */}
      <div className="flex flex-col gap-3 rounded-app border border-border bg-card p-4 shadow-sm">
        <h2 className="text-sm font-bold text-foreground">اطلاعات کلی</h2>
        <Text
          name="title"
          label="عنوان طرح درس"
          defaultValue={plan?.title}
          placeholder="مثلاً تدریس جمع دو رقمی"
          required
        />
        <div className="flex gap-3">
          <Text
            name="subject"
            label="درس"
            defaultValue={plan?.subject}
            placeholder="ریاضی"
          />
          <Text
            name="grade"
            label="پایه"
            defaultValue={plan?.grade}
            placeholder="سوم"
          />
        </div>
        <Text
          name="duration"
          label="مدت زمان"
          defaultValue={plan?.duration}
          placeholder="۴۵ دقیقه"
        />
      </div>

      {/* مراحل تدریس */}
      <div className="flex flex-col gap-4 rounded-app border border-border bg-card p-4 shadow-sm">
        <h2 className="text-sm font-bold text-foreground">مراحل تدریس</h2>

        <Area
          name="objectives"
          label="اهداف درس"
          icon={<Target size={16} className="text-primary" />}
          defaultValue={plan?.objectives}
          placeholder="در پایان درس، دانش‌آموز قادر باشد..."
        />
        <Area
          name="materials"
          label="ابزارهای مورد نیاز"
          icon={<Wrench size={16} className="text-accent" />}
          defaultValue={plan?.materials}
          placeholder="ماژیک، تخته، کارت‌های آموزشی..."
        />
        <Area
          name="method"
          label="روش تدریس"
          icon={<Presentation size={16} className="text-success" />}
          defaultValue={plan?.method}
          placeholder="روش پرسش و پاسخ، کار گروهی..."
        />
        <Area
          name="evaluation"
          label="ارزشیابی"
          icon={<ClipboardCheck size={16} className="text-pink-500" />}
          defaultValue={plan?.evaluation}
          placeholder="پرسش کلاسی، تمرین، آزمونک..."
        />
      </div>

      {state?.error ? (
        <div className="flex items-center gap-2 rounded-app bg-danger/10 px-3 py-2.5 text-xs font-medium text-danger">
          <AlertCircle size={16} />
          <span>{state.error}</span>
        </div>
      ) : null}

      <AuthSubmit label={plan ? "ذخیره تغییرات" : "ذخیره طرح درس"} />
    </form>
  );
}

function Text({
  name,
  label,
  defaultValue,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <label htmlFor={name} className="text-xs font-medium text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-11 rounded-app border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted"
      />
    </div>
  );
}

function Area({
  name,
  label,
  icon,
  defaultValue,
  placeholder,
}: {
  name: string;
  label: string;
  icon: React.ReactNode;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="flex items-center gap-1.5 text-xs font-medium text-foreground"
      >
        {icon}
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={3}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="rounded-app border border-border bg-background px-3 py-2 text-sm leading-6 text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted"
      />
    </div>
  );
}
