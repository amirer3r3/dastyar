export type QBLeaf = {
  id: string;
  title: string;
  pdfUrl?: string | null;
};

export type QBChapter = {
  id: string;
  title: string;
  children?: QBLeaf[];
};

export type QBSubject = {
  id: string;
  title: string;
  layout: "accordion" | "flat";
  chapters: QBChapter[];
};

export type QBGrade = {
  id: string;
  title: string;
  subjects: QBSubject[];
};

function flatSubject(
  id: string,
  title: string,
  lessons: Array<{ id: string; title: string }>
): QBSubject {
  return {
    id,
    title,
    layout: "flat",
    chapters: lessons.map((l) => ({ id: l.id, title: l.title })),
  };
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
    "بیست و یکم",
    "بیست و دوم",
    "بیست و سوم",
    "بیست و چهارم",
    "بیست و پنجم",
  ];
  return map[n] ?? String(n);
}

/* ========== پایه اول ========== */

const g1Farsi = flatSubject("farsi", "فارسی", [
  { id: "qb-g1-farsi-negareh", title: "نگاره‌ها" },
  { id: "qb-g1-farsi-1", title: "درس اول: آا ـ بـ ب" },
  { id: "qb-g1-farsi-2", title: "درس دوم: اَ ـَ ـ د" },
  { id: "qb-g1-farsi-3", title: "درس سوم: مـ م ـ سـ س" },
  { id: "qb-g1-farsi-4", title: "درس چهارم: او و ـ تـ ت" },
  { id: "qb-g1-farsi-5", title: "درس پنجم: ر ـ نـ ن" },
  { id: "qb-g1-farsi-6", title: "درس ششم: ایـ یـ ی ای ـ ز" },
  { id: "qb-g1-farsi-7", title: "درس هفتم: اِ ـِ ـه ه ـ شـ ش" },
  { id: "qb-g1-farsi-8", title: "درس هشتم: یـ ی ـ اُ ـُ" },
  { id: "qb-g1-farsi-9", title: "درس نهم: کـ ک ـ و" },
  { id: "qb-g1-farsi-10", title: "درس دهم: پـ پ ـ گـ گ" },
  { id: "qb-g1-farsi-11", title: "درس یازدهم: فـ ف ـ خـ خ" },
  { id: "qb-g1-farsi-12", title: "درس دوازدهم: قـ ق ـ لـ ل" },
  { id: "qb-g1-farsi-13", title: "درس سیزدهم: جـ ج ـ ـُ استثنا" },
  { id: "qb-g1-farsi-14", title: "درس چهاردهم: هـ ـهـ ـه ه ـ چـ چ" },
  { id: "qb-g1-farsi-15", title: "درس پانزدهم: ژ ـ خوا" },
  { id: "qb-g1-farsi-16", title: "درس شانزدهم: در بازار (تشدید ّ)" },
  {
    id: "qb-g1-farsi-17",
    title: "درس هفدهم: صدای موج (صـ ص) ـ سفر دل‌پذیر (ذ)",
  },
  {
    id: "qb-g1-farsi-18",
    title: "درس هجدهم: علی و معصومه (عـ ـعـ ـع ع) ـ مثل خورشید (ثـ ث)",
  },
  { id: "qb-g1-farsi-19", title: "درس نوزدهم: حَلزون (حـ ح)" },
  {
    id: "qb-g1-farsi-20",
    title: "درس بیستم: رضا (ضـ ض) ـ خاطرات انقلاب (ط)",
  },
  {
    id: "qb-g1-farsi-21",
    title: "درس بیست و یکم: لاک‌پشت و مرغابی‌ها (غـ ـغـ ـغ غ)",
  },
  { id: "qb-g1-farsi-22", title: "درس بیست و دوم: پیامبر مهربان (ظ)" },
]);

const g1Math = flatSubject(
  "math",
  "ریاضی",
  Array.from({ length: 25 }, (_, i) => ({
    id: `qb-g1-math-${i + 1}`,
    title: `درس ${numberedPersian(i + 1)}`,
  }))
);

const g1Science = flatSubject("science", "علوم", [
  { id: "qb-g1-sci-1", title: "زنگ علوم" },
  { id: "qb-g1-sci-2", title: "سلام، به من نگاه کن" },
  { id: "qb-g1-sci-3", title: "سالم باش، شاداب باش" },
  { id: "qb-g1-sci-4", title: "دنیای جانوران" },
  { id: "qb-g1-sci-5", title: "دنیای گیاهان" },
  { id: "qb-g1-sci-6", title: "زمینِ خانه‌ی پرآبِ ما" },
  { id: "qb-g1-sci-7", title: "زمینِ خانه‌ی سنگیِ ما" },
  { id: "qb-g1-sci-8", title: "چه می‌خواهم بسازم؟" },
  { id: "qb-g1-sci-9", title: "زمینِ خانه‌ی خاکیِ ما" },
  { id: "qb-g1-sci-10", title: "در اطراف ما هوا وجود دارد" },
  { id: "qb-g1-sci-11", title: "دنیای سرد و گرم" },
  { id: "qb-g1-sci-12", title: "از خانه تا مدرسه" },
  { id: "qb-g1-sci-13", title: "آهن‌ربای من" },
  { id: "qb-g1-sci-14", title: "از گذشته تا آینده" },
]);

const g1Quran = flatSubject("quran", "قرآن", [
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `qb-g1-quran-${i + 1}`,
    title: `درس ${numberedPersian(i + 1)}`,
  })),
  { id: "qb-g1-quran-last", title: "درس آخر" },
]);

/* ========== پایه دوم ========== */

const g2Quran = flatSubject(
  "quran",
  "قرآن",
  Array.from({ length: 14 }, (_, i) => ({
    id: `qb-g2-quran-${i + 1}`,
    title: numberedPersian(i + 1),
  }))
);

