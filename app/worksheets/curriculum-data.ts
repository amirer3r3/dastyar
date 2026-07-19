export type WorksheetLeaf = {
  id: string;
  title: string;
  pdfUrl?: string | null;
};

export type WorksheetChapter = {
  id: string;
  title: string;
  /** اگر خالی باشد، خود فصل یک آیتم قابل کلیک است (لیست ردیفی) */
  children?: WorksheetLeaf[];
};

export type WorksheetSubject = {
  id: string;
  title: string;
  /**
   * accordion = فصل‌های بازشونده
   * flat = لیست ردیفی بدون آکاردئون (علوم، قرآن، ...)
   */
  layout: "accordion" | "flat";
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

function chapter(
  id: string,
  title: string,
  children: WorksheetLeaf[]
): WorksheetChapter {
  return { id, title, children };
}

function flatSubject(
  id: string,
  title: string,
  lessons: Array<{ id: string; title: string }>
): WorksheetSubject {
  return {
    id,
    title,
    layout: "flat",
    chapters: lessons.map((l) => ({ id: l.id, title: l.title })),
  };
}

function accordionSubject(
  id: string,
  title: string,
  chapters: WorksheetChapter[]
): WorksheetSubject {
  return { id, title, layout: "accordion", chapters };
}

function numberedPersian(n: number): string {
  const map = [
    "",
    "اول",
    "دوم",
    "سوم",
    "چهارم",
    "پنجم",
    "ششم",
    "هفتم",
    "هشتم",
    "نهم",
    "دهم",
    "یازدهم",
    "دوازدهم",
    "سیزدهم",
    "چهاردهم",
    "پانزدهم",
    "شانزدهم",
    "هفدهم",
    "هجدهم",
    "نوزدهم",
    "بیستم",
    "بیست‌ویکم",
    "بیست‌ودوم",
    "بیست‌وسوم",
    "بیست‌وچهارم",
    "بیست‌وپنجم",
  ];
  return map[n] ?? String(n);
}

/* ========== پایه اول ========== */

const g1Farsi = accordionSubject("farsi", "فارسی", [
  chapter(
    "g1-farsi-negareh",
    "نگاره‌ها",
    Array.from({ length: 10 }, (_, i) =>
      leaf(`g1-farsi-negareh-${i + 1}`, `نگاره‌ی ${i + 1}`)
    )
  ),
  chapter("g1-farsi-u1", "درس‌های اول تا پانزدهم", [
    ...Array.from({ length: 15 }, (_, i) =>
      leaf(`g1-farsi-l${i + 1}`, `درس ${numberedPersian(i + 1)}`)
    ),
    leaf("g1-farsi-review-1", "تمرین‌های دوره‌ای"),
  ]),
  chapter("g1-farsi-u2", "درس‌های شانزدهم تا بیست‌ودوم", [
    ...Array.from({ length: 7 }, (_, i) =>
      leaf(`g1-farsi-l${i + 16}`, `درس ${numberedPersian(i + 16)}`)
    ),
    leaf("g1-farsi-review-2", "تمرین‌های دوره‌ای"),
  ]),
]);

const g1Math = flatSubject(
  "math",
  "ریاضی",
  Array.from({ length: 25 }, (_, i) => ({
    id: `g1-math-l${i + 1}`,
    title: `درس ${numberedPersian(i + 1)}`,
  }))
);

const g1Science = flatSubject("science", "علوم", [
  { id: "g1-sci-1", title: "زنگ علوم" },
  { id: "g1-sci-2", title: "سلام، به من نگاه کن" },
  { id: "g1-sci-3", title: "سالم باش، شاداب باش" },
  { id: "g1-sci-4", title: "دنیای جانوران" },
  { id: "g1-sci-5", title: "دنیای گیاهان" },
  { id: "g1-sci-6", title: "زمینِ خانه‌ی پرآبِ ما" },
  { id: "g1-sci-7", title: "زمینِ خانه‌ی سنگیِ ما" },
  { id: "g1-sci-8", title: "چه می‌خواهم بسازم؟" },
  { id: "g1-sci-9", title: "زمینِ خانه‌ی خاکیِ ما" },
  { id: "g1-sci-10", title: "در اطراف ما هوا وجود دارد" },
  { id: "g1-sci-11", title: "دنیای سرد و گرم" },
  { id: "g1-sci-12", title: "از خانه تا مدرسه" },
  { id: "g1-sci-13", title: "آهن‌ربای من" },
  { id: "g1-sci-14", title: "از گذشته تا آینده" },
]);

const g1Quran = flatSubject("quran", "قرآن", [
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `g1-quran-l${i + 1}`,
    title: `درس ${numberedPersian(i + 1)}`,
  })),
  { id: "g1-quran-last", title: "درس آخر" },
]);

