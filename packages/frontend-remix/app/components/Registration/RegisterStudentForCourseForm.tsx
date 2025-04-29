import type { Course, Registration } from "~/types";

import { FormField } from "~/components/Common/FormField";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

export function RegisterStudentForCourseForm({
  student_id,
  courses,
  registrations,
  onRegister,
}: {
  student_id: string;
  courses: Course[];
  registrations: Registration[];
  onRegister: (courseId: string) => Promise<void>;
}) {
  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const course_id = form.course_id.value;
          if (course_id) {
            await onRegister(course_id);
          }
        }}
        className="flex items-end gap-4"
      >
        <FormField label="Course" required className="w-full">
          <select
            name="course_id"
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select a course</option>
            {courses
              .filter(
                (course) =>
                  !registrations.some((r) => r.course_id === course.id)
              )
              .map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
          </select>
        </FormField>

        <button
          type="submit"
          className="btn-primary rounded flex items-center gap-2"
        >
          <PlusCircleIcon className="h-5 w-5" />
          Register
        </button>
      </form>
    </div>
  );
}
