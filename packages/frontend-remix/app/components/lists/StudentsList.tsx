import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  type ColumnDef,
} from "@tanstack/react-table";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";
import { useMemo } from "react";
import type { Student } from "~/types";
import  { BasicTable } from "~/components/ui/BasicTable";

const columnHelper = createColumnHelper<Student>();

export function StudentsList({
  students,
  onEdit,
  onDelete,
}: {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}) {
  const columns = useMemo<ColumnDef<Student, any>[]>(() => [
    columnHelper.display({
      id: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link to={`/students/${row.original.id}`} className="text-blue-600 hover:underline">
          {row.original.name_first} {row.original.name_last}
        </Link>
      ),
    }),
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("company", {
      header: "Company",
      cell: info => info.getValue() || "-",
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
      cell: info => info.getValue() || "-",
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right flex justify-end gap-2">
          <button
            onClick={() => onEdit(row.original)}
            className="text-blue-600 hover:text-blue-800"
            aria-label="Edit Student"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(row.original)}
            className="text-red-600 hover:text-red-800"
            aria-label="Delete Student"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    }),
  ], [onEdit, onDelete]);

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <BasicTable table={table} />;
}
