import type { Course, Instructor } from "~/types"
import { createCourse, deleteCourse, getCoursesPageData, updateCourse } from "~/loaders/courses";
import { useEffect, useState } from "react";

import { AddButton } from "~/components/ui/AddButton";
import { CourseForm } from "~/components/forms/CourseForm";
import { CoursesList } from "~/components/lists/CoursesList";
import { DataLoaderState } from "~/components/ui/DataLoaderState";
import type { MetaFunction } from "@remix-run/node";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";
import { canAccessAdmin } from "~/lib/permissions";
import { useAuth } from "~/root";

export const meta: MetaFunction = () => {
    return [
        { title: "Courses - MiiM CRM" },
        { name: "description", content: "Browse and manage courses in the MiiM CRM application." },
    ];
};


export default function CoursesPage() {
    const user = useAuth();
    const [courses, setCourses] = useState<Course[]>([]);

    // we need instructors for the form
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        description_full: "",
        instructor_id: "",
        start_date: "",
        end_date: "",
        syllabus_url: "",
        course_fee: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                setError("Failed to load courses. " + err);
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        reloadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCourse) {
            await updateCourse(editingCourse.id, {
                ...formData,
                course_fee: Number(formData.course_fee),
            });
            reloadData();
            setEditingCourse(null);
        } else {
            const newCourse = await createCourse({
                ...formData,
                syllabus_url: formData.syllabus_url,
                course_fee: Number(formData.course_fee),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });
            setCourses((prev) => [...prev, newCourse]);
        }
        setFormData({
            title: "",
            description: "",
            description_full: "",
            instructor_id: "",
            start_date: "",
            end_date: "",
            syllabus_url: "",
            course_fee: "",
        });
        setShowForm(false);
    };

    return (
        <PageFrame>

            <PageHeader>Courses</PageHeader>
            {canAccessAdmin(user) && !showForm && (
                <AddButton onClick={() => {
                    setFormData({
                        title: "",
                        description: "",
                        description_full: "",
                        instructor_id: "",
                        start_date: "",
                        end_date: "",
                        syllabus_url: "",
                        course_fee: "",
                    });
                    setEditingCourse(null);
                    setShowForm(true);
                }}>
                    Add
                </AddButton>
            )}

            {canAccessAdmin(user) && showForm && (
                <CourseForm
                    formData={formData}
                    setFormData={setFormData}
                    editingCourse={editingCourse}
                    instructors={instructors}
                    onSubmit={handleSubmit}
                    onCancel={() => setShowForm(false)}
                />
            )}

            <DataLoaderState loading={loading} error={error} />

            <CoursesList
                courses={courses}
                onEdit={(course) => {
                    if (!canAccessAdmin(user)) return;
                    setEditingCourse(course);
                    setFormData({
                        title: course.title,
                        description: course.description,
                        description_full: course.description_full,
                        instructor_id: course.instructor_id,
                        start_date: course.start_date.split("T")[0],
                        end_date: course.end_date.split("T")[0],
                        syllabus_url: course.syllabus_url || "",
                        course_fee: course.course_fee?.toString() || "",
                    });
                    setShowForm(true);
                }}
                onDelete={async (id) => {
                    if (!canAccessAdmin(user)) return;
                    const course = courses.find(c => c.id === id);
                    if (course && window.confirm(`Are you sure you want to delete the course "${course.title}"?`)) {
                        try {
                            await deleteCourse(id);
                            reloadData();
                        } catch (error: any) {
                            console.error(error);
                            setError(error.message || "Cannot delete course: it has active student registrations.");
                        }
                    }
                }}
                canDelete={canAccessAdmin(user)}
                canEdit={canAccessAdmin(user)}
            />
        </PageFrame>
    );
}