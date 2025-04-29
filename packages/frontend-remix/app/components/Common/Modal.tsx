import { XMarkIcon } from "@heroicons/react/24/solid";

export function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-md shadow-lg p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          aria-label="Close"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        {children}
      </div>
    </div>
  );
}
