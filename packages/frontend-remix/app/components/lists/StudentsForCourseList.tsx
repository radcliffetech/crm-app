import type { Course, Registration, Student } from "~/types";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { BasicTable } from "~/components/ui/BasicTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "@remix-run/react";
import { unregisterStudentFromCourse } from "~/loaders/students";
import { useMemo } from "react";

const columnHelper = createColumnHelper<Student>();

export function StudentsForCourseList({
  students,
  registrations,
  course,
  onUnregister
}: {
  students: Student[];
  registrations: Registration[];
  course: Course;
  onUnregister: () => void;
}) {
  const columns = useMemo<ColumnDef<Student, unknown>[]>(() => [
    columnHelper.display({
      id: "name",
      header: "Name",
      cell: ({ row }) => (
        <Link to={`/students/${row.original.id}`} className="text-blue-600 hover:underline">
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
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <button
            onClick={async () => {
              if (window.confirm("Are you sure you want to unregister this student from the course?")) {
                await unregisterStudentFromCourse(
                  row.original.id,
                  course.id
                );
                onUnregister();
              }
            }}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Unregister
          </button>
        </div>
      ),
    }),
  ], [course.id, registrations, onUnregister]);

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <h2 className="text-xl font-semibold mb-2">Registered Students</h2>
      <BasicTable table={table} />
    </>
  );
}
