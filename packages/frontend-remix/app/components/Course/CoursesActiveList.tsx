import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { BasicTable } from "~/components/Common/BasicTable";
import type { Course } from "~/types";
import { Link } from "@remix-run/react";
import { useMemo } from "react";

const columnHelper = createColumnHelper<Course>();

export function CoursesActiveList({ courses }: { courses: Course[] }) {
  const data = useMemo(() => courses, [courses]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "title",
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
      columnHelper.display({
        id: "instructor_name",
        header: "Instructor",
        cell: ({ row }) => row.original.instructor_name,
      }),
      columnHelper.display({
        id: "start_date",
        header: "Start Date",
        cell: ({ row }) =>
          new Date(row.original.start_date).toLocaleDateString(),
      }),
      columnHelper.display({
        id: "end_date",
        header: "End Date",
        cell: ({ row }) => new Date(row.original.end_date).toLocaleDateString(),
      }),
      columnHelper.display({
        id: "enrollment_count",
        header: "Enrolled",
        cell: ({ row }) => row.original.enrollment_count,
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <BasicTable table={table} />;
}
