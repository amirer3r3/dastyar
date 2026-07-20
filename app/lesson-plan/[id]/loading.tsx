export default function LessonPlanDetailLoading() {
  return (
    <div className="flex flex-col gap-4 px-4 pt-6">
      <div className="h-10 w-full animate-pulse rounded-app bg-border" />
      <div className="h-24 animate-pulse rounded-app bg-border" />
      <div className="aspect-[3/4] animate-pulse rounded-app bg-border" />
      <div className="h-12 animate-pulse rounded-full bg-border" />
    </div>
  );
}
