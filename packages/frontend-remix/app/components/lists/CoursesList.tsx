import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { BasicTable } from "~/components/ui/BasicTable";
import type { ColumnDef } from "@tanstack/react-table";
import type { Course } from "~/types";
import { Link } from "@remix-run/react";
import { useMemo } from "react";

const columnHelper = createColumnHelper<Course>();

export function CoursesList({
  courses,
  onEdit,
  onDelete,
}: {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
}) {
  const columns = useMemo<ColumnDef<Course, unknown>[]>(() => [
    columnHelper.display({
      id: "title",
      header: "Title",
      cell: info => (
        <Link to={`/courses/${info.row.original.id}`} className="text-blue-600 hover:underline">
          {info.row.original.title}
        </Link>
      ),
    }),
    columnHelper.accessor("instructor_name", {
      header: "Instructor",
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor("enrollment_count", {          
      header: "Enrolled",
      cell: ({ getValue }) => getValue(),
  }),
    columnHelper.display({
      id: "start_date",
      header: "Start Date",
      cell: info => new Date(info.row.original.start_date).toLocaleDateString(),
    }),
    columnHelper.display({
      id: "end_date",
      header: "End Date",
      cell: info => new Date(info.row.original.end_date).toLocaleDateString(),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: info => (
        <div className="text-right flex justify-end gap-2">
          <button
            onClick={() => onEdit(info.row.original)}
            className="text-blue-600 hover:text-blue-800"
            aria-label="Edit Course"
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(info.row.original.id)}
            className="text-red-600 hover:text-red-800"
            aria-label="Delete Course"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ),
    }),
  ], [onEdit, onDelete]);

  const table = useReactTable({
    data: courses,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <BasicTable table={table} />;
}