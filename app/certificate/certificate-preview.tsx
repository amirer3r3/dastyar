import type { CertificateData, TemplateId } from "./types";

export default function CertificatePreview({ data }: { data: CertificateData }) {
  const name = data.studentName.trim() || "نام دانش‌آموز";
  const message =
    data.message.trim() || "به دلیل تلاش و موفقیت در درس، تقدیر می‌شود.";
  const teacher = data.teacherName.trim();

  return (
    <div>
      {data.templateId === "cert-classic" ? (
        <CertClassic name={name} message={message} teacher={teacher} />
      ) : null}
      {data.templateId === "cert-fun" ? (
        <CertFun name={name} message={message} teacher={teacher} />
      ) : null}
      {data.templateId === "badge-star" ? (
        <BadgeStar name={name} />
      ) : null}
      {data.templateId === "badge-great" ? (
        <BadgeGreat name={name} />
      ) : null}
    </div>
  );
}

function CertClassic({
  name,
  message,
  teacher,
}: {
  name: string;
  message: string;
  teacher: string;
}) {
  return (
    <div
      className="relative mx-auto overflow-hidden bg-white text-gray-900"
      style={{
        width: 800,
        height: 560,
        fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
      }}
    >
      <div className="absolute inset-4 border-4 border-double border-amber-700" />
      <div className="absolute inset-6 border border-amber-400" />
      <div className="flex h-full flex-col items-center justify-center px-16 text-center">
        <p className="text-sm tracking-widest text-amber-700">تقدیرنامه</p>
        <h1 className="mt-2 text-3xl font-black text-amber-900">
          لوح تقدیر
        </h1>
        <p className="mt-6 text-base leading-8 text-gray-600">
          این گواهی به
        </p>
        <p className="mt-1 text-4xl font-black text-primary">{name}</p>
        <p className="mt-6 max-w-lg text-base leading-8 text-gray-700">
          {message}
        </p>
        {teacher ? (
          <p className="mt-8 text-sm text-gray-500">معلم: {teacher}</p>
        ) : null}
        <p className="mt-4 text-xs text-gray-400">
          {new Date().toLocaleDateString("fa-IR")}
        </p>
      </div>
    </div>
  );
}

function CertFun({
  name,
  message,
  teacher,
}: {
  name: string;
  message: string;
  teacher: string;
}) {
  return (
    <div
      className="relative mx-auto overflow-hidden"
      style={{
        width: 800,
        height: 560,
        fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
        background: "linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #ddd6fe 100%)",
      }}
    >
      <div className="absolute inset-3 rounded-3xl border-4 border-dashed border-pink-400" />
      <div className="flex h-full flex-col items-center justify-center px-12 text-center">
        <p className="text-4xl">🌟🎉⭐</p>
        <h1 className="mt-2 text-3xl font-black text-pink-600">آفرین!</h1>
        <p className="mt-4 text-lg font-bold text-purple-700">{name}</p>
        <p className="mt-4 max-w-md rounded-2xl bg-white/70 px-6 py-3 text-base leading-8 text-purple-800">
          {message}
        </p>
        {teacher ? (
          <p className="mt-6 text-sm font-bold text-pink-600">
            از طرف: {teacher} 👩‍🏫
          </p>
        ) : null}
        <p className="mt-3 text-2xl">🎨📚✨</p>
      </div>
    </div>
  );
}

function BadgeStar({ name }: { name: string }) {
  return (
    <div
      className="relative mx-auto flex flex-col items-center justify-center overflow-hidden rounded-3xl text-center shadow-xl"
      style={{
        width: 400,
        height: 400,
        fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
        background: "linear-gradient(160deg, #fbbf24 0%, #f59e0b 100%)",
      }}
    >
      <p className="text-6xl">⭐</p>
      <p className="mt-2 text-lg font-bold text-white">دانش‌آموز برتر</p>
      <p className="mt-3 text-2xl font-black text-white drop-shadow">{name}</p>
      <p className="mt-4 rounded-full bg-white/30 px-4 py-1 text-sm font-bold text-white">
        آفرین! 🎉
      </p>
    </div>
  );
}

function BadgeGreat({ name }: { name: string }) {
  return (
    <div
      className="relative mx-auto flex flex-col items-center justify-center overflow-hidden rounded-full text-center shadow-xl"
      style={{
        width: 400,
        height: 400,
        fontFamily: "var(--font-vazirmatn), Tahoma, sans-serif",
        background: "linear-gradient(160deg, #4f46e5 0%, #7c3aed 100%)",
      }}
    >
      <p className="text-5xl">🏆</p>
      <p className="mt-2 text-xl font-black text-white">عالی بود!</p>
      <p className="mt-4 text-2xl font-black text-yellow-300">{name}</p>
      <p className="mt-3 text-sm font-bold text-white/80">ادامه بده 💪</p>
    </div>
  );
}

export function isBadgeTemplate(id: TemplateId): boolean {
  return id === "badge-star" || id === "badge-great";
}
