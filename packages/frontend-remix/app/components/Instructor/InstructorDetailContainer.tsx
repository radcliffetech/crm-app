import type { Course, Instructor } from "~/types";
import { FormEvent, useState } from "react";

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
import { updateInstructor } from "~/loaders/instructors";
import { useAuth } from "~/root";
import { useRevalidator } from "@remix-run/react";

type InstructorDetailContainerProps = {
  loaderData: {
    instructor: Instructor;
    courses: Course[];
  };
};

export function InstructorDetailContainer({
  loaderData,
}: InstructorDetailContainerProps) {
  const { instructor, courses } = loaderData;
  const user = useAuth();
  const { revalidate } = useRevalidator();

  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    name_first: instructor.name_first,
    name_last: instructor.name_last,
    email: instructor.email,
    bio: instructor.bio || "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateInstructor(instructor.id, formState);
    toast.success("Instructor updated successfully!");
    revalidate();
    setIsEditing(false);
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

          <div className="my-4 border border-gray-300 rounded p-4">
            <PageSubheader>Info</PageSubheader>
            <p className="mb-4 text-gray-600">{instructor.email}</p>
            <p className="mb-8 italic">{instructor.bio}</p>
          </div>
          <div className="my-4 border border-gray-300 rounded p-4">
            <PageSubheader>Courses</PageSubheader>
            {courses.length > 0 ? (
              <CoursesForInstructorList courses={courses} />
            ) : (
              <p className="text-gray-500 italic">No courses assigned.</p>
            )}
          </div>

          <div className="my-4 border border-gray-300 rounded p-4">
            <PageSubheader>Students</PageSubheader>
            <StudentsForInstructorList instructor_id={instructor.id} />
          </div>
        </>
      )}
    </PageFrame>
  );
}
