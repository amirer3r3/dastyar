export default function WorksheetsLoading() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <div className="h-10 w-40 animate-pulse rounded-full bg-border" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-11 animate-pulse rounded-app bg-border" />
        <div className="h-11 animate-pulse rounded-app bg-border" />
      </div>
      <div className="mt-2 h-14 animate-pulse rounded-app bg-border" />
      <div className="h-14 animate-pulse rounded-app bg-border" />
      <div className="h-14 animate-pulse rounded-app bg-border" />
    </div>
  );
}
