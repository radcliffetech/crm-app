import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { BasicTable } from "~/components/ui/BasicTable";
import type { ColumnDef } from "@tanstack/react-table";
import type { Course } from "~/types";
import { DropdownActions } from "~/components/ui/DropdownActions";
import { Link } from "@remix-run/react";
import { useMemo } from "react";

const columnHelper = createColumnHelper<Course>();

export function CoursesList({
  courses,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  deletingId,
}: {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
  deletingId: string | null;
}) {
  const columns = useMemo<ColumnDef<Course, unknown>[]>(
    () => [
      columnHelper.display({
        id: "title",
        header: "Title",
        cell: (info) => (
          <Link
            to={`/courses/${info.row.original.id}`}
            className="text-blue-600 hover:underline"
          >
            {info.row.original.title}
          </Link>
        ),
      }),
      columnHelper.display({
        id: "course_code",
        header: "Course Code",
        cell: (info) => info.row.original.course_code,
      }),
      columnHelper.display({
        id: "instructor_name",
        header: "Instructor",
        cell: ({ row }) => row.original.instructor_name,
      }),
      columnHelper.display({
        id: "enrollment_count",
        header: "Enrolled",
        cell: ({ row }) => row.original.enrollment_count,
      }),
      columnHelper.display({
        id: "start_date",
        header: "Start Date",
        cell: (info) =>
          new Date(info.row.original.start_date).toLocaleDateString(),
      }),
      columnHelper.display({
        id: "end_date",
        header: "End Date",
        cell: (info) =>
          new Date(info.row.original.end_date).toLocaleDateString(),
      }),
      columnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: (info) =>
          deletingId === info.row.original.id ? (
            <div className="flex justify-center p-2">
              <div className="h-5 w-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <DropdownActions
              canEdit={canEdit}
              canDelete={canDelete}
              onEdit={() => onEdit(info.row.original)}
              onDelete={() => onDelete(info.row.original.id)}
            />
          ),
      }),
    ],
    [onEdit, onDelete, canEdit, canDelete, deletingId],
  );

  const table = useReactTable({
    data: courses,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <BasicTable table={table} />;
}
