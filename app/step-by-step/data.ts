export type Exercise = {
  id: string;
  title: string;
  problem: string;
  steps: string[];
  finalAnswer: string;
};

export type Chapter = {
  id: string;
  title: string;
  exercises: Exercise[];
};

export type SubjectGuide = {
  id: string;
  title: string;
  grade: string;
  icon: string;
  color: string;
  chapters: Chapter[];
};

export const guides: SubjectGuide[] = [
  {
    id: "math3",
    title: "ریاضی سوم",
    grade: "پایه سوم",
    icon: "🔢",
    color: "#3b82f6",
    chapters: [
      {
        id: "math3-ch1",
        title: "فصل ۱: الگوها و عددنویسی",
        exercises: [
          {
            id: "math3-ch1-e1",
            title: "تمرین ۱: جمع دو عدد سه‌رقمی",
            problem: "حاصل جمع ۲۴۶ + ۱۳۷ را به دست آورید.",
            steps: [
              "یکان‌ها را جمع می‌کنیم: ۶ + ۷ = ۱۳. رقم ۳ را می‌نویسیم و ۱ ده‌تایی به دهگان می‌بریم.",
              "دهگان‌ها را جمع می‌کنیم: ۴ + ۳ = ۷، به‌علاوه ۱ که آوردیم می‌شود ۸.",
              "صدگان‌ها را جمع می‌کنیم: ۲ + ۱ = ۳.",
              "نتیجه را کنار هم می‌گذاریم: ۳۸۳.",
            ],
            finalAnswer: "۳۸۳",
          },
          {
            id: "math3-ch1-e2",
            title: "تمرین ۲: الگوی عددی",
            problem: "عدد بعدی در الگوی ۲، ۴، ۶، ۸، ... چیست؟",
            steps: [
              "تفاوت هر عدد با عدد قبلی را پیدا می‌کنیم: ۴ − ۲ = ۲.",
              "می‌بینیم که هر بار ۲ واحد اضافه می‌شود (الگوی شمارش دوتا دوتا).",
              "پس به آخرین عدد یعنی ۸، مقدار ۲ را اضافه می‌کنیم: ۸ + ۲ = ۱۰.",
            ],
            finalAnswer: "۱۰",
          },
        ],
      },
      {
        id: "math3-ch2",
        title: "فصل ۲: ضرب و تقسیم",
        exercises: [
          {
            id: "math3-ch2-e1",
            title: "تمرین ۱: ضرب",
            problem: "حاصل ۷ × ۶ چند است؟",
            steps: [
              "ضرب یعنی جمع‌های تکراری: عدد ۷ را ۶ بار با هم جمع می‌کنیم.",
              "۷ + ۷ + ۷ + ۷ + ۷ + ۷ = ۴۲.",
              "یا از جدول ضرب استفاده می‌کنیم: ۷ × ۶ = ۴۲.",
            ],
            finalAnswer: "۴۲",
          },
        ],
      },
    ],
  },
  {
    id: "science4",
    title: "علوم چهارم",
    grade: "پایه چهارم",
    icon: "🔬",
    color: "#16a34a",
    chapters: [
      {
        id: "science4-ch1",
        title: "فصل ۱: مخلوط‌ها",
        exercises: [
          {
            id: "science4-ch1-e1",
            title: "تمرین ۱: جدا کردن مخلوط",
            problem:
              "برای جدا کردن براده آهن از ماسه از چه روشی استفاده می‌کنیم؟ چرا؟",
            steps: [
              "ابتدا ویژگی مواد را بررسی می‌کنیم: آهن جذب آهنربا می‌شود اما ماسه نمی‌شود.",
              "از این تفاوت استفاده می‌کنیم و یک آهنربا نزدیک مخلوط می‌بریم.",
              "آهنربا فقط براده آهن را جذب می‌کند و ماسه باقی می‌ماند.",
            ],
            finalAnswer: "استفاده از آهنربا (به دلیل خاصیت مغناطیسی آهن)",
          },
        ],
      },
    ],
  },
  {
    id: "math5",
    title: "ریاضی پنجم",
    grade: "پایه پنجم",
    icon: "📐",
    color: "#8b5cf6",
    chapters: [
      {
        id: "math5-ch1",
        title: "فصل ۱: کسرها",
        exercises: [
          {
            id: "math5-ch1-e1",
            title: "تمرین ۱: جمع کسرها",
            problem: "حاصل ۱/۴ + ۲/۴ را به دست آورید.",
            steps: [
              "چون مخرج‌ها برابر هستند (هر دو ۴)، فقط صورت‌ها را جمع می‌کنیم.",
              "صورت‌ها: ۱ + ۲ = ۳. مخرج بدون تغییر می‌ماند: ۴.",
              "پس نتیجه می‌شود ۳/۴.",
            ],
            finalAnswer: "۳/۴",
          },
        ],
      },
    ],
  },
];
