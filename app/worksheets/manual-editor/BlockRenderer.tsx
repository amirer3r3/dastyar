"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import RichTextField from "./rich-text-field";
import FreeBlockShell from "./FreeBlockShell";
import { defaultBlockStyle, type ManualBlock, type ShapeKind } from "./types";
import { formatPersianNumber } from "@/app/lib/persian-digits";
import QuestionDividerLine from "../QuestionDividerLine";
import QuestionAnswerSpaceHandle from "./QuestionAnswerSpaceHandle";
import { normalizeDividerKind } from "../question-style";
import { useExamDesignerStore } from "./store/exam-designer-store";
import "katex/dist/katex.min.css";

type Props = {
  block: ManualBlock;
  index: number;
  preview: boolean;
};

export default function BlockRenderer({ block, index, preview }: Props) {
  const select = useExamDesignerStore((s) => s.select);
  const selectedId = useExamDesignerStore((s) => s.selectedId);
  const updateBlock = useExamDesignerStore((s) => s.updateBlock);
  const selected = selectedId === block.id && !preview;
  const editingTextBlockId = useExamDesignerStore((s) => s.editingTextBlockId);
  const isBankQuestion = block.type === "bank-question";
  const isFloatingText = block.type === "floating-text";
  const isFreeText = block.type === "text" || isFloatingText;
  const isTextLike = isFreeText || isBankQuestion;
  const isSheetQuestionBlock =
    block.type === "question" || block.type === "bank-question";
  const canEditText =
    !preview &&
    selected &&
    (isSheetQuestionBlock ||
      (isTextLike && editingTextBlockId === block.id));
  const editorFocusRef = useRef<{ focus: () => void } | null>(null);

  useEffect(() => {
    if (!canEditText) return;
    const t = window.setTimeout(() => editorFocusRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [canEditText]);

  const style = block.style ?? defaultBlockStyle();
  const innerStyle = {
    color: style.color,
    fontSize: style.fontSize,
    fontFamily: style.fontFamily,
    textAlign: style.align,
    fontWeight: style.bold ? 700 : 400,
    fontStyle: style.italic ? "italic" : "normal",
  } as const;

  const resizable = block.type !== "divider";
  const isNumberedQuestion =
    block.type === "question" ||
    block.type === "bank-question" ||
    block.type === "checkbox-question";
  const showQuestionNumber = isNumberedQuestion;
  const showAnswerLines =
    block.type === "answer-lines" || block.answerLines > 0;

  if (block.type === "divider") {
    return (
      <FreeBlockShell
        block={block}
        preview={preview}
        resizable
        variant="divider"
      >
        <div className="flex h-full w-full min-w-0 items-center px-0">
          <QuestionDividerLine
            kind={normalizeDividerKind(block.dividerKind ?? "dotted")}
            marginTop={0}
            marginBottom={0}
          />
        </div>
      </FreeBlockShell>
    );
  }

  if (block.type === "image") {
    return (
      <FreeBlockShell block={block} preview={preview} resizable>
        <div className="flex h-full w-full items-center justify-center overflow-hidden bg-black/[0.02]">
          {block.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.imageUrl}
              alt=""
              className="max-h-full max-w-full object-contain"
              draggable={false}
            />
          ) : (
            <span className="text-xs text-muted">بدون تصویر</span>
          )}
        </div>
      </FreeBlockShell>
    );
  }

  return (
    <FreeBlockShell
      block={block}
      preview={preview}
      resizable={resizable}
      variant={isFreeText || isBankQuestion || isFloatingText ? "text" : "default"}
    >
      <div
        className={`h-full w-full min-w-0 ${isFreeText || isBankQuestion ? "px-0 py-0" : "p-1"}`}
        style={{ ...innerStyle, width: "100%" }}
      >
        {block.type === "text" ||
        block.type === "floating-text" ||
        block.type === "question" ||
        block.type === "box" ||
        block.type === "bank-question" ||
        block.type === "checkbox-question" ? (
          <div
            className={
              showQuestionNumber
                ? "flex h-full min-h-0 flex-col"
                : "flex h-full min-h-0 flex-col"
            }
          >
            <div
              className={
                showQuestionNumber
                  ? "flex min-h-0 shrink-0 items-start gap-1.5"
                  : "flex h-full min-h-0 flex-col"
              }
            >
              {showQuestionNumber ? (
                <QuestionNumberPlain
                  block={block}
                  autoIndex={index}
                  preview={preview}
                  selected={selected}
                  onChange={(questionNumber) =>
                    updateBlock(block.id, { questionNumber })
                  }
                />
              ) : null}
              <div className="min-h-0 min-w-0 flex-1 overflow-auto">
                <RichTextField
                  html={block.html}
                  onChange={(html) => updateBlock(block.id, { html })}
                  typography={{
                    fontSize: style.fontSize,
                    fontFamily: style.fontFamily,
                    lineHeight: 1.6,
                  }}
                  onEditorReady={(editor) => {
                    if (isTextLike) {
                      editorFocusRef.current = {
                        focus: () => editor?.commands.focus("end"),
                      };
                    }
                  }}
                  onFocus={() => {
                    if (canEditText) select(block.id);
                  }}
                  onBlur={() => {
                    if (preview || !canEditText) return;
                    window.setTimeout(() => {
                      const shell = document.getElementById(
                        `block-shell-${block.id}`
                      );
                      const active = document.activeElement;
                      if (shell && active && shell.contains(active)) return;
                      if (
                        useExamDesignerStore.getState().editingTextBlockId ===
                        block.id
                      ) {
                        return;
                      }
                      if (
                        useExamDesignerStore.getState().selectedId === block.id
                      ) {
                        select(null);
                      }
                    }, 150);
                  }}
                  editable={
                    preview
                      ? false
                      : isSheetQuestionBlock
                        ? selected
                        : isTextLike
                          ? canEditText
                          : !preview
                  }
                  fillWidth={isTextLike || isSheetQuestionBlock}
                  placeholder="متن را بنویسید..."
                  className={
                    block.type === "box"
                      ? "h-full min-h-[2rem] rounded border border-emerald-200/80 px-2 py-1"
                      : isTextLike
                        ? "h-full min-h-[1.75rem] w-full border-none outline-none"
                        : "h-full min-h-[2rem] border-none outline-none"
                  }
                />
              </div>
            </div>

            {block.type === "checkbox-question" ? (
              <div className="mt-1 flex flex-col gap-1 pr-9 text-sm">
                {(block.options ?? []).map((opt, i) => (
                  <label key={opt.label} className="flex items-center gap-2">
                    <span>{opt.label}</span>
                    <input
                      type="checkbox"
                      checked={opt.checked}
                      disabled={preview}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const next = [...(block.options ?? [])];
                        next[i] = { ...opt, checked: e.target.checked };
                        updateBlock(block.id, { options: next });
                      }}
                      className="h-4 w-4 accent-[#0E7048]"
                    />
                  </label>
                ))}
              </div>
            ) : null}

            {showAnswerLines && isNumberedQuestion ? (
              <div className="mt-2 flex w-full shrink-0 flex-col gap-2 pr-9">
                {Array.from({ length: Math.max(0, block.answerLines) }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="min-h-px border-b border-dotted border-sky-400/80"
                    />
                  )
                )}
              </div>
            ) : null}
            {isNumberedQuestion || block.type === "bank-question" ? (
              <QuestionAnswerSpaceHandle
                questionId={block.id}
                preview={preview}
              />
            ) : null}
          </div>
        ) : null}

        {block.type === "formula" ? (
          <FormulaView latex={block.latex ?? ""} />
        ) : null}

        {block.type === "table" ? (
          <EditableTable
            block={block}
            preview={preview}
            onChange={(cells) => updateBlock(block.id, { cells })}
          />
        ) : null}

        {block.type === "shape" ? (
          <ShapeSvg
            shape={block.shape ?? "rectangle"}
            width={block.width ?? 120}
            height={block.height ?? 80}
          />
        ) : null}

        {showAnswerLines && !isNumberedQuestion ? (
          <div className="mt-1 flex flex-1 flex-col justify-end gap-2">
            {Array.from({ length: Math.max(0, block.answerLines) }).map(
              (_, i) => (
                <div
                  key={i}
                  className="min-h-px border-b border-dotted border-sky-400/80"
                />
              )
            )}
            {!preview && selected && block.type === "answer-lines" ? (
              <div className="no-print flex items-center gap-2 text-[10px] text-muted">
                خطوط
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={block.answerLines}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    updateBlock(block.id, {
                      answerLines: Number(e.target.value) || 0,
                    })
                  }
                  className="h-7 w-12 rounded-lg border border-border px-1 text-xs"
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </FreeBlockShell>
  );
}

function QuestionNumberPlain({
  block,
  autoIndex,
  preview,
  selected,
  onChange,
}: {
  block: ManualBlock;
  autoIndex: number;
  preview: boolean;
  selected: boolean;
  onChange: (questionNumber: string | undefined) => void;
}) {
  const editRef = useRef<HTMLSpanElement>(null);
  const hidden = block.questionNumber === "";
  const autoLabel = formatPersianNumber(autoIndex);
  const displayValue =
    block.questionNumber !== undefined ? block.questionNumber : autoLabel;

  useEffect(() => {
    if (!selected || !editRef.current) return;
    editRef.current.textContent = hidden ? "" : displayValue;
  }, [selected, hidden, displayValue]);

  const plainClass = "shrink-0 pt-0.5 text-sm font-bold leading-7";

  if (preview || !selected) {
    if (hidden) return null;
    return <span className={plainClass}>{displayValue}</span>;
  }

  return (
    <span
      ref={editRef}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-label="شماره سوال — برای حذف، متن را پاک کنید"
      className={`${plainClass} min-w-[0.75rem] max-w-[4rem] cursor-text outline-none data-[empty=true]:text-muted`}
      data-empty={hidden ? "true" : "false"}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onInput={(e) => {
        const raw = e.currentTarget.textContent ?? "";
        const t = raw.replace(/\u200B/g, "").trim();
        if (t === "") {
          onChange("");
          e.currentTarget.dataset.empty = "true";
        } else {
          onChange(t);
          e.currentTarget.dataset.empty = "false";
        }
      }}
      onBlur={(e) => {
        const t = (e.currentTarget.textContent ?? "")
          .replace(/\u200B/g, "")
          .trim();
        if (t === "") onChange("");
        else onChange(t);
      }}
    />
  );
}

function FormulaView({ latex }: { latex: string }) {
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
    <div
      className="flex h-full items-center justify-center overflow-auto py-1"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function EditableTable({
  block,
  preview,
  onChange,
}: {
  block: ManualBlock;
  preview: boolean;
  onChange: (cells: string[][]) => void;
}) {
  const cells = block.cells ?? [];
  return (
    <div className="h-full overflow-auto">
      <table className="studio-table w-full text-sm">
        <tbody>
          {cells.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c}>
                  {preview ? (
                    cell
                  ) : (
                    <input
                      value={cell}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const next = cells.map((rr) => [...rr]);
                        next[r][c] = e.target.value;
                        onChange(next);
                      }}
                      className="w-full bg-transparent outline-none"
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ShapeSvg({
  shape,
  width,
  height,
}: {
  shape: ShapeKind;
  width: number;
  height: number;
}) {
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      {shape === "rectangle" ? (
        <rect
          x="2"
          y="2"
          width={width - 4}
          height={height - 4}
          fill="none"
          stroke="#0E7048"
          strokeWidth="2"
        />
      ) : null}
      {shape === "circle" ? (
        <ellipse
          cx={width / 2}
          cy={height / 2}
          rx={width / 2 - 3}
          ry={height / 2 - 3}
          fill="none"
          stroke="#0E7048"
          strokeWidth="2"
        />
      ) : null}
      {shape === "line" ? (
        <line
          x1="4"
          y1={height / 2}
          x2={width - 4}
          y2={height / 2}
          stroke="#0E7048"
          strokeWidth="3"
        />
      ) : null}
      {shape === "arrow" ? (
        <>
          <line
            x1="6"
            y1={height / 2}
            x2={width - 16}
            y2={height / 2}
            stroke="#0E7048"
            strokeWidth="3"
          />
          <polygon
            points={`${width - 6},${height / 2} ${width - 20},${height / 2 - 8} ${width - 20},${height / 2 + 8}`}
            fill="#0E7048"
          />
        </>
      ) : null}
      {shape === "star" ? (
        <polygon
          points={starPoints(width, height)}
          fill="none"
          stroke="#0E7048"
          strokeWidth="2"
        />
      ) : null}
    </svg>
  );
}

function starPoints(w: number, h: number): string {
  const cx = w / 2;
  const cy = h / 2;
  const outer = Math.min(w, h) / 2 - 4;
  const inner = outer * 0.45;
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 === 0 ? outer : inner;
    pts.push(`${cx + r * Math.cos(ang)},${cy + r * Math.sin(ang)}`);
  }
  return pts.join(" ");
}
