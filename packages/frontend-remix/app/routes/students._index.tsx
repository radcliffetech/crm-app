import { createStudent, deleteStudent, getAllStudents, updateStudent } from "~/loaders/students";
import { useEffect, useState } from "react";

import { AddButton } from "~/components/ui/AddButton";
import { DataLoaderState } from "~/components/ui/DataLoaderState";
import type { MetaFunction } from "@remix-run/node";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";
import type { Student } from "~/types";
import { StudentForm } from "~/components/forms/StudentForm";
import { StudentsList } from "~/components/lists/StudentsList";
import { canAccessAdmin } from "~/lib/permissions";
import { useAuth } from "~/root";

export const meta: MetaFunction = () => {
  return [
    { title: "Students - MiiM CRM" },
    { name: "description", content: "Manage and view student records in the MiiM CRM platform." },
  ];
};

const initialFormData = {
  name_first: "",
  name_last: "",
  email: "",
  phone: "",
  company: "",
  notes: "",
}

export default function StudentsPage() {
  const user = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name_first: "",
    name_last: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });
  const [editingstudent_id, setEditingstudent_id] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function reloadData() {
    setLoading(true);
    setError(null);
    getAllStudents()
      .then(setStudents)
      .catch((err) => {
        console.error(err);
        setError("Failed to load students " + err);
      })
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    reloadData();
  }, []);

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingstudent_id(null);
  }

  const handleUpdateStudent = async (id: string) => {
    try {
    await updateStudent(id, formData);
    reloadData();
    resetForm();
    } catch (err) {
      console.error(err);
      setError("Failed to update student " + err);
    }
  };

  return (
    <PageFrame>
      <PageHeader>Students</PageHeader>
      {canAccessAdmin(user) && !showForm && (
        <AddButton
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          Add
        </AddButton>
      )}

      {showForm && (
        <StudentForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={async (e) => {
            e.preventDefault();
            if (editingstudent_id) {
              await handleUpdateStudent(editingstudent_id);
            } else {
              const newStudent = await createStudent(formData);
              setStudents((prev) => [...prev, newStudent]);
            }
            setShowForm(false);
          }}
          editingstudent_id={editingstudent_id}
          onCancel={() => setShowForm(false)}
        />
      )}

      <DataLoaderState loading={loading} error={error} />

      <StudentsList
        students={students}
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
          if (window.confirm(`Are you sure you want to delete ${student.name_first} ${student.name_last}?`)) {
            try {
            await deleteStudent(student.id);
            reloadData();
            } catch (err) {
              console.error(err);
              setError("Failed to delete student " + err);
            }
          }
        }}
      />
    </PageFrame>
  );
}
