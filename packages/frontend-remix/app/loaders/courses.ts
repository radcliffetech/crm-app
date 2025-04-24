import type { Course, Instructor, Registration, Student } from "~/types";
import { fetchListData, fetchPageData, mutateData } from "~/lib/api/fetch";

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
}> {
  const [courses, instructors] = await Promise.all([
    fetchListData<Course>("courses", "/"),
    fetchListData<Instructor>("instructors", "/"),
  ]);

  return { courses, instructors };
}

export async function getCoursePageData(id: string): Promise<{
  course: Course | null;
  instructor: Instructor | null;
  registrations: Registration[];
  students: Student[];
  unregisteredStudents: Student[];
}> {
  const [course, allStudents, registrations] = await Promise.all([
    fetchPageData<Course>("courses", `/${id}/`),
    fetchListData<Student>("students", "/"),
    fetchListData<Registration>("registrations", "/", { course: id })
  ]);

  const students = allStudents.filter(s => registrations.some(r => r.student_id === s.id));
  const unregisteredStudents = allStudents.filter(s => !registrations.some(r => r.student_id === s.id));

  const instructor = course?.instructor_id
    ? await fetchPageData<Instructor>("instructors", `/${course.instructor_id}/`)
    : null;

  return { course, instructor, registrations, students, unregisteredStudents };
}

export async function createCourse(data: Omit<Course, "id">): Promise<Course> {
  return await mutateData("courses", "/", "POST", data);
}

export async function updateCourse(id: string, data: Omit<Course, "id">): Promise<void> {
  await mutateData("courses", `/${id}/`, "PUT", data);
}

export async function deleteCourse(id: string): Promise<void> {
  await mutateData("courses", `/${id}/`, "DELETE", {});
}