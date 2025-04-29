import { Link } from "@remix-run/react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { BasicTable } from "~/components/Common/BasicTable";
import type { Student } from "~/types";

const columnHelper = createColumnHelper<Student>();

import { DropdownActions } from "~/components/Common/DropdownActions";
import { EditButton } from "~/components/Common/EditButton";

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
  const columns = useMemo<ColumnDef<Student, any>[]>(
    () => [
      columnHelper.display({
        header: "Name",
        id: "name_first",
        enableSorting: true,
        cell: ({ row }) => (
          <Link
            to={`/students/${row.original.id}`}
            className="text-blue-600 hover:underline"
          >
            {row.original.name_first} {row.original.name_last}
          </Link>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        enableSorting: true,
      }),
      columnHelper.accessor("company", {
        header: "Company",
        enableSorting: true,
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("phone", {
        header: "Phone",
        enableSorting: true,
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        enableSorting: false,
        cell: ({ row }) =>
          deletingId === row.original.id ? (
            <EditButton loading={true} />
          ) : (
            <DropdownActions
              canEdit={canEdit}
              canDelete={canDelete}
              onEdit={() => onEdit(row.original)}
              onDelete={() => onDelete(row.original)}
            />
          ),
      }),
    ],
    [onEdit, onDelete, canEdit, canDelete, deletingId]
  );

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: true,
  });

  return <BasicTable table={table} />;
}
