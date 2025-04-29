import type { Course, CourseFormData, Instructor, Registration, Student } from "~/types";
import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "@remix-run/react";
import { getCoursePageData, getCourses } from "~/loaders/courses";
import { getRegistrationsForCourse, registerStudentToCourse, unregisterStudent } from "~/loaders/registrations";

import { CourseForm } from "~/components/forms/CourseForm";
import { DataLoaderState } from "~/components/ui/DataLoaderState";
import type { MetaFunction } from "@remix-run/node";
import { Modal } from "~/components/ui/Modal";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";
import PageSubheader from "~/components/ui/PageSubheader";
import { RegisterCourseForStudentForm } from "~/components/registrations/RegisterCourseForStudentForm";
import { RegistrationsForCourseList } from "~/components/lists/RegistrationsForCourseList";
import RenderMarkdown from "~/components/ui/RenderMarkdown";
import { canAccessAdmin } from "~/lib/permissions";
import { emptyCourseForm } from "./courses._index";
import { getAllInstructors } from "~/loaders/instructors";
import { getAllStudents } from "~/loaders/students";
import { toast } from "react-hot-toast";
import { updateCourse } from "~/loaders/courses";
import { useAuth } from "~/root";

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `Course: ${params.slug} – MiiM CRM` },
    { name: "description", content: "View course details, instructor info, and student registration." },
  ];
};


export default function CourseDetailPage() {
  const { id } = useParams();
  const auth = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [unregisteredStudents, setUnregisteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>(emptyCourseForm);

  function reloadData() {
    if (id) {
      setLoading(true);
      setError(null);
      getCoursePageData(id)
        .then(({ course, instructor, registrations, unregisteredStudents, 
          instructors, courses }) => {
          setCourse(course);
          setCourses(courses);
          setInstructor(instructor);
          setInstructors(instructors);
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

  const openEditForm = () => {
    if (course) {
      setFormData({
        title: course.title ?? "",
        course_code: course.course_code ?? "",
        description: course.description ?? "",
        description_full: course.description_full ?? "",
        start_date: course.start_date ?? "",
        end_date: course.end_date ?? "",
        course_fee: course.course_fee ?? "0",
        prerequisites: course.prerequisites.map((prereq) => prereq.id),
        instructor_id: course.instructor_id ?? "",
        syllabus_url: course.syllabus_url ?? "",
      });
      setShowForm(true);
    }
  };

  const handleFormSubmit = (event: FormEvent, payload: CourseFormData) => {
    event.preventDefault();
    if (!course) return;
    updateCourse(course.id, {
      ...payload,
      course_fee: Number(payload.course_fee),
      prerequisites: course.prerequisites.map((prereq) => prereq.id),
    })
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

  return (
    <PageFrame>
      <div className="flex justify-between items-center mb-4">
        <PageHeader>
          {course?.title}
          {course?.course_code && (
            <span className="block text-base text-gray-500 mt-1">
              {course.course_code}
            </span>
          )}
        </PageHeader>
        {canAccessAdmin(auth) && course && (
          <button
            onClick={openEditForm}
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            Edit Course
          </button>
        )}
      </div>
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
          {course.prerequisites.length > 0 && (
            <div className="mt-6 border border-gray-300 rounded p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Prerequisites</h2>
              {course.prerequisites.map((prereq) => (
                <p key={prereq.id} className="text-gray-600">
                  {prereq.title} ({prereq.course_code})
                </p>
              ))}
            </div>
          )}
          <div
            className="prose my-4 text-gray-700">
            <RenderMarkdown>
              {course.description_full}
            </RenderMarkdown>
          </div>
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

      {showForm && formData && (
        <Modal isOpen={true} onClose={() => setShowForm(false)}>
          <CourseForm
              formData={{
                ...formData,
                prerequisites: formData.prerequisites,
              }}
              setFormData={setFormData}
              editingCourse={course}
              instructors={instructors}
              onSubmit={(e: React.FormEvent) => handleFormSubmit(e, formData)}
              onCancel={() => setShowForm(false)}
              allCourses={courses}
            />
        </Modal>
      )}

    </PageFrame>
  );
}