import type { Course, Registration, Student } from "~/types";
import { fetchListData, fetchPageData, mutateData } from "~/lib/api/fetch";

export async function getStudentsForInstructor(instructor_id: string): Promise<{
  students: Student[];
  registrations: Registration[];
  courses: Course[];
}> {
  const [courses, registrations, students] = await Promise.all([
    fetchListData<Course>("courses", "/"), // all courses - eventually move this to the backend
    fetchListData<Registration>("registrations", "/",{instructor_id}),
    fetchListData<Student>("students", "/", {instructor_id })
  ]);

  return {
    students,
    registrations,
    courses,
  };
}

export async function getAllStudents(): Promise<Student[]> {
  return await fetchListData<Student>("students", "/");
}


export async function getStudentPageData(id: string): Promise<{
    student: Student | null;
    registrations: Registration[];
    courses: Course[];
}> {
  const [student, registrations, courses] = await Promise.all([
    fetchPageData("students", `/${id}/`),
    fetchListData<Registration>("registrations", "/", { student_id: id}),
    fetchListData<Course>("courses", "/"),
  ]);

  return {
    student,
    registrations,
    courses,
  };
}

export async function unregisterStudentFromCourse(student_id: string, course_id: string): Promise<{
    registrations: Registration[];
    students: Student[];
    unregisteredStudents: Student[];
}> {
  const regs = await fetchListData<Registration>("registrations", "/");

  const reg = regs.find(r => r.student_id === student_id && r.course_id === course_id);
  if (reg) {
    await mutateData("registrations", `/${reg.id}/`, "DELETE", {});
  }

  const updatedRegs = await fetchListData<Registration>("registrations", "/");
  const allStudents = await fetchListData<Student>("students", "/");

  return {
    registrations: updatedRegs,
    students: allStudents.filter(s => updatedRegs.some(r => r.student_id === s.id)),
    unregisteredStudents: allStudents.filter(s => !updatedRegs.some(r => r.student_id === s.id)),
  };
}

export async function createStudent(data: Omit<Student, "id" | "created_at" | "updated_at">): Promise<Student> {
  return await mutateData("students", "/", "POST", data);
}

export async function updateStudent(id: string, data: Omit<Student, "id" | "created_at" | "updated_at">): Promise<void> {
  await mutateData("students", `/${id}/`, "PUT", {
    ...data,
    updated_at: new Date().toISOString(),
  });
}

export async function deleteStudent(id: string): Promise<void> {
  await mutateData("students", `/${id}/`, "DELETE", {});
}