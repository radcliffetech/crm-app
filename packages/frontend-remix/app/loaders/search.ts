import type { Course, Instructor, Registration, Student } from "~/types";

import { fetchPageData } from "~/lib/api/fetch";

export async function searchLoader(query: string) {
  const response = await fetchPageData("org", `/search?q=${query}`);

  return {
    students: response.students as Student[],
    instructors: response.instructors as Instructor[],
    courses: response.courses as Course[],
    registrations: response.registrations as Registration[],
  };
}
