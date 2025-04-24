import type { Course, Instructor, Registration, Student } from "~/types";
import { getRegistrationsByStudent, unregisterStudentByregistration_id } from "~/loaders/registrations";
import { getStudentPageData, updateStudent } from "~/loaders/students";
import { useEffect, useState } from "react";

import { CoursesForStudentList } from "~/components/lists/CoursesForStudentList";
import { DataLoaderState } from "~/components/ui/DataLoaderState";
import type { MetaFunction } from "@remix-run/node";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { RegisterStudentForCourseForm } from "~/components/registrations/RegisterStudentForCourseForm";
import { StudentForm } from "~/components/forms/StudentForm";
import { useParams } from "@remix-run/react";

export const meta: MetaFunction = ({ data }) => {
  return [
    {
      title: "Student Detail – MiiM CRM",
    },
    {
      name: "description",
      content: "View and manage student details, courses, and registration.",
    },
  ];
};

export default function StudentDetailPage() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name_first: "",
    name_last: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    reloadData();
  }, [id]);

  const registeredCourses = courses.filter(course =>
    registrations.some(r => r.course_id === course.id)
  );
  if (!student) return <div className="p-8"><DataLoaderState loading={loading} error={error} /></div>;

  if (editing) {
    return (
      <div className="p-8">
        <StudentForm
          formData={formData} 
          setFormData={setFormData}
          onSubmit={async (e) => {
            e.preventDefault();
            await updateStudent(student.id, formData);
            reloadData();
            setEditing(false);
          }}
          editingstudent_id={student.id}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  function reloadData() {
    if (id) {
      setLoading(true);
      setError(null);
      getStudentPageData(id)
        .then(({ student, registrations, courses, instructors }) => {
          setStudent(student);
          if (student) {
            setFormData({
              name_first: student.name_first,
              name_last: student.name_last,
              email: student.email,
              phone: student.phone || "",
              company: student.company || "",
              notes: student.notes || "",
            });
          }
          setRegistrations(registrations);
          setCourses(courses);
          setInstructors(instructors);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load student data.");
        })
        .finally(() => setLoading(false));
    }
  }

  function getInstructorName(id: string): string {
    const instructor = instructors.find(i => i.id === id);
    return instructor ? `${instructor.name_first} ${instructor.name_last} (${instructor.email})` : id;
  }

  return (
    <PageFrame>
      <PageHeader>{student.name_first} {student.name_last}</PageHeader>
      <button
        onClick={() => setEditing(true)}
        className="mb-4 px-4 py-2 btn-primary flex items-center gap-2"
      >
        <PencilSquareIcon className="h-5 w-5" />
        Edit
      </button>
      <p className="mb-2"><strong>Email:</strong> {student.email}</p>
      <p className="mb-2"><strong>Notes:</strong> {student.notes || "—"}</p>

      <RegisterStudentForCourseForm
        student_id={student.id}
        courses={courses}
        registrations={registrations}
        onRegister={async () => {
          const newRegs = await getRegistrationsByStudent(student.id);
          setRegistrations(newRegs);
        }}
      />
      <div className="py-4">
        <CoursesForStudentList
          registeredCourses={registeredCourses}
          registrations={registrations}
          student_id={student.id}
          getInstructorName={getInstructorName}
          unregisterAction={async (regId: string) => {
            await unregisterStudentByregistration_id(regId, student.id);
            reloadData();
          }}
        />
      </div>
    </PageFrame>
  );
}