const g2Farsi = flatSubject("farsi", "فارسی", [
  { id: "qb-g2-farsi-1", title: "درس اول: کتاب‌خانه‌ی کلاس ما" },
  { id: "qb-g2-farsi-2", title: "درس دوم: مسجد محله‌ی ما" },
  { id: "qb-g2-farsi-3", title: "درس سوم: خرس کوچولو" },
  { id: "qb-g2-farsi-4", title: "درس چهارم: مدرسه‌ی خرگوش‌ها" },
  { id: "qb-g2-farsi-5", title: "درس پنجم: چوپان درست‌کار" },
  { id: "qb-g2-farsi-6", title: "درس ششم: کوشا و نوشا" },
  { id: "qb-g2-farsi-7", title: "درس هفتم: دوستان ما" },
  { id: "qb-g2-farsi-8", title: "درس هشتم: از همه مهربان‌تر" },
  { id: "qb-g2-farsi-9", title: "درس نهم: زیارت" },
  { id: "qb-g2-farsi-10", title: "درس دهم: هنرمند" },
  { id: "qb-g2-farsi-11", title: "درس یازدهم: درس آزاد" },
  { id: "qb-g2-farsi-12", title: "درس دوازدهم: فردوسی" },
  { id: "qb-g2-farsi-13", title: "درس سیزدهم: ایران زیبا" },
  { id: "qb-g2-farsi-14", title: "درس چهاردهم: پرچم" },
  { id: "qb-g2-farsi-15", title: "درس پانزدهم: نوروز" },
  { id: "qb-g2-farsi-16", title: "درس شانزدهم: پرواز قطره" },
  { id: "qb-g2-farsi-17", title: "درس هفدهم: مثل دانشمندان" },
]);

const g2Math = flatSubject("math", "ریاضی", [
  { id: "qb-g2-math-1", title: "۱. عدد و رقم" },
  { id: "qb-g2-math-2", title: "۲. جمع و تفریق اعداد دو رقمی" },
  { id: "qb-g2-math-3", title: "۳. اشکال هندسی" },
  { id: "qb-g2-math-4", title: "۴. عددهای سه رقمی" },
  { id: "qb-g2-math-5", title: "۵. اندازه‌گیری" },
  { id: "qb-g2-math-6", title: "۶. جمع و تفریق اعداد سه رقمی" },
  { id: "qb-g2-math-7", title: "۷. کسر و احتمال" },
  { id: "qb-g2-math-8", title: "۸. آمار و نمودار" },
]);

const g2Hedye = flatSubject("hedye", "هدیه‌ها", [
  { id: "qb-g2-hedye-1", title: "درس اول: هدیه‌های خدا" },
  { id: "qb-g2-hedye-2", title: "درس دوم: پرندگان چه می‌گویند؟" },
  { id: "qb-g2-hedye-3", title: "درس سوم: خاطره‌ی ماه" },
  { id: "qb-g2-hedye-4", title: "درس چهارم: مهربان‌تر از مادر" },
  { id: "qb-g2-hedye-5", title: "درس پنجم: می‌خواهم وضو بگیرم" },
  { id: "qb-g2-hedye-6", title: "درس ششم: پیامبران خدا" },
  { id: "qb-g2-hedye-7", title: "درس هفتم: مهمان کوچک" },
  { id: "qb-g2-hedye-8", title: "درس هشتم: جشن میلاد" },
  { id: "qb-g2-hedye-9", title: "درس نهم: اهل بیت پیامبر" },
  { id: "qb-g2-hedye-10", title: "درس دهم: خانواده‌ی بخشنده" },
]);

const g2Science = flatSubject("science", "علوم", [
  { id: "qb-g2-sci-1", title: "درس اول: زنگ علوم (گردش در باغ)" },
  { id: "qb-g2-sci-2", title: "درس دوم: هوای سالم، آب سالم" },
  { id: "qb-g2-sci-3", title: "درس سوم: زندگی ما و گردش زمین" },
  { id: "qb-g2-sci-4", title: "درس چهارم: زندگی ما و گردش زمین" },
  { id: "qb-g2-sci-5", title: "درس پنجم: پیام رمز را پیدا کن" },
  { id: "qb-g2-sci-6", title: "درس ششم: پیام رمز را پیدا کن" },
  { id: "qb-g2-sci-7", title: "درس هفتم: اگر تمام شود..." },
  { id: "qb-g2-sci-8", title: "درس هشتم: بسازیم و لذّت ببریم" },
  { id: "qb-g2-sci-9", title: "درس نهم: سرگذشت دانه" },
  { id: "qb-g2-sci-10", title: "درس دهم: درون آشیانه‌ها" },
  { id: "qb-g2-sci-11", title: "درس یازدهم: من رشد می‌کنم" },
  { id: "qb-g2-sci-12", title: "درس دوازدهم: برای جشن آماده شویم" },
  { id: "qb-g2-sci-13", title: "درس سیزدهم: از گذشته تا آینده (نان)" },
  { id: "qb-g2-sci-14", title: "درس چهاردهم: بعد از جشن" },
]);

/* ========== پایه سوم ========== */

const g3Quran = flatSubject("quran", "قرآن", [
  { id: "qb-g3-quran-1", title: "فصل اول: آموزش روخوانی قرآن کریم" },
  { id: "qb-g3-quran-2", title: "فصل دوم: آموزش نماز" },
  { id: "qb-g3-quran-3", title: "فصل سوم: انس با قرآن کریم" },
]);

