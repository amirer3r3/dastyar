"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Editor } from "@tiptap/react";
import katex from "katex";
import { GripVertical, Trash2, Image as ImageIcon } from "lucide-react";
import { formatPersianNumber } from "@/app/lib/persian-digits";
import RichTextField from "./rich-text-field";
import type { ManualBlock } from "./types";
import "katex/dist/katex.min.css";

type Props = {
  block: ManualBlock;
  index: number;
  selected: boolean;
  preview: boolean;
  panMode: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<ManualBlock>) => void;
  onRemove: () => void;
  onActivateEditor: (editor: Editor | null) => void;
};

export default function BlockItem({
  block,
  index,
  selected,
  preview,
  panMode,
  onSelect,
  onChange,
  onRemove,
  onActivateEditor,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id, disabled: preview || panMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const questionNumber = index + 1;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`studio-block relative ${
        selected && !preview
          ? "rounded-lg ring-2 ring-[var(--studio)]/35"
          : ""
      } ${isDragging ? "opacity-70" : ""}`}
    >
      {!preview ? (
        <div className="no-print mb-1 flex items-center justify-between gap-2">
          <button
            type="button"
            className="cursor-grab touch-none text-muted/70 active:cursor-grabbing"
            aria-label="جابجایی"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={15} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="text-danger/80"
            aria-label="حذف بلاک"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ) : null}

      {block.type === "question" ||
      block.type === "box" ||
      block.type === "bank-question" ? (
        <div className="flex items-start gap-2">
          {block.type !== "box" ? (
            <span className="pt-0.5 text-sm font-bold text-gray-800">
              {formatPersianNumber(questionNumber)}.
            </span>
          ) : null}
          <div className="min-w-0 flex-1">
            <RichTextField
              html={block.html}
              onChange={(html) => onChange({ html })}
              onFocus={() => onSelect()}
              onEditorReady={(ed) => {
                if (ed) onActivateEditor(ed);
              }}
              editable={!preview}
              placeholder={
                block.type === "box" ? "متن داخل کادر..." : "متن سوال..."
              }
              className={
                block.type === "box"
                  ? "rounded-md border border-emerald-200 bg-white px-2 py-1"
                  : "px-0.5"
              }
            />
          </div>
        </div>
      ) : null}

      {block.type === "formula" ? (
        <FormulaView
          latex={block.latex ?? ""}
          preview={preview}
          onEdit={(latex) => onChange({ latex })}
        />
      ) : null}

      {block.type === "image" ? (
        <ImageView
          url={block.imageUrl ?? ""}
          preview={preview}
          onChangeUrl={(imageUrl) => onChange({ imageUrl })}
        />
      ) : null}

      {block.type === "answer-lines" ||
      block.type === "question" ||
      block.type === "bank-question" ? (
        <div className="mt-2">
          {(block.type === "answer-lines" || block.answerLines > 0) && (
            <AnswerLinesPreview count={block.answerLines || 1} />
          )}
          {!preview ? (
            <div className="mt-2 flex items-center gap-2 no-print">
              <label className="text-[11px] text-muted">خطوط پاسخ:</label>
              <input
                type="number"
                min={0}
                max={20}
                value={block.answerLines}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                  onChange({ answerLines: Number(e.target.value) || 0 })
                }
                className="w-14 rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none focus:border-[var(--studio)]"
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {!preview &&
      (block.type === "question" || block.type === "bank-question") ? (
        <div className="studio-flower-divider no-print mt-3" aria-hidden="true" />
      ) : null}
    </div>
  );
}

function AnswerLinesPreview({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-3 pt-1">
      {Array.from({ length: Math.max(0, count) }).map((_, i) => (
        <div key={i} className="h-0 border-b border-dotted border-sky-400/80" />
      ))}
    </div>
  );
}

function FormulaView({
  latex,
  preview,
  onEdit,
}: {
  latex: string;
  preview: boolean;
  onEdit: (latex: string) => void;
}) {
  let html = "";
  try {
    html = katex.renderToString(latex || "\\;", {
      throwOnError: false,
      displayMode: true,
    });
  } catch {
    html = "";
  }

  return (
    <div className="space-y-2">
      <div
        className="overflow-x-auto px-2 py-2 text-center"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {!preview ? (
        <input
          dir="ltr"
          value={latex}
          onChange={(e) => onEdit(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="no-print w-full rounded-lg border border-border bg-background px-2 py-1.5 font-mono text-xs outline-none"
          placeholder="LaTeX"
        />
      ) : null}
    </div>
  );
}

function ImageView({
  url,
  preview,
  onChangeUrl,
}: {
  url: string;
  preview: boolean;
  onChangeUrl: (url: string) => void;
}) {
  return (
    <div className="space-y-2">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt="تصویر بلاک"
          className="mx-auto max-h-48 rounded-lg object-contain"
        />
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-8 text-muted">
          <ImageIcon size={22} />
          <span className="text-xs">تصویری انتخاب نشده</span>
        </div>
      )}
      {!preview ? (
        <input
          dir="ltr"
          type="url"
          value={url}
          onChange={(e) => onChangeUrl(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          placeholder="https://..."
          className="no-print w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none"
        />
      ) : null}
    </div>
  );
}
