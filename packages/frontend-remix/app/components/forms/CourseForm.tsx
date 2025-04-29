import { Course, Instructor } from "~/types";

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
        <label className="flex flex-col">
          <span className="flex items-center gap-1">
            Course Code <span className="text-red-500">*</span>
          </span>
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
        </label>
        <label className="flex flex-col">
          <span className="flex items-center gap-1">
            Title <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="border p-2"
            required
          />
        </label>
        <label className="flex flex-col">
          <span className="flex items-center gap-1">
            Instructor <span className="text-red-500">*</span>
          </span>
          <select
            value={formData.instructor_id}
            onChange={(e) => setFormData({ ...formData, instructor_id: e.target.value })}
            className="border p-2"
            required
          >
            <option value="">Select Instructor</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.name_first} {instructor.name_last} ({instructor.email})
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col md:col-span-2">
          <span className="flex items-center gap-1">
            Prerequisites <span className="text-sm text-gray-500">(optional)</span>
          </span>
          <select
            multiple
            value={formData.prerequisites}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              setFormData({ ...formData, prerequisites: selected });
            }}
            className="border p-2 h-24"
          >
            {allCourses
              .filter((c) => c.id !== editingCourse?.id)
              .map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_code} – {course.title}
                </option>
              ))}
          </select>
        </label>
        <label className="flex flex-col">
          <span className="flex items-center gap-1">
            Start Date <span className="text-red-500">*</span>
          </span>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="border p-2"
            required
          />
        </label>
        <label className="flex flex-col">
          <span className="flex items-center gap-1">
            End Date <span className="text-red-500">*</span>
          </span>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            className="border p-2"
            required
          />
        </label>
        <label className="flex flex-col">
          <span className="flex items-center gap-1">
            Course Fee <span className="text-red-500">*</span>
          </span>
          <input
            type="number"
            value={formData.course_fee}
            onChange={(e) => setFormData({ ...formData, course_fee: e.target.value })}
            className="border p-2"
            required
            min="0"
          />
        </label>
        <label className="flex flex-col">
          <span className="flex items-center gap-1">
            Syllabus URL <span className="text-sm text-gray-500">(optional)</span>
          </span>
          <input
            type="url"
            value={formData.syllabus_url}
            onChange={(e) => setFormData({ ...formData, syllabus_url: e.target.value })}
            className="border p-2"
          />
        </label>
        <label className="flex flex-col md:col-span-2">
          <span className="flex items-center gap-1">
            Description <span className="text-red-500">*</span>
          </span>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border p-2"
            required
          />
        </label>
        <label className="flex flex-col md:col-span-2">
          <span className="flex items-center gap-1">
            Full Description <span className="text-red-500">*</span>
          </span>
          <textarea
            value={formData.description_full}
            onChange={(e) => setFormData({ ...formData, description_full: e.target.value })}
            className="border p-2 h-20"
            required
          />
        </label>
        <button
          type="submit"
          className="btn-primary py-2 px-4 rounded w-full mt-4"
        >
          {editingCourse ? "Update" : "Save"}
        </button>
    </form>
  );
}