import type { Course, Instructor, Registration, Student } from "~/types";
import { Link, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";

import { DataLoaderState } from "~/components/ui/DataLoaderState";
import type { MetaFunction } from "@remix-run/node";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";
import { RegisterCourseForStudentForm } from "~/components/registrations/RegisterCourseForStudentForm";
import { StudentsForCourseList } from "~/components/lists/StudentsForCourseList";
import { getCoursePageData } from "~/loaders/courses";
import { marked } from "marked";
import { registerStudentToCourse } from "~/loaders/registrations";

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `Course: ${params.slug} – MiiM CRM` },
    { name: "description", content: "View course details, instructor info, and student registration." },
  ];
};


export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [unregisteredStudents, setUnregisteredStudents] = useState<Student[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function reloadData() {
    if (id) {
      setLoading(true);
      setError(null);
      getCoursePageData(id)
        .then(({ course, instructor, registrations, students, unregisteredStudents }) => {
          setCourse(course);
          setInstructor(instructor);
          setRegistrations(registrations);
          setStudents(students);
          setUnregisteredStudents(unregisteredStudents);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load course data.");
        })
        .finally(() => setLoading(false));
    }
  }

  useEffect(() => {
    reloadData();

  }, [id]);

  const registerForCourse = (student_id: string, course: Course) => {
    registerStudentToCourse(student_id, course.id).then(() => reloadData());
  }


  return (
    <PageFrame>
      <PageHeader>{course?.title}</PageHeader>
      {course && (
        <p className="mb-4 text-sm text-gray-500">
          {new Date(course.start_date).toLocaleDateString()} – {new Date(course.end_date).toLocaleDateString()}
        </p>
      )}
      {instructor && (
        <p className="mb-2 text-sm text-gray-600">
          Instructor:{" "}
          <Link to={`/instructors/${instructor.id}`} className="text-blue-600 hover:underline">
            {instructor.name_first} {instructor.name_last}
          </Link>
        </p>
      )}

      <DataLoaderState loading={loading} error={error} />

      {course && (
        <>
          <p className="mb-1 text-xl  text-gray-600">{course.description}</p>
          <div
            className="prose my-4 text-gray-700"
            dangerouslySetInnerHTML={{ __html: marked(course.description_full) }}
          />
          <p className="text-xl font-bold text-gray-800 mt-6">
            Course Fee: ${course.course_fee.toLocaleString()}
          </p>

          <div className="py-4">
            {students.length === 0 ? (
              <p className="text-gray-500 italic">No students registered.</p>
            ) : (
              <StudentsForCourseList
                course={course}
                students={students}
                registrations={registrations}
                onUnregister={reloadData}
              />
            )}
          </div>
          <RegisterCourseForStudentForm
            course={course}
            unregisteredStudents={unregisteredStudents}
            onRegister={registerForCourse}
          />
        </>)}


    </PageFrame>
  );
}