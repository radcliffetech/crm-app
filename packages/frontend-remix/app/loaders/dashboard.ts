import { fetchListData, fetchPageData } from "~/lib/api/fetch";

import type { Course } from "~/types";

export async function getDashboardData(token?: string): Promise<{
  studentCount: number;
  courseCount: number;
  instructorCount: number;
  courses: Course[];
}> {
  try {
    const [summary, courses] = await Promise.all([
      fetchPageData("org", "/dashboard-summary/", undefined, token),
      fetchListData<Course>("courses", "/", { active_courses: "true" }, token),
    ]);

    return {
      studentCount: summary.studentCount,
      courseCount: summary.courseCount,
      instructorCount: summary.instructorCount,
      courses,
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch dashboard data.");
  }
}