/* ========== پایه دوم ========== */

const g2Quran = flatSubject(
  "quran",
  "قرآن",
  Array.from({ length: 14 }, (_, i) => ({
    id: `g2-quran-l${i + 1}`,
    title: numberedPersian(i + 1),
  }))
);

const g2Math = accordionSubject("math", "ریاضی", [
  chapter("g2-math-1", "۱. عدد و رقم", [
    leaf("g2-math-1-1", "عدد و شمارش"),
    leaf("g2-math-1-2", "دسته‌های ده‌تایی و یکی"),
    leaf("g2-math-1-3", "جمع و تفریق"),
    leaf("g2-math-1-4", "شمارش چند تا چند تا"),
    leaf("g2-math-1-5", "ترکیبی کل فصل"),
  ]),
  chapter("g2-math-2", "۲. جمع و تفریق اعداد دو رقمی", [
    leaf("g2-math-2-1", "جمع و تفریق ده‌تایی"),
    leaf("g2-math-2-2", "جمع و تفریق"),
    leaf("g2-math-2-3", "جمع و تفریق دو عدد دو رقمی"),
    leaf("g2-math-2-4", "جمع و تفریق دو عدد (ادامه)"),
    leaf("g2-math-2-5", "ترکیبی کل فصل"),
  ]),
  chapter("g2-math-3", "۳. اشکال هندسی", [
    leaf("g2-math-3-1", "یادآوری شکل‌های هندسی"),
    leaf("g2-math-3-2", "روابط بین شکل‌ها"),
    leaf("g2-math-3-3", "تقارن"),
    leaf("g2-math-3-4", "تقارن (ادامه)"),
    leaf("g2-math-3-5", "ترکیبی کل فصل"),
  ]),
  chapter("g2-math-4", "۴. عددهای سه رقمی", [
    leaf("g2-math-4-1", "معرفی پول"),
    leaf("g2-math-4-2", "معرفی عددهای سه رقمی"),
    leaf("g2-math-4-3", "تقریب اعداد سه رقمی"),
    leaf("g2-math-4-4", "آمادگی برای جمع و تفریق"),
    leaf("g2-math-4-5", "ترکیبی کل فصل"),
  ]),
  chapter("g2-math-5", "۵. اندازه‌گیری", [
    leaf("g2-math-5-1", "اندازه‌گیری طول"),
    leaf("g2-math-5-2", "اندازه‌گیری دقیق‌تر"),
    leaf("g2-math-5-3", "واحد سانتی‌متر"),
    leaf("g2-math-5-4", "واحد میلی‌متر"),
    leaf("g2-math-5-5", "ترکیبی کل فصل"),
  ]),
  chapter("g2-math-6", "۶. جمع و تفریق اعداد سه رقمی", [
    leaf("g2-math-6-1", "مقایسه‌ی اعداد"),
    leaf("g2-math-6-2", "جمع و تفریق عددهای سه رقمی"),
    leaf("g2-math-6-3", "جمع در جدول ارزش مکانی"),
    leaf("g2-math-6-4", "تفریق در جدول ارزش مکانی"),
    leaf("g2-math-6-5", "ترکیبی کل فصل"),
  ]),
  chapter("g2-math-7", "۷. کسر و احتمال", [
    leaf("g2-math-7-1", "قسمتی از یک واحد"),
    leaf("g2-math-7-2", "آشنایی با کسر"),
    leaf("g2-math-7-3", "مفهوم احتمال"),
    leaf("g2-math-7-4", "احتمال و کسر"),
    leaf("g2-math-7-5", "ترکیبی کل فصل"),
  ]),
  chapter("g2-math-8", "۸. آمار و نمودار", [
    leaf("g2-math-8-1", "سرشماری"),
    leaf("g2-math-8-2", "نمودار ستونی"),
    leaf("g2-math-8-3", "نمودار تصویری"),
    leaf("g2-math-8-4", "انتخاب نمودار"),
    leaf("g2-math-8-5", "ترکیبی کل فصل"),
  ]),
]);

