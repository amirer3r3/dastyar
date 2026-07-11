import { questions } from "./data";
import QuestionBankClient from "./question-bank-client";

export default function QuestionBankPage() {
  return <QuestionBankClient questions={questions} />;
}
