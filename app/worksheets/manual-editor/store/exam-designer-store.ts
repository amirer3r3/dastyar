import { create } from "zustand";
import {
  clampGeometry,
  computePageCount,
  migrateBlocks,
  nextBlockPlacement,
  nextStandardFloatingPlacement,
  pageContentBounds,
  setStudioPageLayout,
  studioDividerGeometry,
  studioFullWidthTextGeometry,
  DIVIDER_BLOCK_H,
  DIVIDER_MIN_H,
  DIVIDER_MIN_W,
  STUDIO_BLOCK_EDGE_PAD,
  blockPageBounds,
} from "../canvas-layout";
import type { WorksheetTheme } from "../../types";
import {
  normalizeExamHeaderVariant,
  nextExamHeaderVariant,
  prevExamHeaderVariant,
  type ExamHeaderVariant,
} from "../../exam-header-variant";
import { normalizeAnswerUnits } from "../../worksheet-question-layout";
import type { QuestionDividerKind, WorksheetQuestionStyle } from "../../question-style";
import {
  defaultQuestionStyle,
  normalizeDividerKind,
} from "../../question-style";
import {
  normalizeAnswerRulingStyle,
  type AnswerRulingStyle,
} from "../../answer-ruling-style";
import type { SnapGuideLines } from "../alignment-snap";
import {
  type BlockStyle,
  type DesignerDocument,
  type DesignerToolTab,
  type ManualBlock,
  type ManualLayout,
  type ShapeKind,
  STORAGE_KEY,
  TEMPLATE_KEY,
  cloneBlocks,
  createAnswerLinesBlock,
  createCheckboxQuestionBlock,
  createDividerBlock,
  createFormulaBlock,
  createImageBlock,
  createShapeBlock,
  createTableBlock,
  createTextBlock,
  createFloatingTextBlock,
  createEmptyQuestionBlock,
  createSheetQuestionBlock,
  createSheetQuestionFromBank,
  defaultBlockStyle,
  defaultManualLayout,
} from "../types";

const QUESTION_BLOCK_TYPES = new Set([
  "question",
  "bank-question",
  "checkbox-question",
]);

function styleFromQuestionSheet(
  style: WorksheetQuestionStyle,
  blockStyle?: BlockStyle
): BlockStyle {
  const base = blockStyle ?? defaultBlockStyle();
  return {
    ...base,
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
  };
}

function applyQuestionStyleToBlocks(
  blocks: ManualBlock[],
  style: WorksheetQuestionStyle
): ManualBlock[] {
  return blocks.map((b) => {
    if (!QUESTION_BLOCK_TYPES.has(b.type)) return b;
    return {
      ...b,
      style: styleFromQuestionSheet(style, b.style),
    };
  });
}

function isQuestionLikeBlock(block: ManualBlock): boolean {
  return (
    block.type === "bank-question" ||
    block.type === "question" ||
    block.type === "checkbox-question"
  );
}

function questionTextToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
  return `<p>${escaped || "..."}</p>`;
}

type HistorySnap = {
  blocks: ManualBlock[];
  columns: 1 | 2;
};

