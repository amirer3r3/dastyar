"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  ListChecks,
  AlignLeft,
  Link2,
} from "lucide-react";
import {
  type Quiz,
  type QuizQuestion,
  type QuestionType,
  questionTypeLabels,
  emptyQuestion,
} from "./types";
import { saveQuizAction, type QuizFormState } from "@/app/lib/quiz-actions";
import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import AuthSubmit from "@/app/components/auth-submit";

const typeIcons: Record<QuestionType, React.ReactNode> = {
  multiple_choice: <ListChecks size={16} />,
  descriptive: <AlignLeft size={16} />,
  matching: <Link2 size={16} />,
};

export default function QuizBuilder({ quiz }: { quiz?: Quiz }) {
  const [title, setTitle] = useState(quiz?.title ?? "");
  const [description, setDescription] = useState(quiz?.description ?? "");
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    quiz?.questions ?? [emptyQuestion()]
  );

  const [state, formAction] = useActionState<QuizFormState, FormData>(
    saveQuizAction,
    undefined
  );

  const addQuestion = (type: QuestionType) =>
    setQuestions((prev) => [...prev, emptyQuestion(type)]);

  const removeQuestion = (id: string) =>
    setQuestions((prev) => prev.filter((q) => q.id !== id));

  const updateQuestion = (id: string, patch: Partial<QuizQuestion>) =>
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q))
    );

  const changeType = (id: string, type: QuestionType) =>
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        const fresh = emptyQuestion(type);
        return { ...fresh, id: q.id, text: q.text };
      })
    );

  return (
    <form action={formAction} className="flex flex-col gap-5 px-4 pt-2 pb-8">
      {quiz ? <input type="hidden" name="id" value={quiz.id} /> : null}
      <input
        type="hidden"
        name="questions"
        value={JSON.stringify(questions)}
        readOnly
      />

      <div className="flex flex-col gap-3 rounded-app border border-border bg-card p-4 shadow-sm">
        <h2 className="text-sm font-bold text-foreground">اطلاعات آزمون</h2>
        <Field
          label="عنوان آزمون"
          value={title}
          onChange={setTitle}
          name="title"
          placeholder="مثلاً آزمون ریاضی فصل ۲"
          required
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">توضیحات</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="راهنمای آزمون برای دانش‌آموزان..."
            className="rounded-app border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">
            سوالات ({questions.length})
          </h2>
        </div>

        {questions.map((q, index) => (
          <QuestionEditor
            key={q.id}
            question={q}
            index={index}
            onUpdate={(patch) => updateQuestion(q.id, patch)}
            onRemove={() => removeQuestion(q.id)}
            onTypeChange={(type) => changeType(q.id, type)}
          />
        ))}

        <div className="flex flex-wrap gap-2">
          {(
            Object.keys(questionTypeLabels) as QuestionType[]
          ).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addQuestion(type)}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-foreground transition-colors active:bg-primary/10"
            >
              <Plus size={14} />
              {typeIcons[type]}
              {questionTypeLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {state?.error ? (
        <div className="flex items-center gap-2 rounded-app bg-danger/10 px-3 py-2.5 text-xs font-medium text-danger">
          <AlertCircle size={16} />
          <span>{state.error}</span>
        </div>
      ) : null}

      <AuthSubmit label={quiz ? "ذخیره آزمون" : "ساخت آزمون"} />
    </form>
  );
}

