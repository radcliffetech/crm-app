type SaveButtonProps = {
  isEditing: boolean;
  fullWidth?: boolean;
};

export function SaveButton({ isEditing, fullWidth = false }: SaveButtonProps) {
  return (
    <button
      type="submit"
      className={`btn-primary py-2 px-4 rounded mt-4 ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {isEditing ? "Update" : "Save"}
    </button>
  );
}
