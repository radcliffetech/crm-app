import { PencilSquareIcon } from "@heroicons/react/24/solid";

type EditButtonProps = {
  loading?: boolean;
  onClick?: () => void;
};

export function EditButton({ loading = false, onClick }: EditButtonProps) {
  if (loading) {
    return (
      <div className="flex justify-center p-2">
        <div className="h-5 w-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="btn-primary flex items-center gap-2 px-4 py-2 rounded"
      type="button"
    >
      <PencilSquareIcon className="h-4 w-4" />
      Edit
    </button>
  );
}
