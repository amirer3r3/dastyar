import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getPlannerItems,
  formatWeekStart,
  getSaturdayOfWeek,
} from "@/app/lib/planner";
import PlannerClient from "./planner-client";

export default async function PlannerPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  let weekStart = params.week?.trim() ?? "";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
    weekStart = formatWeekStart(new Date());
  } else {
    weekStart = formatWeekStart(
      getSaturdayOfWeek(new Date(weekStart + "T12:00:00"))
    );
  }

  const items = await getPlannerItems(session.user.id, weekStart);

  return <PlannerClient items={items} weekStart={weekStart} />;
}
