"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./Header";
import MainToolbar from "./MainToolbar";
import TextSubToolbar from "./TextSubToolbar";
import {
  StudioQuestionBankPanel,
  StudioQuestionBankToggle,
} from "./StudioQuestionBank";
import {
  defaultQuestionStyle,
  questionStylesEqual,
  type WorksheetQuestionStyle,
} from "../question-style";
import type { ExamHeaderVariant, WorksheetTheme } from "../types";
import Canvas from "./Canvas";
import FooterBar from "./FooterBar";
import PreviewModal from "./PreviewModal";
import FormulaModal from "./formula-modal";
import { upsertManualDraft } from "./draft-storage";
import { useExamDesignerStore } from "./store/exam-designer-store";
import {
  manualLayoutFingerprint,
  type DesignerDocument,
  type ManualLayout,
} from "./types";

type Props = {
  layout: ManualLayout;
  onChange: (layout: ManualLayout) => void;
  sheetTitle?: string;
  meta?: {
    subject?: string;
    grade?: string;
    bismillah?: string;
    worksheetDate?: string;
    schoolName?: string;
    examDistrict?: string;
    examCity?: string;
    examDuration?: string;
    footerMessage?: string;
    headerVariant?: ExamHeaderVariant;
  };
  theme?: WorksheetTheme;
  headerVariant?: ExamHeaderVariant;
  onHeaderVariantChange?: (variant: ExamHeaderVariant) => void;
  titleFontSize?: string;
  questionStyle?: WorksheetQuestionStyle;
  onQuestionStyleChange?: (style: WorksheetQuestionStyle) => void;
  initialDocument?: DesignerDocument | null;
  activeDraftId?: string | null;
  onClose: () => void;
  onDraftSaved?: () => void;
};

