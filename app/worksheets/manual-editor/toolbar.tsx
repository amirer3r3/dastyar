"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Sigma,
  ImagePlus,
  Columns2,
  Square,
  Type,
} from "lucide-react";

type Props = {
  editor: Editor | null;
  columns: 1 | 2;
  onToggleColumns: () => void;
  onOpenFormula: () => void;
  onInsertImage: () => void;
  fontSize: string;
  onFontSizeChange: (size: string) => void;
};

const SIZES = [
  { label: "کوچک", value: "14px" },
  { label: "متوسط", value: "16px" },
  { label: "بزرگ", value: "18px" },
  { label: "خیلی بزرگ", value: "22px" },
];

export default function ManualToolbar({
  editor,
  columns,
  onToggleColumns,
  onOpenFormula,
  onInsertImage,
  fontSize,
  onFontSizeChange,
}: Props) {
  const disabled = !editor;

  return (
    <div className="sticky top-[52px] z-30 flex flex-wrap items-center gap-1.5 rounded-2xl border border-border bg-card p-2 shadow-sm">
      <select
        value={fontSize}
        onChange={(e) => onFontSizeChange(e.target.value)}
        className="h-9 rounded-xl border border-border bg-background px-2 text-xs font-medium text-foreground outline-none"
        title="سایز متن"
      >
        {SIZES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <ToolBtn
        disabled={disabled}
        active={editor?.isActive("bold")}
        onClick={() => editor?.chain().focus().toggleBold().run()}
        label="ضخیم"
      >
        <Bold size={15} />
      </ToolBtn>
      <ToolBtn
        disabled={disabled}
        active={editor?.isActive("italic")}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        label="کج"
      >
        <Italic size={15} />
      </ToolBtn>
      <ToolBtn
        disabled={disabled}
        active={editor?.isActive("underline")}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
        label="زیرخط"
      >
        <UnderlineIcon size={15} />
      </ToolBtn>

      <span className="mx-0.5 h-6 w-px bg-border" />

      <ToolBtn
        disabled={disabled}
        active={editor?.isActive({ textAlign: "right" })}
        onClick={() => editor?.chain().focus().setTextAlign("right").run()}
        label="راست‌چین"
      >
        <AlignRight size={15} />
      </ToolBtn>
      <ToolBtn
        disabled={disabled}
        active={editor?.isActive({ textAlign: "center" })}
        onClick={() => editor?.chain().focus().setTextAlign("center").run()}
        label="وسط‌چین"
      >
        <AlignCenter size={15} />
      </ToolBtn>
      <ToolBtn
        disabled={disabled}
        active={editor?.isActive({ textAlign: "left" })}
        onClick={() => editor?.chain().focus().setTextAlign("left").run()}
        label="چپ‌چین"
      >
        <AlignLeft size={15} />
      </ToolBtn>

      <span className="mx-0.5 h-6 w-px bg-border" />

      <ToolBtn disabled={false} onClick={onOpenFormula} label="فرمول">
        <Sigma size={15} />
      </ToolBtn>
      <ToolBtn disabled={false} onClick={onInsertImage} label="تصویر">
        <ImagePlus size={15} />
      </ToolBtn>
      <ToolBtn
        disabled={false}
        active={columns === 2}
        onClick={onToggleColumns}
        label="دو ستونه"
      >
        <Columns2 size={15} />
      </ToolBtn>

      <span className="mr-auto hidden items-center gap-1 text-[10px] text-muted sm:flex">
        <Type size={12} />
        <Square size={12} />
        A4 زنده
      </span>
    </div>
  );
}

function ToolBtn({
  children,
  onClick,
  active,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors disabled:opacity-40 ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
