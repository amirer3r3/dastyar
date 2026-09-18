"use client";

import {
  useMemo,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  Pencil,
  Sparkles,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  BookOpen,
  ListChecks,
  NotebookPen,
  Library,
  Plus,
  Printer,
  Trash2,
} from "lucide-react";
import { formatPersianNumber } from "@/app/lib/persian-digits";
import {
  getQBFlatLessons,
  questionBankGrades,
} from "@/app/question-bank/curriculum-data";
import {
  type WorksheetData,
  type WorksheetQuestion,
  type WorksheetTheme,
  defaultWorksheet,
  normalizeWorksheetData,
} from "./types";
import { worksheetThemeOptions } from "./theme-config";
import WorksheetPreview from "./worksheet-preview";
import {
  bankGrades,
  bankSubjects,
  filterBankQuestions,
  type BankQuestion,
} from "./sample-bank";
import ManualDesignEditor from "./manual-editor";
import ManualDraftsPanel from "./manual-editor/ManualDraftsPanel";
import {
  getManualDraft,
  readManualDrafts,
  type StoredManualDraft,
} from "./manual-editor/draft-storage";
import type { DesignerDocument } from "./manual-editor/types";
import WorksheetDesignHeader from "@/app/components/worksheets/worksheet-design-header";
import QuestionStylePanel from "./QuestionStylePanel";
import {
  QUESTION_SIZE_OPTIONS,
  formatSizeLabel,
} from "./question-style";
import {
  defaultQuestionStyle,
  formatPersianDigits,
  parsePersianDigits,
  questionStylesEqual,
} from "./question-style";
import { printWorksheetFromDom } from "./print-worksheet";
import { paginateStandardExamQuestions } from "./standard-exam-paginate";
import ExamHeaderVariantSwitcher from "./ExamHeaderVariantSwitcher";
import {
  nextExamHeaderVariant,
  prevExamHeaderVariant,
} from "./exam-header-variant";
import {
  formatExamScore,
  parsePersianDecimal,
} from "./exam-score";
import {
  CARTOON_MAX_PAGES_MESSAGE,
  paginateWorksheetQuestions,
} from "./worksheet-paginate";
import {
  defaultManualLayout,
  manualLayoutsEqual,
  type ManualLayout,
  type ManualLayoutFingerprintContext,
} from "./manual-editor/types";

type QuestionsTab = "bank" | "manual";

type BankSessionEdit = {
  text: string;
  answerSpace: number;
};

