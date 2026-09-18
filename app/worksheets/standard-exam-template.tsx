"use client";

import type {
  CSSProperties,
  MouseEventHandler,
  PointerEventHandler,
  ReactNode,
} from "react";
import type { WorksheetData, WorksheetQuestion } from "./types";
import { toPersianDigits } from "@/app/lib/persian-digits";
import { formatExamScore } from "./exam-score";
import { formatPersianDigits } from "./question-style";
import {
  answerRulingBackgroundStyle,
  normalizeAnswerRulingStyle,
  type AnswerRulingStyle,
} from "./answer-ruling-style";
import {
  QUESTION_FLEX_ROW_CONSTRAINT_CLASS,
  QUESTION_TEXT_BOX_CONSTRAINT_CLASS,
} from "./question-text-constraints";
import {
  answerSpaceHeightPx,
  normalizeAnswerUnits,
} from "./worksheet-question-layout";
import { emptyQuestion, type ExamHeaderVariant } from "./types";
import {
  EXAM_HEADER_VARIANT_LABELS,
  usesMinimalExamHeader,
  usesStandardExamTableLayout,
} from "./exam-header-variant";

export type StandardExamHeaderData = Pick<
  WorksheetData,
  | "bismillah"
  | "title"
  | "worksheetDate"
  | "schoolName"
  | "examDistrict"
  | "examCity"
  | "examDuration"
>;

function DottedField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="standard-exam-field header-field-row">
      <span className="standard-exam-field-label header-label">{label}</span>
      {value?.trim() ? (
        <span className="standard-exam-field-value">{toPersianDigits(value)}</span>
      ) : (
        <span className="standard-exam-dots header-dots" aria-hidden />
      )}
    </div>
  );
}

/** عنوان وسط سربرگ مینیمال: «کاربرگ ریاضی» → «آزمون ریاضی» */
export function formatMinimalExamTitle(title: string | undefined): string {
  const raw = title?.trim() || "";
  if (!raw) return "آزمون";
  if (raw.startsWith("کاربرگ")) {
    return raw.replace(/^کاربرگ\s*/u, "آزمون ");
  }
  return raw;
}

function MinHeaderFieldRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div className="minHeader__fieldRow fieldRow">
      <span>{label}</span>
      {value?.trim() ? (
        <span className="minHeader__value">{toPersianDigits(value)}</span>
      ) : (
        <span className="line" aria-hidden />
      )}
    </div>
  );
}

export function MinimalExamHeader({ data }: { data: StandardExamHeaderData }) {
  const bismillah = data.bismillah?.trim() || "به نام خدا";
  const examTitle = formatMinimalExamTitle(data.title);

  return (
    <header
      className="standard-exam-header standard-exam-header--minimal minHeader exam-header z-10 select-none"
      dir="rtl"
    >
      <div className="minHeader__right minHeader__stack">
        <MinHeaderFieldRow label="نام و نام خانوادگی:" />
        <MinHeaderFieldRow label="کلاس / شعبه:" />
      </div>

      <div className="minHeader__center">
        <div className="bismillah">{bismillah}</div>
        <div className="title">{toPersianDigits(examTitle)}</div>
      </div>

      <div className="minHeader__left minHeader__stack">
        <MinHeaderFieldRow label="تاریخ آزمون:" value={data.worksheetDate} />
        <MinHeaderFieldRow label="زمان پاسخ‌دهی:" value={data.examDuration} />
      </div>
    </header>
  );
}

export function StandardExamHeader({ data }: { data: StandardExamHeaderData }) {
  const district = data.examDistrict?.trim() || ".........";
  const city = data.examCity?.trim() || ".........";
  const bismillah = data.bismillah?.trim() || "به نام خدا";

  return (
    <header className="standard-exam-header exam-header z-10 select-none">
      <div className="standard-exam-header-col standard-exam-header-col--right header-side-column">
        <DottedField label="نام:" />
        <DottedField label="نام خانوادگی:" />
        <DottedField label="کلاس:" />
      </div>
      <div className="standard-exam-header-col standard-exam-header-col--center flex flex-col items-center text-center">
        <p className="standard-exam-bismillah center-title text-center text-sm font-bold">
          {bismillah}
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/khoda.svg"
          alt="نشان رسمی"
          className="standard-exam-emblem mx-auto my-1 h-10 w-10 object-contain sm:h-11 sm:w-11"
        />
        <p className="standard-exam-org-line sub-center-title">
          آموزش و پرورش ناحیه {toPersianDigits(district)} شهرستان{" "}
          {toPersianDigits(city)}
        </p>
      </div>
      <div className="standard-exam-header-col standard-exam-header-col--left header-side-column">
        <DottedField label="تاریخ:" value={data.worksheetDate} />
        <DottedField label="آزمون:" value={data.title} />
        <DottedField label="نام مدرسه:" value={data.schoolName} />
      </div>
    </header>
  );
}

