"use client";

import { useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Minus,
  Move,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import DividerKindSelect from "../DividerKindSelect";
import { normalizeDividerKind } from "../question-style";
import { computeBlockSnap } from "./alignment-snap";
import {
  clampGeometry,
  DIVIDER_MIN_H,
  DIVIDER_MIN_W,
  blockPageBounds,
  pageContentBounds,
} from "./canvas-layout";
import { useExamDesignerStore } from "./store/exam-designer-store";
import type { ManualBlock } from "./types";

type Props = {
  block: ManualBlock;
  preview: boolean;
  children: React.ReactNode;
  resizable?: boolean;
  variant?: "text" | "default" | "divider";
};

type Corner = "nw" | "ne" | "sw" | "br";

function isEmptyBlockHtml(html: string): boolean {
  return !html
    .replace(/<br\s*\/?>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

export default function FreeBlockShell({
  block,
  preview,
  children,
  resizable = true,
  variant = "default",
}: Props) {
  const selectedId = useExamDesignerStore((s) => s.selectedId);
  const editingTextBlockId = useExamDesignerStore((s) => s.editingTextBlockId);
  const panMode = useExamDesignerStore((s) => s.panMode);
  const select = useExamDesignerStore((s) => s.select);
  const toggleTextBlockEditing = useExamDesignerStore(
    (s) => s.toggleTextBlockEditing
  );
  const updateBlockGeometry = useExamDesignerStore((s) => s.updateBlockGeometry);
  const commitGeometryHistory = useExamDesignerStore(
    (s) => s.commitGeometryHistory
  );
  const removeBlock = useExamDesignerStore((s) => s.removeBlock);
  const duplicateBlock = useExamDesignerStore((s) => s.duplicateBlock);
  const nudgeBlockVertical = useExamDesignerStore((s) => s.nudgeBlockVertical);
  const nudgeBlockWidth = useExamDesignerStore((s) => s.nudgeBlockWidth);
  const updateBlock = useExamDesignerStore((s) => s.updateBlock);
  const applyPainterIfArmed = useExamDesignerStore((s) => s.applyPainterIfArmed);
  const blocks = useExamDesignerStore((s) => s.blocks);
  const setSnapGuides = useExamDesignerStore((s) => s.setSnapGuides);
  const clearSnapGuides = useExamDesignerStore((s) => s.clearSnapGuides);

  const selected = selectedId === block.id && !preview;
  const isText = variant === "text" || block.type === "floating-text";
  const isDivider = variant === "divider" || block.type === "divider";
  const geomLimits = isDivider
    ? { minW: DIVIDER_MIN_W, minH: DIVIDER_MIN_H }
    : undefined;
  const isEditingText = isText && editingTextBlockId === block.id;
  const dragRef = useRef<{ startX: number; startY: number; bx: number; by: number } | null>(
    null
  );

  const x = block.x ?? 24;
  const y = block.y ?? 96;
  const page = block.page ?? 0;
  const width = block.width ?? 280;
  const height = block.height ?? 72;

  const startDrag = (e: React.PointerEvent) => {
    if (preview || panMode) return;
    if (isText && isEditingText) return;
    const target = e.target as HTMLElement;
    if (target.closest("[data-resize-handle]")) return;
    if (target.closest("[data-text-edit-btn]")) return;
    if (target.closest("[data-block-toolbar]")) return;
    if (target.closest("[contenteditable='true']")) return;
    if (target.closest("input, textarea, select, button")) return;
    e.stopPropagation();
    e.preventDefault();
    applyPainterIfArmed(block.id);
    select(block.id);
    dragRef.current = { startX: e.clientX, startY: e.clientY, bx: x, by: y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onDragMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const scale = useExamDesignerStore.getState().canvasScale || 1;
    const dx = (e.clientX - dragRef.current.startX) / scale;
    const dy = (e.clientY - dragRef.current.startY) / scale;
    let nx = dragRef.current.bx + dx;
    let ny = dragRef.current.by + dy;
    let np = page;

    const bounds = blockPageBounds(block, np);
    if (ny + height > bounds.maxY + 24) {
      np = page + 1;
      ny = blockPageBounds(block, np).minY + 8;
    } else if (ny < bounds.minY - 24 && np > 0) {
      np = page - 1;
      ny = blockPageBounds(block, np).maxY - height - 8;
    }

    const snapped = computeBlockSnap({
      x: nx,
      y: ny,
      width,
      height,
      page: np,
      blockId: block.id,
      blocks,
    });
    setSnapGuides(snapped.guides);

    const clamped = clampGeometry(
      snapped.x,
      snapped.y,
      width,
      height,
      np,
      geomLimits,
      blockPageBounds(block, np)
    );
    updateBlockGeometry(block.id, clamped, false);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    clearSnapGuides();
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    commitGeometryHistory();
  };

  const startResize = (corner: Corner, e: React.PointerEvent) => {
    if (preview || !resizable) return;
    if (isDivider && corner !== "br" && corner !== "sw") return;
    e.stopPropagation();
    e.preventDefault();
    select(block.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const scale = useExamDesignerStore.getState().canvasScale || 1;
    const sx = x;
    const sy = y;
    const sw = width;
    const sh = height;

    const move = (ev: PointerEvent) => {
      const dx = (ev.clientX - startX) / scale;
      const dy = (ev.clientY - startY) / scale;
      let nx = sx;
      let ny = sy;
      let nw = sw;
      let nh = sh;

      switch (corner) {
        case "br":
          nw = sw + dx;
          nh = isDivider ? sh : sh + dy;
          break;
        case "sw":
          nx = sx + dx;
          nw = sw - dx;
          nh = isDivider ? sh : sh + dy;
          break;
        case "ne":
          ny = sy + dy;
          nw = sw + dx;
          nh = sh - dy;
          break;
        case "nw":
          nx = sx + dx;
          ny = sy + dy;
          nw = sw - dx;
          nh = sh - dy;
          break;
      }

      if (isDivider) {
        ny = sy;
        nh = sh;
      }

      const clamped = clampGeometry(
        nx,
        ny,
        nw,
        nh,
        page,
        geomLimits,
        blockPageBounds(block, page)
      );
      updateBlockGeometry(block.id, clamped, false);
    };

    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      commitGeometryHistory();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const textEmpty = isText && isEmptyBlockHtml(block.html);
  const showEmptyTextHint = isText && !preview && !selected && textEmpty;

  const shellClass = `relative box-border h-full w-full ${
    isDivider ? "rounded-sm" : "rounded-md"
  } ${
    selected && !preview
      ? isDivider
        ? "outline outline-1 outline-[#0E7048] -outline-offset-0"
        : "outline outline-2 outline-[#0E7048] -outline-offset-1"
      : "outline-none"
  }`;

  return (
    <div
      id={`block-shell-${block.id}`}
      data-block-shell
      className={`absolute touch-none ${selected ? "z-[35]" : "z-[32]"} ${
        preview ? "" : panMode ? "pointer-events-none" : ""
      } ${selected && isText ? "overflow-visible" : ""}`}
      style={{ left: x, top: y, width, height }}
      onClick={(e) => {
        e.stopPropagation();
        if (preview) return;
        applyPainterIfArmed(block.id);
        select(block.id);
      }}
    >
      {selected && !preview && isText ? (
        <>
          <div
            data-block-toolbar
            className="no-print absolute -top-9 left-0 z-30 flex items-center rounded-full border border-border bg-white px-1 py-0.5 shadow-sm"
          >
            <MiniBtn label="حذف" onClick={() => removeBlock(block.id)}>
              <Trash2 size={13} />
            </MiniBtn>
          </div>
          <div
            data-block-toolbar
            className="no-print absolute -top-9 right-0 z-30 flex items-center gap-0.5 rounded-full border border-border bg-white px-1 py-0.5 shadow-sm"
          >
            <button
              type="button"
              data-text-edit-btn
              title={isEditingText ? "پایان ویرایش — جابه‌جایی" : "ویرایش متن"}
              aria-label={isEditingText ? "پایان ویرایش" : "ویرایش متن"}
              aria-pressed={isEditingText}
              onClick={(e) => {
                e.stopPropagation();
                toggleTextBlockEditing(block.id);
              }}
              className={`flex h-7 w-7 items-center justify-center rounded-full ${
                isEditingText
                  ? "bg-[#0E7048] text-white"
                  : "text-[#0E7048] hover:bg-[#e7f6ee]"
              }`}
            >
              <Pencil size={13} strokeWidth={2.25} />
            </button>
            <MiniBtn label="تکثیر" onClick={() => duplicateBlock(block.id)}>
              <Copy size={13} />
            </MiniBtn>
          </div>
        </>
      ) : null}

      <div
        className={`${shellClass} ${
          preview ? "" : isEditingText ? "" : "cursor-move"
        }`}
        onPointerDown={startDrag}
        onPointerMove={onDragMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {showEmptyTextHint ? (
          <span className="no-print pointer-events-none absolute right-1 top-1 z-[1] text-xs text-muted">
            متن — برای انتخاب لمس کنید
          </span>
        ) : null}
        <div
          className={`relative z-[1] h-full w-full min-w-0 overflow-hidden ${
            isText && !isEditingText ? "pointer-events-none" : ""
          }`}
        >
          {children}
        </div>

        {selected && !preview && !isText ? (
          <div
            data-block-toolbar
            className="no-print absolute -top-9 right-0 z-30 flex items-center gap-0.5 rounded-full border border-border bg-white px-1 py-0.5 shadow-sm"
          >
            {block.type === "divider" ? (
              <>
                <MiniBtn
                  label="بالا"
                  onClick={() => nudgeBlockVertical(block.id, -1)}
                >
                  <ChevronUp size={13} />
                </MiniBtn>
                <MiniBtn
                  label="پایین"
                  onClick={() => nudgeBlockVertical(block.id, 1)}
                >
                  <ChevronDown size={13} />
                </MiniBtn>
                <MiniBtn
                  label="کوتاه‌تر"
                  onClick={() => nudgeBlockWidth(block.id, -1)}
                >
                  <Minus size={13} />
                </MiniBtn>
                <MiniBtn
                  label="بلندتر"
                  onClick={() => nudgeBlockWidth(block.id, 1)}
                >
                  <Plus size={13} />
                </MiniBtn>
                <div
                  className="w-[7rem] px-0.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DividerKindSelect
                    size="compact"
                    value={normalizeDividerKind(block.dividerKind ?? "dotted")}
                    onChange={(kind) =>
                      updateBlock(block.id, { dividerKind: kind })
                    }
                  />
                </div>
              </>
            ) : null}
            <MiniBtn label="تکثیر" onClick={() => duplicateBlock(block.id)}>
              <Copy size={13} />
            </MiniBtn>
            <MiniBtn label="حذف" onClick={() => removeBlock(block.id)}>
              <Trash2 size={13} />
            </MiniBtn>
          </div>
        ) : null}

        {selected && !preview && resizable ? (
          isText ? (
            <button
              type="button"
              data-resize-handle
              aria-label="تغییر اندازه"
              onPointerDown={(e) => startResize("br", e)}
              className="no-print absolute -bottom-2 -right-2 z-30 flex h-5 w-5 cursor-nwse-resize items-center justify-center rounded-md border border-[#0E7048] bg-white text-[#0E7048] shadow-md"
              title="تغییر اندازه"
            >
              <Move size={12} strokeWidth={2.5} />
            </button>
          ) : isDivider ? (
            <>
              <Handle
                corner="sw"
                onResize={startResize}
                className="edge"
              />
              <Handle
                corner="br"
                onResize={startResize}
                className="edge"
              />
            </>
          ) : (
            <>
              <Handle corner="nw" onResize={startResize} />
              <Handle corner="ne" onResize={startResize} />
              <Handle corner="sw" onResize={startResize} />
              <Handle corner="br" onResize={startResize} />
            </>
          )
        ) : null}
      </div>
    </div>
  );
}

function Handle({
  corner,
  onResize,
  className = "",
}: {
  corner: Corner;
  onResize: (c: Corner, e: React.PointerEvent) => void;
  className?: string;
}) {
  const pos = className
    ? corner === "sw"
      ? "-left-1.5 top-1/2 -translate-y-1/2 cursor-ew-resize"
      : "-right-1.5 top-1/2 -translate-y-1/2 cursor-ew-resize"
    : corner === "nw"
      ? "-top-1.5 -left-1.5 cursor-nwse-resize"
      : corner === "ne"
        ? "-top-1.5 -right-1.5 cursor-nesw-resize"
        : corner === "sw"
          ? "-bottom-1.5 -left-1.5 cursor-nesw-resize"
          : "-bottom-1.5 -right-1.5 cursor-nesw-resize";

  return (
    <span
      data-resize-handle
      role="presentation"
      onPointerDown={(e) => onResize(corner, e)}
      className={`no-print absolute z-30 h-3 w-3 rounded-sm border-2 border-white bg-[#0E7048] shadow ${pos} ${className}`}
    />
  );
}

function MiniBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="flex h-7 w-7 items-center justify-center rounded-full text-[#0E7048] hover:bg-[#e7f6ee]"
    >
      {children}
    </button>
  );
}
