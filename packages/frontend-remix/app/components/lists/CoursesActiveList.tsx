import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";

import { BasicTable } from "~/components/ui/BasicTable";
import type { Course } from "~/types";
import { Link } from "@remix-run/react";
import { useMemo } from "react";

const columnHelper = createColumnHelper<Course>();

export function CoursesActiveList({
  courses,
}: {
  courses: Course[];
}) {
  const data = useMemo(() => courses, [courses]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Title",
        cell: ({ row }) => (
          <Link
            to={`/courses/${row.original.id}`}
            className="text-blue-600 hover:underline"
          >
            {row.original.title}
          </Link>
        ),
      }),
      columnHelper.accessor("instructor_name", {
        header: "Instructor",
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("start_date", {
        header: "Start Date",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      }),
      columnHelper.accessor("end_date", {
        header: "End Date",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      }),
      columnHelper.accessor("enrollment_count", {          
          header: "Enrolled",
          cell: ({ getValue }) => getValue(),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Current Courses</h2>
      <BasicTable table={table} />
    </div>
  );
}