export function StandardExamHeaderByVariant({
  variant,
  data,
}: {
  variant: ExamHeaderVariant;
  data: StandardExamHeaderData;
}) {
  if (usesMinimalExamHeader(variant)) {
    return <MinimalExamHeader data={data} />;
  }
  return <StandardExamHeader data={data} />;
}

export { EXAM_HEADER_VARIANT_LABELS };

/** استایل شماره سوال/ردیف — همان fontSize و fontFamily متن سوال */
export function standardExamQuestionNumberStyle(
  qStyle: CSSProperties
): CSSProperties {
  return {
    fontFamily: qStyle.fontFamily,
    fontSize: qStyle.fontSize,
    lineHeight: qStyle.lineHeight ?? 1.55,
    fontWeight: 700,
  };
}

export function standardExamAnswerSpaceHeightPx(
  units: number,
  options?: { reserveEditorMin?: boolean }
): number {
  return answerSpaceHeightPx(
    units,
    options?.reserveEditorMin ? "editor" : "print"
  );
}

export const RULED_ANSWER_LINE_STEP_PX = 28;

export function StandardExamAnswerSpace({
  units,
  reserveEditorMin = false,
  ruled = false,
  rulingStyle,
  className = "",
}: {
  units: number;
  /** در ادیتور حرفه‌ای — حداقل ارتفاع برای نگه‌داشتن دستگیره */
  reserveEditorMin?: boolean;
  /** @deprecated از rulingStyle استفاده کنید */
  ruled?: boolean;
  rulingStyle?: AnswerRulingStyle;
  className?: string;
}) {
  const h = standardExamAnswerSpaceHeightPx(units, { reserveEditorMin });
  if (h <= 0) return null;
  const kind = normalizeAnswerRulingStyle(
    rulingStyle ?? (ruled ? "ruled" : "none")
  );
  const hasRuling = kind !== "none";
  return (
    <div
      className={`standard-exam-answer-space w-full relative transition-all ${
        hasRuling ? "standard-exam-answer-space--ruled" : ""
      } ${className}`.trim()}
      style={{
        height: h,
        ...answerRulingBackgroundStyle(kind, { reserveEditorMin }),
      }}
    />
  );
}

export function StandardExamQuestionCell({
  q,
  qStyle,
  body,
  renderAnswerSpaceArea,
}: {
  q: WorksheetQuestion;
  qStyle: CSSProperties;
  /** در ادیتور حرفه‌ای — ویرایش مستقیم متن سوال */
  body?: ReactNode;
  /** دستگیره فاصله پاسخ (ادیتور حرفه‌ای) */
  renderAnswerSpaceArea?: (q: WorksheetQuestion, units: number) => ReactNode;
}) {
  const units = normalizeAnswerUnits(q.answerLines);
  return (
    <div className={`standard-exam-q-cell ${QUESTION_TEXT_BOX_CONSTRAINT_CLASS}`}>
      {body ?? (
        <p className="standard-exam-q-text" style={qStyle}>
          {q.text?.trim() || "..."}
        </p>
      )}
      {renderAnswerSpaceArea ? (
        renderAnswerSpaceArea(q, units)
      ) : (
        <StandardExamAnswerSpace units={units} />
      )}
    </div>
  );
}

