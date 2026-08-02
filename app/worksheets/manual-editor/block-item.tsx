"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Editor } from "@tiptap/react";
import katex from "katex";
import {
  GripVertical,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import RichTextField from "./rich-text-field";
import type { ManualBlock } from "./types";
import "katex/dist/katex.min.css";

type Props = {
  block: ManualBlock;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onChange: (patch: Partial<ManualBlock>) => void;
  onRemove: () => void;
  onActivateEditor: (editor: Editor | null) => void;
  fontSize: string;
};

export default function BlockItem({
  block,
  index,
  selected,
  onSelect,
  onChange,
  onRemove,
  onActivateEditor,
  fontSize,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    fontSize,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative rounded-xl border bg-white p-3 transition-shadow ${
        selected
          ? "border-primary shadow-md shadow-primary/15 ring-2 ring-primary/20"
          : "border-border/80 shadow-sm"
      } ${isDragging ? "opacity-70" : ""}`}
    >
      <div className="mb-2 flex items-center justify-between gap-2 no-print">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="cursor-grab touch-none text-muted active:cursor-grabbing"
            aria-label="جابجایی"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={16} />
          </button>
          <span className="text-[11px] font-bold text-muted">
            {blockLabel(block, index)}
          </span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-danger opacity-70 hover:opacity-100"
          aria-label="حذف بلاک"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {block.type === "question" ||
      block.type === "box" ||
      block.type === "bank-question" ? (
        <RichTextField
          html={block.html}
          onChange={(html) => onChange({ html })}
          onFocus={() => onSelect()}
          onEditorReady={(ed) => {
            if (ed) onActivateEditor(ed);
          }}
          placeholder={
            block.type === "box" ? "متن داخل کادر..." : "متن سوال..."
          }
          className={
            block.type === "box"
              ? "rounded-lg border-2 border-dashed border-border bg-background/50 px-2 py-1"
              : "px-1"
          }
        />
      ) : null}

      {block.type === "formula" ? (
        <FormulaView
          latex={block.latex ?? ""}
          onEdit={(latex) => onChange({ latex })}
        />
      ) : null}

      {block.type === "image" ? (
        <ImageView
          url={block.imageUrl ?? ""}
          onChangeUrl={(imageUrl) => onChange({ imageUrl })}
        />
      ) : null}

      {block.type === "answer-lines" ||
      block.type === "question" ||
      block.type === "bank-question" ? (
        <div className="mt-3">
          {(block.type === "answer-lines" || block.answerLines > 0) && (
            <AnswerLinesPreview count={block.answerLines || 1} />
          )}
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
              className="w-14 rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none focus:border-primary"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function blockLabel(block: ManualBlock, index: number): string {
  switch (block.type) {
    case "question":
      return `سوال ${(index + 1).toLocaleString("fa-IR")}`;
    case "box":
      return "کادر / جدول";
    case "answer-lines":
      return "خطوط پاسخ";
    case "formula":
      return "فرمول";
    case "image":
      return "تصویر";
    case "bank-question":
      return "از بانک سوالات";
    default:
      return "بلاک";
  }
}

function AnswerLinesPreview({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      {Array.from({ length: Math.max(0, count) }).map((_, i) => (
        <div key={i} className="h-0 border-b border-dotted border-gray-400" />
      ))}
    </div>
  );
}

function FormulaView({
  latex,
  onEdit,
}: {
  latex: string;
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
        className="overflow-x-auto rounded-lg bg-background px-2 py-3 text-center"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <input
        dir="ltr"
        value={latex}
        onChange={(e) => onEdit(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-lg border border-border bg-background px-2 py-1.5 font-mono text-xs outline-none focus:border-primary"
        placeholder="LaTeX"
      />
    </div>
  );
}

function ImageView({
  url,
  onChangeUrl,
}: {
  url: string;
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
      <input
        dir="ltr"
        type="url"
        value={url}
        onChange={(e) => onChangeUrl(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        placeholder="https://..."
        className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs outline-none focus:border-primary"
      />
    </div>
  );
}
