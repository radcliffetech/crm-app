import type { Course, Instructor, Student } from "~/types";

import { fetchPageData } from "~/lib/api/fetch";

export async function searchLoader(query: string) {
  try {
    const response = await fetchPageData<any>("org", `/search?q=${query}`);

    const results = [
      ...response.students.map((student: Student) => ({
        type: "Student",
        label: `${student.name_first} ${student.name_last}`,
        link: `/students/${student.id}`,
      })),
      ...response.instructors.map((instructor: Instructor) => ({
        type: "Instructor",
        label: `${instructor.name_first} ${instructor.name_last}`,
        link: `/instructors/${instructor.id}`,
      })),
      ...response.courses.map((course: Course) => ({
        type: "Course",
        label: course.title,
        link: `/courses/${course.id}`,
      })),
    ];

    return results;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch search results.");
  }
}
