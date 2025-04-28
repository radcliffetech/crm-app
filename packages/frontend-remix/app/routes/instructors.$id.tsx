import type { Course, Instructor } from "~/types";
import { useEffect, useState } from "react";

import { CoursesForInstructorList } from "~/components/lists/CoursesForInstructorList";
import { DataLoaderState } from "~/components/ui/DataLoaderState";
import type { MetaFunction } from "@remix-run/node";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";
import PageSubheader from "~/components/ui/PageSubheader";
import { StudentsForInstructorList } from "~/components/lists/StudentsForInstructorList";
import { canAccessAdmin } from "~/lib/permissions";
import { toast } from "react-hot-toast";
import { useAuth } from "~/root";
import { useParams } from "@remix-run/react";

export const meta: MetaFunction = ({ }) => {
  return [
    { title: `Instructor Detail – MiiM CRM` },
    { name: "description", content: "View instructor profile, biography, and course assignments." },
  ];
};


export default function InstructorDetailPage() {
  const { id } = useParams();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  function reloadData() {
    if (id) {
    getInstructorPageData(id).then(({ instructor, courses }) => {
      setInstructor(instructor);
      setCourses(courses);
    });
  }
  }
  useEffect(() => {
    reloadData();
  }, [id]);


  return (
    <PageFrame>
      <DataLoaderState loading={!instructor} error={null} />
      {instructor && (<>
        <PageHeader>
          {instructor.name_first} {instructor.name_last}
        </PageHeader>
        {canAccessAdmin(user) && isEditing ? (
          <div className="mb-4 space-y-2">
            <input
              type="text"
              name="name_first"
              value={formState.name_first}
              onChange={handleInputChange}
              placeholder="First Name"
              className="w-full border rounded px-2 py-1"
            />
            <input
              type="text"
              name="name_last"
              value={formState.name_last}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="w-full border rounded px-2 py-1"
            />
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full border rounded px-2 py-1"
            />
            <textarea
              name="bio"
              value={formState.bio}
              onChange={handleInputChange}
              placeholder="Bio"
              className="w-full border rounded px-2 py-1"
              rows={4}
            />
            <button
              onClick={async (e) => {
                try {
                  await updateInstructor(instructor.id, formState);
                  reloadData();
                  setIsEditing(false);
                  toast.success("Instructor updated successfully!");
                } catch (error) {
                  toast.error("Failed to update instructor.");
                }
              }}
              className="px-4 py-2 btn-primary"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="ml-2 px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
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
        <div className="pt-4" >
          <PageSubheader>Courses Teaching</PageSubheader>
          {courses.length > 0 ? (
            <CoursesForInstructorList courses={courses} />
          ) : (
            <p className="text-gray-500 italic">No courses assigned.</p>
          )}
        </div>

    <PageSubheader>Active Students</PageSubheader>
      <StudentsForInstructorList instructor_id={instructor.id} />
      </>)}
    </PageFrame>
  );
}
