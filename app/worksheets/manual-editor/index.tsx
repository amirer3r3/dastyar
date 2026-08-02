"use client";

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import ManualToolbar from "./toolbar";
import ElementsSidebar from "./elements-sidebar";
import BlockItem from "./block-item";
import FormulaModal from "./formula-modal";
import {
  type ManualBlock,
  type ManualBlockType,
  type ManualLayout,
  createEmptyQuestionBlock,
  createBoxBlock,
  createAnswerLinesBlock,
  createFormulaBlock,
  createImageBlock,
  createBankQuestionBlock,
} from "./types";

const A4_WIDTH_PX = 793.7;

type Props = {
  layout: ManualLayout;
  onChange: (layout: ManualLayout) => void;
  sheetTitle?: string;
  meta?: { subject?: string; grade?: string; teacher?: string };
};

export default function ManualDesignEditor({
  layout,
  onChange,
  sheetTitle,
  meta,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(
    layout.blocks[0]?.id ?? null
  );
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);
  const [fontSize, setFontSize] = useState("16px");
  const [formulaOpen, setFormulaOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const scaleWrapRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 8 },
    })
  );

  const blockIds = useMemo(
    () => layout.blocks.map((b) => b.id),
    [layout.blocks]
  );

  useLayoutEffect(() => {
    const wrap = scaleWrapRef.current;
    const sheet = sheetRef.current;
    if (!wrap || !sheet) return;

    const recompute = () => {
      const available = wrap.clientWidth;
      const next = Math.min(1, available / A4_WIDTH_PX);
      setScale(next);
      setScaledHeight(sheet.offsetHeight * next);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(wrap);
    ro.observe(sheet);
    return () => ro.disconnect();
  });

  const patchLayout = useCallback(
    (patch: Partial<ManualLayout>) => {
      onChange({ ...layout, ...patch });
    },
    [layout, onChange]
  );

  const updateBlock = useCallback(
    (id: string, patch: Partial<ManualBlock>) => {
      onChange({
        ...layout,
        blocks: layout.blocks.map((b) =>
          b.id === id ? { ...b, ...patch } : b
        ),
      });
    },
    [layout, onChange]
  );

  const removeBlock = useCallback(
    (id: string) => {
      const next = layout.blocks.filter((b) => b.id !== id);
      onChange({ ...layout, blocks: next });
      if (selectedId === id) {
        setSelectedId(next[0]?.id ?? null);
        setActiveEditor(null);
      }
    },
    [layout, onChange, selectedId]
  );

  const addBlock = useCallback(
    (type: ManualBlockType) => {
      let block: ManualBlock;
      switch (type) {
        case "box":
          block = createBoxBlock();
          break;
        case "answer-lines":
          block = createAnswerLinesBlock();
          break;
        case "formula":
          block = createFormulaBlock();
          break;
        case "image":
          block = createImageBlock();
          break;
        case "bank-question":
          block = createBankQuestionBlock();
          break;
        default:
          block = createEmptyQuestionBlock();
      }
      onChange({ ...layout, blocks: [...layout.blocks, block] });
      setSelectedId(block.id);
    },
    [layout, onChange]
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = layout.blocks.findIndex((b) => b.id === active.id);
    const newIndex = layout.blocks.findIndex((b) => b.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onChange({
      ...layout,
      blocks: arrayMove(layout.blocks, oldIndex, newIndex),
    });
  };

  const handleImageFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === "string" ? reader.result : "";
      if (!url) return;
      if (selectedId) {
        const selected = layout.blocks.find((b) => b.id === selectedId);
        if (selected?.type === "image") {
          updateBlock(selectedId, { imageUrl: url });
          return;
        }
      }
      const block = createImageBlock(url);
      onChange({ ...layout, blocks: [...layout.blocks, block] });
      setSelectedId(block.id);
    };
    reader.readAsDataURL(file);
  };

  const insertFormula = (latex: string) => {
    const block = createFormulaBlock(latex);
    onChange({ ...layout, blocks: [...layout.blocks, block] });
    setSelectedId(block.id);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="no-print">
        <ManualToolbar
          editor={activeEditor}
          columns={layout.columns}
          onToggleColumns={() =>
            patchLayout({ columns: layout.columns === 1 ? 2 : 1 })
          }
          onOpenFormula={() => setFormulaOpen(true)}
          onInsertImage={() => fileRef.current?.click()}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
        />
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleImageFile(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
        <div className="order-2 min-w-0 flex-1 lg:order-1">
          <div ref={scaleWrapRef} className="w-full overflow-hidden">
            <div style={{ height: scaledHeight }} className="relative w-full">
              <div
                ref={sheetRef}
                className="sheet-scaler absolute right-0 top-0 origin-top-right"
                style={{ transform: `scale(${scale})` }}
              >
                <div
                  id="manual-print-area"
                  className="a4-sheet bg-white text-gray-900 shadow-xl"
                  style={{
                    fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
                    fontSize,
                  }}
                >
                  <div className="flex min-h-[297mm] flex-col p-[14mm]">
                    <header className="mb-5 border-b-2 border-gray-800 pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-xs leading-6 text-gray-700">
                          {meta?.subject ? (
                            <div>درس: {meta.subject}</div>
                          ) : null}
                          {meta?.grade ? <div>پایه: {meta.grade}</div> : null}
                        </div>
                        <h2 className="flex-1 text-center text-xl font-bold">
                          {sheetTitle || "کاربرگ"}
                        </h2>
                        <div className="text-xs leading-6 text-gray-700">
                          {meta?.teacher ? (
                            <div>معلم: {meta.teacher}</div>
                          ) : null}
                          <div>نام: ...............</div>
                        </div>
                      </div>
                    </header>

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={onDragEnd}
                    >
                      <SortableContext
                        items={blockIds}
                        strategy={verticalListSortingStrategy}
                      >
                        <div
                          className={
                            layout.columns === 2
                              ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
                              : "flex flex-col gap-4"
                          }
                        >
                          {layout.blocks.map((block, index) => (
                            <BlockItem
                              key={block.id}
                              block={block}
                              index={index}
                              selected={selectedId === block.id}
                              fontSize={fontSize}
                              onSelect={() => setSelectedId(block.id)}
                              onChange={(patch) =>
                                updateBlock(block.id, patch)
                              }
                              onRemove={() => removeBlock(block.id)}
                              onActivateEditor={(ed) => {
                                setSelectedId(block.id);
                                setActiveEditor(ed);
                              }}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>

                    {layout.blocks.length === 0 ? (
                      <p className="mt-10 text-center text-sm text-muted">
                        از پنل المان‌ها یک بلاک اضافه کنید.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 w-full shrink-0 no-print lg:order-2 lg:w-[220px]">
          <ElementsSidebar onAdd={addBlock} />
        </div>
      </div>

      <FormulaModal
        open={formulaOpen}
        onClose={() => setFormulaOpen(false)}
        onInsert={insertFormula}
      />
    </div>
  );
}