const g3Hedye = flatSubject("hedye", "هدیه‌ها", [
  { id: "qb-g3-hedye-1", title: "درس اول: آستین‌های خالی" },
  { id: "qb-g3-hedye-2", title: "درس دوم: غروب یک روز بهاری" },
  { id: "qb-g3-hedye-3", title: "درس سوم: همیشه با من" },
  { id: "qb-g3-hedye-4", title: "درس چهارم: در کاخ نمرود" },
  { id: "qb-g3-hedye-5", title: "درس پنجم: روز دهم" },
  { id: "qb-g3-hedye-6", title: "درس ششم: بانوی قهرمان" },
  { id: "qb-g3-hedye-7", title: "درس هفتم: بوی بهشت" },
  { id: "qb-g3-hedye-8", title: "درس هشتم: جشن تکلیف" },
  { id: "qb-g3-hedye-9", title: "درس نهم: گفت و گو با خدا" },
  { id: "qb-g3-hedye-10", title: "درس دهم: ماه مهمانی خدا" },
  { id: "qb-g3-hedye-11", title: "درس یازدهم: عید مسلمانان" },
  { id: "qb-g3-hedye-12", title: "درس دوازدهم: سخن آسمانی" },
  { id: "qb-g3-hedye-13", title: "درس سیزدهم: انتخاب پروانه" },
  { id: "qb-g3-hedye-14", title: "درس چهاردهم: امّ‌ابیها" },
  { id: "qb-g3-hedye-15", title: "درس پانزدهم: همسفر ناشناس" },
  { id: "qb-g3-hedye-16", title: "درس شانزدهم: داناترین مردم" },
  { id: "qb-g3-hedye-17", title: "درس هفدهم: خواب شیرین" },
  { id: "qb-g3-hedye-18", title: "درس هجدهم: آینه‌ی سخنگو" },
  { id: "qb-g3-hedye-19", title: "درس نوزدهم: گندم از گندم بروید" },
  { id: "qb-g3-hedye-20", title: "درس بیستم: باغ همیشه بهار" },
]);

const g3Farsi = flatSubject("farsi", "فارسی", [
  { id: "qb-g3-farsi-1", title: "درس اول: محله‌ی ما" },
  { id: "qb-g3-farsi-2", title: "درس دوم: زنگ ورزش" },
  { id: "qb-g3-farsi-3", title: "درس سوم: آسمان آبی، طبیعتِ پاک" },
  { id: "qb-g3-farsi-4", title: "درس چهارم: آواز گنجشک" },
  { id: "qb-g3-farsi-5", title: "درس پنجم: بلدرچین و برزگر" },
  { id: "qb-g3-farsi-6", title: "درس ششم: فداکاران" },
  { id: "qb-g3-farsi-7", title: "درس هفتم: کارِ نیک" },
  { id: "qb-g3-farsi-8", title: "درس هشتم: پیراهنِ بهشتی" },
  { id: "qb-g3-farsi-9", title: "درس نهم: بویِ نرگس" },
  { id: "qb-g3-farsi-10", title: "درس دهم: یارِ مهربان" },
  { id: "qb-g3-farsi-11", title: "درس یازدهم: نویسنده‌ی بزرگ" },
  { id: "qb-g3-farsi-12", title: "درس دوازدهم: ایرانِ عزیز" },
  { id: "qb-g3-farsi-13", title: "درس سیزدهم: درسِ آزاد" },
  { id: "qb-g3-farsi-14", title: "درس چهاردهم: ایران آباد" },
  { id: "qb-g3-farsi-15", title: "درس پانزدهم: دریا" },
  { id: "qb-g3-farsi-16", title: "درس شانزدهم: اگر جنگل نباشد" },
  { id: "qb-g3-farsi-17", title: "درس هفدهم: چشم‌های آسمان" },
]);

const g3Math = flatSubject("math", "ریاضی", [
  { id: "qb-g3-math-1", title: "فصل ۱: الگوها" },
  { id: "qb-g3-math-2", title: "فصل ۲: عددهای چهار رقمی" },
  { id: "qb-g3-math-3", title: "فصل ۳: عددهای کسری" },
  { id: "qb-g3-math-4", title: "فصل ۴: ضرب و تقسیم" },
  { id: "qb-g3-math-5", title: "فصل ۵: محیط و مساحت" },
  { id: "qb-g3-math-6", title: "فصل ۶: جمع و تفریق" },
  { id: "qb-g3-math-7", title: "فصل ۷: آمار و احتمال" },
  { id: "qb-g3-math-8", title: "فصل ۸: ضرب عددها" },
]);

const g3Science = flatSubject("science", "علوم", [
  { id: "qb-g3-sci-1", title: "درس اول: زنگ علوم" },
  { id: "qb-g3-sci-2", title: "درس دوم: خوراکی‌ها" },
  { id: "qb-g3-sci-3", title: "درس سوم: اندازه‌گیری مواد" },
  { id: "qb-g3-sci-4", title: "درس چهارم: مواد اطراف ما" },
  { id: "qb-g3-sci-5", title: "درس پنجم: آب، ماده‌ی باارزش" },
  { id: "qb-g3-sci-6", title: "درس ششم: زندگی ما و آب" },
  { id: "qb-g3-sci-7", title: "درس هفتم: نور و مشاهده‌ی اجسام" },
  { id: "qb-g3-sci-8", title: "درس هشتم: جست‌وجو کنیم و بسازیم" },
  { id: "qb-g3-sci-9", title: "درس نهم: نیرو، همه‌جا (۱)" },
  { id: "qb-g3-sci-10", title: "درس دهم: نیرو، همه‌جا (۲)" },
  { id: "qb-g3-sci-11", title: "درس یازدهم: بکارید و ببینید" },
  { id: "qb-g3-sci-12", title: "درس دوازدهم: هر کدام جای خود (۱)" },
  { id: "qb-g3-sci-13", title: "درس سیزدهم: هر کدام جای خود (۲)" },
  { id: "qb-g3-sci-14", title: "درس چهاردهم: از گذشته تا آینده" },
]);

