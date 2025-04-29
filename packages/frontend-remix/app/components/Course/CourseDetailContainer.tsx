import type {
  Course,
  CourseFormData,
  Instructor,
  Registration,
  Student,
} from "~/types";
import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "@remix-run/react";
import { getCoursePageData, updateCourse } from "~/loaders/courses";
import {
  registerStudentToCourse,
  unregisterStudent,
} from "~/loaders/registrations";

import { CourseForm } from "~/components/Course/CourseForm";
import { DataLoaderState } from "~/components/Common/DataLoaderState";
import { Modal } from "~/components/Common/Modal";
import { PageFrame } from "~/components/Common/PageFrame";
import { PageHeader } from "~/components/Common/PageHeader";
import { PageSubheader } from "~/components/Common/PageSubheader";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { RegisterCourseForStudentForm } from "~/components/Registration/RegisterCourseForStudentForm";
import { RegistrationsForCourseList } from "~/components/Registration/RegistrationsForCourseList";
import RenderMarkdown from "~/components/Common/RenderMarkdown";
import { canAccessAdmin } from "~/lib/permissions";
import { toast } from "react-hot-toast";
import { useAuth } from "~/root";

const emptyCourseForm: CourseFormData = {
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

export function CourseDetailContainer() {
  const { id } = useParams();
  const auth = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [unregisteredStudents, setUnregisteredStudents] = useState<Student[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>(emptyCourseForm);

  function reloadData() {
    if (!id) return;
    setLoading(true);
    setError(null);
    getCoursePageData(id)
      .then(
        ({
          course,
          instructor,
          registrations,
          unregisteredStudents,
          instructors,
          courses,
        }) => {
          setCourse(course);
          setCourses(courses);
          setInstructor(instructor);
          setInstructors(instructors);
          setRegistrations(registrations);
          setUnregisteredStudents(unregisteredStudents);
        }
      )
      .catch((err) => {
        console.error(err);
        setError("Failed to load course data " + err);
        toast.error("Failed to load course data.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reloadData();
  }, [id]);

  const openEditForm = () => {
    if (!course) return;
    setFormData({
      title: course.title ?? "",
      course_code: course.course_code ?? "",
      description: course.description ?? "",
      description_full: course.description_full ?? "",
      start_date: course.start_date ?? "",
      end_date: course.end_date ?? "",
      course_fee: course.course_fee ?? "0",
      prerequisites: course.prerequisites,
      instructor_id: course.instructor_id ?? "",
      syllabus_url: course.syllabus_url ?? "",
    });
    setShowForm(true);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!course) return;
    updateCourse(course.id, formData)
      .then(() => {
        toast.success("Course updated successfully!");
        setShowForm(false);
        reloadData();
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to update course: " + err);
        toast.error("Failed to update course.");
      });
  };

  const handleRegisterStudent = (student_id: string) => {
    if (!course) return;
    registerStudentToCourse(student_id, course.id)
      .then(() => {
        toast.success("Student registered successfully!");
        reloadData();
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to register student: " + err);
        toast.error("Failed to register student.");
      });
  };

  const handleUnregisterStudent = (reg: Registration) => {
    unregisterStudent(reg)
      .then(() => {
        toast.success("Student unregistered successfully!");
        reloadData();
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to unregister student: " + err);
        toast.error("Failed to unregister student.");
      });
  };

  return (
    <PageFrame>
      <div className="flex justify-between items-center mb-2">
        <PageHeader>
          {course?.title}
          {course?.course_code && (
            <span className="block text-base text-gray-500 my-2">
              {course.course_code}
            </span>
          )}
          {course && (
            <p className="mb-4 text-sm text-gray-500">
              {new Date(course.start_date).toLocaleDateString()} –{" "}
              {new Date(course.end_date).toLocaleDateString()}
            </p>
          )}
          {instructor && (
            <p className="mb-2 text-sm text-gray-600">
              Instructor:{" "}
              <Link
                to={`/instructors/${instructor.id}`}
                className="text-blue-600 hover:underline"
              >
                {instructor.name_first} {instructor.name_last}
              </Link>
            </p>
          )}
        </PageHeader>
      </div>

      {canAccessAdmin(auth) && course && (
        <div className="mb-4">
          <button
            onClick={openEditForm}
            className="btn-primary rounded px-4 py-2"
          >
            <PencilSquareIcon className="h-4 w-4 inline-block mr-1" />
            Edit
          </button>
        </div>
      )}

      <DataLoaderState loading={loading} error={error} />

      {course && (
        <>
          <p className="mb-1 text-xl text-gray-600">{course.description}</p>

          {course.prerequisites.length > 0 && (
            <div className="mt-6 border border-gray-300 rounded p-4">
              <h2 className="text-lg font-light text-gray-700 mb-2">
                Prerequisites
              </h2>
              {course.prerequisites.map((prereq) => (
                <p key={prereq} className="text-gray-600">
                  {prereq}
                </p>
              ))}
            </div>
          )}

          <div className="prose my-4 text-gray-700">
            <RenderMarkdown>{course.description_full}</RenderMarkdown>
          </div>

          <p className="text-xl font-light text-gray-800 mt-6">
            Course Fee: $
            {Number(course.course_fee).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <RegisterCourseForStudentForm
            course={course}
            unregisteredStudents={unregisteredStudents}
            onRegister={handleRegisterStudent}
          />

          <div className="py-4">
            <PageSubheader>Registered Students</PageSubheader>
            {registrations.length === 0 ? (
              <p className="text-gray-500 italic">No students registered.</p>
            ) : (
              <RegistrationsForCourseList
                registrations={registrations}
                unregisterAction={handleUnregisterStudent}
              />
            )}
          </div>
        </>
      )}

      {showForm && (
        <Modal isOpen onClose={() => setShowForm(false)}>
          <CourseForm
            formData={formData}
            setFormData={setFormData}
            editingCourse={course}
            instructors={instructors}
            onSubmit={handleFormSubmit}
            onCancel={() => setShowForm(false)}
            allCourses={courses}
          />
        </Modal>
      )}
    </PageFrame>
  );
}