const g2Hedye = flatSubject("hedye", "هدیه‌ها", [
  { id: "g2-hedye-1", title: "درس اول: هدیه‌های خدا" },
  { id: "g2-hedye-2", title: "درس دوم: پرندگان چه می‌گویند؟" },
  { id: "g2-hedye-3", title: "درس سوم: خاطره‌ی ماه" },
  { id: "g2-hedye-4", title: "درس چهارم: مهربان‌تر از مادر" },
  { id: "g2-hedye-5", title: "درس پنجم: می‌خواهم وضو بگیرم" },
  { id: "g2-hedye-6", title: "درس ششم: پیامبران خدا" },
  { id: "g2-hedye-7", title: "درس هفتم: مهمان کوچک" },
  { id: "g2-hedye-8", title: "درس هشتم: جشن میلاد" },
  { id: "g2-hedye-9", title: "درس نهم: اهل بیت پیامبر" },
  { id: "g2-hedye-10", title: "درس دهم: خانواده‌ی بخشنده" },
  { id: "g2-hedye-11", title: "درس یازدهم: نماز بخوانیم" },
  { id: "g2-hedye-12", title: "درس دوازدهم: پدر مهربان" },
  { id: "g2-hedye-13", title: "درس سیزدهم: بهترین دوست" },
  { id: "g2-hedye-14", title: "درس چهاردهم: دعای باران" },
  { id: "g2-hedye-15", title: "درس پانزدهم: بچه‌ها سلام!" },
  { id: "g2-hedye-16", title: "درس شانزدهم: کیسه‌ی سنجاب کوچولو" },
  { id: "g2-hedye-17", title: "درس هفدهم: وقت نماز" },
  { id: "g2-hedye-18", title: "درس هجدهم: خاطره‌ی نانوشته" },
  { id: "g2-hedye-19", title: "درس نوزدهم: جشن بزرگ" },
  { id: "g2-hedye-20", title: "درس بیستم: در کنار سفره" },
]);

