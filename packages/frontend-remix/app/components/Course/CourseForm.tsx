import { Course, Instructor } from "~/types";

import { FormField } from "~/components/Common/FormField";

export function CourseForm({
  formData,
  setFormData,
  editingCourse,
  instructors,
  onSubmit,
  allCourses,
}: {
  formData: {
    title: string;
    description: string;
    description_full: string;
    instructor_id: string;
    start_date: string;
    end_date: string;
    syllabus_url: string;
    course_fee: string;
    course_code: string;
    prerequisites: string[];
  };
  setFormData: React.Dispatch<React.SetStateAction<typeof formData>>;
  editingCourse: Course | null;
  instructors: Instructor[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  allCourses: Course[];
}) {
  if (!instructors || instructors.length === 0) {
    return <div className="text-red-500">No instructors available</div>;
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="Course Code" required>
        <input
          type="text"
          value={formData.course_code}
          onChange={(e) => {
            const raw = e.target.value.toUpperCase();
            const cleaned = raw.replace(/[^A-Z0-9-]/g, "");
            setFormData({ ...formData, course_code: cleaned });
          }}
          className="border p-2"
          required
          disabled={!!editingCourse}
        />
      </FormField>

      <FormField label="Title" required>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="border p-2"
          required
        />
      </FormField>

      <FormField label="Instructor" required>
        <select
          value={formData.instructor_id}
          onChange={(e) =>
            setFormData({ ...formData, instructor_id: e.target.value })
          }
          className="border p-2"
          required
        >
          <option value="">Select Instructor</option>
          {instructors.map((instructor) => (
            <option key={instructor.id} value={instructor.id}>
              {instructor.name_first} {instructor.name_last} ({instructor.email}
              )
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Prerequisites">
        <select
          multiple
          value={formData.prerequisites}
          onChange={(e) => {
            const selected = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setFormData({ ...formData, prerequisites: selected });
          }}
          className="border p-2 h-24"
        >
          {allCourses
            .filter((c) => c.course_code !== editingCourse?.course_code)
            .map((course) => (
              <option key={course.course_code} value={course.course_code}>
                {course.course_code} – {course.title}
              </option>
            ))}
        </select>
      </FormField>

      <FormField label="Start Date" required>
        <input
          type="date"
          value={formData.start_date}
          onChange={(e) =>
            setFormData({ ...formData, start_date: e.target.value })
          }
          className="border p-2"
          required
        />
      </FormField>

      <FormField label="End Date" required>
        <input
          type="date"
          value={formData.end_date}
          onChange={(e) =>
            setFormData({ ...formData, end_date: e.target.value })
          }
          className="border p-2"
          required
        />
      </FormField>

      <FormField label="Course Fee" required>
        <input
          type="number"
          value={formData.course_fee}
          onChange={(e) =>
            setFormData({ ...formData, course_fee: e.target.value })
          }
          className="border p-2"
          required
          min="0"
        />
      </FormField>

      <FormField label="Syllabus URL">
        <input
          type="url"
          value={formData.syllabus_url}
          onChange={(e) =>
            setFormData({ ...formData, syllabus_url: e.target.value })
          }
          className="border p-2"
        />
      </FormField>

      <FormField label="Description" required className="md:col-span-2">
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="border p-2"
          required
        />
      </FormField>

      <FormField label="Full Description" required className="md:col-span-2">
        <textarea
          value={formData.description_full}
          onChange={(e) =>
            setFormData({ ...formData, description_full: e.target.value })
          }
          className="border p-2 h-20"
          required
        />
      </FormField>

      <button
        type="submit"
        className="btn-primary py-2 px-4 rounded w-full mt-4"
      >
        {editingCourse ? "Update" : "Save"}
      </button>
    </form>
  );
}