const g3Social = flatSubject("social", "مطالعات اجتماعی", [
  { id: "qb-g3-soc-1", title: "درس اول: من به دنیا آمدم" },
  { id: "qb-g3-soc-2", title: "درس دوم: من بزرگ‌تر شده‌ام" },
  { id: "qb-g3-soc-3", title: "درس سوم: آیا ما مثل هم هستیم؟" },
  { id: "qb-g3-soc-4", title: "درس چهارم: اعضای خانواده" },
  { id: "qb-g3-soc-5", title: "درس پنجم: خانواده‌ام را دوست دارم" },
  { id: "qb-g3-soc-6", title: "درس ششم: تغییر در خانواده" },
  { id: "qb-g3-soc-7", title: "درس هفتم: از بزرگ‌ترها قدردانی کنیم" },
  { id: "qb-g3-soc-8", title: "درس هشتم: چرا با هم همکاری می‌کنیم؟" },
  { id: "qb-g3-soc-9", title: "درس نهم: مقررات خانه‌ی ما" },
  {
    id: "qb-g3-soc-10",
    title: "درس دهم: نیازهای خانواده چگونه تأمین می‌شود؟",
  },
  { id: "qb-g3-soc-11", title: "درس یازدهم: منابع" },
  { id: "qb-g3-soc-12", title: "درس دوازدهم: درست مصرف کنیم" },
  { id: "qb-g3-soc-13", title: "درس سیزدهم: بازیافت" },
  { id: "qb-g3-soc-14", title: "درس چهاردهم: خانه‌ام را دوست دارم" },
  { id: "qb-g3-soc-15", title: "درس پانزدهم: خانه‌ها با هم تفاوت دارند" },
  { id: "qb-g3-soc-16", title: "درس شانزدهم: خانه‌ی شما چه شکلی است؟" },
  { id: "qb-g3-soc-17", title: "درس هفدهم: از خانه محافظت کنیم" },
  { id: "qb-g3-soc-18", title: "درس هجدهم: مدرسه‌ی دوست‌داشتنی ما" },
  { id: "qb-g3-soc-19", title: "درس نوزدهم: مکان‌های مدرسه را بشناسیم" },
  { id: "qb-g3-soc-20", title: "درس بیستم: خانه‌ی شما کجاست؟" },
  { id: "qb-g3-soc-21", title: "درس بیست‌ویکم: جهت‌های اصلی" },
  { id: "qb-g3-soc-22", title: "درس بیست‌ودوم: پست" },
  { id: "qb-g3-soc-23", title: "درس بیست‌وسوم: ایمنی در کوچه و خیابان" },
]);

/* ========== پایه چهارم ========== */

const g4Quran = flatSubject("quran", "قرآن", [
  ...Array.from({ length: 14 }, (_, i) => ({
    id: `qb-g4-quran-${i + 1}`,
    title: numberedPersian(i + 1),
  })),
  { id: "qb-g4-quran-last", title: "درس آخر" },
]);

const g4Hedye = flatSubject("hedye", "هدیه‌ها", [
  { id: "qb-g4-hedye-1", title: "درس اول: دانه‌ای که نمی‌خواست بروید!" },
  { id: "qb-g4-hedye-2", title: "درس دوم: کودکی بر آب" },
  { id: "qb-g4-hedye-3", title: "درس سوم: ما به مسجد می‌رویم" },
  { id: "qb-g4-hedye-4", title: "درس چهارم: یک نماز و ده رکوع!" },
  { id: "qb-g4-hedye-5", title: "درس پنجم: سخنی که سه بار تکرار شد!" },
  { id: "qb-g4-hedye-6", title: "درس ششم: حرمی با دو گنبد" },
  { id: "qb-g4-hedye-7", title: "درس هفتم: نماز در کوهستان" },
  { id: "qb-g4-hedye-8", title: "درس هشتم: دیدار دوست" },
  { id: "qb-g4-hedye-9", title: "درس نهم: کودک شجاع" },
  { id: "qb-g4-hedye-10", title: "درس دهم: روشن‌ترین شب" },
  { id: "qb-g4-hedye-11", title: "درس یازدهم: …" },
  { id: "qb-g4-hedye-12", title: "درس دوازدهم: روزی برای تمام بچه‌ها" },
  { id: "qb-g4-hedye-13", title: "درس سیزدهم: خاله نرگس" },
  { id: "qb-g4-hedye-14", title: "درس چهاردهم: اولین بانوی مسلمان" },
  { id: "qb-g4-hedye-15", title: "درس پانزدهم: یک ماجرای زیبا" },
  { id: "qb-g4-hedye-16", title: "درس شانزدهم: اسب طلایی" },
  { id: "qb-g4-hedye-17", title: "درس هفدهم: آقای بهاری، خانم بهاری" },
  { id: "qb-g4-hedye-18", title: "درس هجدهم: چشمان همیشه باز" },
  { id: "qb-g4-hedye-19", title: "درس نوزدهم: خداجون از تو ممنونم" },
]);

const g4Farsi = flatSubject("farsi", "فارسی", [
  { id: "qb-g4-farsi-1", title: "درس اول: آفریدگار زیبایی" },
  { id: "qb-g4-farsi-2", title: "درس دوم: کوچ پرستوها" },
  { id: "qb-g4-farsi-3", title: "درس سوم: راز نشانه‌ها" },
  { id: "qb-g4-farsi-4", title: "درس چهارم: ارزش علم" },
  { id: "qb-g4-farsi-5", title: "درس پنجم: رهایی از قفس" },
  { id: "qb-g4-farsi-6", title: "درس ششم: آرش کمان‌گیر" },
  { id: "qb-g4-farsi-7", title: "درس هفتم: مهمان شهر ما" },
  { id: "qb-g4-farsi-8", title: "درس هشتم: درس آزاد" },
  { id: "qb-g4-farsi-9", title: "درس نهم: درس آزاد" },
  { id: "qb-g4-farsi-10", title: "درس دهم: باغچه‌ی اطفال" },
  { id: "qb-g4-farsi-11", title: "درس یازدهم: فرمانده‌ی دل‌ها" },
  { id: "qb-g4-farsi-12", title: "درس دوازدهم: اتفاق ساده" },
  { id: "qb-g4-farsi-13", title: "درس سیزدهم: لطفِ حق" },
  { id: "qb-g4-farsi-14", title: "درس چهاردهم: ادب از که آموختی؟" },
  { id: "qb-g4-farsi-15", title: "درس پانزدهم: شیر و موش" },
  { id: "qb-g4-farsi-16", title: "درس شانزدهم: پرسشگری" },
  { id: "qb-g4-farsi-17", title: "درس هفدهم: مدرسه‌ی هوشمند" },
]);

