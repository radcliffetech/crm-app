import type { Course, Instructor } from "~/types";
import { useEffect, useState } from "react";

import { CoursesForInstructorList } from "~/components/lists/CoursesForInstructorList";
import { DataLoaderState } from "~/components/ui/DataLoaderState";
import type { MetaFunction } from "@remix-run/node";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";
import { StudentsForInstructorList } from "~/components/lists/StudentsForInstructorList";
import { getInstructorPageData } from "~/loaders/instructors";
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
      <p className="mb-4 text-gray-600">{instructor.email}</p>
      <p className="mb-8 italic">{instructor.bio}</p>

      {courses.length > 0 ? (
        <CoursesForInstructorList courses={courses} />
      ) : (
        <p className="text-gray-500 italic">No courses assigned.</p>
      )}

      <StudentsForInstructorList instructor_id={instructor.id} />
      </>)}
    </PageFrame>
  );
}
