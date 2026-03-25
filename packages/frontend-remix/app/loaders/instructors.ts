import type { Course, Instructor } from "~/types";
import {
  ENDPOINTS,
  fetchListData,
  fetchPageData,
  mutateData,
} from "~/lib/api/fetch";

export async function getAllInstructors(token?: string): Promise<Instructor[]> {
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${ENDPOINTS.instructors}/`, { headers });

  if (!res.ok) {
    throw new Error("Failed to fetch instructors");
  }
  const data = await res.json();
  return Array.isArray(data) ? data : data.results;
}

export async function getInstructorPageData(id: string, token?: string): Promise<{
  instructor: Instructor;
  courses: Course[];
}> {
  const [instructor, courses] = await Promise.all([
    fetchPageData<Instructor>("instructors", `/${id}/`, undefined, token),
    fetchListData<Course>("courses", "/", { instructor_id: id }, token),
  ]);

  return { instructor, courses };
}

export async function createInstructor(
  data: Omit<Instructor, "id">,
  token?: string,
): Promise<Instructor> {
  try {
    return await mutateData("instructors", "/", "POST", data, token);
  } catch (error: any) {
    throw new Error(error.message || "Failed to create instructor.");
  }
}

export async function updateInstructor(
  id: string,
  data: Omit<Instructor, "id" | "created_at" | "updated_at">,
  token?: string,
): Promise<void> {
  try {
    await mutateData("instructors", `/${id}/`, "PUT", {
      ...data,
      updated_at: new Date().toISOString(),
    }, token);
  } catch (error: any) {
    throw new Error(error.message || "Failed to update instructor.");
  }
}

export async function deleteInstructor(id: string, token?: string): Promise<void> {
  try {
    await mutateData("instructors", `/${id}/`, "DELETE", {}, token);
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete instructor.");
  }
}