export default function ManualDesignEditor({
  layout,
  onChange,
  sheetTitle,
  meta,
  initialDocument,
  activeDraftId,
  onClose,
  onDraftSaved,
  theme = "formal",
  titleFontSize = "18px",
  questionStyle,
  onQuestionStyleChange,
  headerVariant: headerVariantProp,
  onHeaderVariantChange,
}: Props) {
  const hydrate = useExamDesignerStore((s) => s.hydrate);
  const setWorksheetTheme = useExamDesignerStore((s) => s.setWorksheetTheme);
  const setTitleFontSize = useExamDesignerStore((s) => s.setTitleFontSize);
  const storeQuestionStyle = useExamDesignerStore((s) => s.questionStyle);
  const setHeaderVariant = useExamDesignerStore((s) => s.setHeaderVariant);
  const setExamDuration = useExamDesignerStore((s) => s.setExamDuration);
  const setFooterMessage = useExamDesignerStore((s) => s.setFooterMessage);
  const getDocument = useExamDesignerStore((s) => s.getDocument);
  const blocks = useExamDesignerStore((s) => s.blocks);
  const columns = useExamDesignerStore((s) => s.columns);
  const toolTab = useExamDesignerStore((s) => s.toolTab);
  const toast = useExamDesignerStore((s) => s.toast);
  const dirty = useExamDesignerStore((s) => s.dirty);
  const selectedId = useExamDesignerStore((s) => s.selectedId);
  const setToast = useExamDesignerStore((s) => s.setToast);
  const addFormulaBlock = useExamDesignerStore((s) => s.addFormulaBlock);
  const saveLocal = useExamDesignerStore((s) => s.saveLocal);
  const saveTemplate = useExamDesignerStore((s) => s.saveTemplate);
  const clearSheet = useExamDesignerStore((s) => s.clearSheet);
  const undo = useExamDesignerStore((s) => s.undo);
  const redo = useExamDesignerStore((s) => s.redo);
  const removeBlock = useExamDesignerStore((s) => s.removeBlock);
  const setPreviewOpen = useExamDesignerStore((s) => s.setPreviewOpen);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formulaOpen, setFormulaOpen] = useState(false);
  const [bankEnabled, setBankEnabled] = useState(false);
  const synced = useRef(false);
  const skipLayoutEmitRef = useRef(true);
  const lastEmittedLayoutRef = useRef<ManualLayout | null>(null);
  const lastEmittedFingerprintRef = useRef<string | null>(null);
  const lastStylePushKeyRef = useRef<string | null>(null);
  const lastHeaderVariantPropRef = useRef<ExamHeaderVariant | null>(null);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const onQuestionStyleChangeRef = useRef(onQuestionStyleChange);
  onQuestionStyleChangeRef.current = onQuestionStyleChange;

  useEffect(() => {
    hydrate(
      layout,
      {
        title: sheetTitle,
        subject: meta?.subject,
        grade: meta?.grade,
        bismillah: meta?.bismillah,
        worksheetDate: meta?.worksheetDate,
        schoolName: meta?.schoolName,
        examDistrict: meta?.examDistrict,
        examCity: meta?.examCity,
        examDuration: meta?.examDuration,
        footerMessage: meta?.footerMessage,
        theme,
        titleFontSize,
        questionStyle,
        headerVariant: headerVariantProp ?? meta?.headerVariant,
      },
      initialDocument
        ? { document: initialDocument }
        : { skipStorageRestore: true }
    );
    synced.current = true;
    lastHeaderVariantPropRef.current =
      headerVariantProp ?? meta?.headerVariant ?? "standard";
    skipLayoutEmitRef.current = true;
    const initialBlocks = useExamDesignerStore.getState().blocks;
    const initialColumns = useExamDesignerStore.getState().columns;
    const initialTheme = useExamDesignerStore.getState().worksheetTheme;
    const initialStyle = useExamDesignerStore.getState().questionStyle;
    lastEmittedLayoutRef.current = {
      blocks: initialBlocks,
      columns: initialColumns,
    };
    lastEmittedFingerprintRef.current = manualLayoutFingerprint(
      { blocks: initialBlocks, columns: initialColumns },
      { theme: initialTheme, questionStyle: initialStyle }
    );
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
    // hydrate once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const storeTheme = useExamDesignerStore((s) => s.worksheetTheme);
  const storeTitleFontSize = useExamDesignerStore((s) => s.titleFontSize);

  const layoutFingerprint = useMemo(
    () =>
      manualLayoutFingerprint(
        { blocks, columns },
        { theme: storeTheme, questionStyle: storeQuestionStyle }
      ),
    [blocks, columns, storeTheme, storeQuestionStyle]
  );

  useEffect(() => {
    if (!synced.current) return;
    if (storeTheme !== theme) setWorksheetTheme(theme);
    if (storeTitleFontSize !== titleFontSize) setTitleFontSize(titleFontSize);
  }, [
    theme,
    titleFontSize,
    storeTheme,
    storeTitleFontSize,
    setWorksheetTheme,
    setTitleFontSize,
  ]);

  /** فقط تغییر prop والد → استور (بدون effect معکوس استور → والد) */
  useEffect(() => {
    if (!synced.current) return;
    const prop = headerVariantProp ?? meta?.headerVariant ?? "standard";
    if (lastHeaderVariantPropRef.current === prop) return;
    lastHeaderVariantPropRef.current = prop;
    setHeaderVariant(prop);
  }, [headerVariantProp, meta?.headerVariant, setHeaderVariant]);

  useEffect(() => {
    if (!synced.current) return;
    const fromMeta = meta?.examDuration;
    if (fromMeta === undefined) return;
    setExamDuration(fromMeta);
  }, [meta?.examDuration, setExamDuration]);

  useEffect(() => {
    if (!synced.current) return;
    const fromMeta = meta?.footerMessage;
    if (fromMeta === undefined) return;
    setFooterMessage(fromMeta);
  }, [meta?.footerMessage, setFooterMessage]);

  useEffect(() => {
    if (!synced.current) return;
    const notify = onQuestionStyleChangeRef.current;
    if (!notify) return;
    const parentStyle = questionStyle ?? defaultQuestionStyle();
    if (questionStylesEqual(storeQuestionStyle, parentStyle)) {
      lastStylePushKeyRef.current = null;
      return;
    }
    const styleKey = [
      storeQuestionStyle.fontFamily,
      storeQuestionStyle.fontSize,
      storeQuestionStyle.dividersBetweenQuestions,
      storeQuestionStyle.questionDividerKind,
    ].join("\0");
    if (lastStylePushKeyRef.current === styleKey) return;
    lastStylePushKeyRef.current = styleKey;
    notify(storeQuestionStyle);
  }, [storeQuestionStyle, questionStyle]);

  useEffect(() => {
    if (!synced.current) return;
    if (skipLayoutEmitRef.current) {
      skipLayoutEmitRef.current = false;
      lastEmittedFingerprintRef.current = layoutFingerprint;
      lastEmittedLayoutRef.current = { blocks, columns };
      return;
    }
    if (lastEmittedFingerprintRef.current === layoutFingerprint) return;

    lastEmittedFingerprintRef.current = layoutFingerprint;
    lastEmittedLayoutRef.current = { blocks, columns };
    onChangeRef.current({ blocks, columns });
  }, [layoutFingerprint]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [toast, setToast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const metaKey = e.ctrlKey || e.metaKey;
      if (metaKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }
      if (e.key === "Escape") {
        setPreviewOpen(false);
        setMenuOpen(false);
        setFormulaOpen(false);
        return;
      }
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (
        !typing &&
        selectedId &&
        (e.key === "Backspace" || e.key === "Delete")
      ) {
        e.preventDefault();
        removeBlock(selectedId);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, selectedId, removeBlock, setPreviewOpen]);

  const persistDraftIfNeeded = () => {
    if (blocks.length === 0) return;
    const doc = getDocument();
    upsertManualDraft(doc, activeDraftId ?? null, sheetTitle);
    onDraftSaved?.();
  };

  const requestClose = () => {
    if (dirty) {
      const ok = window.confirm(
        "تغییرات ذخیره‌نشده دارید. به‌عنوان پیش‌نویس ذخیره و خارج شوید؟"
      );
      if (!ok) return;
    }
    persistDraftIfNeeded();
    onClose();
  };

  const handleSave = async () => {
    const doc = saveLocal();
    try {
      await fetch("/api/worksheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doc),
      });
    } catch {
      // local save already succeeded
    }
  };

  return (
    <div
      className="manual-studio persian-nums fixed inset-0 z-[70] flex w-full max-w-[100vw] flex-col overflow-hidden bg-[#f7fbf8]"
      dir="rtl"
    >
      <Header
        onClose={requestClose}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        onSaveTemplate={() => {
          saveTemplate();
          setMenuOpen(false);
        }}
        onClearSheet={() => {
          if (window.confirm("همه محتوای برگه پاک شود؟")) {
            clearSheet();
          }
          setMenuOpen(false);
        }}
      />

      <div className="shrink-0 space-y-1 pb-2 pt-3">
        <MainToolbar onOpenFormula={() => setFormulaOpen(true)} />
        {toolTab === "text" ? (
          <>
            <div className="px-2 sm:px-3">
              <TextSubToolbar />
            </div>
            <StudioQuestionBankToggle
              enabled={bankEnabled}
              onChange={setBankEnabled}
            />
          </>
        ) : null}
      </div>

      {toast ? (
        <div className="mx-3 mb-2 rounded-xl bg-[#e7f6ee] px-3 py-1.5 text-center text-xs font-bold text-[#0E7048]">
          {toast}
        </div>
      ) : null}

      <Canvas
        scrollFooter={
          toolTab === "text" && bankEnabled ? (
            <StudioQuestionBankPanel
              initialGrade={meta?.grade}
              initialSubject={meta?.subject}
            />
          ) : null
        }
      />
      <FooterBar
        onSave={handleSave}
        onHeaderVariantChange={onHeaderVariantChange}
      />
      <PreviewModal />
      <FormulaModal
        open={formulaOpen}
        onClose={() => setFormulaOpen(false)}
        onInsert={(latex) => {
          addFormulaBlock(latex);
          setFormulaOpen(false);
        }}
      />
    </div>
  );
}
