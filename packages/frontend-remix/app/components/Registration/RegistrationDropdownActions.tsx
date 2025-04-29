import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

import type { Registration } from "~/types";

export function RegistrationDropdownActions({
  registration,
  onUnregister,
}: {
  registration: Registration;
  onUnregister: (reg: Registration) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (registration.registration_status !== "registered") {
    return null;
  }

  return (
    <div className="relative text-right" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-600 hover:text-gray-800"
        aria-label="Actions"
      >
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-md z-10">
          <button
            onClick={async () => {
              if (
                window.confirm(
                  "Are you sure you want to unregister this student from the course?",
                )
              ) {
                await onUnregister(registration);
              }
              setOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
          >
            <TrashIcon className="h-4 w-4" />
            Unregister
          </button>
        </div>
      )}
    </div>
  );
}