type ExamDesignerState = {
  blocks: ManualBlock[];
  columns: 1 | 2;
  selectedId: string | null;
  /** بلوک متن/بانک در حالت ویرایش با مداد */
  editingTextBlockId: string | null;
  toolTab: DesignerToolTab;
  zoom: number;
  panMode: boolean;
  previewOpen: boolean;
  dirty: boolean;
  toast: string | null;
  title: string;
  subject: string;
  grade: string;
  bismillah: string;
  worksheetDate: string;
  schoolName: string;
  examDistrict: string;
  examCity: string;
  examDuration: string;
  footerMessage: string;
  worksheetTheme: WorksheetTheme;
  headerVariant: ExamHeaderVariant;
  titleFontSize: string;
  questionStyle: WorksheetQuestionStyle;
  answerRulingStyle: AnswerRulingStyle;
  pendingDividerKind: QuestionDividerKind;
  painterStyle: BlockStyle | null;
  pendingStyle: BlockStyle;
  canvasScale: number;
  snapGuides: SnapGuideLines[];
  geometrySnap: HistorySnap | null;
  past: HistorySnap[];
  future: HistorySnap[];
  hydrate: (
    layout: ManualLayout,
    meta: {
      title?: string;
      subject?: string;
      grade?: string;
      theme?: WorksheetTheme;
      titleFontSize?: string;
      questionStyle?: WorksheetQuestionStyle;
      bismillah?: string;
      worksheetDate?: string;
      schoolName?: string;
      examDistrict?: string;
      examCity?: string;
      examDuration?: string;
      footerMessage?: string;
      headerVariant?: ExamHeaderVariant;
    },
    options?: { document?: DesignerDocument; skipStorageRestore?: boolean }
  ) => void;
  setExamDuration: (value: string) => void;
  setFooterMessage: (value: string) => void;
  setHeaderVariant: (variant: ExamHeaderVariant) => void;
  nextHeaderVariant: () => void;
  prevHeaderVariant: () => void;
  setToolTab: (tab: DesignerToolTab) => void;
  select: (id: string | null) => void;
  /** انتخاب + حالت ویرایش برای سؤال روی برگه (تم آزمون مدارس / جدول) */
  selectSheetQuestion: (id: string) => void;
  setEditingTextBlockId: (id: string | null) => void;
  toggleTextBlockEditing: (id: string) => void;
  setZoom: (zoom: number) => void;
  nudgeZoom: (delta: number) => void;
  togglePan: () => void;
  setPreviewOpen: (open: boolean) => void;
  setWorksheetTheme: (theme: WorksheetTheme) => void;
  setTitleFontSize: (titleFontSize: string) => void;
  setQuestionStyle: (patch: Partial<WorksheetQuestionStyle>) => void;
  setAnswerRulingStyle: (style: AnswerRulingStyle) => void;
  setPendingDividerKind: (kind: QuestionDividerKind) => void;
  nudgeBlockVertical: (id: string, dir: -1 | 1) => void;
  nudgeBlockWidth: (id: string, dir: -1 | 1) => void;
  setToast: (message: string | null) => void;
  applyStyle: (patch: Partial<BlockStyle>) => void;
  toggleBold: () => void;
  toggleItalic: () => void;
  setAlign: (align: BlockStyle["align"]) => void;
  loadPainter: () => void;
  applyPainterIfArmed: (id: string) => void;
  addTextBlock: () => string;
  addQuestion: () => string;
  addFloatingTextBlock: () => string;
  addTableBlock: (rows: number, cols: number) => void;
  addShapeBlock: (shape: ShapeKind) => void;
  addFormulaBlock: (latex: string) => void;
  addImageBlock: (imageUrl: string) => void;
  addDivider: (kind?: QuestionDividerKind) => void;
  addCheckboxQuestion: () => void;
  addAnswerLines: () => void;
  addQuestionFromBank: (
    text: string,
    answerLines: number,
    bankQuestionId?: string
  ) => void;
  updateBlock: (id: string, patch: Partial<ManualBlock>) => void;
  beginAnswerSpaceDrag: () => void;
  setQuestionAnswerSpace: (
    id: string,
    answerLines: number,
    options?: { recordHistory?: boolean }
  ) => void;
  commitAnswerSpaceDrag: () => void;
  setQuestionScore: (id: string, score: number | null) => void;
  updateBlockGeometry: (
    id: string,
    patch: Pick<ManualBlock, "x" | "y" | "width" | "height" | "page">,
    recordHistory?: boolean
  ) => void;
  commitGeometryHistory: () => void;
  setCanvasScale: (scale: number) => void;
  setSnapGuides: (guides: SnapGuideLines[]) => void;
  clearSnapGuides: () => void;
  duplicateBlock: (id: string) => void;
  removeBlock: (id: string) => void;
  moveBlock: (id: string, dir: -1 | 1) => void;
  reorder: (activeId: string, overId: string) => void;
  setColumns: (columns: 1 | 2) => void;
  clearSheet: () => void;
  undo: () => void;
  redo: () => void;
  getDocument: () => DesignerDocument;
  saveLocal: () => DesignerDocument;
  saveTemplate: () => void;
  loadSaved: () => boolean;
};

function blockPlacement(state: ExamDesignerState) {
  setStudioPageLayout({
    theme: state.worksheetTheme,
    pageCount: computePageCount(state.blocks),
    headerVariant: state.headerVariant,
  });
  return nextBlockPlacement(state.blocks);
}

function withHistory(
  get: () => ExamDesignerState,
  set: (partial: Partial<ExamDesignerState>) => void,
  mutate: (state: ExamDesignerState) => Partial<ExamDesignerState>
) {
  const state = get();
  const snap: HistorySnap = {
    blocks: cloneBlocks(state.blocks),
    columns: state.columns,
  };
  const next = mutate(state);
  set({
    ...next,
    dirty: true,
    past: [...state.past, snap].slice(-60),
    future: [],
  });
}