const g2Farsi = accordionSubject("farsi", "فارسی", [
  chapter("g2-farsi-1", "فصل اول", [
    leaf("g2-farsi-1-1", "ستایش"),
    leaf("g2-farsi-1-2", "درس اول: کتاب‌خانه‌ی کلاس ما"),
    leaf("g2-farsi-1-3", "یار مهربان (بخوان و حفظ کن)"),
    leaf("g2-farsi-1-4", "درس دوم: مسجد محله‌ی ما"),
    leaf("g2-farsi-1-5", "چغندر پربرکت (بخوان و بیندیش)"),
  ]),
  chapter("g2-farsi-2", "فصل دوم", [
    leaf("g2-farsi-2-1", "درس سوم: خرس کوچولو"),
    leaf("g2-farsi-2-2", "راه سلامتی (حکایت)"),
    leaf("g2-farsi-2-3", "ستاره (بخوان و حفظ کن)"),
    leaf("g2-farsi-2-4", "درس چهارم: مدرسه‌ی خرگوش‌ها"),
    leaf("g2-farsi-2-5", "تمیز باش و عزیز باش (بخوان و بیندیش)"),
  ]),
  chapter("g2-farsi-3", "فصل سوم", [
    leaf("g2-farsi-3-1", "درس پنجم: چوپان درست‌کار"),
    leaf("g2-farsi-3-2", "احوال‌پرسی (بخوان و حفظ کن)"),
    leaf("g2-farsi-3-3", "درس ششم: کوشا و نوشا"),
    leaf("g2-farsi-3-4", "خوش‌اخلاقی (حکایت)"),
    leaf("g2-farsi-3-5", "درس هفتم: دوستان ما"),
    leaf("g2-farsi-3-6", "مورچه اشک‌ریزان، چرا اشک‌ریزان؟ (بخوان و بیندیش)"),
  ]),
  chapter("g2-farsi-4", "فصل چهارم", [
    leaf("g2-farsi-4-1", "درس هشتم: از همه مهربان‌تر"),
    leaf("g2-farsi-4-2", "مثل یک رنگین‌کمان (بخوان و حفظ کن)"),
    leaf("g2-farsi-4-3", "همکاری (حکایت)"),
    leaf("g2-farsi-4-4", "درس نهم: زیارت"),
    leaf("g2-farsi-4-5", "کی بود؟ کی بود؟ (بخوان و بیندیش)"),
  ]),
  chapter("g2-farsi-5", "فصل پنجم", [
    leaf("g2-farsi-5-1", "درس دهم: هنرمند"),
    leaf("g2-farsi-5-2", "من هنرمندم (بخوان و حفظ کن)"),
    leaf("g2-farsi-5-3", "کودک زیرک (حکایت)"),
    leaf("g2-farsi-5-4", "درس یازدهم: درس آزاد"),
    leaf("g2-farsi-5-5", "درس دوازدهم: فردوسی"),
    leaf("g2-farsi-5-6", "یک کلاغ، چهل کلاغ (بخوان و بیندیش)"),
  ]),
  chapter("g2-farsi-6", "فصل ششم", [
    leaf("g2-farsi-6-1", "درس سیزدهم: ایران زیبا"),
    leaf("g2-farsi-6-2", "ای خانه‌ی ما (بخوان و حفظ کن)"),
    leaf("g2-farsi-6-3", "درس چهاردهم: پرچم"),
    leaf("g2-farsi-6-4", "با پرستوهای شاد (بخوان و حفظ کن)"),
    leaf("g2-farsi-6-5", "درس پانزدهم: نوروز"),
    leaf("g2-farsi-6-6", "عمونوروز (بخوان و بیندیش)"),
  ]),
  chapter("g2-farsi-7", "فصل هفتم", [
    leaf("g2-farsi-7-1", "درس شانزدهم: پرواز قطره"),
    leaf("g2-farsi-7-2", "شیر و موش (حکایت)"),
    leaf("g2-farsi-7-3", "درس هفدهم: مثل دانشمندان"),
    leaf("g2-farsi-7-4", "درخت‌کاری (بخوان و حفظ کن)"),
    leaf("g2-farsi-7-5", "بلبل و مورچه (نمایش)"),
    leaf("g2-farsi-7-6", "روباه و خروس (بخوان و بیندیش)"),
    leaf("g2-farsi-7-7", "نیایش"),
  ]),
]);

const g2Science = flatSubject("science", "علوم", [
  { id: "g2-sci-1", title: "درس اول: زنگ علوم (گردش در باغ)" },
  { id: "g2-sci-2", title: "درس دوم: هوای سالم، آب سالم" },
  { id: "g2-sci-3", title: "درس سوم: زندگی ما و گردش زمین" },
  { id: "g2-sci-4", title: "درس چهارم: زندگی ما و گردش زمین" },
  { id: "g2-sci-5", title: "درس پنجم: پیام رمز را پیدا کن" },
  { id: "g2-sci-6", title: "درس ششم: پیام رمز را پیدا کن" },
  { id: "g2-sci-7", title: "درس هفتم: اگر تمام شود..." },
  { id: "g2-sci-8", title: "درس هشتم: بسازیم و لذّت ببریم" },
  { id: "g2-sci-9", title: "درس نهم: سرگذشت دانه" },
  { id: "g2-sci-10", title: "درس دهم: درون آشیانه‌ها" },
  { id: "g2-sci-11", title: "درس یازدهم: من رشد می‌کنم" },
  { id: "g2-sci-12", title: "درس دوازدهم: برای جشن آماده شویم" },
  { id: "g2-sci-13", title: "درس سیزدهم: از گذشته تا آینده (نان)" },
  { id: "g2-sci-14", title: "درس چهاردهم: بعد از جشن" },
]);

