import { useEffect, useState } from "react";

import type { Course } from "~/types";
import { CoursesActiveList } from "~/components/lists/CoursesActiveList";
import { DashboardCard } from "~/components/ui/DashboardCard";
import { DataLoaderState } from "~/components/ui/DataLoaderState";
import type { MetaFunction } from "@remix-run/node";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";
import PageSubheader from "~/components/ui/PageSubheader";
import { getDashboardData } from "~/loaders/dashboard";

export const meta: MetaFunction = () => {
  return [
    { title: "MiiM CRM" },
    { name: "description", content: "Sample CRM" },
  ];
};

export default function Index() {
  const [studentCount, setStudentCount] = useState(0);
  const [instructorCount, setInstructorCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [courses, setcourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function reloadData() {
    setLoading(true);
    setError(null);
    getDashboardData()
      .then(({ studentCount, courseCount, instructorCount, courses }) => {
        setStudentCount(studentCount);
        setCourseCount(courseCount);
        setInstructorCount(instructorCount);
        setcourses(courses);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load dashboard data " + err);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reloadData();
  }, []);

  return (
    <PageFrame>
      <PageHeader>Dashboard</PageHeader>
      <DataLoaderState loading={loading} error={error} />
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