const g4Math = flatSubject("math", "ریاضی", [
  { id: "qb-g4-math-1", title: "فصل ۱: اعداد و الگوها" },
  { id: "qb-g4-math-2", title: "فصل ۲: کسر" },
  { id: "qb-g4-math-3", title: "فصل ۳: ضرب و تقسیم" },
  { id: "qb-g4-math-4", title: "فصل ۴: اندازه‌گیری" },
  { id: "qb-g4-math-5", title: "فصل ۵: عدد مخلوط و عدد اعشاری" },
  { id: "qb-g4-math-6", title: "فصل ۶: شکل‌های هندسی" },
  { id: "qb-g4-math-7", title: "فصل ۷: آمار و احتمال" },
]);

const g4Science = flatSubject("science", "علوم", [
  { id: "qb-g4-sci-1", title: "زنگ علوم" },
  { id: "qb-g4-sci-2", title: "سلام، به من نگاه کن" },
  { id: "qb-g4-sci-3", title: "سالم باش، شاداب باش" },
  { id: "qb-g4-sci-4", title: "دنیای جانوران" },
  { id: "qb-g4-sci-5", title: "دنیای گیاهان" },
  { id: "qb-g4-sci-6", title: "زمین، خانه‌ی پر آب ما" },
  { id: "qb-g4-sci-7", title: "زمین، خانه‌ی سنگی ما" },
  { id: "qb-g4-sci-8", title: "چه می‌خواهم بسازم؟" },
  { id: "qb-g4-sci-9", title: "زمین، خانه‌ی خاکی ما" },
  { id: "qb-g4-sci-10", title: "در اطراف ما هوا وجود دارد" },
  { id: "qb-g4-sci-11", title: "دنیای سرد و گرم" },
  { id: "qb-g4-sci-12", title: "از خانه تا مدرسه" },
  { id: "qb-g4-sci-13", title: "آهن‌ربای من" },
  { id: "qb-g4-sci-14", title: "از گذشته تا آینده" },
]);

/* ========== پایه پنجم ========== */

const g5Quran = flatSubject("quran", "قرآن", [
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `qb-g5-quran-${i + 1}`,
    title: numberedPersian(i + 1),
  })),
  { id: "qb-g5-quran-last", title: "درس آخر" },
]);

const g5Hedye = flatSubject("hedye", "هدیه‌ها", [
  { id: "qb-g5-hedye-1", title: "دسته گلی از آسمان" },
  { id: "qb-g5-hedye-2", title: "تنها او" },
  { id: "qb-g5-hedye-3", title: "از نوزاد بپرسید" },
  { id: "qb-g5-hedye-4", title: "گل صد برگ" },
  { id: "qb-g5-hedye-5", title: "مال مردم" },
  { id: "qb-g5-hedye-6", title: "رنگین کمان جمعه" },
  { id: "qb-g5-hedye-7", title: "دو نامه" },
  { id: "qb-g5-hedye-8", title: "یک جهان جشن" },
  { id: "qb-g5-hedye-9", title: "در ساحل دجله" },
  { id: "qb-g5-hedye-10", title: "سرو سربلند سامرا" },
  { id: "qb-g5-hedye-11", title: "خورشید پشت ابر" },
  { id: "qb-g5-hedye-12", title: "کوچک‌های بزرگ" },
  { id: "qb-g5-hedye-13", title: "بزرگ مرد تاریخ" },
  { id: "qb-g5-hedye-14", title: "بهمن همیشه بهار" },
  { id: "qb-g5-hedye-15", title: "روزنامه‌های دیواری" },
  { id: "qb-g5-hedye-16", title: "اینها و آنها" },
]);

const g5Farsi = flatSubject("farsi", "فارسی", [
  { id: "qb-g5-farsi-1", title: "درس اول: تماشاخانه" },
  { id: "qb-g5-farsi-2", title: "درس دوم: فضل خدا" },
  { id: "qb-g5-farsi-3", title: "درس سوم: رازی و ساخت بیمارستان" },
  { id: "qb-g5-farsi-4", title: "درس چهارم: بازرگان و پسران" },
  { id: "qb-g5-farsi-5", title: "درس پنجم: چنار و کدوبُن" },
  { id: "qb-g5-farsi-6", title: "درس ششم: سرود ملی" },
  { id: "qb-g5-farsi-7", title: "درس هفتم: درس آزاد (فرهنگ بومی ۱)" },
  { id: "qb-g5-farsi-8", title: "درس هشتم: دفاع از میهن" },
  { id: "qb-g5-farsi-9", title: "درس نهم: نام‌آوران دیروز، امروز، فردا" },
  { id: "qb-g5-farsi-10", title: "درس دهم: نامِ نیکو" },
  { id: "qb-g5-farsi-11", title: "درس یازدهم: نقش خردمندان" },
  { id: "qb-g5-farsi-12", title: "درس دوازدهم: درس آزاد (فرهنگ بومی ۲)" },
  { id: "qb-g5-farsi-13", title: "درس سیزدهم: روزی که باران می‌بارید" },
  { id: "qb-g5-farsi-14", title: "درس چهاردهم: شجاعت" },
  { id: "qb-g5-farsi-15", title: "درس پانزدهم: کاجستان" },
  { id: "qb-g5-farsi-16", title: "درس شانزدهم: وقتی بوعلی کودک بود" },
  { id: "qb-g5-farsi-17", title: "درس هفدهم: کار و تلاش" },
]);

