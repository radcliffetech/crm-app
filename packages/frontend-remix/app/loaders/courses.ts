import type {
  Course,
  CoursePayload,
  Instructor,
  Registration,
  Student,
} from "~/types";
import { fetchListData, fetchPageData, mutateData } from "~/lib/api/fetch";

export async function getCoursesForInstructor(instructor_id: string, token?: string): Promise<{
  courses: Course[];
  registrations: Registration[];
  students: Student[];
}> {
  const [courses, registrations, allStudents] = await Promise.all([
    fetchListData<Course>("courses", "/", { instructor_id }, token),
    fetchListData<Registration>("registrations", "/", undefined, token),
    fetchListData<Student>("students", "/", undefined, token),
  ]);

  const student_ids = new Set(
    registrations
      .filter((r) => courses.some((c) => c.id === r.course_id))
      .map((r) => r.student_id)
  );

  const students = allStudents.filter((s) => student_ids.has(s.id));
  return { courses, registrations, students };
}

export async function getCoursesPageData(token?: string): Promise<{
  courses: Course[];
  instructors: Instructor[];
  registrations: Registration[];
}> {
  const [courses, instructors, registrations] = await Promise.all([
    fetchListData<Course>("courses", "/", undefined, token),
    fetchListData<Instructor>("instructors", "/", undefined, token),
    fetchListData<Registration>("registrations", "/", undefined, token),
  ]);

  return { courses, instructors, registrations };
}

export async function getCourses(token?: string): Promise<Course[]> {
  const courses = await fetchListData<Course>("courses", "/", undefined, token);
  return courses;
}

export async function getCoursePageData(id: string, token?: string): Promise<{
  course: Course;
  instructor: Instructor | null;
  registrations: Registration[];
  unregisteredStudents: Student[];
  instructors: Instructor[];
  courses: Course[];
}> {
  const [course, registrations, unregisteredStudents, instructors, courses] =
    await Promise.all([
      fetchPageData<Course>("courses", `/${id}/`, undefined, token),
      fetchListData<Registration>("registrations", "/", { course_id: id }, token),
      fetchListData<Student>("students", "/", {
        course_id: id,
        eligible_for_course: true,
      }, token),
      fetchListData<Instructor>("instructors", "/", undefined, token),
      fetchListData<Course>("courses", "/", undefined, token),
    ]);

  if (!course) {
    throw new Error("Course not found or invalid ID. " + id);
  }
  const instructor = course.instructor_id
    ? await fetchPageData<Instructor>(
        "instructors",
        `/${course.instructor_id}/`,
        undefined,
        token,
      )
    : null;

  const output = {
    course,
    instructor,
    registrations,
    unregisteredStudents,
    instructors,
    courses,
  };
  return output;
}

export async function createCourse(data: CoursePayload, token?: string): Promise<Course> {
  try {
    return await mutateData("courses", "/", "POST", data, token);
  } catch (error: any) {
    throw new Error(error.message || "Failed to create course.");
  }
}

export async function updateCourse(
  id: string,
  data: CoursePayload,
  token?: string,
): Promise<void> {
  try {
    await mutateData("courses", `/${id}/`, "PUT", data, token);
  } catch (error: any) {
    throw new Error(error.message || "Failed to update course.");
  }
}

export async function deleteCourse(id: string, token?: string): Promise<void> {
  try {
    await mutateData("courses", `/${id}/`, "DELETE", {}, token);
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete course.");
  }
}
