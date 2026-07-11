import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AppHeader from "@/app/components/app-header";
import { getStudents, getClassStats } from "@/app/lib/students";
import MyClassClient from "./my-class-client";

export default async function MyClassPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const students = await getStudents(session.user.id);
  const stats = getClassStats(students);

  return (
    <>
      <AppHeader title="کلاس من" subtitle="مدیریت دانش‌آموزان و نمرات" />
      <MyClassClient students={students} stats={stats} />
    </>
  );
}
