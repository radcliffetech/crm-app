import type { Course, Registration, Student } from "~/types";

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
import { updateStudent } from "~/loaders/students";
import { useAuth } from "~/root";
import { useRevalidator } from "@remix-run/react";
import { useState } from "react";

type StudentDetailContainerProps = {
  loaderData: {
    student: Student;
    registrations: Registration[];
    courses: Course[];
  };
};

export function StudentDetailContainer({
  loaderData,
}: StudentDetailContainerProps) {
  const { student, registrations, courses } = loaderData;
  const user = useAuth();
  const { revalidate } = useRevalidator();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name_first: student.name_first,
    name_last: student.name_last,
    email: student.email,
    phone: student.phone || "",
    company: student.company || "",
    notes: student.notes || "",
  });

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
                revalidate();
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
            toast.success("Student registered successfully!");
            revalidate();
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
              revalidate();
            } catch (err) {
              console.error(err);
              toast.error("Failed to unregister student.");
            }
          }}
        />
      </div>
    </PageFrame>
  );
}
