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
    standardPagination,
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

  const panSessionRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    scrollLeft: number;
    scrollTop: number;
    pointerId: number | null;
    touchId: number | null;
  }>({
    active: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
    pointerId: null,
    touchId: null,
  });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !panMode) return;

    const beginPan = (clientX: number, clientY: number) => {
      panSessionRef.current = {
        active: true,
        startX: clientX,
        startY: clientY,
        scrollLeft: el.scrollLeft,
        scrollTop: el.scrollTop,
        pointerId: panSessionRef.current.pointerId,
        touchId: panSessionRef.current.touchId,
      };
    };

    /** Scroll is in viewport px; outer wrapper size already includes `scale`. */
    const movePan = (clientX: number, clientY: number) => {
      const s = panSessionRef.current;
      if (!s.active) return;
      el.scrollLeft = s.scrollLeft - (clientX - s.startX);
      el.scrollTop = s.scrollTop - (clientY - s.startY);
    };

    const endPan = () => {
      panSessionRef.current.active = false;
      panSessionRef.current.pointerId = null;
      panSessionRef.current.touchId = null;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (panSessionRef.current.touchId != null) return;
      panSessionRef.current.pointerId = e.pointerId;
      beginPan(e.clientX, e.clientY);
      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!el.hasPointerCapture(e.pointerId)) return;
      if (e.cancelable) e.preventDefault();
      movePan(e.clientX, e.clientY);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
      endPan();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      if (panSessionRef.current.pointerId != null) return;
      const t = e.touches[0];
      panSessionRef.current.touchId = t.identifier;
      beginPan(t.clientX, t.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      const s = panSessionRef.current;
      if (!s.active || s.touchId == null) return;
      const t = Array.from(e.touches).find((x) => x.identifier === s.touchId);
      if (!t) return;
      e.preventDefault();
      movePan(t.clientX, t.clientY);
    };

    const onTouchEnd = (e: TouchEvent) => {
      const s = panSessionRef.current;
      if (s.touchId == null) return;
      const stillDown = Array.from(e.touches).some(
        (x) => x.identifier === s.touchId
      );
      if (!stillDown) endPan();
    };

    const capture = { capture: true };
    const captureNonPassive = { capture: true, passive: false as const };

    el.addEventListener("pointerdown", onPointerDown, capture);
    el.addEventListener("pointermove", onPointerMove, captureNonPassive);
    el.addEventListener("pointerup", onPointerUp, capture);
    el.addEventListener("pointercancel", onPointerUp, capture);
    el.addEventListener("touchstart", onTouchStart, captureNonPassive);
    el.addEventListener("touchmove", onTouchMove, captureNonPassive);
    el.addEventListener("touchend", onTouchEnd, capture);
    el.addEventListener("touchcancel", onTouchEnd, capture);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown, capture);
      el.removeEventListener("pointermove", onPointerMove, captureNonPassive);
      el.removeEventListener("pointerup", onPointerUp, capture);
      el.removeEventListener("pointercancel", onPointerUp, capture);
      el.removeEventListener("touchstart", onTouchStart, captureNonPassive);
      el.removeEventListener("touchmove", onTouchMove, captureNonPassive);
      el.removeEventListener("touchend", onTouchEnd, capture);
      el.removeEventListener("touchcancel", onTouchEnd, capture);
      endPan();
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
        className={`manual-canvas-viewport h-full overflow-auto overscroll-contain pb-28 ${
          panMode
            ? "manual-canvas-viewport--pan cursor-grab active:cursor-grabbing"
            : ""
        }`}
        style={{ touchAction: panMode ? "none" : "pan-y" }}
        onClick={(e) => {
          if (panMode) return;
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