function QuestionEditor({
  question,
  index,
  onUpdate,
  onRemove,
  onTypeChange,
}: {
  question: QuizQuestion;
  index: number;
  onUpdate: (patch: Partial<QuizQuestion>) => void;
  onRemove: () => void;
  onTypeChange: (type: QuestionType) => void;
}) {
  return (
    <div className="rounded-app border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GripVertical size={16} className="text-muted" />
          <span className="text-xs font-bold text-muted">سوال {index + 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={question.type}
            onChange={(e) => onTypeChange(e.target.value as QuestionType)}
            className="rounded-full border border-border bg-background px-2 py-1 text-xs font-medium text-foreground outline-none"
          >
            {(Object.keys(questionTypeLabels) as QuestionType[]).map((t) => (
              <option key={t} value={t}>
                {questionTypeLabels[t]}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onRemove}
            aria-label="حذف سوال"
            className="text-danger"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <textarea
        value={question.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        rows={2}
        placeholder="متن سوال را بنویسید..."
        className="mb-3 w-full rounded-app border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted"
      />

      {question.type === "multiple_choice" ? (
        <MultipleChoiceEditor question={question} onUpdate={onUpdate} />
      ) : null}

      {question.type === "matching" ? (
        <MatchingEditor question={question} onUpdate={onUpdate} />
      ) : null}

      {question.type === "descriptive" ? (
        <p className="text-xs text-muted">
          دانش‌آموز پاسخ تشریحی خود را می‌نویسد.
        </p>
      ) : null}
    </div>
  );
}

function MultipleChoiceEditor({
  question,
  onUpdate,
}: {
  question: QuizQuestion;
  onUpdate: (patch: Partial<QuizQuestion>) => void;
}) {
  const options = question.options ?? ["", "", "", ""];

  const setOption = (i: number, value: string) => {
    const next = [...options];
    next[i] = value;
    onUpdate({ options: next });
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted">گزینه‌ها (صحیح را انتخاب کنید):</span>
      {options.map((opt, i) => (
        <label
          key={i}
          className={`flex items-center gap-2 rounded-app border px-3 py-2 ${
            question.correctOption === i
              ? "border-success bg-success/10"
              : "border-border bg-background"
          }`}
        >
          <input
            type="radio"
            name={`correct-${question.id}`}
            checked={question.correctOption === i}
            onChange={() => onUpdate({ correctOption: i })}
            className="accent-success"
          />
          <input
            type="text"
            value={opt}
            onChange={(e) => setOption(i, e.target.value)}
            placeholder={`گزینه ${i + 1}`}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
          />
        </label>
      ))}
    </div>
  );
}

function MatchingEditor({
  question,
  onUpdate,
}: {
  question: QuizQuestion;
  onUpdate: (patch: Partial<QuizQuestion>) => void;
}) {
  const pairs = question.pairs ?? [];

  const updatePair = (id: string, field: "left" | "right", value: string) => {
    onUpdate({
      pairs: pairs.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    });
  };

  const addPair = () =>
    onUpdate({
      pairs: [...pairs, { id: crypto.randomUUID(), left: "", right: "" }],
    });

  const removePair = (id: string) =>
    onUpdate({ pairs: pairs.filter((p) => p.id !== id) });

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted">جفت‌های وصل‌کردنی:</span>
      {pairs.map((pair, i) => (
        <div key={pair.id} className="flex items-center gap-2">
          <span className="w-5 text-xs font-bold text-muted">{i + 1}</span>
          <input
            type="text"
            value={pair.left}
            onChange={(e) => updatePair(pair.id, "left", e.target.value)}
            placeholder="ستون چپ"
            className="flex-1 rounded-app border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary placeholder:text-muted"
          />
          <Link2 size={14} className="shrink-0 text-muted" />
          <input
            type="text"
            value={pair.right}
            onChange={(e) => updatePair(pair.id, "right", e.target.value)}
            placeholder="ستون راست"
            className="flex-1 rounded-app border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary placeholder:text-muted"
          />
          <button
            type="button"
            onClick={() => removePair(pair.id)}
            className="text-danger"
            aria-label="حذف جفت"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addPair}
        className="mt-1 flex items-center gap-1 text-xs font-bold text-primary"
      >
        <Plus size={14} />
        افزودن جفت
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  name,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>
      <input
        name={name}
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-app border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted"
      />
    </div>
  );
}
