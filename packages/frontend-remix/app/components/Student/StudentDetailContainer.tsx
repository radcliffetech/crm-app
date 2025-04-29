import type { Course, Registration, Student } from "~/types";
import {
  registerStudentToCourse,
  unregisterStudent,
} from "~/loaders/registrations";

import { EditButton } from "~/components/Common/EditButton";
import { EditModal } from "~/components/Common/EditModal";
import { PageFrame } from "~/components/Common/PageFrame";
import { PageHeader } from "~/components/Common/PageHeader";
import { PageSection } from "~/components/Common/PageSection";
import { RegisterStudentForCourseForm } from "~/components/Registration/RegisterStudentForCourseForm";
import { RegistrationsForStudentList } from "~/components/Registration/RegistrationsForStudentList";
import { StudentForm } from "~/components/Student/StudentForm";
import { canAccessAdmin } from "~/lib/permissions";
import { toast } from "react-hot-toast";
import { updateStudent } from "~/loaders/students";
import { useAuth } from "~/root";
import { useEditState } from "~/components/Common/useEditState";
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

  const { editing, open, close } = useEditState();
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
        <div className="flex justify-start mb-4">
          <EditButton loading={false} onClick={open} />
        </div>
      )}

      <PageSection title="Info">
        <p className="mb-2">
          <strong>Email:</strong> {student.email}
        </p>
        <p className="mb-2">
          <strong>Notes:</strong> {student.notes || "—"}
        </p>
      </PageSection>

      {editing && (
        <EditModal open={editing} onClose={close}>
          <StudentForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await updateStudent(student.id, formData);
                toast.success("Student updated successfully!");
                revalidate();
                close();
              } catch (err) {
                console.error(err);
                toast.error("Failed to update student.");
              }
            }}
            editingstudent_id={student.id}
            onCancel={close}
          />
        </EditModal>
      )}

      <PageSection title="Registration">
        <RegisterStudentForCourseForm
          student_id={student.id}
          courses={courses}
          registrations={registrations}
          onRegister={async (courseId: string) => {
            try {
              await registerStudentToCourse(student.id, courseId);
              toast.success("Student registered successfully!");
              await revalidate();
            } catch (err: any) {
              console.error(err);

              try {
                const errorData = await err.response?.json();
                toast.error(errorData?.error || "Failed to register student.");
              } catch {
                toast.error("Failed to register student.");
              }

              throw err;
            }
          }}
        />
      </PageSection>

      <PageSection title="Registered Courses">
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
      </PageSection>
    </PageFrame>
  );
}
