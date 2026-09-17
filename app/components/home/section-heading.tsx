export default function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center gap-2 px-1">
      <span className="h-6 w-1.5 rounded bg-blue-600" />
      <h2 className="text-base font-bold text-foreground">{title}</h2>
    </div>
  );
}
