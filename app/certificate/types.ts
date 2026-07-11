export type TemplateKind = "certificate" | "badge";

export type TemplateId =
  | "cert-classic"
  | "cert-fun"
  | "badge-star"
  | "badge-great";

export type CertificateData = {
  templateId: TemplateId;
  studentName: string;
  message: string;
  teacherName: string;
};

export type Template = {
  id: TemplateId;
  kind: TemplateKind;
  name: string;
  emoji: string;
  description: string;
};

export const templates: Template[] = [
  {
    id: "cert-classic",
    kind: "certificate",
    name: "تقدیرنامه رسمی",
    emoji: "📜",
    description: "مناسب مراسم و چاپ",
  },
  {
    id: "cert-fun",
    kind: "certificate",
    name: "تقدیرنامه فانتزی",
    emoji: "🌈",
    description: "رنگارنگ برای ابتدایی",
  },
  {
    id: "badge-star",
    kind: "badge",
    name: "برچسب ستاره",
    emoji: "⭐",
    description: "برچسب تشویقی کوچک",
  },
  {
    id: "badge-great",
    kind: "badge",
    name: "برچسب عالی بود",
    emoji: "🏆",
    description: "مناسب ارسال در شاد",
  },
];

export const defaultCertificateData = (): CertificateData => ({
  templateId: "cert-classic",
  studentName: "",
  message: "به دلیل تلاش و موفقیت در درس، تقدیر می‌شود.",
  teacherName: "",
});
