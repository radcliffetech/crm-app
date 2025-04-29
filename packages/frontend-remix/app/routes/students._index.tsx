import {
  createStudent,
  deleteStudent,
  getAllStudents,
  updateStudent,
} from "~/loaders/students";
import { useEffect, useState } from "react";

import { AddButton } from "~/components/ui/AddButton";
import { DataLoaderState } from "~/components/ui/DataLoaderState";
import type { MetaFunction } from "@remix-run/node";
import { Modal } from "~/components/ui/Modal";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";
import type { Student } from "~/types";
import { StudentForm } from "~/components/forms/StudentForm";
import { StudentsList } from "~/components/lists/StudentsList";
import { canAccessAdmin } from "~/lib/permissions";
import { toast } from "react-hot-toast";
import { useAuth } from "~/root";
import { useConfirmDialog } from "~/components/ConfirmDialogProvider";

export const meta: MetaFunction = () => {
  return [
    { title: "Students - MiiM CRM" },
    {
      name: "description",
      content: "Manage and view student records in the MiiM CRM platform.",
    },
  ];
};

const initialFormData = {
  name_first: "",
  name_last: "",
  email: "",
  phone: "",
  company: "",
  notes: "",
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [editingstudent_id, setEditingstudent_id] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const confirm = useConfirmDialog();

  function reloadData() {
    setLoading(true);
    setError(null);
    getAllStudents()
      .then(setStudents)
      .catch((err) => {
        console.error(err);
        setError("Failed to load students.");
      })
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    reloadData();
  }, []);

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingstudent_id(null);
  };

  const handleUpdateStudent = async (id: string) => {
    try {
      await updateStudent(id, formData);
      reloadData();
      resetForm();
      toast.success("Student updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update student " + err);
      toast.error("Failed to update student.");
    }
  };

  return (
    <PageFrame>
      <PageHeader>Students</PageHeader>
      {!showForm && (
        <AddButton
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          Add
        </AddButton>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => {
          setFormData(initialFormData);
          setEditingstudent_id(null);
          setShowForm(false);
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
              setShowForm(false);
            }
          }}
          editingstudent_id={editingstudent_id}
          onCancel={() => {
            setFormData(initialFormData);
            setEditingstudent_id(null);
            setShowForm(false);
          }}
        />
      </Modal>

      <DataLoaderState loading={loading} error={error} />

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
          setShowForm(true);
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
            reloadData();
            toast.success("Student deleted successfully!");
          } catch (err) {
            console.error(err);
            setError("Failed to delete student " + err);
            toast.error("Failed to delete student.");
          } finally {
            setDeletingId(null);
          }
        }}
        canDelete={canAccessAdmin(useAuth())}
        canEdit={canAccessAdmin(useAuth())}
      />
    </PageFrame>
  );
}
