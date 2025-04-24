import { fetchListData, fetchPageData } from "~/lib/api/fetch";

import type { Course } from "~/types";

export async function getDashboardData(): Promise<{
  studentCount: number;
  courseCount: number;
  instructorCount: number;
  courses: Course[];
}> {
  const [summary, courses] = await Promise.all([
    fetchPageData("org", "/dashboard-summary/"),
    fetchListData<Course>("courses", "/", { active_courses: "true" }),
  ]);

  return {
    studentCount: summary.studentCount,
    courseCount: summary.courseCount,
    instructorCount: summary.instructorCount,
    courses,
  };
}