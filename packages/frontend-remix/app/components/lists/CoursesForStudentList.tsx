import type { Course, Registration } from "~/types";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { BasicTable } from "~/components/ui/BasicTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "@remix-run/react";
import { useMemo } from "react";

const columnHelper = createColumnHelper<Course>();

export function CoursesForStudentList({
  registeredCourses,
  registrations,
  student_id,
  getInstructorName,
  unregisterAction,
}: {
  registeredCourses: Course[];
  registrations: Registration[];
  student_id: string;
  getInstructorName: (id: string) => string;
  unregisterAction: (id: string) => Promise<void>;
}) {
  if (registeredCourses.length === 0) {
    return <p className="text-gray-500 italic">No courses registered.</p>;
  }

  const columns = useMemo<ColumnDef<Course, unknown>[]>(() => [
    columnHelper.display({
      id: "title",
      header: "Title",
      cell: ({ row }) => (
        <Link to={`/courses/${row.original.id}`} className="text-blue-600 hover:underline">
          {row.original.title}
        </Link>
      ),
    }),
    columnHelper.display({
      id: "instructor",
      header: "Instructor",
      cell: ({ row }) => getInstructorName(row.original.instructor_id),
    }),
    columnHelper.display({
      id: "start_date",
      header: "Start Date",
      cell: ({ row }) => new Date(row.original.start_date).toLocaleDateString(),
    }),
    columnHelper.display({
      id: "end_date",
      header: "End Date",
      cell: ({ row }) => new Date(row.original.end_date).toLocaleDateString(),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const reg = registrations.find(r => r.course_id === row.original.id);
        return (
          <div className="text-right flex justify-end gap-2">
            {reg && (
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to unregister this student from the course?")) {
                    unregisterAction(reg.id);
                  }
                }}
                className="text-red-600 hover:text-red-800"
                aria-label="Unregister"
              >
                Unregister
              </button>
            )}
          </div>
        );
      },
    }),
  ], [getInstructorName, registrations, unregisterAction]);

  const table = useReactTable({
    data: registeredCourses,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <h2 className="text-xl font-semibold mb-2">Registered Courses</h2>
      <BasicTable table={table} />
    </>
  );
}
