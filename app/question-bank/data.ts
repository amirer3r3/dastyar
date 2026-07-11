export type Difficulty = "easy" | "medium" | "hard";

export type Question = {
  id: string;
  text: string;
  answer: string;
  grade: string;
  subject: string;
  difficulty: Difficulty;
};

export const grades = [
  "پایه اول",
  "پایه دوم",
  "پایه سوم",
  "پایه چهارم",
  "پایه پنجم",
  "پایه ششم",
];

export const subjects = ["ریاضی", "علوم", "فارسی", "مطالعات اجتماعی", "هدیه‌های آسمان"];

export const difficulties: { value: Difficulty; label: string; color: string }[] = [
  { value: "easy", label: "آسان", color: "#16a34a" },
  { value: "medium", label: "متوسط", color: "#f59e0b" },
  { value: "hard", label: "سخت", color: "#ef4444" },
];

export const difficultyLabel = (d: Difficulty) =>
  difficulties.find((x) => x.value === d)?.label ?? d;

export const difficultyColor = (d: Difficulty) =>
  difficulties.find((x) => x.value === d)?.color ?? "#6b7280";

export const questions: Question[] = [
  {
    id: "q1",
    text: "حاصل عبارت ۲۵ + ۳۷ چند می‌شود؟",
    answer: "۶۲",
    grade: "پایه سوم",
    subject: "ریاضی",
    difficulty: "easy",
  },
  {
    id: "q2",
    text: "کوچک‌ترین عدد سه رقمی را بنویسید.",
    answer: "۱۰۰",
    grade: "پایه سوم",
    subject: "ریاضی",
    difficulty: "easy",
  },
  {
    id: "q3",
    text: "اگر یک مستطیل طول ۸ و عرض ۵ داشته باشد، محیط آن چند است؟",
    answer: "۲۶ (۲ × (۸ + ۵))",
    grade: "پایه پنجم",
    subject: "ریاضی",
    difficulty: "medium",
  },
  {
    id: "q4",
    text: "حاصل ضرب ۱۲ × ۱۲ را حساب کنید.",
    answer: "۱۴۴",
    grade: "پایه چهارم",
    subject: "ریاضی",
    difficulty: "medium",
  },
  {
    id: "q5",
    text: "کسر ۳/۴ را به صورت اعشاری بنویسید.",
    answer: "۰٫۷۵",
    grade: "پایه ششم",
    subject: "ریاضی",
    difficulty: "hard",
  },
  {
    id: "q6",
    text: "سه حالت ماده را نام ببرید.",
    answer: "جامد، مایع، گاز",
    grade: "پایه چهارم",
    subject: "علوم",
    difficulty: "easy",
  },
  {
    id: "q7",
    text: "کدام اندام بدن وظیفه پمپاژ خون را بر عهده دارد؟",
    answer: "قلب",
    grade: "پایه پنجم",
    subject: "علوم",
    difficulty: "easy",
  },
  {
    id: "q8",
    text: "فرآیندی که گیاهان با آن غذای خود را می‌سازند چه نام دارد؟",
    answer: "فتوسنتز",
    grade: "پایه ششم",
    subject: "علوم",
    difficulty: "medium",
  },
  {
    id: "q9",
    text: "چرخه آب در طبیعت شامل چه مراحلی است؟ (توضیح دهید)",
    answer: "تبخیر، میعان، بارش، جمع‌آوری",
    grade: "پایه ششم",
    subject: "علوم",
    difficulty: "hard",
  },
  {
    id: "q10",
    text: "مخالف کلمه «شادی» چیست؟",
    answer: "غم / اندوه",
    grade: "پایه دوم",
    subject: "فارسی",
    difficulty: "easy",
  },
  {
    id: "q11",
    text: "برای کلمه «کتاب» یک جمله بسازید.",
    answer: "نمونه: من کتاب داستان می‌خوانم.",
    grade: "پایه دوم",
    subject: "فارسی",
    difficulty: "easy",
  },
  {
    id: "q12",
    text: "در جمله «هوا سرد است»، فعل کدام است؟",
    answer: "است",
    grade: "پایه سوم",
    subject: "فارسی",
    difficulty: "medium",
  },
  {
    id: "q13",
    text: "منظور از «آرایه تشبیه» در ادبیات چیست؟ با مثال توضیح دهید.",
    answer: "مانند کردن چیزی به چیز دیگر؛ مثال: او مثل شیر شجاع است.",
    grade: "پایه ششم",
    subject: "فارسی",
    difficulty: "hard",
  },
  {
    id: "q14",
    text: "پایتخت ایران کدام شهر است؟",
    answer: "تهران",
    grade: "پایه چهارم",
    subject: "مطالعات اجتماعی",
    difficulty: "easy",
  },
  {
    id: "q15",
    text: "چهار جهت اصلی جغرافیایی را نام ببرید.",
    answer: "شمال، جنوب، شرق، غرب",
    grade: "پایه چهارم",
    subject: "مطالعات اجتماعی",
    difficulty: "easy",
  },
  {
    id: "q16",
    text: "دو مورد از وظایف شهرداری را بنویسید.",
    answer: "نمونه: جمع‌آوری زباله، ساخت و نگهداری پارک‌ها",
    grade: "پایه پنجم",
    subject: "مطالعات اجتماعی",
    difficulty: "medium",
  },
  {
    id: "q17",
    text: "شمردن از ۱ تا ۵ را تمرین کنید و بنویسید.",
    answer: "۱، ۲، ۳، ۴، ۵",
    grade: "پایه اول",
    subject: "ریاضی",
    difficulty: "easy",
  },
  {
    id: "q18",
    text: "نماز چند رکعت است؟ نمازهای روزانه را نام ببرید.",
    answer: "۱۷ رکعت؛ صبح، ظهر، عصر، مغرب، عشا",
    grade: "پایه پنجم",
    subject: "هدیه‌های آسمان",
    difficulty: "medium",
  },
];