/* ========== پایه سوم ========== */

const g3Hedye = flatSubject("hedye", "هدیه‌ها", [
  { id: "g3-hedye-1", title: "درس اول: آستین‌های خالی" },
  { id: "g3-hedye-2", title: "درس دوم: غروب یک روز بهاری" },
  { id: "g3-hedye-3", title: "درس سوم: همیشه با من" },
  { id: "g3-hedye-4", title: "درس چهارم: در کاخ نمرود" },
  { id: "g3-hedye-5", title: "درس پنجم: روز دهم" },
  { id: "g3-hedye-6", title: "درس ششم: بانوی قهرمان" },
  { id: "g3-hedye-7", title: "درس هفتم: بوی بهشت" },
  { id: "g3-hedye-8", title: "درس هشتم: جشن تکلیف" },
  { id: "g3-hedye-9", title: "درس نهم: گفت و گو با خدا" },
  { id: "g3-hedye-10", title: "درس دهم: ماه مهمانی خدا" },
  { id: "g3-hedye-11", title: "درس یازدهم: عید مسلمانان" },
  { id: "g3-hedye-12", title: "درس دوازدهم: سخن آسمانی" },
  { id: "g3-hedye-13", title: "درس سیزدهم: انتخاب پروانه" },
  { id: "g3-hedye-14", title: "درس چهاردهم: امّ‌ابیها" },
  { id: "g3-hedye-15", title: "درس پانزدهم: همسفر ناشناس" },
  { id: "g3-hedye-16", title: "درس شانزدهم: داناترین مردم" },
  { id: "g3-hedye-17", title: "درس هفدهم: خواب شیرین" },
  { id: "g3-hedye-18", title: "درس هجدهم: آینه‌ی سخنگو" },
  { id: "g3-hedye-19", title: "درس نوزدهم: گندم از گندم بروید" },
  { id: "g3-hedye-20", title: "درس بیستم: باغ همیشه بهار" },
]);

