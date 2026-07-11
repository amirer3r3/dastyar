"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import {
  Users,
  Plus,
  Trash2,
  Pencil,
  X,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import {
  saveStudentAction,
  deleteStudentAction,
  updateStudentGradeAction,
  type ClassFormState,
} from "@/app/lib/class-actions";
import type { Student } from "@/app/lib/students";

type FormMode = { kind: "add" } | { kind: "edit"; student: Student } | null;

export default function MyClassClient({
  students,
  stats,
}: {
  students: Student[];
  stats: {
    total: number;
    gradedCount: number;
    average: number | null;
  };
}) {
  const [formMode, setFormMode] = useState<FormMode>(null);
  const [state, formAction, pending] = useActionState(
    saveStudentAction,
    undefined as ClassFormState
  );
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state?.error) {
      setFormMode(null);
    }
    wasPending.current = pending;
  }, [pending, state]);

  return (
    <>
      <main className="flex flex-col gap-4 px-4 pt-2 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-app border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted">
              <Users size={16} />
              <span className="text-xs">تعداد دانش‌آموز</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {stats.total.toLocaleString("fa-IR")}
            </p>
          </div>
          <div className="rounded-app border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 text-muted">
              <BarChart3 size={16} />
              <span className="text-xs">میانگین نمره</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {stats.average !== null
                ? stats.average.toLocaleString("fa-IR", {
                    maximumFractionDigits: 1,
                  })
                : "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">لیست دانش‌آموزان</h2>
          <button
            type="button"
            onClick={() => setFormMode({ kind: "add" })}
            className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-md shadow-primary/30"
          >
            <Plus size={16} />
            افزودن
          </button>
        </div>

        {students.length === 0 ? (
          <div className="mt-6 flex flex-col items-center gap-3 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <Users size={36} />
            </span>
            <h3 className="text-base font-bold text-foreground">
              هنوز دانش‌آموزی ثبت نشده
            </h3>
            <p className="max-w-xs text-sm text-muted">
              نام، پایه و نمره نهایی دانش‌آموزان کلاس خود را اینجا مدیریت کنید.
            </p>
            <button
              type="button"
              onClick={() => setFormMode({ kind: "add" })}
              className="mt-2 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
            >
              <Plus size={18} />
              افزودن اولین دانش‌آموز
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {students.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onEdit={() => setFormMode({ kind: "edit", student })}
              />
            ))}
          </div>
        )}
      </main>

      {formMode ? (
        <StudentForm
          mode={formMode}
          state={state}
          pending={pending}
          formAction={formAction}
          onClose={() => setFormMode(null)}
        />
      ) : null}
    </>
  );
}

function StudentCard({
  student,
  onEdit,
}: {
  student: Student;
  onEdit: () => void;
}) {
  const [grade, setGrade] = useState(
    student.finalGrade !== null ? String(student.finalGrade) : ""
  );
  const [gradeError, setGradeError] = useState<string | null>(null);

  async function saveGrade() {
    setGradeError(null);
    const formData = new FormData();
    formData.set("id", student.id);
    formData.set("finalGrade", grade);
    const result = await updateStudentGradeAction(formData);
    if (result?.error) setGradeError(result.error);
  }

  return (
    <div className="rounded-app border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <GraduationCap size={22} />
        </span>
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="text-sm font-bold text-foreground">{student.name}</span>
          <span className="text-xs text-muted">
            {student.grade ? `پایه ${student.grade}` : null}
            {student.studentNumber ? ` · کد ${student.studentNumber}` : null}
          </span>
          {student.notes ? (
            <p className="mt-1 text-xs leading-6 text-muted">{student.notes}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={onEdit}
            aria-label="ویرایش"
            className="flex h-9 w-9 items-center justify-center rounded-full text-primary active:bg-primary/10"
          >
            <Pencil size={18} />
          </button>
          <form action={deleteStudentAction}>
            <input type="hidden" name="id" value={student.id} />
            <button
              type="submit"
              aria-label="حذف"
              className="flex h-9 w-9 items-center justify-center rounded-full text-danger active:bg-danger/10"
            >
              <Trash2 size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
        <label className="text-xs font-medium text-muted">نمره نهایی:</label>
        <input
          type="number"
          min={0}
          max={20}
          step={0.5}
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          placeholder="۰–۲۰"
          className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-center text-sm outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={saveGrade}
          className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary active:bg-primary/20"
        >
          ثبت
        </button>
        {gradeError ? (
          <span className="text-xs text-danger">{gradeError}</span>
        ) : null}
      </div>
    </div>
  );
}

function StudentForm({
  mode,
  state,
  pending,
  formAction,
  onClose,
}: {
  mode: FormMode;
  state: ClassFormState;
  pending: boolean;
  formAction: (payload: FormData) => void;
  onClose: () => void;
}) {
  const editing = mode?.kind === "edit" ? mode.student : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-foreground">
            {editing ? "ویرایش دانش‌آموز" : "افزودن دانش‌آموز"}
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

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">نام و نام خانوادگی</span>
            <input
              name="name"
              defaultValue={editing?.name ?? ""}
              required
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="مثلاً علی محمدی"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">پایه</span>
              <input
                name="grade"
                defaultValue={editing?.grade ?? ""}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                placeholder="هفتم"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">شماره دانش‌آموزی</span>
              <input
                name="studentNumber"
                defaultValue={editing?.studentNumber ?? ""}
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                placeholder="اختیاری"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">نمره نهایی (۰ تا ۲۰)</span>
            <input
              name="finalGrade"
              type="number"
              min={0}
              max={20}
              step={0.5}
              defaultValue={
                editing?.finalGrade !== null && editing?.finalGrade !== undefined
                  ? editing.finalGrade
                  : ""
              }
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="اختیاری"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">یادداشت</span>
            <textarea
              name="notes"
              rows={2}
              defaultValue={editing?.notes ?? ""}
              className="resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
              placeholder="توضیحات اختیاری"
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
