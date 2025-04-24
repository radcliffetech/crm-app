import type { Course, Registration } from "~/types"

import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { registerStudentToCourse } from "~/loaders/registrations";

export function RegisterStudentForCourseForm({
  student_id,
  courses,
  registrations,
  onRegister
}: {
  student_id: string;
  courses: Course[];
  registrations: Registration[];
  onRegister: () => void;
}) {
  return (
    <div className="mt-6 p-6 bg-gray-50 shadow-md rounded-md">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const course_id = form.course_id.value;
          if (course_id) {
            await registerStudentToCourse(student_id, course_id);
            onRegister();
          }
        }}
        className="flex items-center gap-4"
      >
        <select name="course_id" className="border p-2 rounded" required>
          <option value="">Select a course</option>
          {courses
            .filter(course => !registrations.some(r => r.course_id === course.id))
            .map(course => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
        </select>
        <button type="submit" className="btn-primary py-2 px-4 rounded flex items-center gap-2">
          <PlusCircleIcon className="h-5 w-5" />
          Register
        </button>
      </form>
    </div>
  );
}
