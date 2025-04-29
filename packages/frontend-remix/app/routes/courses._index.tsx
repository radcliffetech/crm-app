import type { Course, CourseFormData, CoursePayload, Instructor } from "~/types";
import { createCourse, deleteCourse, getCoursesPageData, updateCourse } from "~/loaders/courses";
import { useEffect, useState } from "react";

import { AddButton } from "~/components/ui/AddButton";
import { CourseForm } from "~/components/forms/CourseForm";
import { CoursesList } from "~/components/lists/CoursesList";
import { DataLoaderState } from "~/components/ui/DataLoaderState";
import type { MetaFunction } from "@remix-run/node";
import { Modal } from "~/components/ui/Modal";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";
import { canAccessAdmin } from "~/lib/permissions";
import { toast } from "react-hot-toast";
import { useAuth } from "~/root";
import { useConfirmDialog } from "~/lib/ConfirmDialogProvider";

export const meta: MetaFunction = () => {
    return [
        { title: "Courses - MiiM CRM" },
        { name: "description", content: "Browse and manage courses in the MiiM CRM application." },
    ];
};




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

export default function CoursesPage() {

    const [courses, setCourses] = useState<Course[]>([]);

    // we need instructors for the form
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [formData, setFormData] = useState<CourseFormData>(emptyCourseForm);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const confirm = useConfirmDialog();

    function reloadData() {
        setLoading(true);
        setError(null);
        getCoursesPageData()
            .then(({ courses, instructors }) => {
                setCourses(courses);
                setInstructors(instructors);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load courses.");
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        reloadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingCourse) {
                await updateCourse(editingCourse.id, formData);
                reloadData();
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
        setShowForm(false);
        setSaving(false);
    };

    return (
        <PageFrame>

            <PageHeader>Courses</PageHeader>
            {!showForm && (
                <AddButton onClick={() => {
                    setFormData(emptyCourseForm);
                    setEditingCourse(null);
                    setShowForm(true);
                }}>
                    Add
                </AddButton>
            )}

            <Modal
                isOpen={showForm}
                onClose={() => {
                    setFormData(emptyCourseForm);
                    setEditingCourse(null);
                    setShowForm(false);
                }}
            >
                <CourseForm
                    formData={formData}
                    setFormData={setFormData}
                    editingCourse={editingCourse}
                    instructors={instructors}
                    onSubmit={(e) => handleSubmit(e)}
                    onCancel={() => {
                        setFormData(emptyCourseForm);
                        setEditingCourse(null);
                        setShowForm(false);
                    }}
                    allCourses={courses}
                />
            </Modal>

            <DataLoaderState loading={loading} error={error} />

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
                    setShowForm(true);
                }}
                onDelete={async (id) => {
                    const course = courses.find(c => c.id === id);
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
                            reloadData();
                        } catch (error: any) {
                            console.error(error);
                            setError(error.message || "Cannot delete course: it has active student registrations.");
                        } finally {
                            setDeletingId(null);
                        }
                    }
                }}
                canDelete={canAccessAdmin(useAuth())}
                canEdit={canAccessAdmin(useAuth())}
            />
        </PageFrame>
    );
}