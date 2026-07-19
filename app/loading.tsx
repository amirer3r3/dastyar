export default function GlobalLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-6">
      <div className="h-10 w-10 animate-pulse rounded-full bg-primary/20" />
      <div className="h-3 w-28 animate-pulse rounded-full bg-border" />
    </div>
  );
}
