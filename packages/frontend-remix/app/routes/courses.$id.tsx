import type { Course, Instructor, Registration, Student } from "~/types";
import { Link, useParams } from "@remix-run/react";
import { registerStudentToCourse, unregisterStudent } from "~/loaders/registrations";
import { useEffect, useState } from "react";

import { DataLoaderState } from "~/components/ui/DataLoaderState";
import type { MetaFunction } from "@remix-run/node";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";
import PageSubheader from "~/components/ui/PageSubheader";
import { RegisterCourseForStudentForm } from "~/components/registrations/RegisterCourseForStudentForm";
import { RegistrationsForCourseList } from "~/components/lists/RegistrationsForCourseList";
import { getCoursePageData } from "~/loaders/courses";
import { marked } from "marked";
import { toast } from "react-hot-toast";

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
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [unregisteredStudents, setUnregisteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function reloadData() {
    if (id) {
      setLoading(true);
      setError(null);
      getCoursePageData(id)
        .then(({ course, instructor, registrations, unregisteredStudents }) => {
          setCourse(course);
          setInstructor(instructor);
          setRegistrations(registrations);
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
    registerStudentToCourse(student_id, course.id).then(() => {
      toast.success("Student registered successfully!");
      reloadData();
    }).catch((err) => {
      console.error(err);
      setError("Failed to register student for course: " + err);
      toast.error("Failed to register student for course.");
    });
  }

  return (
    <PageFrame>
      <PageHeader>
        {course?.title}
        {course?.course_code && (
          <span className="block text-base text-gray-500 mt-1">
            {course.course_code}
          </span>
        )}
      </PageHeader>
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
            <PageSubheader>Registered Students</PageSubheader>
            {registrations.length === 0 ? (
              <p className="text-gray-500 italic">No students registered.</p>
            ) : (
              <RegistrationsForCourseList
                course={course}
                registrations={registrations}
                unregisterAction={(reg: Registration) => {
                  unregisterStudent(reg).then(() => {
                    toast.success("Student unregistered successfully!");
                    reloadData();
                  }).catch((err) => {
                    console.error(err);
                    setError("Failed to unregister student: " + err);
                  });
                }}  
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