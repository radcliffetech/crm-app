import type { Course, Student } from "~/types";

import { PageSubheader } from "../Common/PageSubheader";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

export function RegisterCourseForStudentForm({
  course,
  unregisteredStudents,
  onRegister,
}: {
  course: Course;
  unregisteredStudents: Student[];
  onRegister: (student_id: string, course: Course) => void;
}) {
  return (
    <div className="mt-6 p-6 bg-gray-50 shadow-md rounded-md">
      <PageSubheader>Registration</PageSubheader>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const student_id = form.student_id.value;
          if (student_id && course) {
            onRegister(student_id, course);
          }
        }}
        className="flex items-center gap-4"
      >
        <select name="student_id" className="border p-2 rounded" required>
          <option value="">Select student</option>
          {unregisteredStudents.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name_first} {s.name_last} ({s.email})
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="btn-primary py-2 px-4 rounded flex items-center gap-2"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Register
        </button>
      </form>
    </div>
  );
}