const g5Math = flatSubject("math", "ریاضی", [
  { id: "qb-g5-math-1", title: "فصل ۱: عددنویسی و الگوها" },
  { id: "qb-g5-math-2", title: "فصل ۲: کسر" },
  { id: "qb-g5-math-3", title: "فصل ۳: نسبت، تناسب و درصد" },
  { id: "qb-g5-math-4", title: "فصل ۴: تقارن و چندضلعی‌ها" },
  { id: "qb-g5-math-5", title: "فصل ۵: عددهای اعشاری" },
  { id: "qb-g5-math-6", title: "فصل ۶: اندازه‌گیری" },
  { id: "qb-g5-math-7", title: "فصل ۷: آمار و احتمال" },
]);

const g5Science = flatSubject("science", "علوم", [
  { id: "qb-g5-sci-1", title: "زنگ علوم" },
  { id: "qb-g5-sci-2", title: "ماده تغییر می‌کند" },
  { id: "qb-g5-sci-3", title: "رنگین‌کمان" },
  { id: "qb-g5-sci-4", title: "برگی از تاریخ زمین" },
  { id: "qb-g5-sci-5", title: "حرکت بدن" },
  { id: "qb-g5-sci-6", title: "چه خبر؟ (۱)" },
  { id: "qb-g5-sci-7", title: "چه خبر؟ (۲)" },
  { id: "qb-g5-sci-8", title: "کارها آسان می‌شود (۱)" },
  { id: "qb-g5-sci-9", title: "کارها آسان می‌شود (۲)" },
  { id: "qb-g5-sci-10", title: "خاک باارزش" },
  { id: "qb-g5-sci-11", title: "بکارید و بخورید" },
  { id: "qb-g5-sci-12", title: "از ریشه تا برگ" },
]);

const g5Social = flatSubject("social", "مطالعات اجتماعی", [
  { id: "qb-g5-soc-1", title: "درس ۱- من با دیگران ارتباط برقرار می‌کنم" },
  { id: "qb-g5-soc-2", title: "درس ۲- احساسات ما" },
  { id: "qb-g5-soc-3", title: "درس ۳- همدلی با دیگران" },
  { id: "qb-g5-soc-4", title: "درس ۴- من عضو گروه هستم" },
  { id: "qb-g5-soc-5", title: "درس ۵- جمعیت ایران" },
  { id: "qb-g5-soc-6", title: "درس ۶- منابع آب ایران" },
  { id: "qb-g5-soc-7", title: "درس ۷- نواحی صنعتی مهمّ ایران" },
  { id: "qb-g5-soc-8", title: "درس ۸- راه‌ها و حمل و نقل (۱)" },
  { id: "qb-g5-soc-9", title: "درس ۹- راه‌ها و حمل و نقل (۲)" },
  { id: "qb-g5-soc-10", title: "درس ۱۰- کشور ما چگونه اداره می‌شود؟" },
  {
    id: "qb-g5-soc-11",
    title: "درس ۱۱- کشورهای همسایه (۱) / کشورهای همسایه (۲)",
  },
  { id: "qb-g5-soc-12", title: "درس ۱۲- حرکت‌های زمین" },
  { id: "qb-g5-soc-13", title: "درس ۱۳- زندگی در نواحی مختلف جهان" },
  { id: "qb-g5-soc-14", title: "درس ۱۴- بازگشت از سفر حج" },
  { id: "qb-g5-soc-15", title: "درس ۱۵- مدینه، شهر پیامبر(ص)" },
  { id: "qb-g5-soc-16", title: "درس ۱۶- سفر به کربلا (۱)" },
  { id: "qb-g5-soc-17", title: "درس ۱۷- سفر به کربلا (۲)" },
  {
    id: "qb-g5-soc-18",
    title: "درس ۱۸- ایرانیان مسلمان حکومت تشکیل می‌دهند",
  },
  { id: "qb-g5-soc-19", title: "درس ۱۹- وزیران کاردان، شهرهای آباد" },
  { id: "qb-g5-soc-20", title: "درس ۲۰- کشورگشایان بی‌رحم" },
  { id: "qb-g5-soc-21", title: "درس ۲۱- بازسازی ویرانه‌ها" },
]);

/* ========== پایه ششم ========== */

const g6Quran = flatSubject("quran", "قرآن", [
  ...Array.from({ length: 14 }, (_, i) => ({
    id: `qb-g6-quran-${i + 1}`,
    title: numberedPersian(i + 1),
  })),
  { id: "qb-g6-quran-last", title: "درس آخر" },
]);

const g6Hedye = flatSubject("hedye", "هدیه‌ها", [
  { id: "qb-g6-hedye-1", title: "درس اول: یکتا" },
  { id: "qb-g6-hedye-2", title: "درس دوم: بهترین راهنمایان" },
  { id: "qb-g6-hedye-3", title: "درس سوم: سرور آزادگان" },
  { id: "qb-g6-hedye-4", title: "درس چهارم: باغ سری" },
  { id: "qb-g6-hedye-5", title: "درس پنجم: شتربان با ایمان" },
  { id: "qb-g6-hedye-6", title: "درس ششم: مثل فرات و کارون" },
  { id: "qb-g6-hedye-7", title: "درس هفتم: سیمای خوبان" },
  { id: "qb-g6-hedye-8", title: "درس هشتم: دست در دست دوست" },
  { id: "qb-g6-hedye-9", title: "درس نهم: دوران غیبت" },
  { id: "qb-g6-hedye-10", title: "درس دهم: جهان دیگر" },
  { id: "qb-g6-hedye-11", title: "درس یازدهم: آداب زندگی" },
  { id: "qb-g6-hedye-12", title: "درس دوازدهم: دانش‌آموز نمونه" },
  { id: "qb-g6-hedye-13", title: "درس سیزدهم: سفرهای با برکت" },
  { id: "qb-g6-hedye-14", title: "درس چهاردهم: عید مسلمانان" },
  { id: "qb-g6-hedye-15", title: "درس پانزدهم: راز موفقیت" },
  { id: "qb-g6-hedye-16", title: "درس شانزدهم: حماسه‌آفرینان جاودان" },
  { id: "qb-g6-hedye-17", title: "درس هفدهم: زیارت" },
]);

