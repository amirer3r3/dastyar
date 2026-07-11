export type Audiobook = {
  id: string;
  title: string;
  description: string;
  author: string;
  duration: string;
  coverEmoji: string;
  coverImage: string;
  audioUrl: string;
  category: "story" | "education" | "poem";
  seedRating: number;
  playCount: number;
};

export const audiobookCategoryLabels: Record<Audiobook["category"], string> = {
  story: "قصه",
  education: "آموزشی",
  poem: "شعر",
};

export const seedAudiobooks: Audiobook[] = [
  {
    id: "audio-1",
    title: "قصه پسرک فلافل‌فروش",
    description:
      "قصه آموزنده‌ای درباره صداقت و تلاش برای دانش‌آموزان ابتدایی.",
    author: "دستیار معلم",
    duration: "۸ دقیقه",
    coverEmoji: "📖",
    coverImage: "/marketplace/covers/audio-story.svg",
    audioUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
    category: "story",
    seedRating: 4.7,
    playCount: 312,
  },
  {
    id: "audio-2",
    title: "آموزش جدول ضرب با شعر",
    description: "یادگیری جدول ضرب ۲ و ۳ با شعر و آهنگ برای پایه دوم.",
    author: "معلم نمونه",
    duration: "۵ دقیقه",
    coverEmoji: "🎵",
    coverImage: "/marketplace/covers/audio-education.svg",
    audioUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
    category: "education",
    seedRating: 4.5,
    playCount: 189,
  },
  {
    id: "audio-3",
    title: "شعر حافظ برای نوجوانان",
    description: "شرح ساده و زیبای یک غزل حافظ با توضیحات ادبی.",
    author: "دستیار معلم",
    duration: "۱۲ دقیقه",
    coverEmoji: "🎙️",
    coverImage: "/marketplace/covers/audio-poem.svg",
    audioUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
    category: "poem",
    seedRating: 4.8,
    playCount: 97,
  },
  {
    id: "audio-4",
    title: "ماجراهای جنگل — قسمت ۱",
    description: "قسمت اول از سری قصه‌های صوتی علمی درباره حیوانات.",
    author: "دستیار معلم",
    duration: "۱۵ دقیقه",
    coverEmoji: "🌲",
    coverImage: "/marketplace/covers/audio-forest.svg",
    audioUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
    category: "story",
    seedRating: 4.6,
    playCount: 245,
  },
];
