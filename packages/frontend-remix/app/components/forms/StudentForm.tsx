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
      <label className="flex flex-col">
        First Name <span className="text-sm text-gray-500">(required)</span>
        <input
          type="text"
          value={formData.name_first}
          onChange={(e) =>
            setFormData({ ...formData, name_first: e.target.value })
          }
          className="border p-2"
          required
        />
      </label>
      <label className="flex flex-col">
        Last Name <span className="text-sm text-gray-500">(required)</span>
        <input
          type="text"
          value={formData.name_last}
          onChange={(e) =>
            setFormData({ ...formData, name_last: e.target.value })
          }
          className="border p-2"
          required
        />
      </label>
      <label className="flex flex-col">
        Email <span className="text-sm text-gray-500">(required)</span>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2"
          required
        />
      </label>
      <label className="flex flex-col">
        Phone <span className="text-sm text-gray-500">(optional)</span>
        <input
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="border p-2"
        />
      </label>
      <label className="flex flex-col">
        Company <span className="text-sm text-gray-500">(optional)</span>
        <input
          type="text"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
          className="border p-2"
        />
      </label>
      <label className="flex flex-col md:col-span-2">
        Notes <span className="text-sm text-gray-500">(optional)</span>
        <input
          type="text"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="border p-2"
        />
      </label>
      <button type="submit" className="btn-primary py-2 px-4 rounded">
        {editingstudent_id ? "Update" : "Save"}
      </button>
    </form>
  );
}