const g6Science = flatSubject("science", "علوم", [
  { id: "qb-g6-sci-1", title: "زنگ علوم" },
  { id: "qb-g6-sci-2", title: "سرگذشت دفتر من" },
  { id: "qb-g6-sci-3", title: "کارخانه‌ی کاغذسازی" },
  { id: "qb-g6-sci-4", title: "سفر به اعماق زمین" },
  { id: "qb-g6-sci-5", title: "زمین پویا" },
  { id: "qb-g6-sci-6", title: "ورزش و نیرو (۱)" },
  { id: "qb-g6-sci-7", title: "ورزش و نیرو (۲)" },
  { id: "qb-g6-sci-8", title: "طراحی کنیم و بسازیم" },
  { id: "qb-g6-sci-9", title: "سفر انرژی" },
  { id: "qb-g6-sci-10", title: "خیلی کوچک، خیلی بزرگ" },
  { id: "qb-g6-sci-11", title: "شگفتی‌های برگ" },
  { id: "qb-g6-sci-12", title: "جنگل برای کیست؟" },
  { id: "qb-g6-sci-13", title: "سالم بمانیم" },
  { id: "qb-g6-sci-14", title: "از گذشته تا آینده" },
]);

const g6Tech = flatSubject("tech", "کار و فناوری", [
  { id: "qb-g6-tech-1", title: "مهارت ۱: مهارت گره‌زنی" },
  { id: "qb-g6-tech-2", title: "مهارت ۲: مهارت دوخت" },
  { id: "qb-g6-tech-3", title: "مهارت ۳: آشنایی با مهارت گل‌سازی" },
  { id: "qb-g6-tech-4", title: "مهارت ۴: مهارت پرورش حشرات مفید" },
  { id: "qb-g6-tech-5", title: "مهارت ۵: مهارت سبزی‌کاری" },
  { id: "qb-g6-tech-6", title: "مهارت ۶: مهارت تهیه‌ی خوراک و نوشیدنی" },
  {
    id: "qb-g6-tech-7",
    title: "مهارت ۷: آشنایی با صنایع شیمیایی و مهارت ساخت شمع",
  },
  { id: "qb-g6-tech-8", title: "مهارت ۸: مهارت ساخت ربات" },
  { id: "qb-g6-tech-9", title: "مهارت ۹: مهارت کار با مفتول" },
  { id: "qb-g6-tech-10", title: "مهارت ۱۰: مهارت کار با چرم" },
  { id: "qb-g6-tech-11", title: "مهارت ۱۱: مهارت ماکت‌سازی" },
  { id: "qb-g6-tech-12", title: "مهارت ۱۲: مهارت کار با اپ‌اینونتور" },
  { id: "qb-g6-tech-13", title: "مهارت ۱۳: مهارت بومی ـ محلی" },
]);

const g6Farsi = flatSubject("farsi", "فارسی", [
  { id: "qb-g6-farsi-1", title: "درس اول: معرفت آفریدگار" },
  { id: "qb-g6-farsi-2", title: "درس دوم: پنجره‌های شناخت" },
  { id: "qb-g6-farsi-3", title: "درس سوم: هوشیاری" },
  { id: "qb-g6-farsi-4", title: "درس چهارم: داستان من و شما" },
  { id: "qb-g6-farsi-5", title: "درس پنجم: هفت خان رستم" },
  { id: "qb-g6-farsi-6", title: "درس ششم: ای وطن" },
  { id: "qb-g6-farsi-7", title: "درس هفتم: درس آزاد (فرهنگ بومی ۱)" },
  { id: "qb-g6-farsi-8", title: "درس هشتم: دریاقلی" },
  { id: "qb-g6-farsi-9", title: "درس نهم: رنج‌هایی کشیده‌ام که مپرس" },
  { id: "qb-g6-farsi-10", title: "درس دهم: عطّار و جلال‌الدین محمد" },
  { id: "qb-g6-farsi-11", title: "درس یازدهم: شهدا خورشیدند" },
  { id: "qb-g6-farsi-12", title: "درس دوازدهم: دوستی / مشاوره" },
  { id: "qb-g6-farsi-13", title: "درس سیزدهم: درس آزاد (فرهنگ بومی ۲)" },
  { id: "qb-g6-farsi-14", title: "درس چهاردهم: راز زندگی" },
  { id: "qb-g6-farsi-15", title: "درس پانزدهم: میوه‌ی هنر" },
  { id: "qb-g6-farsi-16", title: "درس شانزدهم: آداب مطالعه" },
  { id: "qb-g6-farsi-17", title: "درس هفدهم: ستاره‌ی روشن" },
]);

const g6Math = flatSubject("math", "ریاضی", [
  { id: "qb-g6-math-1", title: "فصل ۱: عدد و الگوهای عددی" },
  { id: "qb-g6-math-2", title: "فصل ۲: کسر" },
  { id: "qb-g6-math-3", title: "فصل ۳: اعداد اعشاری" },
  { id: "qb-g6-math-4", title: "فصل ۴: تقارن و مختصات" },
  { id: "qb-g6-math-5", title: "فصل ۵: اندازه‌گیری" },
  { id: "qb-g6-math-6", title: "فصل ۶: تناسب و درصد" },
  { id: "qb-g6-math-7", title: "فصل ۷: تقریب" },
]);

