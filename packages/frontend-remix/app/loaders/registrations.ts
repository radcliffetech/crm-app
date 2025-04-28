import type { Course, Registration, Student } from "~/types";
import { fetchListData, fetchPageData, mutateData } from "~/lib/api/fetch";

export async function getRegistrationsForCourse(course_id: string): Promise<{
  course: Course;
  registrations: Registration[];
  students: Student[];
}> {
  try {
    const [course, registrations, students] = await Promise.all([
      fetchPageData<Course>("courses", `/${course_id}/`),
      fetchListData<Registration>("registrations", "/", { course_id }),
      fetchListData<Student>("students", "/")
    ]);

    const studentMap = new Map<string, Student>();
    students.forEach(s => studentMap.set(s.id, s));
    const filteredStudents = registrations.map(r => studentMap.get(r.student_id)).filter(Boolean) as Student[];

    return { course, registrations, students: filteredStudents };
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch registrations for course.");
  }
}

export async function getRegistrationsByStudent(student_id: string): Promise<Registration[]> {
  try {
    return fetchListData<Registration>("registrations", "/", { student_id });
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch registrations.");
  }
}

export async function registerStudentToCourse(student_id: string, course_id: string) {
  try {
    return mutateData("registrations", "/register/", "POST", { student_id, course_id });
  } catch (error: any) {
    throw new Error(error.message || "Failed to register student.");
  }
}

export async function unregisterStudent(reg: Registration) {
  try {
    return mutateData("registrations", "/unregister/", "POST", {
      student_id: reg.student_id,
      course_id: reg.course_id
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to unregister student.");
  }
}
