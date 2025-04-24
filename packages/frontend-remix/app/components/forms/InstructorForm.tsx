import type { Instructor } from "~/types";

export function InstructorForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  editingInstructor,
}: {
  formData: { name_first: string; name_last: string; email: string; bio: string };
  setFormData: React.Dispatch<React.SetStateAction<{
    name_first: string;
    name_last: string;
    email: string;
    bio: string;
  }>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  editingInstructor: Instructor | null;
}) {
  return (
    <div className="mb-6 p-6 bg-gray-50 shadow-md rounded-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">
          {editingInstructor ? `Edit ${formData.name_first} ${formData.name_last}` : "Create New Instructor"}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-3xl"
          aria-label="Cancel"
        >
          &times;
        </button>
      </div>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={formData.name_first}
          onChange={(e) => setFormData({ ...formData, name_first: e.target.value })}
          className="border p-2"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.name_last}
          onChange={(e) => setFormData({ ...formData, name_last: e.target.value })}
          className="border p-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2"
          required
        />
        <textarea
          placeholder="Bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="border p-2 md:col-span-2"
        />
          <button type="submit" className="btn-primary py-2 px-4 rounded">
          {editingInstructor ? "Update" : "Save"}
        </button>
      </form>
    </div>
  );
}