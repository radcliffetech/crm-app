import type { Course, Registration, Student } from "~/types";
import { fetchListData, fetchPageData, mutateData } from "~/lib/api/fetch";

export async function getStudentsForInstructor(instructor_id: string, token?: string): Promise<{
  students: Student[];
  registrations: Registration[];
  courses: Course[];
}> {
  try {
    const [courses, registrations, students] = await Promise.all([
      fetchListData<Course>("courses", "/", undefined, token),
      fetchListData<Registration>("registrations", "/", { instructor_id }, token),
      fetchListData<Student>("students", "/", { instructor_id }, token),
    ]);

    return {
      students,
      registrations,
      courses,
    };
  } catch (error: any) {
    throw new Error(
      error.message || "Failed to fetch students for instructor."
    );
  }
}

export async function getAllStudents(token?: string): Promise<Student[]> {
  try {
    return await fetchListData<Student>("students", "/", undefined, token);
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch students.");
  }
}

export async function getStudentPageData(id: string, token?: string): Promise<{
  student: Student;
  registrations: Registration[];
  courses: Course[];
}> {
  try {
    const [student, registrations, courses] = await Promise.all([
      fetchPageData("students", `/${id}/`, undefined, token),
      fetchListData<Registration>("registrations", "/", { student_id: id }, token),
      fetchListData<Course>("courses", "/", undefined, token),
    ]);

    return {
      student,
      registrations,
      courses,
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch student data.");
  }
}

export async function unregisterStudentFromCourse(
  student_id: string,
  course_id: string,
  token?: string,
): Promise<{
  registrations: Registration[];
  students: Student[];
  unregisteredStudents: Student[];
}> {
  try {
    const regs = await fetchListData<Registration>("registrations", "/", undefined, token);

    const reg = regs.find(
      (r) => r.student_id === student_id && r.course_id === course_id
    );
    if (reg) {
      await mutateData("registrations", `/${reg.id}/`, "DELETE", {}, token);
    }

    const updatedRegs = await fetchListData<Registration>("registrations", "/", undefined, token);
    const allStudents = await fetchListData<Student>("students", "/", undefined, token);

    return {
      registrations: updatedRegs,
      students: allStudents.filter((s) =>
        updatedRegs.some((r) => r.student_id === s.id)
      ),
      unregisteredStudents: allStudents.filter(
        (s) => !updatedRegs.some((r) => r.student_id === s.id)
      ),
    };
  } catch (error: any) {
    throw new Error(
      error.message || "Failed to unregister student from course."
    );
  }
}

export async function createStudent(
  data: Omit<Student, "id" | "created_at" | "updated_at">,
  token?: string,
): Promise<Student> {
  try {
    return await mutateData("students", "/", "POST", data, token);
  } catch (error: any) {
    throw new Error(error.message || "Failed to create student.");
  }
}

export async function updateStudent(
  id: string,
  data: Omit<Student, "id" | "created_at" | "updated_at">,
  token?: string,
): Promise<void> {
  try {
    await mutateData("students", `/${id}/`, "PUT", {
      ...data,
      updated_at: new Date().toISOString(),
    }, token);
  } catch (error: any) {
    throw new Error(error.message || "Failed to update student.");
  }
}

export async function deleteStudent(id: string, token?: string): Promise<void> {
  try {
    await mutateData("students", `/${id}/`, "DELETE", {}, token);
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete student.");
  }
}
