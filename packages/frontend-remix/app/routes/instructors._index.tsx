import {
  createInstructor,
  deleteInstructor,
  getAllInstructors,
  updateInstructor,
} from "~/loaders/instructors";
import { useEffect, useState } from "react";

import { AddButton } from "~/components/ui/AddButton";
import { DataLoaderState } from "~/components/ui/DataLoaderState";
import type { Instructor } from "~/types";
import { InstructorForm } from "~/components/forms/InstructorForm";
import { InstructorsList } from "~/components/lists/InstructorsList";
import type { MetaFunction } from "@remix-run/node";
import { Modal } from "~/components/ui/Modal";
import { PageFrame } from "~/components/ui/PageFrame";
import { PageHeader } from "~/components/ui/PageHeader";
import { canAccessAdmin } from "~/lib/permissions";
import { toast } from "react-hot-toast";
import { useAuth } from "~/root";
import { useConfirmDialog } from "~/components/ConfirmDialogProvider";

export const meta: MetaFunction = () => {
  return [
    { title: "Instructors - MiiM CRM" },
    {
      name: "description",
      content:
        "Manage instructor profiles and view their associated course information.",
    },
  ];
};

export default function InstructorsPage() {
  const user = useAuth();
  const confirm = useConfirmDialog();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name_first: "",
    name_last: "",
    email: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function reloadData() {
    setLoading(true);
    setError(null);
    getAllInstructors()
      .then((instructors) => {
        setInstructors(instructors);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load instructors.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reloadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (editingInstructor) {
        await updateInstructor(editingInstructor.id, {
          ...formData,
        });
        setEditingInstructor(null);
      } else {
        const now = new Date().toISOString();
        await createInstructor({
          ...formData,
          created_at: now,
          updated_at: now,
        });
      }
      reloadData();
      setFormData({ name_first: "", name_last: "", email: "", bio: "" });
      setShowForm(false);
      toast.success("Instructor saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save instructor " + err);
      toast.error("Failed to save instructor.");
    }
  };

  return (
    <PageFrame>
      <PageHeader>Instructors</PageHeader>
      {!showForm && (
        <AddButton
          onClick={() => {
            setShowForm(true);
            setEditingInstructor(null);
            setFormData({ name_first: "", name_last: "", email: "", bio: "" });
          }}
        >
          Add
        </AddButton>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => {
          setFormData({ name_first: "", name_last: "", email: "", bio: "" });
          setEditingInstructor(null);
          setShowForm(false);
        }}
      >
        <InstructorForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormData({ name_first: "", name_last: "", email: "", bio: "" });
            setEditingInstructor(null);
            setShowForm(false);
          }}
          editingInstructor={editingInstructor}
        />
      </Modal>
      <DataLoaderState loading={loading} error={error} />
      <InstructorsList
        instructors={instructors}
        deletingId={deletingId}
        onEdit={(instructor) => {
          setEditingInstructor(instructor);
          setFormData({
            name_first: instructor.name_first,
            name_last: instructor.name_last,
            email: instructor.email,
            bio: instructor.bio || "",
          });
          setShowForm(true);
        }}
        onDelete={async (id) => {
          const instructor = instructors.find((i) => i.id === id);
          if (instructor) {
            setDeletingId(id);
            const confirmed = await confirm({
              title: "Delete Instructor",
              description: `Are you sure you want to delete ${instructor.name_first} ${instructor.name_last}?`,
              confirmText: "Delete",
              cancelText: "Cancel",
            });
            if (!confirmed) {
              setDeletingId(null);
              return;
            }
            try {
              await deleteInstructor(id);
              reloadData();
              toast.success("Instructor deleted successfully!");
            } catch (err) {
              console.error(err);
              setError("Failed to delete instructor " + err);
              toast.error("Failed to delete instructor.");
            } finally {
              setDeletingId(null);
            }
          }
        }}
        canEdit={canAccessAdmin(user)}
        canDelete={canAccessAdmin(user)}
      />
    </PageFrame>
  );
}