export default function WorksheetEditor() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const studioOpen = searchParams.get("editor") === "manual";
  const [data, setData] = useState<WorksheetData>(() =>
    normalizeWorksheetData(defaultWorksheet())
  );

  useEffect(() => {
    setData((prev) => normalizeWorksheetData(prev));
  }, []);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [questionsTab, setQuestionsTab] = useState<QuestionsTab>("bank");
  const [manualDrafts, setManualDrafts] = useState<StoredManualDraft[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [editorBootstrapDoc, setEditorBootstrapDoc] =
    useState<DesignerDocument | null>(null);
  const [bankGrade, setBankGrade] = useState("پایه سوم");
  const [bankSubject, setBankSubject] = useState("ریاضی");
  const [bankLesson, setBankLesson] = useState("");
  const [bankEdits, setBankEdits] = useState<Record<string, BankSessionEdit>>(
    {}
  );
  const [flash, setFlash] = useState<string | null>(null);
  const [manualLayout, setManualLayout] = useState<ManualLayout>(() =>
    defaultManualLayout()
  );

  const update = useCallback(
    <K extends keyof WorksheetData>(key: K, value: WorksheetData[K]) => {
      setData((prev) => {
        if (Object.is(prev[key], value)) return prev;
        return normalizeWorksheetData({ ...prev, [key]: value });
      });
    },
    []
  );

  const onQuestionStyleChange = useCallback(
    (questionStyle: WorksheetData["questionStyle"]) => {
      setData((prev) => {
        const current = prev.questionStyle ?? defaultQuestionStyle();
        if (questionStylesEqual(current, questionStyle)) return prev;
        return normalizeWorksheetData({ ...prev, questionStyle });
      });
    },
    []
  );

  const onHeaderVariantChange = useCallback(
    (headerVariant: WorksheetData["headerVariant"]) => {
      setData((prev) =>
        prev.headerVariant === headerVariant
          ? prev
          : normalizeWorksheetData({ ...prev, headerVariant })
      );
    },
    []
  );

  const setTheme = (theme: WorksheetTheme) => update("theme", theme);

  const refreshManualDrafts = useCallback(() => {
    setManualDrafts(readManualDrafts());
  }, []);

  useEffect(() => {
    refreshManualDrafts();
  }, [refreshManualDrafts]);

  const openStudio = useCallback(
    (draftId?: string) => {
      setQuestionsTab("manual");
      if (draftId) {
        const draft = getManualDraft(draftId);
        if (draft) {
          setActiveDraftId(draft.id);
          setEditorBootstrapDoc(draft.doc);
        } else {
          setActiveDraftId(null);
          setEditorBootstrapDoc(null);
        }
      } else {
        setActiveDraftId(null);
        setEditorBootstrapDoc(null);
      }
      const params = new URLSearchParams(searchParams.toString());
      params.set("editor", "manual");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const closeStudio = useCallback(() => {
    setActiveDraftId(null);
    setEditorBootstrapDoc(null);
    refreshManualDrafts();
    const params = new URLSearchParams(searchParams.toString());
    params.delete("editor");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams, refreshManualDrafts]);

  const syncManualLayout = useCallback(
    (layout: ManualLayout) => {
      const fingerprintCtx: ManualLayoutFingerprintContext = {
        theme: data.theme,
        questionStyle: data.questionStyle ?? defaultQuestionStyle(),
      };
      setManualLayout((prev) =>
        manualLayoutsEqual(prev, layout, fingerprintCtx) ? prev : layout
      );
    },
    [data.theme, data.questionStyle]
  );

  const showFlash = (message: string) => {
    setFlash(message);
    window.setTimeout(() => setFlash(null), 1800);
  };

  const getBankEdit = useCallback(
    (item: BankQuestion): BankSessionEdit =>
      bankEdits[item.id] ?? {
        text: item.text,
        answerSpace: item.answerLines,
      },
    [bankEdits]
  );

  const patchBankEdit = useCallback(
    (item: BankQuestion, patch: Partial<BankSessionEdit>) => {
      setBankEdits((prev) => {
        const base = prev[item.id] ?? {
          text: item.text,
          answerSpace: item.answerLines,
        };
        return { ...prev, [item.id]: { ...base, ...patch } };
      });
      if (patch.text !== undefined || patch.answerSpace !== undefined) {
        setData((prev) => {
          const onSheet = prev.questions.some(
            (q) => q.bankQuestionId === item.id
          );
          if (!onSheet) return prev;
          return normalizeWorksheetData({
            ...prev,
            questions: prev.questions.map((q) =>
              q.bankQuestionId === item.id
                ? {
                    ...q,
                    ...(patch.text !== undefined ? { text: patch.text } : {}),
                    ...(patch.answerSpace !== undefined
                      ? { answerLines: patch.answerSpace }
                      : {}),
                  }
                : q
            ),
          });
        });
      }
    },
    []
  );

  const addQuestionToSheet = (
    edit: BankSessionEdit,
    bankQuestionId: string
  ) => {
    const id = crypto.randomUUID();
    setData((prev) =>
      normalizeWorksheetData({
        ...prev,
        questions: [
          ...prev.questions,
          {
            id,
            text: edit.text,
            answerLines: edit.answerSpace,
            bankQuestionId,
            score: null,
          },
        ],
        grade: prev.grade || bankGrade,
        subject: prev.subject || bankSubject,
      })
    );
    showFlash("به برگه اضافه شد");
  };

  const removeBankQuestionFromSheet = (bankQuestionId: string) => {
    setData((prev) =>
      normalizeWorksheetData({
        ...prev,
        questions: prev.questions.filter(
          (q) => q.bankQuestionId !== bankQuestionId
        ),
      })
    );
    showFlash("از برگه حذف شد");
  };

  const updateSheetQuestion = (
    questionId: string,
    patch: Partial<Pick<WorksheetQuestion, "text" | "answerLines" | "score">>
  ) => {
    setData((prev) => {
      const target = prev.questions.find((q) => q.id === questionId);
      if (target?.bankQuestionId) {
        const bankId = target.bankQuestionId;
        setBankEdits((edits) => {
          const base = edits[bankId] ?? {
            text: target.text,
            answerSpace: target.answerLines,
          };
          return {
            ...edits,
            [bankId]: {
              text: patch.text ?? base.text,
              answerSpace:
                patch.answerLines !== undefined
                  ? patch.answerLines
                  : base.answerSpace,
            },
          };
        });
      }
      return normalizeWorksheetData({
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId ? { ...q, ...patch } : q
        ),
      });
    });
  };

  const removeSheetQuestion = (questionId: string) => {
    setData((prev) =>
      normalizeWorksheetData({
        ...prev,
        questions: prev.questions.filter((q) => q.id !== questionId),
      })
    );
    showFlash("از برگه حذف شد");
  };

  const isBankQuestionOnSheet = useCallback(
    (bankQuestionId: string) =>
      data.questions.some((q) => q.bankQuestionId === bankQuestionId),
    [data.questions]
  );

  const bankQuestions = useMemo(
    () => filterBankQuestions(bankGrade, bankSubject),
    [bankGrade, bankSubject]
  );

  const bankLessonOptions = useMemo(() => {
    const grade = questionBankGrades.find((g) => g.title === bankGrade);
    const subject = grade?.subjects.find((s) => s.title === bankSubject);
    if (!subject) return [];
    return getQBFlatLessons(subject).map((l) => l.title);
  }, [bankGrade, bankSubject]);

  useEffect(() => {
    setBankLesson((prev) => {
      if (bankLessonOptions.length === 0) return "";
      if (bankLessonOptions.includes(prev)) return prev;
      return bankLessonOptions[0];
    });
  }, [bankGrade, bankSubject, bankLessonOptions]);

  const previewData = useMemo(() => {
    const base = data.questionStyle ?? defaultQuestionStyle();
    return {
      ...data,
      questionStyle: {
        ...defaultQuestionStyle(),
        ...base,
        questionDividerKind:
          base.questionDividerKind ?? defaultQuestionStyle().questionDividerKind,
      },
    };
  }, [data]);

  const cartoonExceedsMaxPages = useMemo(() => {
    const style = data.questionStyle ?? defaultQuestionStyle();
    if (data.theme === "cartoon" || data.theme === "asman") {
      return paginateWorksheetQuestions(
        data.questions,
        style.fontSize,
        style.dividersBetweenQuestions,
        { questionDividerKind: style.questionDividerKind }
      ).exceedsMaxPages;
    }
    if (data.theme === "standard") {
      return paginateStandardExamQuestions(data.questions, style.fontSize, {
        headerVariant: data.headerVariant,
      }).exceedsMaxPages;
    }
    return false;
  }, [data.theme, data.questions, data.questionStyle]);

  const handlePrint = () => {
    const runPrint = () => {
      const ok = printWorksheetFromDom();
      if (!ok) {
        showFlash("پیش‌نمایش آماده نیست — لطفاً دوباره تلاش کنید");
      }
    };
    if (viewMode !== "preview") {
      setViewMode("preview");
      window.setTimeout(runPrint, 450);
      return;
    }
    window.requestAnimationFrame(() => window.setTimeout(runPrint, 100));
  };

  return (
    <div className="pb-8">
      <WorksheetDesignHeader />

      <div className="no-print relative z-10 bg-background px-2 pt-3">
        <div className="flex rounded-full border border-border bg-card p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setViewMode("edit")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition-colors ${
            viewMode === "edit"
              ? "bg-primary text-primary-foreground"
              : "text-muted"
          }`}
        >
          <Pencil size={16} />
          ویرایش
        </button>
        <button
          type="button"
          onClick={() => setViewMode("preview")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition-colors ${
            viewMode === "preview"
              ? "bg-primary text-primary-foreground"
              : "text-muted"
          }`}
        >
          <Eye size={16} />
          پیش‌نمایش
        </button>
      </div>

      {flash ? (
        <div className="no-print mt-2 rounded-xl bg-primary/10 px-3 py-2 text-center text-xs font-bold text-primary">
          {flash}
        </div>
      ) : null}

      {cartoonExceedsMaxPages ? (
        <div
          className="no-print mt-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-center text-xs font-semibold leading-6 text-amber-950"
          role="status"
        >
          {CARTOON_MAX_PAGES_MESSAGE}
        </div>
      ) : null}

      <div className="mt-3">
        <div
          className={`no-print flex flex-col gap-3 ${
            viewMode === "edit" ? "flex" : "hidden"
          }`}
        >
          <div className="rounded-app border border-border bg-card p-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-accent" />
              <h2 className="text-sm font-bold text-foreground">تم کاربرگ</h2>
            </div>
            <div
              className="flex flex-row flex-nowrap gap-2 overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {worksheetThemeOptions.map((theme) => {
                const isActive = data.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setTheme(theme.id)}
                    className={`flex w-[min(42vw,9.5rem)] shrink-0 flex-col items-center gap-1 rounded-app border-2 p-2 text-sm transition-colors ${
                      isActive ? theme.activeClass : "border-border text-muted"
                    }`}
                  >
                    {theme.previewSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={theme.previewSrc}
                        alt=""
                        className="aspect-[210/297] w-full rounded-md border border-border/60 bg-white object-contain object-top"
                      />
                    ) : (
                      <span className="text-lg">{theme.emoji}</span>
                    )}
                    {theme.label}
                    <span className="text-[10px] font-normal text-muted">
                      {theme.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 rounded-app border border-border bg-card p-3 shadow-sm">
            <h2 className="text-sm font-bold text-foreground">اطلاعات کاربرگ</h2>
            {data.theme === "standard" ? (
              <>
                <Field
                  label="به نام خدا"
                  value={data.bismillah}
                  onChange={(v) => update("bismillah", v)}
                />
                <Field
                  label="عنوان آزمون"
                  value={data.title}
                  onChange={(v) => update("title", v)}
                  placeholder="آزمون میان‌ترم"
                />
                <Field
                  label="نام مدرسه"
                  value={data.schoolName}
                  onChange={(v) => update("schoolName", v)}
                />
                <div className="flex gap-2">
                  <Field
                    label="ناحیه"
                    value={data.examDistrict}
                    onChange={(v) => update("examDistrict", v)}
                  />
                  <Field
                    label="شهرستان"
                    value={data.examCity}
                    onChange={(v) => update("examCity", v)}
                  />
                </div>
                <Field
                  label="تاریخ"
                  value={data.worksheetDate}
                  onChange={(v) => update("worksheetDate", v)}
                />
                <Field
                  label="زمان پاسخ‌دهی"
                  value={data.examDuration}
                  onChange={(v) => update("examDuration", v)}
                  placeholder="مثلاً ۹۰ دقیقه"
                />
                <Field
                  label="پیام پایانی آزمون"
                  value={data.footerMessage}
                  onChange={(v) => update("footerMessage", v)}
                  placeholder="موفق و سربلند باشید"
                />
                <ExamHeaderVariantSwitcher
                  layout="segmented"
                  variant={data.headerVariant}
                  onSelect={(v) => update("headerVariant", v)}
                  onPrev={() =>
                    update(
                      "headerVariant",
                      prevExamHeaderVariant(data.headerVariant)
                    )
                  }
                  onNext={() =>
                    update(
                      "headerVariant",
                      nextExamHeaderVariant(data.headerVariant)
                    )
                  }
                  className="rounded-xl border border-border bg-background px-2 py-2"
                />
              </>
            ) : data.theme === "cartoon" || data.theme === "asman" ? (
              <div className="grid grid-cols-[1fr_7.5rem] items-end gap-2">
                <Field
                  label="عنوان"
                  value={data.title}
                  onChange={(v) => update("title", v)}
                  placeholder="مثلاً کاربرگ ریاضی فصل ۲"
                />
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-foreground">
                    اندازه عنوان
                  </span>
                  <div className="relative">
                    <select
                      value={data.titleFontSize}
                      onChange={(e) => update("titleFontSize", e.target.value)}
                      className="h-10 w-full appearance-none rounded-app border border-border bg-background py-2 pr-3 pl-8 text-sm font-medium text-foreground outline-none focus:border-primary"
                    >
                      {QUESTION_SIZE_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {formatSizeLabel(s)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                    />
                  </div>
                </label>
              </div>
            ) : (
              <>
                <Field
                  label="به نام خدا"
                  value={data.bismillah}
                  onChange={(v) => update("bismillah", v)}
                  placeholder="به نام خدا"
                />
                <Field
                  label="عنوان"
                  value={data.title}
                  onChange={(v) => update("title", v)}
                  placeholder="مثلاً کاربرگ ریاضی فصل ۲"
                />
                <div className="flex gap-2">
                  <Field
                    label="درس"
                    value={data.subject}
                    onChange={(v) => update("subject", v)}
                    placeholder="ریاضی"
                  />
                  <Field
                    label="پایه"
                    value={data.grade}
                    onChange={(v) => update("grade", v)}
                    placeholder="پایه سوم"
                  />
                </div>
                <div className="flex gap-2">
                  <Field
                    label="نام معلم"
                    value={data.teacherName}
                    onChange={(v) => update("teacherName", v)}
                    placeholder="نام و نام خانوادگی"
                  />
                  <Field
                    label="تاریخ"
                    value={data.worksheetDate}
                    onChange={(v) => update("worksheetDate", v)}
                    placeholder="۱۴۰۴/۰۶/۲۲"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-foreground">
                    دستورالعمل
                  </label>
                  <textarea
                    value={data.instructions ?? ""}
                    onChange={(e) => update("instructions", e.target.value)}
                    rows={2}
                    placeholder="راهنمای پاسخ‌دهی..."
                    className="rounded-app border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2.5 rounded-app border border-border bg-card p-3 shadow-sm">
            <div className="grid grid-cols-2 gap-1 rounded-2xl bg-primary/5 p-1">
              <button
                type="button"
                onClick={() => setQuestionsTab("bank")}
                className={`rounded-xl py-2.5 text-sm font-bold transition-colors ${
                  questionsTab === "bank"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted"
                }`}
              >
                طراحی سریع
              </button>
              <button
                type="button"
                onClick={() => setQuestionsTab("manual")}
                className={`rounded-xl py-2.5 text-sm font-bold transition-colors ${
                  questionsTab === "manual"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted"
                }`}
              >
                طراحی حرفه‌ای
              </button>
            </div>

            {questionsTab === "bank" ? (
              <>
                <div className="mt-3 flex flex-col gap-2.5 border-t border-border/60 pt-3">
                  <div className="flex items-start gap-2.5 text-right">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <NotebookPen size={16} strokeWidth={2} aria-hidden />
                    </span>
                    <p className="flex-1 pt-0.5 text-xs font-medium leading-6 text-foreground">
                      با انتخاب پایه ، کتاب و فصل مورد نظر ، سوالات انتخابی
                      خودتو به برگه اضافه کن
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <FilterSelect
                      icon={<GraduationCap size={16} />}
                      value={bankGrade}
                      onChange={setBankGrade}
                      options={bankGrades}
                    />
                    <FilterSelect
                      icon={<BookOpen size={16} />}
                      value={bankSubject}
                      onChange={setBankSubject}
                      options={bankSubjects}
                    />
                  </div>
                  <FilterSelect
                    icon={<ListChecks size={16} />}
                    value={
                      bankLesson ||
                      (bankLessonOptions[0] ?? "درسی برای این ترکیب نیست")
                    }
                    onChange={setBankLesson}
                    options={
                      bankLessonOptions.length > 0
                        ? bankLessonOptions
                        : ["درسی برای این ترکیب نیست"]
                    }
                    disabled={bankLessonOptions.length === 0}
                  />
                </div>

                <QuestionStylePanel
                  style={data.questionStyle}
                  onChange={(patch) =>
                    update("questionStyle", {
                      ...data.questionStyle,
                      ...patch,
                    })
                  }
                />

                {data.questions.length > 0 ? (
                  <div className="flex flex-col gap-2 rounded-app border border-primary/20 bg-primary/5 p-2.5">
                    <h2 className="text-sm font-bold text-foreground">
                      سوالات روی برگه (
                      {formatPersianNumber(data.questions.length)})
                    </h2>
                    <p className="text-[11px] leading-5 text-muted">
                      شماره در پیش‌نمایش خودکار است؛ متن و فضای پاسخ را اینجا
                      ویرایش یا حذف کنید.
                    </p>
                    {data.questions.map((q, sheetIndex) => (
                      <SheetQuestionCard
                        key={q.id}
                        index={sheetIndex}
                        text={q.text}
                        answerLines={q.answerLines}
                        showScore={data.theme === "standard"}
                        score={q.score}
                        onChangeText={(text) =>
                          updateSheetQuestion(q.id, { text })
                        }
                        onChangeAnswerLines={(answerLines) =>
                          updateSheetQuestion(q.id, { answerLines })
                        }
                        onChangeScore={(score) =>
                          updateSheetQuestion(q.id, { score })
                        }
                        onRemove={() => removeSheetQuestion(q.id)}
                      />
                    ))}
                  </div>
                ) : null}

                <h2 className="text-sm font-bold text-foreground">
                  بانک سوالات ({formatPersianNumber(bankQuestions.length)})
                </h2>

                {bankQuestions.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-6 text-center">
                    <Library size={22} className="text-muted" />
                    <p className="text-xs leading-6 text-muted">
                      برای این پایه و درس هنوز سوالی در بانک نیست.
                    </p>
                  </div>
                ) : (
                  bankQuestions.map((item, index) => {
                    const edit = getBankEdit(item);
                    return (
                      <BankQuestionCard
                        key={item.id}
                        index={index}
                        edit={edit}
                        isOnSheet={isBankQuestionOnSheet(item.id)}
                        onEditText={(text) => patchBankEdit(item, { text })}
                        onEditAnswerSpace={(answerSpace) =>
                          patchBankEdit(item, { answerSpace })
                        }
                        onAddToSheet={() =>
                          addQuestionToSheet(getBankEdit(item), item.id)
                        }
                        onRemoveFromSheet={() =>
                          removeBankQuestionFromSheet(item.id)
                        }
                      />
                    );
                  })
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <p className="text-sm font-bold text-foreground">
                  محیط طراحی حرفه‌ای
                </p>
                <p className="text-xs leading-6 text-muted">
                  {formatPersianNumber(manualLayout.blocks.length)} بلاک روی
                  برگه آماده است. برای ویرایش تمام‌صفحه وارد شوید.
                </p>
                <button
                  type="button"
                  onClick={() => openStudio()}
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
                >
                  ورود به طراحی حرفه‌ای
                </button>
                <ManualDraftsPanel
                  drafts={manualDrafts}
                  onResume={(id) => openStudio(id)}
                  onRefresh={refreshManualDrafts}
                />
              </div>
            )}
          </div>
        </div>

        <div
          className={
            viewMode === "preview"
              ? "flex flex-col gap-3"
              : "hidden print:!block"
          }
        >
          <ScaledPreview>
            <WorksheetPreview data={previewData} />
          </ScaledPreview>
          <button
            type="button"
            onClick={handlePrint}
            className="no-print flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-md shadow-primary/30 transition-transform active:scale-95"
          >
            <Printer size={18} />
            خروجی PDF
          </button>
        </div>
      </div>
      </div>

      {studioOpen ? (
        <ManualDesignEditor
          layout={manualLayout}
          onChange={syncManualLayout}
          sheetTitle={data.title}
          meta={{
            subject: data.subject,
            grade: data.grade,
            bismillah: data.bismillah,
            worksheetDate: data.worksheetDate,
            schoolName: data.schoolName,
            examDistrict: data.examDistrict,
            examCity: data.examCity,
            examDuration: data.examDuration,
            footerMessage: data.footerMessage,
          }}
          theme={data.theme}
          titleFontSize={data.titleFontSize}
          questionStyle={data.questionStyle}
          onQuestionStyleChange={onQuestionStyleChange}
          headerVariant={data.headerVariant}
          onHeaderVariantChange={onHeaderVariantChange}
          initialDocument={editorBootstrapDoc}
          activeDraftId={activeDraftId}
          onDraftSaved={refreshManualDrafts}
          onClose={closeStudio}
        />
      ) : null}
    </div>
  );
}

function FilterSelect({
  icon,
  value,
  onChange,
  options,
  disabled,
}: {
  icon: ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-primary">
        {icon}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-11 w-full appearance-none rounded-2xl border border-border bg-background py-2 pr-9 pl-8 text-sm font-medium text-foreground outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

function SheetQuestionCard({
  index,
  text,
  answerLines,
  showScore,
  score,
  onChangeText,
  onChangeAnswerLines,
  onChangeScore,
  onRemove,
}: {
  index: number;
  text: string;
  answerLines: number;
  showScore?: boolean;
  score: number | null;
  onChangeText: (text: string) => void;
  onChangeAnswerLines: (n: number) => void;
  onChangeScore?: (score: number | null) => void;
  onRemove: () => void;
}) {
  const [scoreDraft, setScoreDraft] = useState(() => formatExamScore(score));

  useEffect(() => {
    setScoreDraft(formatExamScore(score));
  }, [score]);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-primary">
          شماره {formatPersianNumber(index + 1)} در پیش‌نمایش
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="flex shrink-0 items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-700"
        >
          <Trash2 size={11} />
          حذف از برگه
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => onChangeText(e.target.value)}
        rows={3}
        dir="rtl"
        className="w-full resize-y rounded-xl border border-border bg-card px-3 py-2 text-right text-sm leading-7 outline-none focus:border-primary"
        aria-label="متن سوال روی برگه"
      />
      <div className="flex items-center justify-start gap-1.5">
        <span className="shrink-0 text-[11px] text-muted">فضای پاسخ:</span>
        <div className="flex items-center rounded-md border border-border bg-card">
          <button
            type="button"
            aria-label="کاهش فضای پاسخ"
            onClick={() => onChangeAnswerLines(Math.max(0, answerLines - 1))}
            className="flex h-7 w-6 items-center justify-center text-muted"
          >
            <ChevronDown size={14} />
          </button>
          <PersianNumberInput
            value={answerLines}
            min={0}
            max={20}
            onChange={onChangeAnswerLines}
            className="flex h-7 w-9 items-center justify-center border-0 border-x border-border bg-transparent px-0 text-center text-[11px] font-bold"
          />
          <button
            type="button"
            aria-label="افزایش فضای پاسخ"
            onClick={() => onChangeAnswerLines(Math.min(20, answerLines + 1))}
            className="flex h-7 w-6 items-center justify-center text-muted"
          >
            <ChevronUp size={14} />
          </button>
        </div>
      </div>
      {showScore ? (
        <label className="flex items-center justify-start gap-2">
          <span className="shrink-0 text-[11px] text-muted">بارم:</span>
          <input
            type="text"
            inputMode="decimal"
            dir="ltr"
            value={scoreDraft}
            placeholder="مثلاً 0.25"
            onChange={(e) => setScoreDraft(e.target.value)}
            onBlur={() => {
              const parsed = parsePersianDecimal(scoreDraft);
              onChangeScore?.(parsed);
              setScoreDraft(formatExamScore(parsed));
            }}
            className="persian-nums h-8 w-20 rounded-lg border border-border bg-card px-2 text-center text-xs font-bold outline-none focus:border-primary"
          />
        </label>
      ) : null}
    </div>
  );
}

function BankQuestionCard({
  index,
  edit,
  isOnSheet,
  onEditText,
  onEditAnswerSpace,
  onAddToSheet,
  onRemoveFromSheet,
}: {
  index: number;
  edit: BankSessionEdit;
  isOnSheet: boolean;
  onEditText: (text: string) => void;
  onEditAnswerSpace: (space: number) => void;
  onAddToSheet: () => void;
  onRemoveFromSheet: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-app border border-border bg-background p-2.5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="pt-0.5 text-xs font-bold text-muted">
          سوال {formatPersianNumber(index + 1)}
        </span>
        <button
          type="button"
          onClick={onAddToSheet}
          className="flex shrink-0 items-center justify-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold text-primary-foreground shadow-sm shadow-primary/25"
        >
          <Plus size={11} className="text-primary-foreground" />
          افزودن به برگه
        </button>
      </div>

      <textarea
        value={edit.text}
        onChange={(e) => onEditText(e.target.value)}
        rows={3}
        dir="rtl"
        className="w-full resize-y rounded-xl border border-border bg-card px-3 py-3 text-right text-sm leading-7 text-foreground outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
        aria-label="متن سوال"
      />

      <div className="flex items-center justify-start gap-1.5">
        <span className="shrink-0 text-[11px] text-muted">فضای پاسخ:</span>
        <div className="flex items-center rounded-md border border-border bg-card">
          <button
            type="button"
            aria-label="کاهش فضای پاسخ"
            onClick={() =>
              onEditAnswerSpace(Math.max(0, edit.answerSpace - 1))
            }
            className="flex h-7 w-6 shrink-0 items-center justify-center text-muted transition-colors hover:bg-primary/5 hover:text-primary active:bg-primary/10"
          >
            <ChevronDown size={14} strokeWidth={2.5} />
          </button>
          <PersianNumberInput
            value={edit.answerSpace}
            min={0}
            max={20}
            onChange={onEditAnswerSpace}
            className="flex h-7 w-9 items-center justify-center rounded-none border-0 border-x border-border bg-transparent px-0 text-center text-[11px] font-bold leading-none"
          />
          <button
            type="button"
            aria-label="افزایش فضای پاسخ"
            onClick={() =>
              onEditAnswerSpace(Math.min(20, edit.answerSpace + 1))
            }
            className="flex h-7 w-6 shrink-0 items-center justify-center text-muted transition-colors hover:bg-primary/5 hover:text-primary active:bg-primary/10"
          >
            <ChevronUp size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {isOnSheet ? (
        <div className="flex w-full justify-end pt-0.5">
          <button
            type="button"
            onClick={onRemoveFromSheet}
            className="text-[11px] font-semibold text-red-600 transition-colors hover:text-red-700 active:opacity-80"
          >
            پاک کردن از برگه
          </button>
        </div>
      ) : null}
    </div>
  );
}

function PersianNumberInput({
  value,
  min,
  max,
  onChange,
  className,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
  className?: string;
}) {
  return (
    <input
      type="text"
      inputMode="numeric"
      dir="ltr"
      value={formatPersianDigits(value)}
      onChange={(e) => {
        const n = parsePersianDigits(e.target.value);
        onChange(Math.min(max, Math.max(min, n)));
      }}
      className={
        className ??
        "h-9 w-16 rounded-lg border border-border bg-card px-2 text-center text-xs font-bold text-foreground outline-none focus:border-primary"
      }
      aria-label="فضای پاسخ"
    />
  );
}

const A4_WIDTH_PX = 793.7;
const PREVIEW_SCALE_EPS = 0.005;
const PREVIEW_HEIGHT_EPS = 0.5;

function ScaledPreview({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const sheet = sheetRef.current;
    if (!container || !sheet) return;

    const recompute = () => {
      const available = container.clientWidth;
      if (available <= 0) return;

      const nextScale = Math.min(1, available / A4_WIDTH_PX);
      const nextHeight = sheet.offsetHeight * nextScale;

      setScale((prev) =>
        Math.abs(prev - nextScale) > PREVIEW_SCALE_EPS ? nextScale : prev
      );
      setHeight((prev) =>
        Math.abs(prev - nextHeight) > PREVIEW_HEIGHT_EPS ? nextHeight : prev
      );
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(container);
    ro.observe(sheet);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="worksheet-preview-stage persian-nums w-full">
      <div
        style={{ height }}
        className="worksheet-preview-measure relative w-full print:!h-auto"
      >
        <div
          ref={sheetRef}
          className="worksheet-preview-scaler sheet-scaler absolute right-0 top-0 origin-top-right"
          style={{ transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      <label className="text-xs font-medium text-foreground">{label}</label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-app border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary placeholder:text-muted"
      />
    </div>
  );
}
