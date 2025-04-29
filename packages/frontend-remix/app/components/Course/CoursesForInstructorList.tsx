import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { BasicTable } from "~/components/Common/BasicTable";
import type { ColumnDef } from "@tanstack/react-table";
import type { Course } from "~/types";
import { Link } from "@remix-run/react";
import { useMemo } from "react";

const columnHelper = createColumnHelper<Course>();

export function CoursesForInstructorList({ courses }: { courses: Course[] }) {
  const columns = useMemo<ColumnDef<Course, unknown>[]>(
    () => [
      columnHelper.display({
        id: "title",
        header: "Title",
        enableSorting: true,
        cell: ({ row }) => (
          <Link
            to={`/courses/${row.original.id}`}
            className="text-blue-600 hover:underline"
          >
            {row.original.title}
          </Link>
        ),
      }),
      columnHelper.display({
        id: "start_date",
        header: "Start Date",
        enableSorting: true,
        cell: ({ row }) =>
          new Date(row.original.start_date).toLocaleDateString(),
      }),
      columnHelper.display({
        id: "end_date",
        header: "End Date",
        enableSorting: true,
        cell: ({ row }) => new Date(row.original.end_date).toLocaleDateString(),
      }),
      columnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        enableSorting: false,
        cell: () => <div className="text-right"></div>,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: courses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableSorting: true,
  });

  return (
    <>
      <BasicTable table={table} />
    </>
  );
}
