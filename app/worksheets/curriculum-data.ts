export type WorksheetLeaf = {
  id: string;
  title: string;
  /** مسیر نسبی PDF؛ فعلاً می‌تواند خالی باشد */
  pdfUrl?: string | null;
};

export type WorksheetChapter = {
  id: string;
  title: string;
  /** اگر خالی باشد، خود فصل یک آیتم قابل کلیک است */
  children?: WorksheetLeaf[];
};

export type WorksheetSubject = {
  id: string;
  title: string;
  chapters: WorksheetChapter[];
};

export type WorksheetGrade = {
  id: string;
  title: string;
  subjects: WorksheetSubject[];
};

function leaf(id: string, title: string): WorksheetLeaf {
  return { id, title, pdfUrl: null };
}

function chapterWithChildren(
  id: string,
  title: string,
  children: WorksheetLeaf[]
): WorksheetChapter {
  return { id, title, children };
}

const farsiGrade1: WorksheetSubject = {
  id: "farsi",
  title: "فارسی",
  chapters: [
    chapterWithChildren(
      "farsi-negareh",
      "نگاره‌ها",
      Array.from({ length: 10 }, (_, i) =>
        leaf(`farsi-negareh-${i + 1}`, `نگاره‌ی ${i + 1}`)
      )
    ),
    chapterWithChildren("farsi-unit-1", "درس‌های اول تا پانزدهم", [
      leaf("farsi-lesson-1", "درس اول"),
      leaf("farsi-lesson-2", "درس دوم"),
      leaf("farsi-lesson-3", "درس سوم"),
      leaf("farsi-lesson-4", "درس چهارم"),
      leaf("farsi-lesson-5", "درس پنجم"),
      leaf("farsi-lesson-6", "درس ششم"),
      leaf("farsi-lesson-7", "درس هفتم"),
      leaf("farsi-lesson-8", "درس هشتم"),
      leaf("farsi-lesson-9", "درس نهم"),
      leaf("farsi-lesson-10", "درس دهم"),
      leaf("farsi-lesson-11", "درس یازدهم"),
      leaf("farsi-lesson-12", "درس دوازدهم"),
      leaf("farsi-lesson-13", "درس سیزدهم"),
      leaf("farsi-lesson-14", "درس چهاردهم"),
      leaf("farsi-lesson-15", "درس پانزدهم"),
      leaf("farsi-review-1", "تمرین‌های دوره‌ای"),
    ]),
    chapterWithChildren("farsi-unit-2", "درس‌های شانزدهم تا بیست‌ودوم", [
      leaf("farsi-lesson-16", "درس شانزدهم"),
      leaf("farsi-lesson-17", "درس هفدهم"),
      leaf("farsi-lesson-18", "درس هجدهم"),
      leaf("farsi-lesson-19", "درس نوزدهم"),
      leaf("farsi-lesson-20", "درس بیستم"),
      leaf("farsi-lesson-21", "درس بیست‌ویکم"),
      leaf("farsi-lesson-22", "درس بیست‌ودوم"),
      leaf("farsi-review-2", "تمرین‌های دوره‌ای"),
    ]),
  ],
};

const mathGrade1: WorksheetSubject = {
  id: "math",
  title: "ریاضی",
  chapters: [
    chapterWithChildren(
      "math-lessons",
      "درس‌ها",
      [
        "درس اول",
        "درس دوم",
        "درس سوم",
        "درس چهارم",
        "درس پنجم",
        "درس ششم",
        "درس هفتم",
        "درس هشتم",
        "درس نهم",
        "درس دهم",
        "درس یازدهم",
        "درس دوازدهم",
        "درس سیزدهم",
        "درس چهاردهم",
        "درس پانزدهم",
        "درس شانزدهم",
        "درس هفدهم",
        "درس هجدهم",
        "درس نوزدهم",
        "درس بیستم",
        "درس بیست و یکم",
        "درس بیست و دوم",
        "درس بیست و سوم",
        "درس بیست و چهارم",
        "درس بیست و پنجم",
      ].map((title, i) => leaf(`math-lesson-${i + 1}`, title))
    ),
  ],
};

const scienceGrade1: WorksheetSubject = {
  id: "science",
  title: "علوم",
  chapters: [
    chapterWithChildren("science-lessons", "درس‌ها", [
      leaf("science-1", "زنگ علوم"),
      leaf("science-2", "سلام، به من نگاه کن"),
      leaf("science-3", "سالم باش، شاداب باش"),
      leaf("science-4", "دنیای جانوران"),
      leaf("science-5", "دنیای گیاهان"),
      leaf("science-6", "زمینِ خانه‌ی پرآبِ ما"),
      leaf("science-7", "زمینِ خانه‌ی سنگیِ ما"),
      leaf("science-8", "چه می‌خواهم بسازم؟"),
      leaf("science-9", "زمینِ خانه‌ی خاکیِ ما"),
      leaf("science-10", "در اطراف ما هوا وجود دارد"),
      leaf("science-11", "دنیای سرد و گرم"),
      leaf("science-12", "از خانه تا مدرسه"),
      leaf("science-13", "آهن‌ربای من"),
      leaf("science-14", "از گذشته تا آینده"),
    ]),
  ],
};

const quranGrade1: WorksheetSubject = {
  id: "quran",
  title: "قرآن",
  chapters: [
    chapterWithChildren("quran-lessons", "درس‌ها", [
      leaf("quran-1", "درس اول"),
      leaf("quran-2", "درس دوم"),
      leaf("quran-3", "درس سوم"),
      leaf("quran-4", "درس چهارم"),
      leaf("quran-5", "درس پنجم"),
      leaf("quran-6", "درس ششم"),
      leaf("quran-7", "درس هفتم"),
      leaf("quran-8", "درس آخر"),
    ]),
  ],
};

export const worksheetGrades: WorksheetGrade[] = [
  {
    id: "grade-1",
    title: "پایه اول",
    subjects: [farsiGrade1, mathGrade1, scienceGrade1, quranGrade1],
  },
];

export type WorksheetItemMeta = {
  gradeId: string;
  gradeTitle: string;
  subjectId: string;
  subjectTitle: string;
  chapterId: string;
  chapterTitle: string;
  item: WorksheetLeaf;
};

export function findWorksheetItem(id: string): WorksheetItemMeta | null {
  for (const grade of worksheetGrades) {
    for (const subject of grade.subjects) {
      for (const chapter of subject.chapters) {
        if (chapter.children?.length) {
          const found = chapter.children.find((c) => c.id === id);
          if (found) {
            return {
              gradeId: grade.id,
              gradeTitle: grade.title,
              subjectId: subject.id,
              subjectTitle: subject.title,
              chapterId: chapter.id,
              chapterTitle: chapter.title,
              item: found,
            };
          }
        } else if (chapter.id === id) {
          return {
            gradeId: grade.id,
            gradeTitle: grade.title,
            subjectId: subject.id,
            subjectTitle: subject.title,
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            item: { id: chapter.id, title: chapter.title, pdfUrl: null },
          };
        }
      }
    }
  }
  return null;
}

export function getGrade(gradeId: string): WorksheetGrade | undefined {
  return worksheetGrades.find((g) => g.id === gradeId);
}

export function getSubject(
  gradeId: string,
  subjectId: string
): WorksheetSubject | undefined {
  return getGrade(gradeId)?.subjects.find((s) => s.id === subjectId);
}
