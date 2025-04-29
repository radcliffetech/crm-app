import type { Course, CourseFormData, Instructor } from "~/types";
import { createCourse, deleteCourse, updateCourse } from "~/loaders/courses";

import { AddButton } from "~/components/Common/AddButton";
import { CourseForm } from "~/components/Course/CourseForm";
import { CoursesList } from "~/components/Course/CoursesList";
import { EditModal } from "~/components/Common/EditModal";
import { PageFrame } from "~/components/Common/PageFrame";
import { PageHeader } from "~/components/Common/PageHeader";
import { canAccessAdmin } from "~/lib/permissions";
import { toast } from "react-hot-toast";
import { useAuth } from "~/root";
import { useConfirmDialog } from "~/components/Common/ConfirmDialogProvider";
import { useEditState } from "~/components/Common/useEditState";
import { useState } from "react";

export const emptyCourseForm: CourseFormData = {
  course_code: "",
  title: "",
  description: "",
  description_full: "",
  instructor_id: "",
  start_date: "",
  end_date: "",
  syllabus_url: "",
  course_fee: "",
  prerequisites: [] as string[],
};

type CoursesPageContainerProps = {
  loaderData: {
    courses: Course[];
    instructors: Instructor[];
  };
};

export function CoursesPageContainer({
  loaderData,
}: CoursesPageContainerProps) {
  const [courses, setCourses] = useState<Course[]>(loaderData.courses);
  const [instructors] = useState<Instructor[]>(loaderData.instructors);
  const { editing, open, close } = useEditState();
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(emptyCourseForm);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const confirm = useConfirmDialog();
  const user = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, formData);
        setCourses((prev) =>
          prev.map((c) =>
            c.id === editingCourse.id ? { ...c, ...formData } : c
          )
        );
        setEditingCourse(null);
      } else {
        const newCourse = await createCourse(formData);
        setCourses((prev) => [...prev, newCourse]);
      }
      toast.success("Course saved successfully!");
    } catch {
      toast.error("Failed to save course.");
    }
    setFormData(emptyCourseForm);
    close();
  };

  return (
    <PageFrame>
      <PageHeader>Courses</PageHeader>

      {!editing && (
        <AddButton
          onClick={() => {
            setFormData(emptyCourseForm);
            setEditingCourse(null);
            open();
          }}
        >
          Add
        </AddButton>
      )}

      <EditModal
        open={editing}
        onClose={() => {
          setFormData(emptyCourseForm);
          setEditingCourse(null);
          close();
        }}
      >
        <CourseForm
          formData={formData}
          setFormData={setFormData}
          editingCourse={editingCourse}
          instructors={instructors}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormData(emptyCourseForm);
            setEditingCourse(null);
            close();
          }}
          allCourses={courses}
        />
      </EditModal>

      <CoursesList
        courses={courses}
        deletingId={deletingId}
        onEdit={(course) => {
          setEditingCourse(course);
          setFormData({
            course_code: course.course_code,
            title: course.title,
            description: course.description,
            description_full: course.description_full,
            instructor_id: course.instructor_id,
            start_date: course.start_date.split("T")[0],
            end_date: course.end_date.split("T")[0],
            syllabus_url: course.syllabus_url || "",
            course_fee: course.course_fee?.toString() || "",
            prerequisites: course.prerequisites,
          });
          open();
        }}
        onDelete={async (id) => {
          const course = courses.find((c) => c.id === id);
          if (course) {
            setDeletingId(id);
            const confirmed = await confirm({
              title: "Delete Course",
              description: `Are you sure you want to delete the course "${course.title}"?`,
              confirmText: "Delete",
              cancelText: "Cancel",
            });
            if (!confirmed) {
              setDeletingId(null);
              return;
            }
            try {
              await deleteCourse(id);
              setCourses((prev) => prev.filter((c) => c.id !== id));
              toast.success("Course deleted successfully!");
            } catch (error: any) {
              console.error(error);
              toast.error(
                error.message ||
                  "Cannot delete course: it has active student registrations."
              );
            } finally {
              setDeletingId(null);
            }
          }
        }}
        canDelete={canAccessAdmin(user)}
        canEdit={canAccessAdmin(user)}
      />
    </PageFrame>
  );
}