export const useExamDesignerStore = create<ExamDesignerState>((set, get) => ({
  blocks: defaultManualLayout().blocks,
  columns: 1,
  selectedId: null,
  editingTextBlockId: null,
  toolTab: "text",
  zoom: 100,
  panMode: false,
  previewOpen: false,
  dirty: false,
  toast: null,
  title: "",
  subject: "",
  grade: "",
  bismillah: "به نام خدا",
  worksheetDate: "",
  schoolName: "",
  examDistrict: "",
  examCity: "",
  examDuration: "",
  footerMessage: "موفق و سربلند باشید",
  worksheetTheme: "standard",
  headerVariant: "standard",
  titleFontSize: "18px",
  questionStyle: defaultQuestionStyle(),
  answerRulingStyle: "none",
  pendingDividerKind: "dotted",
  painterStyle: null,
  pendingStyle: defaultBlockStyle(),
  canvasScale: 1,
  snapGuides: [],
  geometrySnap: null,
  past: [],
  future: [],

  hydrate: (layout, meta, options) => {
    const themeForLayout =
      options?.document?.worksheetTheme ??
      meta.theme ??
      get().worksheetTheme;
    const headerForLayout = normalizeExamHeaderVariant(
      options?.document?.headerVariant ??
        meta.headerVariant ??
        get().headerVariant
    );
    setStudioPageLayout({
      theme: themeForLayout,
      pageCount: computePageCount(
        options?.document?.blocks ?? layout.blocks ?? []
      ),
      headerVariant: headerForLayout,
    });

    if (options?.document) {
      const doc = options.document;
      set({
        blocks: migrateBlocks(cloneBlocks(doc.blocks)),
        columns: doc.columns === 2 ? 2 : 1,
        zoom: typeof doc.zoom === "number" ? doc.zoom : 100,
        selectedId: doc.blocks[0]?.id ?? null,
        title: doc.title ?? meta.title ?? "",
        subject: doc.subject ?? meta.subject ?? "",
        grade: doc.grade ?? meta.grade ?? "",
        bismillah: doc.bismillah ?? meta.bismillah ?? get().bismillah,
        worksheetDate:
          doc.worksheetDate ?? meta.worksheetDate ?? get().worksheetDate,
        schoolName: doc.schoolName ?? meta.schoolName ?? get().schoolName,
        examDistrict:
          doc.examDistrict ?? meta.examDistrict ?? get().examDistrict,
        examCity: doc.examCity ?? meta.examCity ?? get().examCity,
        examDuration:
          doc.examDuration ?? meta.examDuration ?? get().examDuration,
        footerMessage:
          doc.footerMessage ?? meta.footerMessage ?? get().footerMessage,
        worksheetTheme:
          doc.worksheetTheme ?? meta.theme ?? get().worksheetTheme,
        headerVariant: headerForLayout,
        titleFontSize:
          doc.titleFontSize ?? meta.titleFontSize ?? get().titleFontSize,
        questionStyle:
          doc.questionStyle ??
          meta.questionStyle ??
          get().questionStyle,
        pendingDividerKind: normalizeDividerKind(
          doc.questionStyle?.questionDividerKind ??
            meta.questionStyle?.questionDividerKind ??
            get().pendingDividerKind
        ),
        answerRulingStyle: normalizeAnswerRulingStyle(
          doc.answerRulingStyle ?? get().answerRulingStyle
        ),
        dirty: false,
        past: [],
        future: [],
        previewOpen: false,
        panMode: false,
        painterStyle: null,
        toolTab: "text",
      });
      return;
    }
    if (!options?.skipStorageRestore) {
      const restored = get().loadSaved();
      if (restored) {
        set({
          title: meta.title ?? get().title,
          subject: meta.subject ?? get().subject,
          grade: meta.grade ?? get().grade,
          worksheetTheme: meta.theme ?? get().worksheetTheme,
          titleFontSize: meta.titleFontSize ?? get().titleFontSize,
          questionStyle: meta.questionStyle ?? get().questionStyle,
          dirty: false,
          past: [],
          future: [],
          previewOpen: false,
          panMode: false,
          toast: "برگه ذخیره‌شده بازیابی شد",
        });
        return;
      }
    }
    const questionStyle = meta.questionStyle ?? defaultQuestionStyle();
    const migrated = migrateBlocks(cloneBlocks(layout.blocks));
    setStudioPageLayout({
      theme: meta.theme ?? "standard",
      pageCount: computePageCount(migrated),
      headerVariant: headerForLayout,
    });
    set({
      blocks: applyQuestionStyleToBlocks(migrated, questionStyle),
      columns: layout.columns,
      selectedId: layout.blocks[0]?.id ?? null,
      title: meta.title ?? "",
      subject: meta.subject ?? "",
      grade: meta.grade ?? "",
      bismillah: meta.bismillah ?? "به نام خدا",
      worksheetDate: meta.worksheetDate ?? "",
      schoolName: meta.schoolName ?? "",
      examDistrict: meta.examDistrict ?? "",
      examCity: meta.examCity ?? "",
      examDuration: meta.examDuration ?? "",
      footerMessage: meta.footerMessage ?? "موفق و سربلند باشید",
      worksheetTheme: meta.theme ?? "standard",
      headerVariant: headerForLayout,
      titleFontSize: meta.titleFontSize ?? "18px",
      questionStyle,
      pendingDividerKind: normalizeDividerKind(
        questionStyle.questionDividerKind
      ),
      answerRulingStyle: get().answerRulingStyle,
      dirty: false,
      past: [],
      future: [],
      previewOpen: false,
      panMode: false,
      painterStyle: null,
      toolTab: "text",
    });
  },

  setWorksheetTheme: (theme: WorksheetTheme) => set({ worksheetTheme: theme }),
  setHeaderVariant: (variant) => {
    const headerVariant = normalizeExamHeaderVariant(variant);
    if (get().headerVariant === headerVariant) {
      return;
    }
    setStudioPageLayout({
      theme: get().worksheetTheme,
      pageCount: computePageCount(get().blocks),
      headerVariant,
    });
    set({ headerVariant, dirty: true });
  },
  nextHeaderVariant: () => {
    const headerVariant = nextExamHeaderVariant(get().headerVariant);
    get().setHeaderVariant(headerVariant);
  },
  prevHeaderVariant: () => {
    const headerVariant = prevExamHeaderVariant(get().headerVariant);
    get().setHeaderVariant(headerVariant);
  },
  setTitleFontSize: (titleFontSize: string) => set({ titleFontSize }),

  setExamDuration: (value) => {
    const examDuration = value ?? "";
    if (get().examDuration === examDuration) return;
    set({ examDuration, dirty: true });
  },

  setFooterMessage: (value) => {
    const footerMessage = value ?? "";
    if (get().footerMessage === footerMessage) return;
    set({ footerMessage, dirty: true });
  },

  setQuestionStyle: (patch) => {
    withHistory(get, set, (state) => {
      const questionStyle = { ...state.questionStyle, ...patch };
      const pendingDividerKind =
        patch.questionDividerKind !== undefined
          ? normalizeDividerKind(patch.questionDividerKind)
          : state.pendingDividerKind;
      return {
        questionStyle,
        pendingDividerKind,
        blocks: applyQuestionStyleToBlocks(state.blocks, questionStyle),
      };
    });
  },

  setPendingDividerKind: (kind) =>
    set({ pendingDividerKind: normalizeDividerKind(kind) }),

  setAnswerRulingStyle: (style) =>
    set({
      answerRulingStyle: normalizeAnswerRulingStyle(style),
      dirty: true,
    }),

  setToolTab: (tab) => set({ toolTab: tab }),
  select: (id) =>
    set((state) => ({
      selectedId: id,
      snapGuides: id === null ? [] : state.snapGuides,
      editingTextBlockId:
        id === null
          ? null
          : id === state.editingTextBlockId
            ? state.editingTextBlockId
            : null,
    })),

  setEditingTextBlockId: (id) => set({ editingTextBlockId: id }),

  selectSheetQuestion: (id) => {
    const block = get().blocks.find((b) => b.id === id);
    if (!block || !QUESTION_BLOCK_TYPES.has(block.type)) {
      set({ selectedId: id });
      return;
    }
    set({ selectedId: id, editingTextBlockId: id });
  },

  toggleTextBlockEditing: (id) =>
    set((state) => ({
      selectedId: id,
      editingTextBlockId: state.editingTextBlockId === id ? null : id,
    })),
  setZoom: (zoom) => set({ zoom: Math.min(150, Math.max(50, zoom)) }),
  nudgeZoom: (delta) =>
    set({ zoom: Math.min(150, Math.max(50, get().zoom + delta)) }),
  togglePan: () => set({ panMode: !get().panMode }),
  setPreviewOpen: (open) => set({ previewOpen: open }),
  setToast: (message) => set({ toast: message }),

  applyStyle: (patch) => {
    const { selectedId, pendingStyle } = get();
    if (!selectedId) {
      set({ pendingStyle: { ...pendingStyle, ...patch } });
      return;
    }
    withHistory(get, set, (state) => ({
      blocks: state.blocks.map((b) =>
        b.id === selectedId
          ? { ...b, style: { ...(b.style ?? defaultBlockStyle()), ...patch } }
          : b
      ),
    }));
  },

  toggleBold: () => {
    const selected = get().blocks.find((b) => b.id === get().selectedId);
    const current = selected?.style?.bold ?? get().pendingStyle.bold;
    get().applyStyle({ bold: !current });
  },

  toggleItalic: () => {
    const selected = get().blocks.find((b) => b.id === get().selectedId);
    const current = selected?.style?.italic ?? get().pendingStyle.italic;
    get().applyStyle({ italic: !current });
  },

  setAlign: (align) => get().applyStyle({ align }),

  loadPainter: () => {
    const selected = get().blocks.find((b) => b.id === get().selectedId);
    if (!selected?.style) {
      set({ toast: "ابتدا یک بلاک را انتخاب کنید" });
      return;
    }
    set({
      painterStyle: { ...selected.style },
      toast: "استایل کپی شد — بلاک بعدی را لمس کنید",
    });
  },

  applyPainterIfArmed: (id) => {
    const style = get().painterStyle;
    if (!style) return;
    withHistory(get, set, (state) => ({
      blocks: state.blocks.map((b) =>
        b.id === id ? { ...b, style: { ...style } } : b
      ),
      selectedId: id,
    }));
    set({ painterStyle: null, toast: "استایل اعمال شد" });
  },

  addTextBlock: () => {
    const state = get();
    const place = blockPlacement(state);
    const block = createTextBlock();
    block.style = { ...state.pendingStyle };
    const geom = studioFullWidthTextGeometry(
      place.page,
      Math.max(place.y, pageContentBounds(place.page).minY + 4),
      52
    );
    Object.assign(block, geom);
    withHistory(get, set, (s) => ({
      blocks: [...s.blocks, block],
      selectedId: block.id,
      editingTextBlockId: null,
      toolTab: "text" as const,
    }));
    return block.id;
  },

  addQuestion: () => {
    const state = get();
    const isSchoolExam =
      state.worksheetTheme === "standard" ||
      state.worksheetTheme === "asman";
    let place = blockPlacement(state);
    place = {
      ...place,
      y: Math.max(place.y, pageContentBounds(place.page).minY + 4),
    };

    const block = createSheetQuestionBlock(isSchoolExam);
    block.style = styleFromQuestionSheet(state.questionStyle, block.style);
    const geom = studioFullWidthTextGeometry(place.page, place.y, 52);
    Object.assign(block, geom);

    withHistory(get, set, (s) => ({
      blocks: [...s.blocks, block],
      selectedId: block.id,
      editingTextBlockId: isSchoolExam ? block.id : null,
      toolTab: "text" as const,
    }));
    set({
      toast:
        state.worksheetTheme === "asman"
          ? "سوال به کاربرگ آسمان اضافه شد"
          : isSchoolExam
            ? "سوال آزمون مدارس به برگه اضافه شد"
            : "سوال به برگه اضافه شد",
    });
    return block.id;
  },

  addFloatingTextBlock: () => {
    const state = get();
    const block = createFloatingTextBlock();
    block.style = { ...state.pendingStyle };
    const w = block.width ?? 220;
    const h = block.height ?? 56;
    const place =
      state.worksheetTheme === "standard" ||
      state.worksheetTheme === "asman"
        ? nextStandardFloatingPlacement(state.blocks, h)
        : blockPlacement(state);
    const bounds = blockPageBounds(block, place.page);
    const geom = clampGeometry(
      place.x,
      place.y,
      w,
      h,
      place.page,
      undefined,
      bounds
    );
    Object.assign(block, geom);

    withHistory(get, set, (s) => ({
      blocks: [...s.blocks, block],
      selectedId: block.id,
      editingTextBlockId: block.id,
      toolTab: "text" as const,
    }));
    set({ toast: "متن شناور به برگه اضافه شد" });
    return block.id;
  },

  addTableBlock: (rows, cols) => {
    const state = get();
    const place = blockPlacement(state);
    const block = createTableBlock(rows, cols);
    const geom = clampGeometry(place.x, place.y, 320, 160, place.page);
    Object.assign(block, geom);
    withHistory(get, set, (s) => ({
      blocks: [...s.blocks, block],
      selectedId: block.id,
      toolTab: "table" as const,
    }));
  },

  addShapeBlock: (shape) => {
    const state = get();
    const place = blockPlacement(state);
    const block = createShapeBlock(shape);
    const geom = clampGeometry(
      place.x,
      place.y,
      block.width ?? 120,
      block.height ?? 80,
      place.page
    );
    Object.assign(block, geom);
    withHistory(get, set, (s) => ({
      blocks: [...s.blocks, block],
      selectedId: block.id,
      toolTab: "shapes" as const,
    }));
  },

  addFormulaBlock: (latex) => {
    const state = get();
    const place = blockPlacement(state);
    const block = createFormulaBlock(latex);
    const geom = clampGeometry(place.x, place.y, 240, 56, place.page);
    Object.assign(block, geom);
    withHistory(get, set, (s) => ({
      blocks: [...s.blocks, block],
      selectedId: block.id,
      toolTab: "formula" as const,
    }));
  },

  addImageBlock: (imageUrl) => {
    const state = get();
    const place = blockPlacement(state);
    const block = createImageBlock(imageUrl);
    const geom = clampGeometry(place.x, place.y, 200, 140, place.page);
    Object.assign(block, geom);
    withHistory(get, set, (s) => ({
      blocks: [...s.blocks, block],
      selectedId: block.id,
      toolTab: "text" as const,
    }));
  },

  addDivider: (kind) => {
    const state = get();
    const place = blockPlacement(state);
    const dividerKind = normalizeDividerKind(
      kind ?? state.pendingDividerKind
    );
    const block = createDividerBlock(dividerKind);
    const geom = studioDividerGeometry(place.page, place.y);
    Object.assign(block, geom);
    withHistory(get, set, (s) => ({
      blocks: [...s.blocks, block],
      selectedId: block.id,
      pendingDividerKind: dividerKind,
      toast: "خطکشی به برگه اضافه شد",
    }));
  },

  nudgeBlockVertical: (id, dir) => {
    const state = get();
    const block = state.blocks.find((b) => b.id === id);
    if (!block || block.type !== "divider") return;
    const step = 12;
    const page = block.page ?? 0;
    const x = block.x ?? 24;
    const y = (block.y ?? 96) + dir * step;
    const width = block.width ?? 680;
    const height = block.height ?? 28;
    const clamped = clampGeometry(x, y, width, height, page, {
      minW: DIVIDER_MIN_W,
      minH: DIVIDER_MIN_H,
    });
    withHistory(get, set, (s) => ({
      blocks: s.blocks.map((b) =>
        b.id === id ? { ...b, ...clamped } : b
      ),
    }));
  },

  nudgeBlockWidth: (id, dir) => {
    const state = get();
    const block = state.blocks.find((b) => b.id === id);
    if (!block || block.type !== "divider") return;
    const step = 28;
    const page = block.page ?? 0;
    const x = block.x ?? 24;
    const y = block.y ?? 96;
    const height = block.height ?? DIVIDER_BLOCK_H;
    const width = (block.width ?? 200) + dir * step;
    const clamped = clampGeometry(x, y, width, height, page, {
      minW: DIVIDER_MIN_W,
      minH: DIVIDER_MIN_H,
    });
    withHistory(get, set, (s) => ({
      blocks: s.blocks.map((b) =>
        b.id === id ? { ...b, ...clamped } : b
      ),
    }));
  },

  addCheckboxQuestion: () => {
    const state = get();
    const place = blockPlacement(state);
    const block = createCheckboxQuestionBlock();
    const geom = clampGeometry(place.x, place.y, 300, 100, place.page);
    Object.assign(block, geom);
    withHistory(get, set, (s) => ({
      blocks: [...s.blocks, block],
      selectedId: block.id,
    }));
  },

  addAnswerLines: () => {
    const state = get();
    const place = blockPlacement(state);
    const block = createAnswerLinesBlock();
    const geom = clampGeometry(place.x, place.y, 280, 88, place.page);
    Object.assign(block, geom);
    withHistory(get, set, (s) => ({
      blocks: [...s.blocks, block],
      selectedId: block.id,
    }));
  },

  addQuestionFromBank: (text, answerLinesFromBank, bankQuestionId) => {
    const state = get();
    let place = blockPlacement(state);
    place = {
      ...place,
      y: Math.max(place.y, pageContentBounds(place.page).minY + 4),
    };

    const block = createSheetQuestionFromBank(
      text,
      answerLinesFromBank,
      bankQuestionId ?? "",
      styleFromQuestionSheet(state.questionStyle, defaultBlockStyle())
    );
    if (!bankQuestionId) {
      delete block.bankQuestionId;
    }
    const geom = studioFullWidthTextGeometry(place.page, place.y, 52);
    Object.assign(block, geom);

    withHistory(get, set, (s) => ({
      blocks: [...s.blocks, block],
      selectedId: block.id,
      editingTextBlockId: block.id,
      toolTab: "text" as const,
    }));
    set({ toast: "سوال به برگه طراحی اضافه شد" });
  },

  updateBlock: (id, patch) => {
    const keys = Object.keys(patch);
    const skipHist =
      keys.length === 1 && (keys[0] === "html" || keys[0] === "cells");
    if (skipHist) {
      const current = get().blocks.find((b) => b.id === id);
      if (current) {
        const unchanged = (Object.keys(patch) as (keyof ManualBlock)[]).every(
          (key) => Object.is(current[key], patch[key])
        );
        if (unchanged) return;
      }
      set({
        blocks: get().blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        dirty: true,
      });
      return;
    }
    withHistory(get, set, (state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));
  },

  beginAnswerSpaceDrag: () => {
    const g = get();
    if (g.geometrySnap) return;
    set({
      geometrySnap: {
        blocks: cloneBlocks(g.blocks),
        columns: g.columns,
      },
    });
  },

  setQuestionAnswerSpace: (id, answerLines, options) => {
    const units = normalizeAnswerUnits(answerLines);
    const nextBlocks = get().blocks.map((b) =>
      b.id === id ? { ...b, answerLines: units } : b
    );
    if (options?.recordHistory === false) {
      set({ blocks: nextBlocks, dirty: true });
      return;
    }
    withHistory(get, set, () => ({ blocks: nextBlocks }));
  },

  commitAnswerSpaceDrag: () => {
    get().commitGeometryHistory();
  },

  setQuestionScore: (id, score) => {
    const block = get().blocks.find((b) => b.id === id);
    if (!block || !QUESTION_BLOCK_TYPES.has(block.type)) return;
    const value =
      score == null || !Number.isFinite(score)
        ? null
        : Math.round(score * 1000) / 1000;
    withHistory(get, set, (state) => ({
      blocks: state.blocks.map((b) =>
        b.id === id ? { ...b, score: value } : b
      ),
    }));
  },

  updateBlockGeometry: (id, patch, recordHistory = true) => {
    const state = get();
    const block = state.blocks.find((b) => b.id === id);
    if (!block) return;
    const page = patch.page ?? block.page ?? 0;
    const bounds = blockPageBounds(block, page);
    const clamped = clampGeometry(
      patch.x ?? block.x ?? bounds.minX,
      patch.y ?? block.y ?? bounds.minY + 8,
      patch.width ?? block.width ?? 280,
      patch.height ?? block.height ?? 72,
      page,
      undefined,
      bounds
    );
    const nextBlocks = state.blocks.map((b) =>
      b.id === id ? { ...b, ...clamped } : b
    );
    if (!recordHistory) {
      const g = get();
      if (!g.geometrySnap) {
        set({
          geometrySnap: {
            blocks: cloneBlocks(g.blocks),
            columns: g.columns,
          },
          blocks: nextBlocks,
          dirty: true,
        });
      } else {
        set({ blocks: nextBlocks, dirty: true });
      }
      return;
    }
    withHistory(get, set, () => ({ blocks: nextBlocks }));
  },

  commitGeometryHistory: () => {
    const g = get();
    if (!g.geometrySnap) return;
    set({
      past: [...g.past, g.geometrySnap].slice(-60),
      future: [],
      geometrySnap: null,
      dirty: true,
    });
  },

  setCanvasScale: (scale) => set({ canvasScale: scale }),
  setSnapGuides: (guides) => set({ snapGuides: guides }),
  clearSnapGuides: () => set({ snapGuides: [] }),

  duplicateBlock: (id) => {
    const source = get().blocks.find((b) => b.id === id);
    if (!source) return;
    const copy: ManualBlock = {
      ...cloneBlocks([source])[0],
      id: crypto.randomUUID(),
      x: (source.x ?? 24) + 20,
      y: (source.y ?? 92) + 20,
    };
    withHistory(get, set, (state) => ({
      blocks: [...state.blocks, copy],
      selectedId: copy.id,
    }));
  },

  removeBlock: (id) => {
    withHistory(get, set, (state) => {
      const next = state.blocks.filter((b) => b.id !== id);
      return {
        blocks: next,
        selectedId: state.selectedId === id ? next[0]?.id ?? null : state.selectedId,
      };
    });
  },

  moveBlock: (id, dir) => {
    withHistory(get, set, (state) => {
      const index = state.blocks.findIndex((b) => b.id === id);
      const target = index + dir;
      if (index < 0 || target < 0 || target >= state.blocks.length) return {};
      const next = [...state.blocks];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return { blocks: next };
    });
  },

  reorder: (activeId, overId) => {
    if (activeId === overId) return;
    withHistory(get, set, (state) => {
      const oldIndex = state.blocks.findIndex((b) => b.id === activeId);
      const newIndex = state.blocks.findIndex((b) => b.id === overId);
      if (oldIndex < 0 || newIndex < 0) return {};
      const next = [...state.blocks];
      const [item] = next.splice(oldIndex, 1);
      next.splice(newIndex, 0, item);
      return { blocks: next };
    });
  },

  setColumns: (columns) => {
    withHistory(get, set, () => ({ columns }));
  },

  clearSheet: () => {
    withHistory(get, set, () => ({
      blocks: [],
      selectedId: null,
    }));
  },

  undo: () => {
    const { past, blocks, columns, future } = get();
    const prev = past[past.length - 1];
    if (!prev) return;
    set({
      blocks: prev.blocks,
      columns: prev.columns,
      past: past.slice(0, -1),
      future: [...future, { blocks: cloneBlocks(blocks), columns }],
      dirty: true,
    });
  },

  redo: () => {
    const { future, blocks, columns, past } = get();
    const next = future[future.length - 1];
    if (!next) return;
    set({
      blocks: next.blocks,
      columns: next.columns,
      future: future.slice(0, -1),
      past: [...past, { blocks: cloneBlocks(blocks), columns }],
      dirty: true,
    });
  },

  getDocument: () => ({
    blocks: get().blocks,
    columns: get().columns,
    zoom: get().zoom,
    title: get().title,
    subject: get().subject,
    grade: get().grade,
    bismillah: get().bismillah,
    worksheetDate: get().worksheetDate,
    schoolName: get().schoolName,
    examDistrict: get().examDistrict,
    examCity: get().examCity,
    examDuration: get().examDuration,
    footerMessage: get().footerMessage,
    worksheetTheme: get().worksheetTheme,
    headerVariant: get().headerVariant,
    titleFontSize: get().titleFontSize,
    questionStyle: get().questionStyle,
    answerRulingStyle: get().answerRulingStyle,
  }),

  saveLocal: () => {
    const doc = get().getDocument();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
      set({ dirty: false, toast: "ذخیره شد ✅" });
    } catch {
      set({ toast: "ذخیره محلی ممکن نشد" });
    }
    return doc;
  },

  saveTemplate: () => {
    const doc = get().saveLocal();
    try {
      localStorage.setItem(TEMPLATE_KEY, JSON.stringify(doc));
      set({ toast: "به‌عنوان قالب ذخیره شد" });
    } catch {
      set({ toast: "ذخیره قالب ممکن نشد" });
    }
  },

  loadSaved: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const doc = JSON.parse(raw) as DesignerDocument;
      if (!Array.isArray(doc.blocks)) return false;
      set({
        blocks: migrateBlocks(doc.blocks),
        columns: doc.columns === 2 ? 2 : 1,
        zoom: typeof doc.zoom === "number" ? doc.zoom : 100,
        title: doc.title ?? get().title,
        subject: doc.subject ?? get().subject,
        grade: doc.grade ?? get().grade,
        bismillah: doc.bismillah ?? get().bismillah,
        worksheetDate: doc.worksheetDate ?? get().worksheetDate,
        schoolName: doc.schoolName ?? get().schoolName,
        examDistrict: doc.examDistrict ?? get().examDistrict,
        examCity: doc.examCity ?? get().examCity,
        examDuration: doc.examDuration ?? get().examDuration,
        footerMessage: doc.footerMessage ?? get().footerMessage,
        worksheetTheme: doc.worksheetTheme ?? get().worksheetTheme,
        headerVariant: normalizeExamHeaderVariant(
          doc.headerVariant ?? get().headerVariant
        ),
        titleFontSize: doc.titleFontSize ?? get().titleFontSize,
        questionStyle: doc.questionStyle ?? get().questionStyle,
        pendingDividerKind: normalizeDividerKind(
          doc.questionStyle?.questionDividerKind ??
            get().pendingDividerKind
        ),
        answerRulingStyle: normalizeAnswerRulingStyle(
          doc.answerRulingStyle ?? get().answerRulingStyle
        ),
        selectedId: doc.blocks[0]?.id ?? null,
      });
      setStudioPageLayout({
        theme: get().worksheetTheme,
        pageCount: computePageCount(get().blocks),
        headerVariant: get().headerVariant,
      });
      return true;
    } catch {
      return false;
    }
  },
}));