const g3Farsi = accordionSubject("farsi", "فارسی", [
  chapter("g3-farsi-1", "فصل اول", [
    leaf("g3-farsi-1-1", "ستایش"),
    leaf("g3-farsi-1-2", "درس اول: محله‌ی ما"),
    leaf("g3-farsi-1-3", "بخوان و حفظ کن: پدربزرگ"),
    leaf("g3-farsi-1-4", "درس دوم: زنگ ورزش"),
    leaf("g3-farsi-1-5", "بخوان و بیندیش: قصه‌ی تُنگِ بُلور"),
    leaf("g3-farsi-1-6", "مثل"),
  ]),
  chapter("g3-farsi-2", "فصل دوم", [
    leaf("g3-farsi-2-1", "درس سوم: آسمان آبی، طبیعتِ پاک"),
    leaf("g3-farsi-2-2", "بخوان و حفظ کن: هم‌بازی"),
    leaf("g3-farsi-2-3", "درس چهارم: آواز گنجشک"),
    leaf("g3-farsi-2-4", "بخوان و بیندیش: مورچه‌ریزه"),
    leaf("g3-farsi-2-5", "مثل"),
  ]),
  chapter("g3-farsi-3", "فصل سوم", [
    leaf("g3-farsi-3-1", "درس پنجم: بلدرچین و برزگر"),
    leaf("g3-farsi-3-2", "درس ششم: فداکاران"),
    leaf("g3-farsi-3-3", "بخوان و حفظ کن: مِثل باران"),
    leaf("g3-farsi-3-4", "درس هفتم: کارِ نیک"),
    leaf("g3-farsi-3-5", "بخوان و بیندیش: پَری کوچولو"),
    leaf("g3-farsi-3-6", "حکایت"),
  ]),
  chapter("g3-farsi-4", "فصل چهارم", [
    leaf("g3-farsi-4-1", "درس هشتم: پیراهنِ بهشتی"),
    leaf("g3-farsi-4-2", "بخوان و حفظ کن: لحظه‌ی سبز دعا"),
    leaf("g3-farsi-4-3", "درس نهم: بویِ نرگس"),
    leaf("g3-farsi-4-4", "بخوان و بیندیش: حوضِ فیروزه‌ای"),
    leaf("g3-farsi-4-5", "مثل"),
  ]),
  chapter("g3-farsi-5", "فصل پنجم", [
    leaf("g3-farsi-5-1", "درس دهم: یارِ مهربان"),
    leaf("g3-farsi-5-2", "بخوان و حفظ کن: نقّاشِ دنیا"),
    leaf("g3-farsi-5-3", "درس یازدهم: نویسنده‌ی بزرگ"),
    leaf("g3-farsi-5-4", "بخوان و بیندیش: خوابِ خلیفه"),
    leaf("g3-farsi-5-5", "حکایت"),
  ]),
  chapter("g3-farsi-6", "فصل ششم", [
    leaf("g3-farsi-6-1", "درس دوازدهم: ایرانِ عزیز"),
    leaf("g3-farsi-6-2", "درس سیزدهم: درسِ آزاد"),
    leaf("g3-farsi-6-3", "بخوان و حفظ کن: وطن"),
    leaf("g3-farsi-6-4", "درس چهاردهم: ایران آباد"),
    leaf("g3-farsi-6-5", "بخوان و بیندیش: بویِ سیب و یاس"),
    leaf("g3-farsi-6-6", "حکایت"),
  ]),
  chapter("g3-farsi-7", "فصل هفتم", [
    leaf("g3-farsi-7-1", "درس پانزدهم: دریا"),
    leaf("g3-farsi-7-2", "درس شانزدهم: اگر جنگل نباشد"),
    leaf("g3-farsi-7-3", "بخوان و حفظ کن: بهاران"),
    leaf("g3-farsi-7-4", "درس هفدهم: چشم‌های آسمان"),
    leaf("g3-farsi-7-5", "بخوان و بیندیش: آفرینشِ حلزون"),
    leaf("g3-farsi-7-6", "حکایت"),
    leaf("g3-farsi-7-7", "نیایش"),
  ]),
]);

