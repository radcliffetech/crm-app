import type {
  Course,
  CourseFormData,
  Instructor,
  Registration,
  Student,
} from "~/types";
import { FormEvent, useState } from "react";
import { Link, useRevalidator } from "@remix-run/react";

import { CourseForm } from "~/components/Course/CourseForm";
import { DataLoaderState } from "~/components/Common/DataLoaderState";
import { Modal } from "~/components/Common/Modal";
import { PageFrame } from "~/components/Common/PageFrame";
import { PageHeader } from "~/components/Common/PageHeader";
import { PageSubheader } from "~/components/Common/PageSubheader";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { RegistrationsForCourseList } from "~/components/Registration/RegistrationsForCourseList";
import RenderMarkdown from "~/components/Common/RenderMarkdown";
import { canAccessAdmin } from "~/lib/permissions";
import { toast } from "react-hot-toast";
import { unregisterStudent } from "~/loaders/registrations";
import { updateCourse } from "~/loaders/courses";
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

type CourseDetailContainerProps = {
  loaderData: {
    course: Course;
    instructor: Instructor | null;
    registrations: Registration[];
    unregisteredStudents: Student[];
    instructors: Instructor[];
    courses: Course[];
  };
};

export function CourseDetailContainer({
  loaderData,
}: CourseDetailContainerProps) {
  const {
    course,
    instructor,
    registrations,
    unregisteredStudents,
    instructors,
    courses,
  } = loaderData;
  const auth = useAuth();
  const { revalidate } = useRevalidator();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>(emptyCourseForm);

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
        revalidate();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update course.");
      });
  };

  const handleUnregisterStudent = (reg: Registration) => {
    unregisterStudent(reg)
      .then(() => {
        toast.success("Student unregistered successfully!");
        revalidate();
      })
      .catch((err) => {
        console.error(err);
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

      {canAccessAdmin(auth) && (
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

      <DataLoaderState loading={false} error={null} />

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

          <div className="prose my-4 text-gray-700  border border-gray-300 rounded p-4">
            <RenderMarkdown>{course.description_full}</RenderMarkdown>
          </div>

          <p className="text-xl font-light text-gray-800 mt-4  border border-gray-300 rounded p-4">
            <h2 className="text-lg font-light text-gray-700 mb-2">
              Course Fee
            </h2>
            $
            {Number(course.course_fee).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <div className="my-4 border border-gray-300 rounded p-4">
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
