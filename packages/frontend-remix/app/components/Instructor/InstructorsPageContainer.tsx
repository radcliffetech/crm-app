import {
  createInstructor,
  deleteInstructor,
  updateInstructor,
} from "~/loaders/instructors";

import { AddButton } from "~/components/Common/AddButton";
import { DataLoaderState } from "~/components/Common/DataLoaderState";
import { EditModal } from "~/components/Common/EditModal";
import type { Instructor } from "~/types";
import { InstructorForm } from "~/components/Instructor/InstructorForm";
import { InstructorsList } from "~/components/Instructor/InstructorsList";
import { PageFrame } from "~/components/Common/PageFrame";
import { PageHeader } from "~/components/Common/PageHeader";
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
  bio: "",
};

type InstructorsPageContainerProps = {
  loaderData: {
    instructors: Instructor[];
  };
};

export function InstructorsPageContainer({
  loaderData,
}: InstructorsPageContainerProps) {
  const user = useAuth();
  const confirm = useConfirmDialog();

  const [instructors, setInstructors] = useState<Instructor[]>(
    loaderData.instructors
  );
  const { editing, open, close } = useEditState();
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(
    null
  );
  const [formData, setFormData] = useState(initialFormData);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingInstructor(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingInstructor) {
        await updateInstructor(editingInstructor.id, formData);
        setInstructors((prev) =>
          prev.map((i) =>
            i.id === editingInstructor.id ? { ...i, ...formData } : i
          )
        );
        setEditingInstructor(null);
      } else {
        const now = new Date().toISOString();
        const newInstructor = await createInstructor({
          ...formData,
          created_at: now,
          updated_at: now,
        });
        setInstructors((prev) => [...prev, newInstructor]);
      }
      resetForm();
      close();
      toast.success("Instructor saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save instructor.");
    }
  };

  return (
    <PageFrame>
      <PageHeader>Instructors</PageHeader>

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
        <InstructorForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => {
            resetForm();
            close();
          }}
          editingInstructor={editingInstructor}
        />
      </EditModal>

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
          open();
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
              setInstructors((prev) =>
                prev.filter((i) => i.id !== instructor.id)
              );
              toast.success("Instructor deleted successfully!");
            } catch (err) {
              console.error(err);
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
