import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { BasicTable } from "~/components/Common/BasicTable";
import type { ColumnDef } from "@tanstack/react-table";
import { DropdownActions } from "~/components/Common/DropdownActions";
import { EditButton } from "~/components/Common/EditButton";
import type { Instructor } from "~/types";
import { Link } from "@remix-run/react";
import { useMemo } from "react";

const columnHelper = createColumnHelper<Instructor>();

export function InstructorsList({
  instructors,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  deletingId,
}: {
  instructors: Instructor[];
  onEdit: (instructor: Instructor) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
  deletingId: string | null;
}) {
  const columns = useMemo<ColumnDef<Instructor, unknown>[]>(
    () => [
      columnHelper.display({
        id: "name",
        header: "Name",
        enableSorting: true,
        cell: ({ row }) => (
          <Link
            to={`/instructors/${row.original.id}`}
            className="text-blue-600 hover:underline"
          >
            {row.original.name_first} {row.original.name_last}
          </Link>
        ),
      }),
      columnHelper.display({
        id: "email",
        header: "Email",
        enableSorting: true,
        cell: ({ row }) => row.original.email,
      }),
      columnHelper.display({
        id: "bio",
        header: "Bio",
        enableSorting: true,
        cell: ({ row }) => row.original.bio || "-",
      }),
      columnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        enableSorting: false,
        cell: ({ row }) =>
          deletingId === row.original.id ? (
            <EditButton loading />
          ) : (
            <DropdownActions
              onEdit={() => onEdit(row.original)}
              onDelete={() => onDelete(row.original.id)}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          ),
      }),
    ],
    [onEdit, onDelete, canEdit, canDelete, deletingId]
  );

  const table = useReactTable({
    data: instructors,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: true,
  });

  return <BasicTable table={table} />;
}
