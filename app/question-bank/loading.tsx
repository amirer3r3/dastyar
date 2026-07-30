export default function QuestionBankLoading() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <div className="h-10 w-48 animate-pulse rounded-full bg-border" />
      <div className="h-12 animate-pulse rounded-2xl bg-border" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 animate-pulse rounded-2xl bg-border" />
        <div className="h-16 animate-pulse rounded-2xl bg-border" />
      </div>
      <div className="h-14 animate-pulse rounded-2xl bg-border" />
      <div className="h-14 animate-pulse rounded-2xl bg-border" />
    </div>
  );
}
