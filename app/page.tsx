import HomeHeader from "./components/home/home-header";
import SearchBar from "./components/home/search-bar";
import SectionHeading from "./components/home/section-heading";
import ContentCard from "./components/home/content-card";
import TeacherToolsSection from "./components/home/teacher-tools-section";
import { educationalContent } from "./lib/navigation";

export default function Home() {
  return (
    <>
      <HomeHeader />

      <main className="flex flex-col gap-4 px-4 pt-8">
        <div className="fade-up">
          <SearchBar />
        </div>

        <section>
          <SectionHeading title="محتوای آموزشی" />
          <div className="flex flex-col gap-2">
            {educationalContent.map((card, index) => (
              <ContentCard key={card.href} card={card} index={index} />
            ))}
          </div>
        </section>

        <TeacherToolsSection />
      </main>
    </>
  );
}