export function StandardExamTable({
  rows,
  startIndex,
  qStyle,
  renderQuestionBody,
  renderAnswerSpaceArea,
  renderScoreCell,
}: {
  rows: WorksheetQuestion[];
  startIndex: number;
  qStyle: CSSProperties;
  renderQuestionBody?: (q: WorksheetQuestion, rowIndex: number) => ReactNode;
  renderAnswerSpaceArea?: (q: WorksheetQuestion, units: number) => ReactNode;
  renderScoreCell?: (q: WorksheetQuestion) => ReactNode;
}) {
  const displayRows = rows.length > 0 ? rows : [emptyQuestion()];

  return (
    <table className="standard-exam-table exam-table">
      <thead>
        <tr>
          <th className="standard-exam-col-row">ردیف</th>
          <th className="standard-exam-col-body">شرح سؤال و پاسخ</th>
          <th className="standard-exam-col-score">بارم</th>
        </tr>
      </thead>
      <tbody>
        {displayRows.map((q, i) => (
          <tr key={q.id}>
            <td
              className="standard-exam-col-row"
              style={standardExamQuestionNumberStyle(qStyle)}
            >
              {rows.length > 0 ? formatPersianDigits(startIndex + i + 1) : ""}
            </td>
            <td className="standard-exam-col-body">
              <StandardExamQuestionCell
                q={q}
                qStyle={qStyle}
                body={
                  renderQuestionBody && rows.length > 0
                    ? renderQuestionBody(q, startIndex + i)
                    : undefined
                }
                renderAnswerSpaceArea={
                  rows.length > 0 ? renderAnswerSpaceArea : undefined
                }
              />
            </td>
            <td className="standard-exam-col-score">
              {renderScoreCell && rows.length > 0 ? (
                renderScoreCell(q)
              ) : (
                formatExamScore(q.score)
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export type StandardExamFreeQuestionItemProps = {
  className?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  onPointerDown?: PointerEventHandler<HTMLElement>;
};

type StandardExamQuestionsProps = {
  rows: WorksheetQuestion[];
  startIndex: number;
  qStyle: CSSProperties;
  renderQuestionBody?: (q: WorksheetQuestion, rowIndex: number) => ReactNode;
  /** گزینه‌ها / تصویر / فرمول جدا از خط متن (قالب آزاد) */
  renderQuestionExtra?: (q: WorksheetQuestion, rowIndex: number) => ReactNode;
  renderAnswerSpaceArea?: (q: WorksheetQuestion, units: number) => ReactNode;
  renderScoreCell?: (q: WorksheetQuestion) => ReactNode;
  /** ادیتور — انتخاب سوال (کادر سبز دور کل آیتم) */
  getFreeQuestionItemProps?: (
    q: WorksheetQuestion,
    rowIndex: number
  ) => StandardExamFreeQuestionItemProps | undefined;
};

export function StandardExamFreeQuestions({
  rows,
  startIndex,
  qStyle,
  renderQuestionBody,
  renderQuestionExtra,
  renderAnswerSpaceArea,
  getFreeQuestionItemProps,
}: StandardExamQuestionsProps) {
  const displayRows = rows.length > 0 ? rows : [emptyQuestion()];

  return (
    <div
      className={`standard-exam-free-list ${QUESTION_TEXT_BOX_CONSTRAINT_CLASS} py-3`}
      dir="rtl"
    >
      {displayRows.map((q, i) => {
        const showNumber = rows.length > 0;
        const num = showNumber ? formatPersianDigits(startIndex + i + 1) : "";
        const units = normalizeAnswerUnits(q.answerLines);
        const answerArea =
          rows.length > 0
            ? renderAnswerSpaceArea
              ? renderAnswerSpaceArea(q, units)
              : units > 0
                ? <StandardExamAnswerSpace units={units} />
                : null
            : null;
        const extraBlock =
          rows.length > 0 ? renderQuestionExtra?.(q, startIndex + i) : null;
        const hasExtra = Boolean(extraBlock || answerArea);
        const itemBind = getFreeQuestionItemProps?.(q, startIndex + i);

        return (
          <article
            key={q.id}
            data-qid={q.id}
            className={`question-item standard-exam-free-item ${QUESTION_TEXT_BOX_CONSTRAINT_CLASS} text-right ${itemBind?.className ?? ""}`}
            dir="rtl"
            onClick={itemBind?.onClick}
            onPointerDown={itemBind?.onPointerDown}
          >
            {showNumber ? (
              <div className={`${QUESTION_FLEX_ROW_CONSTRAINT_CLASS} text-right`}>
                <div
                  className={`flex max-w-full min-w-0 items-baseline justify-start gap-2 text-right ${QUESTION_FLEX_ROW_CONSTRAINT_CLASS}`}
                  style={qStyle}
                >
                <span
                  className="question-number standard-exam-free-num inline-block shrink-0 select-none font-bold text-slate-900"
                  style={standardExamQuestionNumberStyle(qStyle)}
                >
                  {num}-
                </span>
                <div
                  className={`question-text flex-1 font-medium text-slate-900 ${QUESTION_TEXT_BOX_CONSTRAINT_CLASS}`}
                >
                  {renderQuestionBody && rows.length > 0 ? (
                    renderQuestionBody(q, startIndex + i)
                  ) : (
                    <span className="standard-exam-q-text">
                      {q.text?.trim() || "..."}
                    </span>
                  )}
                </div>
                </div>
              </div>
            ) : null}
            {hasExtra ? (
              <div className="question-extra mr-7 mt-2">
                {extraBlock}
                {answerArea}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

export function StandardExamQuestions({
  layoutVariant,
  ...props
}: StandardExamQuestionsProps & { layoutVariant: ExamHeaderVariant }) {
  if (!usesStandardExamTableLayout(layoutVariant)) {
    return <StandardExamFreeQuestions {...props} />;
  }
  return <StandardExamTable {...props} />;
}

export const DEFAULT_STANDARD_EXAM_FOOTER_MESSAGE = "موفق و سربلند باشید";

export function resolveStandardExamFooterMessage(raw?: string): string {
  const trimmed = raw?.trim();
  return trimmed || DEFAULT_STANDARD_EXAM_FOOTER_MESSAGE;
}

export function StandardExamFooter({ message }: { message?: string }) {
  const text = resolveStandardExamFooterMessage(message);
  return (
    <footer className="standard-exam-footer">
      <span className="standard-exam-footer-line" aria-hidden />
      <span className="standard-exam-footer-text">{text}</span>
      <span className="standard-exam-footer-line" aria-hidden />
    </footer>
  );
}

/** لایه بیرونی A4 — حاشیه سفید ۸mm (چاپ / PDF) */
export const A4_SHEET_SURFACE_STYLE: CSSProperties = {
  width: "210mm",
  minHeight: "297mm",
  height: "297mm",
  padding: "8mm",
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
  margin: "0 auto",
  position: "relative",
};

/** کادر بیرونی (خط ضخیم) */
export const EXAM_OUTER_FRAME_STYLE: CSSProperties = {
  width: "100%",
  height: "100%",
  minHeight: "calc(297mm - 16mm)",
  border: "2px solid #000000",
  padding: "3px",
  boxSizing: "border-box",
};

/** کادر داخلی (خط نازک + محتوا) */
export const EXAM_INNER_FRAME_STYLE: CSSProperties = {
  width: "100%",
  height: "100%",
  minHeight: "100%",
  border: "1px solid #000000",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  position: "relative",
};

export function StandardExamPageShell({
  showHeader,
  headerData,
  headerVariant = "standard",
  children,
  floatingOverlay,
}: {
  showHeader: boolean;
  headerData: StandardExamHeaderData;
  headerVariant?: ExamHeaderVariant;
  children: ReactNode;
  floatingOverlay?: ReactNode;
}) {
  return (
    <section
      className="standard-exam-page a4-page a4-sheet worksheet-theme-standard school-exam-theme bg-white shadow-xl"
      style={A4_SHEET_SURFACE_STYLE}
      dir="rtl"
    >
      <div
        className="exam-outer-frame exam-frame standard-exam-outer"
        style={EXAM_OUTER_FRAME_STYLE}
      >
        <div
          className="exam-inner-frame standard-exam-inner"
          style={EXAM_INNER_FRAME_STYLE}
        >
          {showHeader ? (
            usesMinimalExamHeader(headerVariant) ? (
              <div className="standard-exam-min-header-slot">
                <StandardExamHeaderByVariant
                  variant={headerVariant}
                  data={headerData}
                />
              </div>
            ) : (
              <StandardExamHeaderByVariant
                variant={headerVariant}
                data={headerData}
              />
            )
          ) : null}
          <div className="standard-exam-body exam-body-container">
            <div className="standard-exam-flow exam-questions-list">
              {children}
            </div>
            {floatingOverlay}
          </div>
        </div>
      </div>
    </section>
  );
}
