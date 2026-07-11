import { guides } from "./data";
import StepGuideClient from "./step-guide-client";

export default function StepByStepPage() {
  return <StepGuideClient guides={guides} />;
}
