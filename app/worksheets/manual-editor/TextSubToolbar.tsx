"use client";

import { useRef } from "react";
import {
  Bold,
  Italic,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Palette,
  ALargeSmall,
  Copy,
  Plus,
  Type,
  ImagePlus,
  SeparatorHorizontal,
} from "lucide-react";
import { WORKSHEET_FONT_OPTIONS as FONTS } from "@/app/lib/project-fonts";
import DividerKindSelect from "../DividerKindSelect";
import AnswerRulingSelect from "../AnswerRulingSelect";
import { useExamDesignerStore } from "./store/exam-designer-store";
import { defaultBlockStyle } from "./types";
import { usesSheetQuestionStudio } from "../worksheet-theme-studio";

const SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px"];
const SWATCHES = [
  "#111827",
  "#0E7048",
  "#1d4ed8",
  "#b45309",
  "#be123c",
  "#6d28d9",
];

export default function TextSubToolbar() {
  const selectedId = useExamDesignerStore((s) => s.selectedId);
  const blocks = useExamDesignerStore((s) => s.blocks);
  const pendingStyle = useExamDesignerStore((s) => s.pendingStyle);
  const painterStyle = useExamDesignerStore((s) => s.painterStyle);
  const applyStyle = useExamDesignerStore((s) => s.applyStyle);
  const toggleBold = useExamDesignerStore((s) => s.toggleBold);
  const toggleItalic = useExamDesignerStore((s) => s.toggleItalic);
  const setAlign = useExamDesignerStore((s) => s.setAlign);
  const loadPainter = useExamDesignerStore((s) => s.loadPainter);
  const worksheetTheme = useExamDesignerStore((s) => s.worksheetTheme);
  const addTextBlock = useExamDesignerStore((s) => s.addTextBlock);
  const addQuestion = useExamDesignerStore((s) => s.addQuestion);
  const addFloatingTextBlock = useExamDesignerStore(
    (s) => s.addFloatingTextBlock
  );
  const isSchoolExam = usesSheetQuestionStudio(worksheetTheme);
  const addDivider = useExamDesignerStore((s) => s.addDivider);
  const pendingDividerKind = useExamDesignerStore((s) => s.pendingDividerKind);
  const setPendingDividerKind = useExamDesignerStore(
    (s) => s.setPendingDividerKind
  );
  const answerRulingStyle = useExamDesignerStore((s) => s.answerRulingStyle);
  const setAnswerRulingStyle = useExamDesignerStore(
    (s) => s.setAnswerRulingStyle
  );
  const addImageBlock = useExamDesignerStore((s) => s.addImageBlock);
  const setToast = useExamDesignerStore((s) => s.setToast);
  const colorRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const selected = blocks.find((b) => b.id === selectedId);
  const style = selected?.style ?? pendingStyle ?? defaultBlockStyle();

  return (
    <div className="studio-subbar mt-2 flex flex-nowrap items-stretch gap-0 overflow-x-auto rounded-2xl border border-border bg-white px-1 py-1">
      {/* راست‌ترین: افزودن متن */}
      <ToolBtn
        label={isSchoolExam ? "اضافه کردن سوال" : "اضافه کردن متن"}
        onClick={() => (isSchoolExam ? addQuestion() : addTextBlock())}
      >
        <span className="flex items-center">
          <Type size={14} />
          <Plus size={10} />
        </span>
        {isSchoolExam ? "اضافه کردن سوال" : "اضافه کردن متن"}
      </ToolBtn>

      {isSchoolExam ? (
        <>
          <Hair />
          <ToolBtn
            label="متن شناور"
            onClick={() => addFloatingTextBlock()}
          >
            <span className="flex items-center">
              <ALargeSmall size={14} />
              <Plus size={10} />
            </span>
            متن شناور
          </ToolBtn>
        </>
      ) : null}

      <Hair />

      <ToolBtn label="افزودن عکس" onClick={() => imageRef.current?.click()}>
        <ImagePlus size={16} />
        افزودن عکس
      </ToolBtn>
      <input
        ref={imageRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          if (file.size > 2_500_000) {
            setToast("حجم عکس حداکثر ۲.۵ مگابایت");
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            const url = reader.result;
            if (typeof url === "string") addImageBlock(url);
          };
          reader.readAsDataURL(file);
        }}
      />

      <Hair />

      <label className="relative flex h-10 min-w-10 shrink-0 flex-col items-center justify-center px-1.5 text-[9px] font-medium">
        Aa
        <span>فونت</span>
        <select
          value={style.fontFamily}
          onChange={(e) => applyStyle({ fontFamily: e.target.value })}
          className="absolute inset-0 opacity-0"
        >
          {FONTS.map((f) => (
            <option key={f.label} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </label>

      <Hair />

      <div className="flex shrink-0 items-stretch gap-1 px-0.5">
        <ToolBtn
          label="افزودن خطکشی بین سوالات"
          onClick={() => addDivider(pendingDividerKind)}
        >
          <SeparatorHorizontal size={16} />
          <span className="max-w-[4.5rem] text-center leading-tight">
            خطکشی بین سوالات
          </span>
        </ToolBtn>
        <div className="flex w-[8.5rem] shrink-0 flex-col justify-center self-center">
          <DividerKindSelect
            size="compact"
            value={pendingDividerKind}
            onChange={setPendingDividerKind}
          />
        </div>
      </div>

      {worksheetTheme === "asman" ? (
        <>
          <Hair />
          <div className="flex shrink-0 items-stretch gap-1 px-0.5">
            <span className="max-w-[4rem] self-center text-center text-[9px] leading-tight text-muted">
              نوع خط‌کشی
            </span>
            <div className="flex w-[8.5rem] shrink-0 flex-col justify-center self-center">
              <AnswerRulingSelect
                size="compact"
                value={answerRulingStyle}
                onChange={setAnswerRulingStyle}
              />
            </div>
          </div>
        </>
      ) : null}

      <ToolBtn label="ضخیم" active={style.bold} onClick={toggleBold}>
        <Bold size={16} />
        ضخیم
      </ToolBtn>
      <ToolBtn label="ایتالیک" active={style.italic} onClick={toggleItalic}>
        <Italic size={16} />
        ایتالیک
      </ToolBtn>

      <Hair />

      <span className="shrink-0 self-center px-1 text-[9px] text-muted">چینش</span>
      <ToolBtn
        label="چپ"
        active={style.align === "left"}
        onClick={() => setAlign("left")}
      >
        <AlignLeft size={16} />
      </ToolBtn>
      <ToolBtn
        label="وسط"
        active={style.align === "center"}
        onClick={() => setAlign("center")}
      >
        <AlignCenter size={16} />
      </ToolBtn>
      <ToolBtn
        label="راست"
        active={style.align === "right"}
        onClick={() => setAlign("right")}
      >
        <AlignRight size={16} />
      </ToolBtn>

      <Hair />

      <ToolBtn
        label="همانندساز"
        active={!!painterStyle}
        onClick={loadPainter}
      >
        <Copy size={16} />
        همانندساز
      </ToolBtn>

      <Hair />

      <label className="relative flex h-10 min-w-10 shrink-0 flex-col items-center justify-center rounded-xl px-1.5 text-[9px] font-medium">
        <ALargeSmall size={16} />
        اندازه
        <select
          value={style.fontSize}
          onChange={(e) => applyStyle({ fontSize: e.target.value })}
          className="absolute h-10 w-10 opacity-0"
        >
          {SIZES.map((s) => (
            <option key={s} value={s}>
              {s.replace("px", "")}
            </option>
          ))}
        </select>
      </label>

      <Hair />

      <div className="hidden items-center gap-0.5 px-1 sm:flex">
        {SWATCHES.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={c}
            onClick={() => applyStyle({ color: c })}
            className="h-4 w-4 shrink-0 rounded-full border border-black/10"
            style={{ background: c }}
          />
        ))}
      </div>

      {/* چپ‌ترین: رنگ */}
      <ToolBtn label="رنگ" onClick={() => colorRef.current?.click()}>
        <Palette size={16} />
        رنگ
      </ToolBtn>
      <input
        ref={colorRef}
        type="color"
        value={style.color}
        onChange={(e) => applyStyle({ color: e.target.value })}
        className="sr-only"
      />
    </div>
  );
}

function Hair() {
  return <span className="mx-0.5 h-8 w-px shrink-0 self-center bg-border" />;
}

function ToolBtn({
  children,
  onClick,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`flex h-10 min-w-10 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1.5 text-[9px] font-medium transition ${
        active ? "bg-[#e7f6ee] text-[#0E7048]" : "text-foreground hover:bg-background"
      }`}
    >
      {children}
    </button>
  );
}
