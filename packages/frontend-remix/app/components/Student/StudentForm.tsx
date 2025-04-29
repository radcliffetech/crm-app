import { FormField } from "~/components/Common/FormField";
import { SaveButton } from "~/components/Common/SaveButton";

type StudentFormProps = {
  formData: {
    name_first: string;
    name_last: string;
    email: string;
    phone: string;
    company: string;
    notes: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name_first: string;
      name_last: string;
      email: string;
      phone: string;
      company: string;
      notes: string;
    }>
  >;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  editingstudent_id: string | null;
  onCancel: () => void;
};

export function StudentForm({
  formData,
  setFormData,
  onSubmit,
  editingstudent_id,
}: StudentFormProps) {
  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField label="First Name" required>
        <input
          type="text"
          value={formData.name_first}
          onChange={(e) =>
            setFormData({ ...formData, name_first: e.target.value })
          }
          className="border p-2"
          required
        />
      </FormField>

      <FormField label="Last Name" required>
        <input
          type="text"
          value={formData.name_last}
          onChange={(e) =>
            setFormData({ ...formData, name_last: e.target.value })
          }
          className="border p-2"
          required
        />
      </FormField>

      <FormField label="Email" required>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2"
          required
        />
      </FormField>

      <FormField label="Phone">
        <input
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="border p-2"
        />
      </FormField>

      <FormField label="Company">
        <input
          type="text"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
          className="border p-2"
        />
      </FormField>

      <FormField label="Notes" className="md:col-span-2">
        <input
          type="text"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="border p-2"
        />
      </FormField>

      <SaveButton isEditing={editingstudent_id !== null} fullWidth />
    </form>
  );
}
