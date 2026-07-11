import { notFound } from "next/navigation";
import { getQuizById } from "@/app/lib/quizzes";
import QuizTakeClient from "../../quiz-take-client";

export default async function QuizTakePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quiz = await getQuizById(id);

  if (!quiz) {
    notFound();
  }

  return <QuizTakeClient quiz={quiz} />;
}
