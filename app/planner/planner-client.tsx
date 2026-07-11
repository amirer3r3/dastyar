"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Pencil,
  X,
  Clock,
  BookOpen,
  PartyPopper,
} from "lucide-react";
import {
  savePlannerItemAction,
  deletePlannerItemAction,
  type PlannerFormState,
} from "@/app/lib/planner-actions";
import {
  addDays,
  dayLabels,
  formatWeekRange,
  plannerTypeLabels,
  type PlannerItem,
  type PlannerItemType,
} from "@/app/planner/types";

const typeIcons: Record<PlannerItemType, typeof Clock> = {
  class: Clock,
  homework: BookOpen,
  event: PartyPopper,
};

const typeColors: Record<PlannerItemType, string> = {
  class: "bg-primary/10 text-primary border-primary/20",
  homework: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  event: "bg-success/10 text-success border-success/20",
};

type FormMode = { kind: "add"; day: number } | { kind: "edit"; item: PlannerItem } | null;

export default function PlannerClient({
  items,
  weekStart,
}: {
  items: PlannerItem[];
  weekStart: string;
}) {
  const router = useRouter();
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [state, formAction, pending] = useActionState(
    savePlannerItemAction,
    undefined as PlannerFormState
  );
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) {
      setFormMode(null);
    }
    wasPending.current = pending;
  }, [pending, state]);

  function navigateWeek(offset: number) {
    const next = addDays(weekStart, offset * 7);
    router.push(`/planner?week=${next}`);
  }

  const itemsByDay = dayLabels.map((_, day) =>
    items.filter((item) => item.dayOfWeek === day)
  );

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              aria-label="بازگشت"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground"
            >
              <ArrowRight size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <CalendarDays size={20} className="text-primary" />
              <h1 className="text-base font-bold text-foreground">برنامه هفتگی</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFormMode({ kind: "add", day: 0 })}
            className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-md shadow-primary/30"
          >
            <Plus size={16} />
            افزودن
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-app border border-border bg-card px-3 py-2">
          <button
            type="button"
            onClick={() => navigateWeek(-1)}
            aria-label="هفته قبل"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted active:bg-background"
          >
            <ChevronRight size={20} />
          </button>
          <div className="text-center">
            <p className="text-sm font-bold text-foreground">
              {formatWeekRange(weekStart)}
            </p>
            <p className="text-xs text-muted">هفته جاری</p>
          </div>
          <button
            type="button"
            onClick={() => navigateWeek(1)}
            aria-label="هفته بعد"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted active:bg-background"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      </header>

      <main className="flex flex-col gap-3 px-4 pt-2 pb-4">
        {items.length === 0 && !formMode ? (
          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <CalendarDays size={36} />
            </span>
            <h2 className="text-base font-bold text-foreground">
              برنامه‌ای برای این هفته ندارید
            </h2>
            <p className="max-w-xs text-sm text-muted">
              ساعات تدریس، تکالیف و رویدادهای کلاسی را اینجا ثبت کنید.
            </p>
            <button
              type="button"
              onClick={() => setFormMode({ kind: "add", day: 0 })}
              className="mt-2 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
            >
              <Plus size={18} />
              افزودن اولین آیتم
            </button>
          </div>
        ) : (
          dayLabels.map((label, day) => {
            const dayItems = itemsByDay[day];

            return (
              <section key={day} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-foreground">{label}</h2>
                  <button
                    type="button"
                    onClick={() => setFormMode({ kind: "add", day })}
                    className="flex h-8 items-center gap-1 rounded-full px-3 text-xs font-medium text-primary active:bg-primary/10"
                  >
                    <Plus size={14} />
                    افزودن
                  </button>
                </div>

                {dayItems.length === 0 ? (
                  <p className="rounded-app border border-dashed border-border px-4 py-3 text-center text-xs text-muted">
                    برنامه‌ای ثبت نشده
                  </p>
                ) : (
                  dayItems.map((item) => {
                    const Icon = typeIcons[item.type];
                    return (
                      <div
                        key={item.id}
                        className={`flex items-start gap-3 rounded-app border p-3 shadow-sm ${typeColors[item.type]}`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card/80">
                          <Icon size={18} />
                        </span>
                        <div className="flex flex-1 flex-col gap-0.5">
                          <span className="text-sm font-bold">{item.title}</span>
                          <span className="text-xs opacity-80">
                            {plannerTypeLabels[item.type]}
                            {item.startTime
                              ? ` · ${item.startTime}${item.endTime ? `–${item.endTime}` : ""}`
                              : null}
                          </span>
                          {item.description ? (
                            <p className="mt-1 text-xs leading-6 opacity-90">
                              {item.description}
                            </p>
                          ) : null}
                        </div>
                        <div className="flex shrink-0 items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => setFormMode({ kind: "edit", item })}
                            aria-label="ویرایش"
                            className="flex h-8 w-8 items-center justify-center rounded-full active:bg-card/80"
                          >
                            <Pencil size={16} />
                          </button>
                          <form action={deletePlannerItemAction}>
                            <input type="hidden" name="id" value={item.id} />
                            <button
                              type="submit"
                              aria-label="حذف"
                              className="flex h-8 w-8 items-center justify-center rounded-full text-danger active:bg-danger/10"
                            >
                              <Trash2 size={16} />
                            </button>
                          </form>
                        </div>
                      </div>
                    );
                  })
                )}
              </section>
            );
          })
        )}
      </main>

      {formMode ? (
        <PlannerForm
          mode={formMode}
          weekStart={weekStart}
          state={state}
          pending={pending}
          formAction={formAction}
          onClose={() => setFormMode(null)}
        />
      ) : null}
    </>
  );
}

