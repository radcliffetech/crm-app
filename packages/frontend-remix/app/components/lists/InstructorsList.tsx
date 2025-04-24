import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { BasicTable } from "~/components/ui/BasicTable";
import type { ColumnDef } from "@tanstack/react-table";
import type { Instructor } from "~/types";
import { Link } from "@remix-run/react";
import { useMemo } from "react";

const columnHelper = createColumnHelper<Instructor>();

export function InstructorsList({
  instructors,
  onEdit,
  onDelete,
}: {
  instructors: Instructor[];
  onEdit: (instructor: Instructor) => void;
  onDelete: (id: string) => void;
}) {
  const columns = useMemo<ColumnDef<Instructor, unknown>[]>(() => [
    columnHelper.display({
      id: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link to={`/instructors/${row.original.id}`} className="text-blue-600 hover:underline">
          {row.original.name_first} {row.original.name_last}
        </Link>
      ),
    }),
    columnHelper.display({
      id: "email",
      header: "Email",
      cell: ({ row }) => row.original.email,
    }),
    columnHelper.display({
      id: "bio",
      header: "Bio",
      cell: ({ row }) => row.original.bio || "-",
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right flex justify-end gap-2">
          <button
            onClick={() => onEdit(row.original)}
            className="text-blue-600 hover:text-blue-800"
            aria-label="Edit Instructor"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="text-red-600 hover:text-red-800"
            aria-label="Delete Instructor"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    }),
  ], [onEdit, onDelete]);

  const table = useReactTable({
    data: instructors,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <BasicTable table={table} />;
}