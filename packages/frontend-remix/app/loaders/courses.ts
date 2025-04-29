import type { Course, Instructor, Registration, Student } from "~/types";
import { fetchListData, fetchPageData, mutateData } from "~/lib/api/fetch";

export type CoursePayload = {
  title: string;
  description: string;
  description_full: string;
  instructor_id: string;
  start_date: string;
  end_date: string;
  syllabus_url?: string;
  course_fee: number;
  course_code: string;
  prerequisites: string[];
  created_at?: string;
  updated_at?: string;
};

export async function getCoursesForInstructor(instructor_id: string): Promise<{
  courses: Course[];
  registrations: Registration[];
  students: Student[];
}> {
  const [courses, registrations, allStudents] = await Promise.all([
    fetchListData<Course>("courses", "/", { instructor_id }),
    fetchListData<Registration>("registrations", "/"),
    fetchListData<Student>("students", "/")
  ]);

  const student_ids = new Set(
    registrations
      .filter(r => courses.some(c => c.id === r.course_id))
      .map(r => r.student_id)
  );

  const students = allStudents.filter(s => student_ids.has(s.id));
  return { courses, registrations, students };
}

export async function getCoursesPageData(): Promise<{
  courses: Course[];
  instructors: Instructor[];
  registrations: Registration[];
}> {
  const [courses, instructors, registrations] = await Promise.all([
    fetchListData<Course>("courses", "/"),
    fetchListData<Instructor>("instructors", "/"),
    fetchListData<Registration>("registrations", "/"),
  ]);

  return { courses, instructors, registrations };
}

export async function getCourses(): Promise<Course[]> {
  const courses = await fetchListData<Course>("courses", "/");
  return courses;
}

export async function getCoursePageData(id: string): Promise<{
  course: Course | null;
  instructor: Instructor | null;
  registrations: Registration[];
  unregisteredStudents: Student[];
  instructors: Instructor[];
  courses: Course[];
}> {
  console.log("Fetching course data for ID:", id);
  const [course, registrations, unregisteredStudents, instructors, courses] = await Promise.all([
    fetchPageData<Course>("courses", `/${id}/`),
    fetchListData<Registration>("registrations", "/", { course_id: id }),
    fetchListData<Student>("students", "/", { course_id: id, eligible_for_course: true }),
    fetchListData<Instructor>("instructors", "/"),
    fetchListData<Course>("courses", "/")
  ]);

  console.log("Course data fetched:", course);
  const instructor = course?.instructor_id
    ? await fetchPageData<Instructor>("instructors", `/${course.instructor_id}/`)
    : null;

  const output = { course, instructor, registrations, unregisteredStudents, instructors, courses };
  return output;
}

export async function createCourse(data: CoursePayload): Promise<Course> {
  try {
    return await mutateData("courses", "/", "POST", data);
  } catch (error: any) {
    throw new Error(error.message || "Failed to create course.");
  }
}

export async function updateCourse(id: string, data: CoursePayload): Promise<void> {
  try {
    await mutateData("courses", `/${id}/`, "PUT", data);
  } catch (error: any) {
    throw new Error(error.message || "Failed to update course.");
  }
}

export async function deleteCourse(id: string): Promise<void> {
  try {
    await mutateData("courses", `/${id}/`, "DELETE", {});
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete course.");
  }
}