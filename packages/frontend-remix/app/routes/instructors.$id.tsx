import type { Course, Instructor } from "~/types";
import { getInstructorPageData, updateInstructor } from "~/loaders/instructors";
import { useEffect, useState } from "react";

import { CoursesForInstructorList } from "~/components/lists/CoursesForInstructorList";
import { DataLoaderState } from "~/components/ui/DataLoaderState";
import { InstructorForm } from "~/components/forms/InstructorForm";
import type { MetaFunction } from "@remix-run/node";
import { Modal } from "~/components/ui/Modal";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";
import PageSubheader from "~/components/ui/PageSubheader";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { StudentsForInstructorList } from "~/components/lists/StudentsForInstructorList";
import { canAccessAdmin } from "~/lib/permissions";
import { toast } from "react-hot-toast";
import { useAuth } from "~/root";
import { useParams } from "@remix-run/react";

export const meta: MetaFunction = ({}) => {
  return [
    { title: `Instructor Detail – MiiM CRM` },
    {
      name: "description",
      content: "View instructor profile, biography, and course assignments.",
    },
  ];
};

export default function InstructorDetailPage() {
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
                onSubmit={async (e) => {
                  e.preventDefault();
                  await updateInstructor(instructor.id, formState);
                  reloadData();
                  setIsEditing(false);
                  toast.success("Instructor updated successfully!");
                }}
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
          <div className="pt-4">
            <PageSubheader>Courses Teaching</PageSubheader>
            {courses.length > 0 ? (
              <CoursesForInstructorList courses={courses} />
            ) : (
              <p className="text-gray-500 italic">No courses assigned.</p>
            )}
          </div>

          <PageSubheader>Active Students</PageSubheader>
          <StudentsForInstructorList instructor_id={instructor.id} />
        </>
      )}
    </PageFrame>
  );
}
