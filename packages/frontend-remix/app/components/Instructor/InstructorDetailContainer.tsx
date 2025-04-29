import type { Course, Instructor } from "~/types";
// components/Instructor/InstructorDetailContainer.tsx
import { FormEvent, useEffect, useState } from "react";
import { getInstructorPageData, updateInstructor } from "~/loaders/instructors";

import { CoursesForInstructorList } from "~/components/Course/CoursesForInstructorList";
import { DataLoaderState } from "~/components/Common/DataLoaderState";
import { InstructorForm } from "~/components/Instructor/InstructorForm";
import { Modal } from "~/components/Common/Modal";
import { PageFrame } from "~/components/Common/PageFrame";
import { PageHeader } from "~/components/Common/PageHeader";
import { PageSubheader } from "~/components/Common/PageSubheader";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { StudentsForInstructorList } from "~/components/Student/StudentsForInstructorList";
import { canAccessAdmin } from "~/lib/permissions";
import { toast } from "react-hot-toast";
import { useAuth } from "~/root";
import { useParams } from "@remix-run/react";

export function InstructorDetailContainer() {
  const { id } = useParams();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    name_first: "",
    name_last: "",
    email: "",
    bio: "",
  });
  const user = useAuth();

  function reloadData() {
    if (id) {
      getInstructorPageData(id).then(({ instructor, courses }) => {
        setInstructor(instructor);
        setCourses(courses);
        setFormState({
          name_first: instructor.name_first,
          name_last: instructor.name_last,
          email: instructor.email,
          bio: instructor.bio || "",
        });
      });
    }
  }

  useEffect(() => {
    reloadData();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!instructor) return;
    await updateInstructor(instructor.id, formState);
    reloadData();
    setIsEditing(false);
    toast.success("Instructor updated successfully!");
  };

  return (
    <PageFrame>
      <DataLoaderState loading={!instructor} error={null} />
      {instructor && (
        <>
          <PageHeader>
            {instructor.name_first} {instructor.name_last}
          </PageHeader>
          {isEditing && (
            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
              <InstructorForm
                formData={formState}
                setFormData={setFormState}
                onSubmit={handleSubmit}
                onCancel={() => setIsEditing(false)}
                editingInstructor={instructor}
              />
            </Modal>
          )}
          {!isEditing && (
            <>
              <p className="mb-4 text-gray-600">{instructor.email}</p>
              <p className="mb-8 italic">{instructor.bio}</p>
              {canAccessAdmin(user) && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mb-4 px-4 py-2 btn-primary flex items-center gap-2"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                  Edit
                </button>
              )}
            </>
          )}
          <div className="py-4">
            <PageSubheader>Courses</PageSubheader>
            {courses.length > 0 ? (
              <CoursesForInstructorList courses={courses} />
            ) : (
              <p className="text-gray-500 italic">No courses assigned.</p>
            )}
          </div>

          <PageSubheader>Students</PageSubheader>
          <StudentsForInstructorList instructor_id={instructor.id} />
        </>
      )}
    </PageFrame>
  );
}
