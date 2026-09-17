import type { CSSProperties } from "react";
import type { WorksheetData } from "./types";
import { toPersianDigits } from "@/app/lib/persian-digits";
import {
  ANSWER_SPACE_UNIT_PX,
  defaultQuestionStyle,
  formatPersianDigits,
  normalizeDividerKind,
} from "./question-style";
import QuestionDividerLine from "./QuestionDividerLine";
import CartoonWorksheetPreview from "./cartoon-worksheet-preview";
import AsmanWorksheetPreview from "./asman-worksheet-preview";
import StandardExamPreview from "./standard-exam-preview";

function AnswerSpace({ units }: { units: number }) {
  const h = Math.max(0, units) * ANSWER_SPACE_UNIT_PX;
  if (h <= 0) return null;
  return <div className="mt-2 w-full shrink-0" style={{ height: h }} aria-hidden />;
}

function QuestionDivider({
  enabled,
  afterSpaceUnits,
  kind,
}: {
  enabled: boolean;
  afterSpaceUnits: number;
  kind: import("./question-style").QuestionDividerKind;
}) {
  if (!enabled) return null;
  const gap = Math.max(12, afterSpaceUnits * 6);
  return <QuestionDividerLine kind={kind} marginTop={gap} />;
}

function WorksheetMetaLines({ data }: { data: WorksheetData }) {
  const items: string[] = [];
  if (data.subject) items.push(`درس: ${data.subject}`);
  if (data.grade) items.push(`پایه: ${data.grade}`);
  if (data.teacherName) items.push(`معلم: ${data.teacherName}`);
  if (data.worksheetDate) items.push(`تاریخ: ${data.worksheetDate}`);
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm leading-7 text-gray-700">
      {items.map((line) => (
        <span key={line}>{toPersianDigits(line)}</span>
      ))}
    </div>
  );
}

function questionTextStyle(data: WorksheetData): CSSProperties {
  const style = data.questionStyle ?? defaultQuestionStyle();
  return {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    textAlign: "right",
  };
}

function FloralWorksheetPreview({ data }: { data: WorksheetData }) {
  const style = data.questionStyle ?? defaultQuestionStyle();
  const dividers = style.dividersBetweenQuestions;
  const dividerKind = normalizeDividerKind(style.questionDividerKind);
  const qStyle = questionTextStyle(data);

  return (
    <div
      id="print-area"
      className="persian-nums worksheet-theme-floral a4-sheet relative mx-auto overflow-hidden bg-white text-gray-800 shadow-xl"
      style={{ fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" }}
    >
      {data.title ? (
        <div className="worksheet-floral-title">
          {data.title}
          {data.subject ? (
            <span className="mt-1 block text-[10pt] font-semibold text-emerald-800">
              {data.subject}
            </span>
          ) : null}
        </div>
      ) : null}
      {data.grade ? (
        <div className="worksheet-floral-grade">{data.grade}</div>
      ) : null}

      <div className="worksheet-floral-body flex min-h-[297mm] flex-col">
        {data.bismillah ? (
          <p className="mb-2 text-center text-sm font-medium text-emerald-900">
            {data.bismillah}
          </p>
        ) : null}
        {data.teacherName || data.worksheetDate ? (
          <p className="mb-3 text-center text-xs text-emerald-800">
            {[data.teacherName ? `معلم: ${data.teacherName}` : null, data.worksheetDate ? `تاریخ: ${data.worksheetDate}` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
        ) : null}
        {data.instructions ? (
          <p className="mb-4 text-center text-sm leading-7 text-emerald-900">
            {data.instructions}
          </p>
        ) : null}

        <div className="flex flex-1 flex-col gap-2">
          {data.questions.map((q, index) => (
            <div key={q.id}>
              <div className="flex items-start gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 text-sm font-bold text-emerald-700">
                  {formatPersianDigits(index + 1)}
                </span>
                <p
                  className="flex-1 pt-0.5 font-medium leading-7"
                  style={qStyle}
                >
                  {q.text || "..."}
                </p>
              </div>
              <div className="pr-9">
                <AnswerSpace units={q.answerLines} />
              </div>
              <QuestionDivider
                enabled={dividers && index < data.questions.length - 1}
                afterSpaceUnits={q.answerLines}
                kind={dividerKind}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WorksheetPreview({ data }: { data: WorksheetData }) {
  if (data.theme === "floral") {
    return <FloralWorksheetPreview data={data} />;
  }

  if (data.theme === "cartoon") {
    return <CartoonWorksheetPreview data={data} />;
  }

  if (data.theme === "asman") {
    return <AsmanWorksheetPreview data={data} />;
  }

  if (data.theme === "standard") {
    return <StandardExamPreview data={data} />;
  }

  const style = data.questionStyle ?? defaultQuestionStyle();
  const dividers = style.dividersBetweenQuestions;
  const dividerKind = normalizeDividerKind(style.questionDividerKind);
  const qStyle = questionTextStyle(data);

  return (
    <div
      id="print-area"
      className="persian-nums a4-sheet mx-auto bg-white text-gray-900 shadow-xl"
      style={{ fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" }}
    >
      <div className="flex h-full min-h-[297mm] flex-col p-[16mm]">
        {data.bismillah ? (
          <p className="mb-3 text-center text-sm font-medium text-gray-800">
            {data.bismillah}
          </p>
        ) : null}

        <div className="border-b-2 border-gray-800 pb-4">
          <h1 className="mb-3 text-center text-2xl font-bold text-gray-900">
            {data.title || "کاربرگ"}
          </h1>
          <WorksheetMetaLines data={data} />
          <div className="mt-2 text-center text-sm text-gray-700">
            نام دانش‌آموز: ...............
          </div>
        </div>

        {data.instructions ? (
          <p className="mt-5 text-sm text-gray-600">{data.instructions}</p>
        ) : null}

        <div className="mt-6 flex flex-1 flex-col gap-2">
          {data.questions.map((q, index) => (
            <div key={q.id}>
              <div className="flex items-start gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-gray-800 text-sm font-bold">
                  {formatPersianDigits(index + 1)}
                </span>
                <p
                  className="flex-1 pt-0.5 font-medium leading-7"
                  style={qStyle}
                >
                  {q.text || "..."}
                </p>
              </div>
              <div className="pr-9">
                <AnswerSpace units={q.answerLines} />
              </div>
              <QuestionDivider
                enabled={dividers && index < data.questions.length - 1}
                afterSpaceUnits={q.answerLines}
                kind={dividerKind}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-gray-300 pt-3 text-center text-xs text-gray-500">
          موفق باشید
        </div>
      </div>
    </div>
  );
}
