import type { Course, Registration, Student } from "~/types";
import { getStudentPageData, updateStudent } from "~/loaders/students";
import { useEffect, useState } from "react";

import { DataLoaderState } from "~/components/ui/DataLoaderState";
import type { MetaFunction } from "@remix-run/node";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";
import PageSubheader from "~/components/ui/PageSubheader";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { RegisterStudentForCourseForm } from "~/components/registrations/RegisterStudentForCourseForm";
import { RegistrationsForStudentList } from "~/components/lists/RegistrationsForStudentList";
import { StudentForm } from "~/components/forms/StudentForm";
import { unregisterStudent } from "~/loaders/registrations";
import { useParams } from "@remix-run/react";

export const meta: MetaFunction = ({  }) => {
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
        .then(({ student, registrations, courses }) => {
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
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to load student data.");
        })
        .finally(() => setLoading(false));
    }
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


      <PageSubheader>Registration</PageSubheader>
      <RegisterStudentForCourseForm
        student_id={student.id}
        courses={courses}
        registrations={registrations}
        onRegister={async () => {
          reloadData()
        }}
      />

      <div className="py-4">
        <PageSubheader>Registered Courses</PageSubheader>
        <RegistrationsForStudentList
          registrations={registrations}
          unregisterAction={async (reg: Registration) => {
            await unregisterStudent(reg);
            reloadData();
          }}
        /> 
      </div>
    </PageFrame>
  );
}
