import { ENDPOINTS, fetchListData, fetchPageData, mutateData } from "~/lib/api/fetch";

import type { Course } from "~/types";
import type { Instructor } from "~/types";

export async function getAllInstructors(): Promise<Instructor[]> {
  const res = await fetch(`${ENDPOINTS.instructors}/`);

  if (!res.ok) {
    throw new Error("Failed to fetch instructors");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.results;
}

export async function getInstructorPageData(id: string): Promise<{
  instructor: Instructor;
  courses: Course[];
}> {
  const [instructor, courses] = await Promise.all([
    fetchPageData<Instructor>("instructors", `/${id}/`),
    fetchListData<Course>("courses", "/", { instructor_id: id }),
  ]);

  return { instructor, courses };
}

export async function createInstructor(data: Omit<Instructor, "id">): Promise<Instructor> {
  return await mutateData("instructors", "/", "POST", data);
}

export async function updateInstructor(id: string, data: Omit<Instructor, "id">): Promise<void> {
  await mutateData("instructors", `/${id}/`, "PUT", data);
}

export async function deleteInstructor(id: string): Promise<void> {
  await mutateData("instructors", `/${id}/`, "DELETE", {});
}
