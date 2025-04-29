import type { Course } from "~/types";
import { CoursesActiveList } from "~/components/Course/CoursesActiveList";
import { DashboardCard } from "~/components/Dashboard/DashboardCard";
import { PageFrame } from "~/components/Common/PageFrame";
import { PageHeader } from "~/components/Common/PageHeader";
import { PageSubheader } from "~/components/Common/PageSubheader";

type DashboardContainerProps = {
  loaderData: {
    studentCount: number;
    instructorCount: number;
    courseCount: number;
    courses: Course[];
  };
};

export function DashboardContainer({ loaderData }: DashboardContainerProps) {
  const { studentCount, instructorCount, courseCount, courses } = loaderData;

  return (
    <PageFrame>
      <PageHeader>Dashboard</PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Students"
          count={studentCount}
          link="/students"
          linkText="View Students"
        />
        <DashboardCard
          title="Instructors"
          count={instructorCount}
          link="/instructors"
          linkText="View Instructors"
        />
        <DashboardCard
          title="Courses"
          count={courseCount}
          link="/courses"
          linkText="View Courses"
        />
        <div className="flex justify-center items-center">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-48 m-4"
            height="150"
          />
        </div>
      </div>

      <PageSubheader>Active Courses</PageSubheader>
      <CoursesActiveList courses={courses} />
    </PageFrame>
  );
}
