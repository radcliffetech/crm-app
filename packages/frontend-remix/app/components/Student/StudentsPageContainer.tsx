import {
  createStudent,
  deleteStudent,
  updateStudent,
} from "~/loaders/students";

import { AddButton } from "~/components/Common/AddButton";
import { DataLoaderState } from "~/components/Common/DataLoaderState";
import { EditModal } from "~/components/Common/EditModal";
import { PageFrame } from "~/components/Common/PageFrame";
import { PageHeader } from "~/components/Common/PageHeader";
import type { Student } from "~/types";
import { StudentForm } from "~/components/Student/StudentForm";
import { StudentsList } from "~/components/Student/StudentsList";
import { canAccessAdmin } from "~/lib/permissions";
import { toast } from "react-hot-toast";
import { useAuth } from "~/root";
import { useConfirmDialog } from "~/components/Common/ConfirmDialogProvider";
import { useEditState } from "~/components/Common/useEditState";
import { useState } from "react";

const initialFormData = {
  name_first: "",
  name_last: "",
  email: "",
  phone: "",
  company: "",
  notes: "",
};

type StudentsPageContainerProps = {
  loaderData: {
    students: Student[];
  };
};

export function StudentsPageContainer({
  loaderData,
}: StudentsPageContainerProps) {
  const [students, setStudents] = useState<Student[]>(loaderData.students);
  const { editing, open, close } = useEditState();
  const [formData, setFormData] = useState(initialFormData);
  const [editingstudent_id, setEditingstudent_id] = useState<string | null>(
    null
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const confirm = useConfirmDialog();
  const user = useAuth();

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingstudent_id(null);
  };

  const handleUpdateStudent = async (id: string) => {
    try {
      await updateStudent(id, formData);
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...formData } : s))
      );
      resetForm();
      toast.success("Student updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update student.");
    }
  };

  return (
    <PageFrame>
      <PageHeader>Students</PageHeader>

      {!editing && (
        <AddButton
          onClick={() => {
            resetForm();
            open();
          }}
        >
          Add
        </AddButton>
      )}

      <EditModal
        open={editing}
        onClose={() => {
          resetForm();
          close();
        }}
      >
        <StudentForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              if (editingstudent_id) {
                await handleUpdateStudent(editingstudent_id);
              } else {
                const newStudent = await createStudent(formData);
                setStudents((prev) => [...prev, newStudent]);
                toast.success("Student created successfully!");
              }
            } catch (err) {
              console.error(err);
              toast.error("Failed to create student.");
            } finally {
              resetForm();
              close();
            }
          }}
          editingstudent_id={editingstudent_id}
          onCancel={() => {
            resetForm();
            close();
          }}
        />
      </EditModal>

      <StudentsList
        students={students}
        deletingId={deletingId}
        onEdit={(student) => {
          setEditingstudent_id(student.id);
          setFormData({
            name_first: student.name_first,
            name_last: student.name_last,
            email: student.email,
            phone: student.phone || "",
            company: student.company || "",
            notes: student.notes || "",
          });
          open();
        }}
        onDelete={async (student) => {
          setDeletingId(student.id);
          const confirmed = await confirm({
            title: "Delete Student",
            description: `Are you sure you want to delete ${student.name_first} ${student.name_last}?`,
            confirmText: "Delete",
            cancelText: "Cancel",
          });
          if (!confirmed) {
            setDeletingId(null);
            return;
          }
          try {
            await deleteStudent(student.id);
            setStudents((prev) => prev.filter((s) => s.id !== student.id));
            toast.success("Student deleted successfully!");
          } catch (err) {
            console.error(err);
            toast.error("Failed to delete student.");
          } finally {
            setDeletingId(null);
          }
        }}
        canDelete={canAccessAdmin(user)}
        canEdit={canAccessAdmin(user)}
      />
    </PageFrame>
  );
}
