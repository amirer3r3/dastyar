import { teacherTools } from "@/app/lib/navigation";
import SectionHeading from "./section-heading";
import TeacherToolCard from "./teacher-tool-item";

export default function TeacherToolsSection() {
  const tall = teacherTools.find((t) => t.variant === "tall");
  const compact = teacherTools.filter((t) => t.variant === "compact");

  if (!tall) return null;

  return (
    <section>
      <SectionHeading title="ابزارهای معلم" />

      <div className="grid grid-cols-2 grid-rows-2 gap-2">
        <div className="row-span-2">
          <TeacherToolCard tool={tall} index={0} />
        </div>

        {compact.map((tool, index) => (
          <TeacherToolCard key={tool.href} tool={tool} index={index + 1} />
        ))}
      </div>
    </section>
  );
}
