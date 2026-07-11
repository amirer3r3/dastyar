import type { WorksheetData } from "./types";

function AnswerLines({ count, dashed }: { count: number; dashed: boolean }) {
  return (
    <div className="mt-2 flex flex-col gap-3">
      {Array.from({ length: Math.max(1, count) }).map((_, i) => (
        <div
          key={i}
          className={`h-0 border-b ${
            dashed ? "border-dashed border-pink-300" : "border-dotted border-gray-400"
          }`}
        />
      ))}
    </div>
  );
}

export default function WorksheetPreview({ data }: { data: WorksheetData }) {
  const isCartoon = data.theme === "cartoon";

  return (
    <div
      id="print-area"
      className="a4-sheet mx-auto bg-white text-gray-900 shadow-xl"
      style={{ fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif" }}
    >
      <div
        className={
          isCartoon
            ? "flex h-full min-h-[297mm] flex-col p-[12mm]"
            : "flex h-full min-h-[297mm] flex-col p-[16mm]"
        }
      >
        {/* هدر */}
        {isCartoon ? (
          <div className="rounded-3xl border-4 border-dashed border-pink-400 bg-gradient-to-l from-yellow-50 to-pink-50 p-5 text-center">
            <div className="mb-1 text-3xl">🌟✏️🎨</div>
            <h1 className="text-2xl font-black text-pink-600">{data.title || "کاربرگ"}</h1>
            <div className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-bold text-purple-700">
              {data.subject ? <span>📚 {data.subject}</span> : null}
              {data.grade ? <span>🎒 {data.grade}</span> : null}
              {data.teacher ? <span>👩‍🏫 {data.teacher}</span> : null}
            </div>
          </div>
        ) : (
          <div className="border-b-2 border-gray-800 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="text-sm leading-7 text-gray-700">
                {data.subject ? <div>درس: {data.subject}</div> : null}
                {data.grade ? <div>پایه: {data.grade}</div> : null}
              </div>
              <h1 className="flex-1 text-center text-2xl font-bold text-gray-900">
                {data.title || "کاربرگ"}
              </h1>
              <div className="text-sm leading-7 text-gray-700">
                {data.teacher ? <div>معلم: {data.teacher}</div> : null}
                <div>نام: ...............</div>
              </div>
            </div>
          </div>
        )}

        {/* دستورالعمل */}
        {data.instructions ? (
          <p
            className={
              isCartoon
                ? "mt-5 rounded-2xl bg-blue-50 p-3 text-center text-sm font-bold text-blue-700"
                : "mt-5 text-sm text-gray-600"
            }
          >
            {isCartoon ? "👉 " : ""}
            {data.instructions}
          </p>
        ) : null}

        {/* سوالات */}
        <div className="mt-6 flex flex-1 flex-col gap-6">
          {data.questions.map((q, index) => (
            <div
              key={q.id}
              className={
                isCartoon
                  ? "rounded-2xl border-2 border-purple-200 bg-purple-50/40 p-4"
                  : ""
              }
            >
              <div className="flex items-start gap-2">
                <span
                  className={
                    isCartoon
                      ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-500 text-sm font-black text-white"
                      : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-gray-800 text-sm font-bold"
                  }
                >
                  {index + 1}
                </span>
                <p className="pt-0.5 text-base font-medium leading-7">
                  {q.text || "..."}
                </p>
              </div>
              <div className="pr-9">
                <AnswerLines count={q.answerLines} dashed={isCartoon} />
              </div>
            </div>
          ))}
        </div>

        {/* فوتر */}
        <div
          className={
            isCartoon
              ? "mt-6 rounded-2xl bg-green-100 p-3 text-center text-sm font-black text-green-700"
              : "mt-6 border-t border-gray-300 pt-3 text-center text-xs text-gray-500"
          }
        >
          {isCartoon ? "🎉 آفرین! تو عالی هستی 🎉" : "موفق باشید"}
        </div>
      </div>
    </div>
  );
}