const g6Social = flatSubject("social", "علوم اجتماعی", [
  { id: "qb-g6-soc-1", title: "دوستی" },
  { id: "qb-g6-soc-2", title: "آداب دوستی" },
  { id: "qb-g6-soc-3", title: "تصمیم‌گیری چیست؟" },
  { id: "qb-g6-soc-4", title: "چگونه تصمیم بگیریم؟" },
  { id: "qb-g6-soc-5", title: "عوامل مؤثر در کشاورزی" },
  { id: "qb-g6-soc-6", title: "محصولات کشاورزی، از تولید تا مصرف" },
  { id: "qb-g6-soc-7", title: "طلای سیاه" },
  { id: "qb-g6-soc-8", title: "انرژی را بهتر مصرف کنیم" },
  { id: "qb-g6-soc-9", title: "پیشرفت‌های علمی مسلمانان" },
  {
    id: "qb-g6-soc-10",
    title: "چه عواملی موجب گسترش علم و فنون در دوره‌ی اسلامی شد؟",
  },
  { id: "qb-g6-soc-11", title: "اصفهان، نصف جهان" },
  {
    id: "qb-g6-soc-12",
    title: "چرا فرهنگ و هنر در دوره‌ی صفویه شکوفا شد؟",
  },
  { id: "qb-g6-soc-13", title: "برنامه‌ی روزانه‌ی متعادل" },
  { id: "qb-g6-soc-14", title: "برنامه‌ریزی برای اوقات فراغت" },
  { id: "qb-g6-soc-15", title: "انواع لباس" },
  { id: "qb-g6-soc-16", title: "لباس از تولید تا مصرف" },
]);

const g6Think = flatSubject("think", "تفکر و پژوهش", [
  { id: "qb-g6-think-1", title: "دیدنی‌های سرزمین من" },
  { id: "qb-g6-think-2", title: "مارگیر و اژدها" },
  { id: "qb-g6-think-3", title: "بوی خوش مدینه" },
  { id: "qb-g6-think-4", title: "آکند" },
  { id: "qb-g6-think-5", title: "ماه بود و روباه!" },
  { id: "qb-g6-think-6", title: "نارنجی‌پوش امانت‌دار (انتخابی)" },
  { id: "qb-g6-think-7", title: "روش گردآوری اطلاعات" },
  { id: "qb-g6-think-8", title: "طرح پرسش پژوهشی" },
  { id: "qb-g6-think-9", title: "مردم‌پسندها" },
  { id: "qb-g6-think-10", title: "زیر ذره‌بین (انتخابی)" },
  { id: "qb-g6-think-11", title: "از کجا بدانم؟ (انتخابی)" },
  { id: "qb-g6-think-12", title: "ارائه‌ی یافته‌های پژوهشی" },
  { id: "qb-g6-think-13", title: "لی‌لی حوضک" },
  { id: "qb-g6-think-14", title: "آخر خط" },
  { id: "qb-g6-think-15", title: "ما کجا هستیم؟" },
  { id: "qb-g6-think-16", title: "یک اتفاق عجیب (انتخابی)" },
  { id: "qb-g6-think-17", title: "پیوستگی (انتخابی)" },
  { id: "qb-g6-think-18", title: "پلنگ‌ها و گوزن‌ها (انتخابی)" },
  { id: "qb-g6-think-19", title: "تپه‌ی کوچک" },
  { id: "qb-g6-think-20", title: "میمون‌های گران‌بها" },
  { id: "qb-g6-think-21", title: "شکلی دیگر" },
  {
    id: "qb-g6-think-22",
    title: "خرسی که می‌خواست خرس باقی بماند (انتخابی)",
  },
  { id: "qb-g6-think-23", title: "پرواز کن! پرواز! (انتخابی)" },
  {
    id: "qb-g6-think-24",
    title: "من عاقبت از این پل خواهم گذشت (انتخابی)",
  },
  { id: "qb-g6-think-25", title: "کیمیاگر (انتخابی)" },
]);

export const questionBankGrades: QBGrade[] = [
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
    subjects: [g3Farsi, g3Math, g3Science, g3Quran, g3Hedye, g3Social],
  },
  {
    id: "grade-4",
    title: "پایه چهارم",
    subjects: [g4Farsi, g4Math, g4Science, g4Quran, g4Hedye],
  },
  {
    id: "grade-5",
    title: "پایه پنجم",
    subjects: [g5Farsi, g5Math, g5Science, g5Quran, g5Hedye, g5Social],
  },
  {
    id: "grade-6",
    title: "پایه ششم",
    subjects: [
      g6Farsi,
      g6Math,
      g6Science,
      g6Quran,
      g6Hedye,
      g6Social,
      g6Tech,
      g6Think,
    ],
  },
];

export type QBItemMeta = {
  gradeId: string;
  gradeTitle: string;
  subjectId: string;
  subjectTitle: string;
  chapterId: string;
  chapterTitle: string;
  item: QBLeaf;
};

export function getQBGrade(gradeId: string): QBGrade | undefined {
  return questionBankGrades.find((g) => g.id === gradeId);
}

export function getQBSubject(
  gradeId: string,
  subjectId: string
): QBSubject | undefined {
  return getQBGrade(gradeId)?.subjects.find((s) => s.id === subjectId);
}

export function getQBFlatLessons(subject: QBSubject): QBLeaf[] {
  const result: QBLeaf[] = [];
  for (const ch of subject.chapters) {
    if (ch.children?.length) result.push(...ch.children);
    else result.push({ id: ch.id, title: ch.title, pdfUrl: null });
  }
  return result;
}

export function findQBItem(id: string): QBItemMeta | null {
  for (const grade of questionBankGrades) {
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

export function getAllQBItemIds(): string[] {
  const ids: string[] = [];
  for (const grade of questionBankGrades) {
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
