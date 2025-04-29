import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useRef, useState } from "react";

import { BasicTable } from "~/components/ui/BasicTable";
import type { ColumnDef } from "@tanstack/react-table";
import { DropdownActions } from "~/components/ui/DropdownActions";
import type { Instructor } from "~/types";
import { Link } from "@remix-run/react";

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
        cell: ({ row }) =>
          deletingId === row.original.id ? (
            <div className="flex justify-center p-2">
              <div className="h-5 w-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
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
    [onEdit, onDelete, canEdit, canDelete],
  );

  const table = useReactTable({
    data: instructors,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <BasicTable table={table} />;
}
