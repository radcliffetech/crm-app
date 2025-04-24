import { PlusIcon } from "@heroicons/react/24/solid";

export function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="btn-primary mb-4 flex items-center gap-2"
    >
      <PlusIcon className="h-5 w-5 text-white" />
      {children}
    </button>
  );
}