function PlannerForm({
  mode,
  weekStart,
  state,
  pending,
  formAction,
  onClose,
}: {
  mode: FormMode;
  weekStart: string;
  state: PlannerFormState;
  pending: boolean;
  formAction: (payload: FormData) => void;
  onClose: () => void;
}) {
  const editing = mode?.kind === "edit" ? mode.item : null;
  const defaultDay = mode?.kind === "add" ? mode.day : (editing?.dayOfWeek ?? 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">
            {editing ? "ویرایش برنامه" : "افزودن به برنامه"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted active:bg-background"
          >
            <X size={20} />
          </button>
        </div>

        <form action={formAction} className="flex flex-col gap-3">
          {editing ? <input type="hidden" name="id" value={editing.id} /> : null}
          <input type="hidden" name="weekStart" value={weekStart} />

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">عنوان</span>
            <input
              name="title"
              defaultValue={editing?.title ?? ""}
              required
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="مثلاً ریاضی هفتم"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">نوع</span>
            <select
              name="type"
              defaultValue={editing?.type ?? "class"}
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {(Object.keys(plannerTypeLabels) as PlannerItemType[]).map((key) => (
                <option key={key} value={key}>
                  {plannerTypeLabels[key]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">روز</span>
            <select
              name="dayOfWeek"
              defaultValue={defaultDay}
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              {dayLabels.map((label, i) => (
                <option key={label} value={i}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">ساعت شروع</span>
              <input
                name="startTime"
                type="time"
                defaultValue={editing?.startTime ?? ""}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">ساعت پایان</span>
              <input
                name="endTime"
                type="time"
                defaultValue={editing?.endTime ?? ""}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">توضیحات</span>
            <textarea
              name="description"
              rows={3}
              defaultValue={editing?.description ?? ""}
              className="resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="جزئیات تکلیف، مکان کلاس و..."
            />
          </label>

          {state?.error ? (
            <p className="text-sm text-danger">{state.error}</p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="mt-1 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {pending ? "در حال ذخیره..." : editing ? "ذخیره تغییرات" : "افزودن"}
          </button>
        </form>
      </div>
    </div>
  );
}
