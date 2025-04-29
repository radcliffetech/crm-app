import type { Course, Instructor } from "~/types";
import { FormEvent, useState } from "react";

import { CoursesForInstructorList } from "~/components/Course/CoursesForInstructorList";
import { DataLoaderState } from "~/components/Common/DataLoaderState";
import { EditButton } from "~/components/Common/EditButton";
import { EditModal } from "~/components/Common/EditModal";
import { InstructorForm } from "~/components/Instructor/InstructorForm";
import { PageFrame } from "~/components/Common/PageFrame";
import { PageHeader } from "~/components/Common/PageHeader";
import { PageSection } from "~/components/Common/PageSection";
import { StudentsForInstructorList } from "~/components/Student/StudentsForInstructorList";
import { canAccessAdmin } from "~/lib/permissions";
import { toast } from "react-hot-toast";
import { updateInstructor } from "~/loaders/instructors";
import { useAuth } from "~/root";
import { useEditState } from "~/components/Common/useEditState";
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

  const { editing, open, close } = useEditState();
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
    close();
  };

  return (
    <PageFrame>
      <DataLoaderState loading={!instructor} error={null} />
      {instructor && (
        <>
          <PageHeader>
            {instructor.name_first} {instructor.name_last}
          </PageHeader>
          {editing && (
            <EditModal open={editing} onClose={close}>
              <InstructorForm
                formData={formState}
                setFormData={setFormState}
                onSubmit={handleSubmit}
                onCancel={close}
                editingInstructor={instructor}
              />
            </EditModal>
          )}
          {!editing && (
            <>
              {canAccessAdmin(user) && (
                <EditButton loading={false} onClick={open} />
              )}
            </>
          )}

          <PageSection title="Info">
            <p className="mb-4 text-gray-600">{instructor.email}</p>
            <p className="mb-8 italic">{instructor.bio}</p>
          </PageSection>
          <PageSection title="Courses">
            {courses.length > 0 ? (
              <CoursesForInstructorList courses={courses} />
            ) : (
              <p className="text-gray-500 italic">No courses assigned.</p>
            )}
          </PageSection>
          <PageSection title="Students">
            <StudentsForInstructorList instructor_id={instructor.id} />
          </PageSection>
        </>
      )}
    </PageFrame>
  );
}
