import type { Quiz, QuizQuestion, QuizSubmission } from "@/app/quiz/types";

export const DESCRIPTIVE_MAX = 10;

export type QuestionScore = {
  questionId: string;
  score: number;
  maxScore: number;
  auto: boolean;
  correct?: boolean;
  needsGrading: boolean;
};

export type SubmissionScore = {
  submissionId: string;
  studentName: string;
  submittedAt: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  pendingDescriptive: number;
  questionScores: QuestionScore[];
};

function getAnswer(submission: QuizSubmission, questionId: string): string {
  return submission.answers.find((a) => a.questionId === questionId)?.value ?? "";
}

function scoreMultipleChoice(question: QuizQuestion, answer: string): QuestionScore {
  const selected = parseInt(answer, 10);
  const correct = selected === question.correctOption;
  return {
    questionId: question.id,
    score: correct ? 1 : 0,
    maxScore: 1,
    auto: true,
    correct,
    needsGrading: false,
  };
}

function scoreMatching(question: QuizQuestion, answer: string): QuestionScore {
  const pairs = (question.pairs ?? []).filter(
    (p) => p.left.trim() && p.right.trim()
  );
  if (pairs.length === 0) {
    return {
      questionId: question.id,
      score: 0,
      maxScore: 1,
      auto: true,
      correct: false,
      needsGrading: false,
    };
  }

  let parsed: Record<string, string> = {};
  try {
    parsed = JSON.parse(answer || "{}");
  } catch {
    parsed = {};
  }

  const correctCount = pairs.filter((p) => parsed[p.id] === p.right).length;
  const ratio = correctCount / pairs.length;

  return {
    questionId: question.id,
    score: Math.round(ratio * 100) / 100,
    maxScore: 1,
    auto: true,
    correct: ratio === 1,
    needsGrading: false,
  };
}

function scoreDescriptive(
  question: QuizQuestion,
  submission: QuizSubmission
): QuestionScore {
  const manual = submission.manualGrades?.[question.id];
  const hasGrade = manual !== undefined && manual !== null;

  return {
    questionId: question.id,
    score: hasGrade ? manual : 0,
    maxScore: DESCRIPTIVE_MAX,
    auto: false,
    needsGrading: !hasGrade,
  };
}

export function scoreQuestion(
  question: QuizQuestion,
  submission: QuizSubmission
): QuestionScore {
  const answer = getAnswer(submission, question.id);

  if (question.type === "multiple_choice") {
    return scoreMultipleChoice(question, answer);
  }
  if (question.type === "matching") {
    return scoreMatching(question, answer);
  }
  return scoreDescriptive(question, submission);
}

export function scoreSubmission(
  quiz: Quiz,
  submission: QuizSubmission
): SubmissionScore {
  const questionScores = quiz.questions.map((q) =>
    scoreQuestion(q, submission)
  );

  const totalScore = questionScores.reduce((s, q) => s + q.score, 0);
  const maxScore = questionScores.reduce((s, q) => s + q.maxScore, 0);
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  const pendingDescriptive = questionScores.filter((q) => q.needsGrading).length;

  return {
    submissionId: submission.id,
    studentName: submission.studentName,
    submittedAt: submission.submittedAt,
    totalScore,
    maxScore,
    percentage,
    pendingDescriptive,
    questionScores,
  };
}

export function formatAnswer(
  question: QuizQuestion,
  answer: string
): string {
  if (question.type === "multiple_choice") {
    const idx = parseInt(answer, 10);
    const opt = question.options?.[idx];
    return opt ? `${idx + 1}. ${opt}` : "—";
  }
  if (question.type === "matching") {
    let parsed: Record<string, string> = {};
    try {
      parsed = JSON.parse(answer || "{}");
    } catch {
      return "—";
    }
    return (question.pairs ?? [])
      .filter((p) => p.left.trim())
      .map((p) => `${p.left} → ${parsed[p.id] ?? "؟"}`)
      .join(" | ");
  }
  return answer || "—";
}
