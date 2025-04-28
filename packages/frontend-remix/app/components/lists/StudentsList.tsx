import { Link } from "@remix-run/react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { BasicTable } from "~/components/ui/BasicTable";
import type { Student } from "~/types";

const columnHelper = createColumnHelper<Student>();

import { DropdownActions } from "~/components/ui/DropdownActions";

export function StudentsList({
  students,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  deletingId,
}: {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  canEdit: boolean;
  canDelete: boolean;
  deletingId: string | null;
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
        deletingId === row.original.id ? (
          <div className="flex justify-center p-2">
            <div className="h-5 w-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <DropdownActions
            canEdit={canEdit}
            canDelete={canDelete}
            onEdit={() => onEdit(row.original)}
            onDelete={() => onDelete(row.original)}
          />
        )
      ),
    }),
  ], [onEdit, onDelete, canEdit, canDelete, deletingId]);

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <BasicTable table={table} />;
}