const g3Math = accordionSubject("math", "ریاضی", [
  chapter("g3-math-1", "فصل ۱: الگوها", [
    leaf("g3-math-1-1", "حل مسئله: الگویابی"),
    leaf("g3-math-1-2", "شمارش چندتا چندتا"),
    leaf("g3-math-1-3", "ماشین‌های ورودی ـ خروجی"),
    leaf("g3-math-1-4", "ساعت در بعدازظهر"),
    leaf("g3-math-1-5", "الگوهای متقارن"),
  ]),
  chapter("g3-math-2", "فصل ۲: عددهای چهار رقمی", [
    leaf("g3-math-2-1", "حل مسئله: الگوسازی"),
    leaf("g3-math-2-2", "معرفی عدد هزار"),
    leaf("g3-math-2-3", "ارزش مکانی"),
    leaf("g3-math-2-4", "ارزش پول"),
    leaf("g3-math-2-5", "تقریب اعداد"),
  ]),
  chapter("g3-math-3", "فصل ۳: عددهای کسری", [
    leaf("g3-math-3-1", "حل مسئله: رسم شکل"),
    leaf("g3-math-3-2", "کسر"),
    leaf("g3-math-3-3", "کاربرد کسر در اندازه‌گیری"),
    leaf("g3-math-3-4", "تساوی کسرها"),
    leaf("g3-math-3-5", "مقایسه‌ی کسرها"),
  ]),
  chapter("g3-math-4", "فصل ۴: ضرب و تقسیم", [
    leaf("g3-math-4-1", "حل مسئله: روش‌های نمادین"),
    leaf("g3-math-4-2", "ضرب"),
    leaf("g3-math-4-3", "ضرب عددهای یک‌رقمی"),
    leaf("g3-math-4-4", "خاصیت‌های ضرب"),
    leaf("g3-math-4-5", "تقسیم"),
  ]),
  chapter("g3-math-5", "فصل ۵: محیط و مساحت", [
    leaf("g3-math-5-1", "حل مسئله: زیر مسئله"),
    leaf("g3-math-5-2", "خط، نیم‌خط و پاره‌خط"),
    leaf("g3-math-5-3", "محیط"),
    leaf("g3-math-5-4", "اندازه‌ی سطح"),
    leaf("g3-math-5-5", "واحد اندازه‌گیری سطح"),
  ]),
  chapter("g3-math-6", "فصل ۶: جمع و تفریق", [
    leaf("g3-math-6-1", "حل مسئله: حل مسئله‌ی ساده‌تر"),
    leaf("g3-math-6-2", "مقایسه‌ی عددها"),
    leaf("g3-math-6-3", "جمع و تفریق"),
    leaf("g3-math-6-4", "جمع در جدول ارزش مکانی"),
    leaf("g3-math-6-5", "تفریق در جدول ارزش مکانی"),
  ]),
  chapter("g3-math-7", "فصل ۷: آمار و احتمال", [
    leaf("g3-math-7-1", "حل مسئله: حدس و آزمایش"),
    leaf("g3-math-7-2", "جدول داده‌ها"),
    leaf("g3-math-7-3", "احتمال"),
    leaf("g3-math-7-4", "نمودار دایره‌ای"),
    leaf("g3-math-7-5", "انتخاب نمودار"),
  ]),
  chapter("g3-math-8", "فصل ۸: ضرب عددها", [
    leaf("g3-math-8-1", "حل مسئله: حذف حالت‌های نامطلوب"),
    leaf("g3-math-8-2", "ضرب در عدد ۱۰"),
    leaf("g3-math-8-3", "ضرب عددهای یک‌رقمی در چندرقمی"),
    leaf("g3-math-8-4", "محاسبه‌ی ضرب"),
    leaf("g3-math-8-5", "تقسیم با باقی‌مانده"),
  ]),
]);

const g3Science = flatSubject("science", "علوم", [
  { id: "g3-sci-1", title: "درس اول: زنگ علوم" },
  { id: "g3-sci-2", title: "درس دوم: خوراکی‌ها" },
  { id: "g3-sci-3", title: "درس سوم: اندازه‌گیری مواد" },
  { id: "g3-sci-4", title: "درس چهارم: مواد اطراف ما" },
  { id: "g3-sci-5", title: "درس پنجم: آب، ماده‌ی باارزش" },
  { id: "g3-sci-6", title: "درس ششم: زندگی ما و آب" },
  { id: "g3-sci-7", title: "درس هفتم: نور و مشاهده‌ی اجسام" },
  { id: "g3-sci-8", title: "درس هشتم: جست‌وجو کنیم و بسازیم" },
  { id: "g3-sci-9", title: "درس نهم: نیرو، همه‌جا (۱)" },
  { id: "g3-sci-10", title: "درس دهم: نیرو، همه‌جا (۲)" },
  { id: "g3-sci-11", title: "درس یازدهم: بکارید و ببینید" },
  { id: "g3-sci-12", title: "درس دوازدهم: هر کدام جای خود (۱)" },
  { id: "g3-sci-13", title: "درس سیزدهم: هر کدام جای خود (۲)" },
  { id: "g3-sci-14", title: "درس چهاردهم: از گذشته تا آینده" },
]);

