import type { Course, Registration, Student } from "~/types";
import { getStudentPageData, updateStudent } from "~/loaders/students";
// components/Student/StudentDetailContainer.tsx
import { useEffect, useState } from "react";

import { DataLoaderState } from "~/components/Common/DataLoaderState";
import { Modal } from "~/components/Common/Modal";
import { PageFrame } from "~/components/Common/PageFrame";
import { PageHeader } from "~/components/Common/PageHeader";
import { PageSubheader } from "~/components/Common/PageSubheader";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { RegisterStudentForCourseForm } from "~/components/Registration/RegisterStudentForCourseForm";
import { RegistrationsForStudentList } from "~/components/Registration/RegistrationsForStudentList";
import { StudentForm } from "~/components/Student/StudentForm";
import { canAccessAdmin } from "~/lib/permissions";
import { toast } from "react-hot-toast";
import { unregisterStudent } from "~/loaders/registrations";
import { useAuth } from "~/root";
import { useParams } from "@remix-run/react";

export function StudentDetailContainer() {
  const user = useAuth();
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
          toast.error("Failed to load student data.");
        })
        .finally(() => setLoading(false));
    }
  }

  useEffect(() => {
    reloadData();
  }, [id]);

  if (!student) {
    return (
      <div className="p-8">
        <DataLoaderState loading={loading} error={error} />
      </div>
    );
  }

  return (
    <PageFrame>
      <PageHeader>
        {student.name_first} {student.name_last}
      </PageHeader>
      {canAccessAdmin(user) && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setEditing(true)}
            className="mb-4 px-4 py-2 btn-primary flex items-center gap-2"
          >
            <PencilSquareIcon className="h-5 w-5" />
            Edit
          </button>
        </div>
      )}
      <p className="mb-2">
        <strong>Email:</strong> {student.email}
      </p>
      <p className="mb-2">
        <strong>Notes:</strong> {student.notes || "—"}
      </p>

      {editing && (
        <Modal isOpen={editing} onClose={() => setEditing(false)}>
          <StudentForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await updateStudent(student.id, formData);
                toast.success("Student updated successfully!");
                reloadData();
                setEditing(false);
              } catch (err) {
                console.error(err);
                toast.error("Failed to update student.");
              }
            }}
            editingstudent_id={student.id}
            onCancel={() => setEditing(false)}
          />
        </Modal>
      )}

      <PageSubheader>Registration</PageSubheader>
      <RegisterStudentForCourseForm
        student_id={student.id}
        courses={courses}
        registrations={registrations}
        onRegister={async () => {
          try {
            reloadData();
            toast.success("Student registered successfully!");
          } catch (err) {
            console.error(err);
            toast.error("Failed to register student.");
          }
        }}
      />

      <div className="py-4">
        <PageSubheader>Registered Courses</PageSubheader>
        <RegistrationsForStudentList
          registrations={registrations}
          unregisterAction={async (reg: Registration) => {
            try {
              await unregisterStudent(reg);
              toast.success("Student unregistered successfully!");
              reloadData();
            } catch (err) {
              console.error(err);
              toast.error("Failed to unregister student.");
              setError("Failed to unregister student from course: " + err);
            }
          }}
        />
      </div>
    </PageFrame>
  );
}
