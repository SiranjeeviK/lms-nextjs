import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import CoursesList from "@/components/courses-list";
import { auth } from "@clerk/nextjs/server";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import InfoCard from "./_components/info-card";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/login");
  }

  const { completedCourses, coursesInProgress } =
    await getDashboardCourses(userId);

  console.log(
    "completedCourses",
    completedCourses,
    "coursesInProgress",
    coursesInProgress,
  );
  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <InfoCard
          icon={Clock}
          label="In Progress"
          variant={"default"}
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          variant={"success"}
          numberOfItems={coursesInProgress.length}
        />
      </div>

      <CoursesList items={[...completedCourses, ...coursesInProgress]} />
    </div>
  );
}