const g3Social = accordionSubject("social", "مطالعات اجتماعی", [
  chapter("g3-soc-1", "فصل اول: من بزرگ‌تر می‌شوم", [
    leaf("g3-soc-1-1", "درس اول: من به دنیا آمدم"),
    leaf("g3-soc-1-2", "درس دوم: من بزرگ‌تر شده‌ام"),
    leaf("g3-soc-1-3", "درس سوم: آیا ما مثل هم هستیم؟"),
  ]),
  chapter("g3-soc-2", "فصل دوم: خانواده", [
    leaf("g3-soc-2-1", "درس چهارم: اعضای خانواده"),
    leaf("g3-soc-2-2", "درس پنجم: خانواده‌ام را دوست دارم"),
    leaf("g3-soc-2-3", "درس ششم: تغییر در خانواده"),
    leaf("g3-soc-2-4", "درس هفتم: از بزرگ‌ترها قدردانی کنیم"),
  ]),
  chapter("g3-soc-3", "فصل سوم: همکاری در خانواده", [
    leaf("g3-soc-3-1", "درس هشتم: چرا با هم همکاری می‌کنیم؟"),
    leaf("g3-soc-3-2", "درس نهم: مقررات خانه‌ی ما"),
  ]),
  chapter("g3-soc-4", "فصل چهارم: نیازهای خانواده", [
    leaf("g3-soc-4-1", "درس دهم: نیازهای خانواده چگونه تأمین می‌شود؟"),
    leaf("g3-soc-4-2", "درس یازدهم: منابع"),
    leaf("g3-soc-4-3", "درس دوازدهم: درست مصرف کنیم"),
    leaf("g3-soc-4-4", "درس سیزدهم: بازیافت"),
  ]),
  chapter("g3-soc-5", "فصل پنجم: خانه‌ی ما", [
    leaf("g3-soc-5-1", "درس چهاردهم: خانه‌ام را دوست دارم"),
    leaf("g3-soc-5-2", "درس پانزدهم: خانه‌ها با هم تفاوت دارند"),
    leaf("g3-soc-5-3", "درس شانزدهم: خانه‌ی شما چه شکلی است؟"),
    leaf("g3-soc-5-4", "درس هفدهم: از خانه محافظت کنیم"),
  ]),
  chapter("g3-soc-6", "فصل ششم: مدرسه‌ی ما", [
    leaf("g3-soc-6-1", "درس هجدهم: مدرسه‌ی دوست‌داشتنی ما"),
    leaf("g3-soc-6-2", "درس نوزدهم: مکان‌های مدرسه را بشناسیم"),
  ]),
  chapter("g3-soc-7", "فصل هفتم: از خانه تا مدرسه", [
    leaf("g3-soc-7-1", "درس بیستم: خانه‌ی شما کجاست؟"),
    leaf("g3-soc-7-2", "درس بیست‌ویکم: جهت‌های اصلی"),
    leaf("g3-soc-7-3", "درس بیست‌ودوم: پست"),
    leaf("g3-soc-7-4", "درس بیست‌وسوم: ایمنی در کوچه و خیابان"),
  ]),
]);

export const worksheetGrades: WorksheetGrade[] = [
  {
    id: "grade-1",
    title: "پایه اول",
    subjects: [g1Farsi, g1Math, g1Science, g1Quran],
  },
  {
    id: "grade-2",
    title: "پایه دوم",
    subjects: [g2Farsi, g2Math, g2Science, g2Quran, g2Hedye],
  },
  {
    id: "grade-3",
    title: "پایه سوم",
    subjects: [g3Farsi, g3Math, g3Science, g3Hedye, g3Social],
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

export function getAllWorksheetItemIds(): string[] {
  const ids: string[] = [];
  for (const grade of worksheetGrades) {
    for (const subject of grade.subjects) {
      for (const chapter of subject.chapters) {
        if (chapter.children?.length) {
          for (const child of chapter.children) ids.push(child.id);
        } else {
          ids.push(chapter.id);
        }
      }
    }
  }
  return ids;
}

export function getFlatLessons(subject: WorksheetSubject): WorksheetLeaf[] {
  if (subject.layout !== "flat") return [];
  const result: WorksheetLeaf[] = [];
  for (const ch of subject.chapters) {
    if (ch.children?.length) {
      result.push(...ch.children);
    } else {
      result.push({ id: ch.id, title: ch.title, pdfUrl: null });
    }
  }
  return result;
}
