import type { Course, Registration, Student } from "~/types";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function registerStudentToCourse(student_id: string, course_id: string) {
  await fetch(`${API_URL}/registrations/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id, course_id }),
  });
}

export async function getRegistrationsForCourse(course_id: string): Promise<{
  course: Course;
  registrations: Registration[];
  students: Student[];
}> {
  const [courseRes, registrationsRes, studentsRes] = await Promise.all([
    fetch(`${API_URL}/courses/${course_id}/`),
    fetch(`${API_URL}/registrations/`),
    fetch(`${API_URL}/students/`)
  ]);

  if (!courseRes.ok) {
    throw new Error(`Course with ID ${course_id} not found`);
  }

  const course = await courseRes.json();
  const registrations: Registration[] = await registrationsRes.json();
  const allStudents: Student[] = await studentsRes.json();

  const filteredRegs = registrations.filter(r => r.course_id === course_id);
  const students = allStudents.filter(s => filteredRegs.some(r => r.student_id === s.id));

  return { course, registrations: filteredRegs, students };
}

export async function getRegistrationsByStudent(student_id: string): Promise<Registration[]> {
  const res = await fetch(`${API_URL}/registrations/`);
  const all: Registration[] = await res.json();
  return all.filter(r => r.student_id === student_id);
}

export async function unregisterStudentByregistration_id(regId: string, student_id: string) {
  await fetch(`${API_URL}/registrations/${regId}/`, {
    method: "DELETE"
  });
}