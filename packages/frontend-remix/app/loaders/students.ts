import type { Course, Registration, Student } from "~/types";
import { fetchListData, fetchPageData, mutateData } from "~/lib/api/fetch";

export async function getStudentsForInstructor(instructor_id: string): Promise<{
  students: Student[];
  registrations: Registration[];
  courses: Course[];
}> {
  try {
    const [courses, registrations, students] = await Promise.all([
      fetchListData<Course>("courses", "/"), // all courses - eventually move this to the backend
      fetchListData<Registration>("registrations", "/", { instructor_id }),
      fetchListData<Student>("students", "/", { instructor_id }),
    ]);

    return {
      students,
      registrations,
      courses,
    };
  } catch (error: any) {
    throw new Error(
      error.message || "Failed to fetch students for instructor.",
    );
  }
}

export async function getAllStudents(): Promise<Student[]> {
  try {
    return await fetchListData<Student>("students", "/");
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch students.");
  }
}

export async function getStudentPageData(id: string): Promise<{
  student: Student | null;
  registrations: Registration[];
  courses: Course[];
}> {
  try {
    const [student, registrations, courses] = await Promise.all([
      fetchPageData("students", `/${id}/`),
      fetchListData<Registration>("registrations", "/", { student_id: id }),
      fetchListData<Course>("courses", "/"),
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
): Promise<{
  registrations: Registration[];
  students: Student[];
  unregisteredStudents: Student[];
}> {
  try {
    const regs = await fetchListData<Registration>("registrations", "/");

    const reg = regs.find(
      (r) => r.student_id === student_id && r.course_id === course_id,
    );
    if (reg) {
      await mutateData("registrations", `/${reg.id}/`, "DELETE", {});
    }

    const updatedRegs = await fetchListData<Registration>("registrations", "/");
    const allStudents = await fetchListData<Student>("students", "/");

    return {
      registrations: updatedRegs,
      students: allStudents.filter((s) =>
        updatedRegs.some((r) => r.student_id === s.id),
      ),
      unregisteredStudents: allStudents.filter(
        (s) => !updatedRegs.some((r) => r.student_id === s.id),
      ),
    };
  } catch (error: any) {
    throw new Error(
      error.message || "Failed to unregister student from course.",
    );
  }
}

export async function createStudent(
  data: Omit<Student, "id" | "created_at" | "updated_at">,
): Promise<Student> {
  try {
    return await mutateData("students", "/", "POST", data);
  } catch (error: any) {
    throw new Error(error.message || "Failed to create student.");
  }
}

export async function updateStudent(
  id: string,
  data: Omit<Student, "id" | "created_at" | "updated_at">,
): Promise<void> {
  try {
    await mutateData("students", `/${id}/`, "PUT", {
      ...data,
      updated_at: new Date().toISOString(),
    });
  } catch (error: any) {
    throw new Error(error.message || "Failed to update student.");
  }
}

export async function deleteStudent(id: string): Promise<void> {
  try {
    await mutateData("students", `/${id}/`, "DELETE", {});
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete student.");
  }
}
