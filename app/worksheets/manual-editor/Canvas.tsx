"use client";

import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  A4_WIDTH_PX,
  A4_HEIGHT_PX,
  PAGE_GAP_PX,
  computePageCount,
  setStudioPageLayout,
} from "./canvas-layout";
import { useShallow } from "zustand/react/shallow";
import { useExamDesignerStore } from "./store/exam-designer-store";
import BlockRenderer from "./BlockRenderer";
import { formatPersianNumber, toPersianDigits } from "@/app/lib/persian-digits";
import AlignmentGuides from "./AlignmentGuides";
import StudioSheetPage from "./StudioSheetPage";
import { StandardExamPageShell } from "../standard-exam-template";
import StandardExamStudioPage, {
  buildStandardExamHeaderFromStore,
  useStandardExamPages,
} from "./standard-exam-studio";
import AsmanExamStudioPage, { useAsmanExamPages } from "./asman-exam-studio";
import {
  isManualFloatingBlock,
  isStandardExamTableBlockType,
} from "./canvas-elements";

type Props = {
  preview?: boolean;
  scrollFooter?: ReactNode;
};

export default function Canvas({ preview = false, scrollFooter }: Props) {
  const blocks = useExamDesignerStore((s) => s.blocks);
  const zoom = useExamDesignerStore((s) => s.zoom);
  const panMode = useExamDesignerStore((s) => s.panMode);
  const theme = useExamDesignerStore((s) => s.worksheetTheme);
  const headerVariant = useExamDesignerStore((s) => s.headerVariant);
  const questionFontSize = useExamDesignerStore(
    (s) => s.questionStyle.fontSize
  );
  const examHeaderSlice = useExamDesignerStore(
    useShallow((s) => ({
      title: s.title,
      bismillah: s.bismillah,
      worksheetDate: s.worksheetDate,
      schoolName: s.schoolName,
      examDistrict: s.examDistrict,
      examCity: s.examCity,
      examDuration: s.examDuration,
    }))
  );
  const select = useExamDesignerStore((s) => s.select);
  const setCanvasScale = useExamDesignerStore((s) => s.setCanvasScale);
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(0.5);

  const standardPagination = useStandardExamPages(blocks, questionFontSize);
  const asmanPagination = useAsmanExamPages(blocks, questionFontSize);
  const pageCount = useMemo(() => {
    if (theme === "standard") {
      return standardPagination.pages.length;
    }
    if (theme === "asman") {
      return asmanPagination.pages.length;
    }
    return computePageCount(blocks);
  }, [
    theme,
    blocks,
    standardPagination.pages.length,
    asmanPagination.pages.length,
  ]);

  const blocksById = useMemo(
    () => new Map(blocks.map((b) => [b.id, b] as const)),
    [blocks]
  );

  const standardHeaderData = useMemo(
    () => buildStandardExamHeaderFromStore(examHeaderSlice),
    [examHeaderSlice]
  );

  useLayoutEffect(() => {
    setStudioPageLayout({ theme, pageCount, headerVariant });
  }, [theme, pageCount, headerVariant]);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth;
      setFit(Math.min(1, Math.max(0.28, (w - 8) / A4_WIDTH_PX)));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = fit * (zoom / 100);

  useEffect(() => {
    setCanvasScale(scale);
  }, [scale, setCanvasScale]);

  let questionNo = 0;

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !panMode) return;
    let startX = 0;
    let startY = 0;
    let sl = 0;
    let st = 0;
    const down = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-block-shell]")) return;
      startX = e.clientX;
      startY = e.clientY;
      sl = el.scrollLeft;
      st = el.scrollTop;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!el.hasPointerCapture(e.pointerId)) return;
      el.scrollLeft = sl - (e.clientX - startX);
      el.scrollTop = st - (e.clientY - startY);
    };
    const up = (e: PointerEvent) => {
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
    };
  }, [panMode]);

  const totalHeight =
    pageCount * A4_HEIGHT_PX + Math.max(0, pageCount - 1) * PAGE_GAP_PX;

  const showFormalHeader = theme === "formal";

  return (
    <div
      ref={wrapRef}
      className="min-h-0 min-w-0 flex-1 overflow-hidden px-2 sm:px-3"
    >
      <div
        ref={scrollerRef}
        className={`h-full overflow-auto overscroll-contain pb-28 ${
          panMode ? "cursor-grab touch-pan-y active:cursor-grabbing" : ""
        }`}
        style={{ touchAction: panMode ? "pan-x pan-y" : "pan-y" }}
        onClick={(e) => {
          const t = e.target as HTMLElement;
          if (
            t.closest(
              ".standard-exam-table, .standard-exam-free-list, .standard-exam-free-item, .standard-exam-q-cell, .standard-exam-score-input, .standard-exam-answer-space-wrap, .asman-answer-space-wrap, .worksheet-asman-free-studio, .standard-exam-floating-layer, .asman-floating-layer, [data-block-shell]"
            )
          ) {
            return;
          }
          select(null);
        }}
      >
        <div
          className="manual-canvas-scale-viewport mx-auto overflow-visible"
          style={{
            width: A4_WIDTH_PX * scale,
            height: totalHeight * scale,
          }}
        >
          <div
            style={{
              width: A4_WIDTH_PX,
              height: totalHeight,
              transform: `scale(${scale})`,
              transformOrigin: "top right",
            }}
          >
            <div
              id="manual-print-area"
              className={`persian-nums flex flex-col gap-6 ${
                theme === "standard" ? "worksheet-theme-standard school-exam-theme" : ""
              }`}
              dir={theme === "standard" ? "rtl" : undefined}
              style={
                theme === "standard"
                  ? {
                      fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
                    }
                  : undefined
              }
            >
              {theme === "standard"
                ? (() => {
                    let rowOffset = 0;
                    return standardPagination.pages.map((pageRows, pageIndex) => {
                      const startIndex = rowOffset;
                      rowOffset += pageRows.length;
                      return (
                        <StudioSheetPage
                          key={pageIndex}
                          pageIndex={pageIndex}
                          pageCount={pageCount}
                          preview={preview}
                          header={null}
                          continuationHeader={null}
                        >
                          <StandardExamPageShell
                            showHeader={pageIndex === 0}
                            headerData={standardHeaderData}
                            headerVariant={headerVariant}
                            floatingOverlay={
                              <div
                                className="standard-exam-floating-layer floating-elements-overlay"
                                aria-label="لایه عناصر شناور"
                              >
                                {blocks
                                  .filter(
                                    (b) =>
                                      isManualFloatingBlock(b) &&
                                      !isStandardExamTableBlockType(b.type) &&
                                      (b.page ?? 0) === pageIndex
                                  )
                                  .map((block) => (
                                    <BlockRenderer
                                      key={block.id}
                                      block={block}
                                      index={0}
                                      preview={preview}
                                    />
                                  ))}
                              </div>
                            }
                          >
                            <StandardExamStudioPage
                              pageIndex={pageIndex}
                              pageCount={pageCount}
                              pageRows={pageRows}
                              startIndex={startIndex}
                              preview={preview}
                              blocksById={blocksById}
                            />
                          </StandardExamPageShell>
                        </StudioSheetPage>
                      );
                    });
                  })()
                : theme === "asman"
                  ? (() => {
                      let rowOffset = 0;
                      return asmanPagination.pages.map((pageRows, pageIndex) => {
                        const startIndex = rowOffset;
                        rowOffset += pageRows.length;
                        return (
                          <StudioSheetPage
                            key={pageIndex}
                            pageIndex={pageIndex}
                            pageCount={pageCount}
                            preview={preview}
                            header={null}
                            continuationHeader={null}
                          >
                            <div className="absolute inset-0 z-10 bg-transparent">
                              <div className="worksheet-asman-studio-body bg-transparent">
                                <AsmanExamStudioPage
                                  pageIndex={pageIndex}
                                  pageCount={pageCount}
                                  pageRows={pageRows}
                                  startIndex={startIndex}
                                  preview={preview}
                                  blocksById={blocksById}
                                />
                              </div>
                              <div
                                className="standard-exam-floating-layer floating-elements-overlay asman-floating-layer"
                                aria-label="لایه عناصر شناور"
                              >
                                {blocks
                                  .filter(
                                    (b) =>
                                      isManualFloatingBlock(b) &&
                                      !isStandardExamTableBlockType(b.type) &&
                                      (b.page ?? 0) === pageIndex
                                  )
                                  .map((block) => (
                                    <BlockRenderer
                                      key={block.id}
                                      block={block}
                                      index={0}
                                      preview={preview}
                                    />
                                  ))}
                              </div>
                            </div>
                          </StudioSheetPage>
                        );
                      });
                    })()
                : Array.from({ length: pageCount }).map((_, pageIndex) => (
                    <StudioSheetPage
                      key={pageIndex}
                      pageIndex={pageIndex}
                      pageCount={pageCount}
                      preview={preview}
                      header={
                        showFormalHeader ? (
                          <SheetHeader preview={preview} />
                        ) : null
                      }
                      continuationHeader={
                        showFormalHeader ? (
                          <ContinuationHeader pageIndex={pageIndex} />
                        ) : null
                      }
                    >
                      <AlignmentGuides pageIndex={pageIndex} preview={preview} />
                      {blocks.length === 0 && pageIndex === 0 ? (
                        <p className="absolute inset-x-0 top-[40%] px-8 text-center text-sm text-muted">
                          از نوار ابزار، متن، جدول، شکل یا فرمول اضافه کنید.
                        </p>
                      ) : null}
                      {blocks
                        .filter((b) => (b.page ?? 0) === pageIndex)
                        .map((block) => {
                          if (
                            block.type === "question" ||
                            block.type === "bank-question" ||
                            block.type === "checkbox-question"
                          ) {
                            questionNo += 1;
                          }
                          return (
                            <BlockRenderer
                              key={block.id}
                              block={block}
                              index={questionNo}
                              preview={preview}
                            />
                          );
                        })}
                      {pageCount > 1 ? (
                        <span className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[10px] text-muted">
                          {toPersianDigits(pageIndex + 1)} /{" "}
                          {toPersianDigits(pageCount)}
                        </span>
                      ) : null}
                    </StudioSheetPage>
                  ))}
            </div>
          </div>
        </div>
        {scrollFooter ? (
          <div className="mx-auto w-full max-w-[min(100%,520px)] px-1 pb-4 pt-2">
            {scrollFooter}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SheetHeader({ preview }: { preview: boolean }) {
  const title = useExamDesignerStore((s) => s.title);
  const subject = useExamDesignerStore((s) => s.subject);
  const grade = useExamDesignerStore((s) => s.grade);
  void preview;
  return (
    <header className="relative mb-1 grid grid-cols-3 items-start gap-1.5 px-[8mm] pt-[8mm] text-[11px] text-gray-700">
      <div className="space-y-1 text-right">
        <div>نام درس: {subject || "..............."}</div>
        <div>پایه: {grade || "..............."}</div>
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="studio-bismillah-mark" />
        <span className="text-xs font-bold text-[#0E7048]">بسمه تعالی</span>
        <span className="text-[10px] text-muted">{title || "کاربرگ"}</span>
      </div>
      <div className="space-y-1 text-left">
        <div>نام و نام خانوادگی: ...............</div>
        <div>تاریخ: ...............</div>
      </div>
    </header>
  );
}

function ContinuationHeader({ pageIndex }: { pageIndex: number }) {
  const title = useExamDesignerStore((s) => s.title);
  return (
    <header className="flex items-center justify-between px-[8mm] pt-[6mm] text-[10px] text-muted">
      <span>{title || "کاربرگ"}</span>
      <span className="font-bold text-[#0E7048]">
        صفحه {formatPersianNumber(pageIndex + 1)}
      </span>
    </header>
  );
}
