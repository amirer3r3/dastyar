import { Suspense } from "react";
import WorksheetEditor from "../worksheet-editor";

export default function CreateWorksheetPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-muted">در حال بارگذاری…</div>}>
      <WorksheetEditor />
    </Suspense>
  );
}
