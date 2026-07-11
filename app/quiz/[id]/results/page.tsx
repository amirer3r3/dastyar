import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getQuiz, getSubmissions } from "@/app/lib/quizzes";
import ResultsDashboard from "./results-dashboard";

export default async function QuizResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const quiz = await getQuiz(session.user.id, id);
  if (!quiz) {
    notFound();
  }

  const submissions = await getSubmissions(id);

  return <ResultsDashboard quiz={quiz} submissions={submissions} />;
}
