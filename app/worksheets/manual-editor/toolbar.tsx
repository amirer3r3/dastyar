"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Sigma,
  Smile,
  Table2,
  Type,
  Palette,
  ALargeSmall,
  Copy,
  Plus,
  Baseline,
} from "lucide-react";
import { WORKSHEET_FONT_OPTIONS as FONTS } from "@/app/lib/project-fonts";

export type StudioToolTab = "text" | "table" | "shapes" | "formula";

type Props = {
  editor: Editor | null;
  toolTab: StudioToolTab;
  onToolTab: (tab: StudioToolTab) => void;
  onAddText: () => void;
  onAddTable: () => void;
  onAddBox: () => void;
  onAddLines: () => void;
  onAddImage: () => void;
  onOpenFormula: () => void;
  fontSize: string;
  onFontSizeChange: (size: string) => void;
};

const TABS: Array<{
  id: StudioToolTab;
  label: string;
  icon: React.ReactNode;
}> = [
  { id: "formula", label: "فرمول ریاضی", icon: <Sigma size={20} /> },
  { id: "shapes", label: "شکل‌ها", icon: <Smile size={20} /> },
  { id: "table", label: "جدول", icon: <Table2 size={20} /> },
  { id: "text", label: "ویرایشگر متن", icon: <Type size={20} /> },
];

const SIZES = ["12px", "14px", "16px", "18px", "20px", "22px", "26px"];

export default function StudioToolbar({
  editor,
  toolTab,
  onToolTab,
  onAddText,
  onAddTable,
  onAddBox,
  onAddLines,
  onAddImage,
  onOpenFormula,
  fontSize,
  onFontSizeChange,
}: Props) {
  const disabled = !editor;

  return (
    <div className="flex flex-col gap-2.5 px-3">
      <p className="text-center text-[11px] font-medium text-muted">ابزارها</p>

      <div className="grid grid-cols-4 gap-2">
        {TABS.map((tab) => {
          const active = toolTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                onToolTab(tab.id);
                if (tab.id === "formula") onOpenFormula();
              }}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border px-1 py-2.5 text-[10px] font-bold transition-colors ${
                active
                  ? "border-transparent bg-[var(--studio)] text-white shadow-md shadow-[var(--studio)]/25"
                  : "border-border bg-card text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {toolTab === "text" ? (
        <div className="studio-subbar no-print flex items-center gap-0.5 overflow-x-auto rounded-2xl border border-border bg-card px-1.5 py-1.5">
          <ToolBtn
            label="رنگ"
            onClick={() => document.getElementById("studio-color")?.click()}
          >
            <Palette size={15} />
            <span className="text-[9px]">رنگ</span>
          </ToolBtn>
          <input
            id="studio-color"
            type="color"
            className="sr-only"
            defaultValue="#111827"
            onChange={(e) =>
              editor?.chain().focus().setColor(e.target.value).run()
            }
          />

          <Divider />

          <label className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl text-[9px] font-medium text-foreground">
            <ALargeSmall size={15} />
            اندازه
            <select
              value={fontSize}
              onChange={(e) => {
                onFontSizeChange(e.target.value);
                editor
                  ?.chain()
                  .focus()
                  .setMark("textStyle", { fontSize: e.target.value })
                  .run();
              }}
              className="sr-only"
            >
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <ToolBtn
            label="کپی"
            disabled={disabled}
            onClick={() => {
              const text = editor?.state.doc.textBetween(
                editor.state.selection.from,
                editor.state.selection.to,
                " "
              );
              if (text) void navigator.clipboard.writeText(text);
            }}
          >
            <Copy size={15} />
            <span className="text-[9px]">همانندساز</span>
          </ToolBtn>

          <Divider />

          <ToolBtn
            label="راست‌چین"
            disabled={disabled}
            active={editor?.isActive({ textAlign: "right" })}
            onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight size={15} />
          </ToolBtn>
          <ToolBtn
            label="وسط"
            disabled={disabled}
            active={editor?.isActive({ textAlign: "center" })}
            onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter size={15} />
          </ToolBtn>
          <ToolBtn
            label="چپ‌چین"
            disabled={disabled}
            active={editor?.isActive({ textAlign: "left" })}
            onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft size={15} />
          </ToolBtn>
          <span className="px-0.5 text-[9px] text-muted">چینش</span>

          <Divider />

          <ToolBtn
            label="ایتالیک"
            disabled={disabled}
            active={editor?.isActive("italic")}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <Italic size={15} />
            <span className="text-[9px]">ایتالیک</span>
          </ToolBtn>
          <ToolBtn
            label="ضخیم"
            disabled={disabled}
            active={editor?.isActive("bold")}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <Bold size={15} />
            <span className="text-[9px]">ضخیم</span>
          </ToolBtn>
          <ToolBtn
            label="خط‌خورده"
            disabled={disabled}
            active={editor?.isActive("strike")}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            <Strikethrough size={15} />
            <span className="text-[9px]">خط‌خورده</span>
          </ToolBtn>

          <Divider />

          <label className="flex h-11 shrink-0 flex-col items-center justify-center px-1 text-[9px] font-medium">
            <Baseline size={15} />
            فونت
            <select
              className="sr-only"
              onChange={(e) =>
                editor?.chain().focus().setFontFamily(e.target.value).run()
              }
              defaultValue={FONTS[0].value}
            >
              {FONTS.map((f) => (
                <option key={f.label} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>

          <ToolBtn label="افزودن متن" onClick={onAddText}>
            <span className="flex items-center">
              <Type size={14} />
              <Plus size={10} className="-mr-0.5" />
            </span>
            <span className="text-[9px]">اضافه کردن متن</span>
          </ToolBtn>
        </div>
      ) : null}

      {toolTab === "shapes" ? (
        <div className="flex gap-2">
          <SubAction onClick={onAddBox}>کادر</SubAction>
          <SubAction onClick={onAddLines}>خطوط پاسخ</SubAction>
          <SubAction onClick={onAddImage}>تصویر</SubAction>
        </div>
      ) : null}

      {toolTab === "formula" ? (
        <div className="flex gap-2">
          <SubAction onClick={onOpenFormula}>درج فرمول</SubAction>
        </div>
      ) : null}

      {toolTab === "table" ? (
        <div className="flex gap-2">
          <SubAction onClick={onAddTable}>افزودن جدول</SubAction>
        </div>
      ) : null}
    </div>
  );
}

function Divider() {
  return <span className="mx-0.5 h-8 w-px shrink-0 bg-border" />;
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
      className={`flex h-11 min-w-11 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 transition-colors disabled:opacity-35 ${
        active
          ? "bg-[var(--studio-soft)] text-[var(--studio)]"
          : "text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function SubAction({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 rounded-2xl border border-border bg-card py-2 text-xs font-bold text-foreground"
    >
      {children}
    </button>
  );
}
