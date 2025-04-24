import type { Course, Registration, Student } from "~/types";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

import { BasicTable } from "~/components/ui/BasicTable";
import { Link } from "@remix-run/react";
import { getStudentsForInstructor } from "~/loaders/students";

const columnHelper = createColumnHelper<Student>();

export function StudentsForInstructorList({ instructor_id }: { instructor_id: string }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  useEffect(() => {
    getStudentsForInstructor(instructor_id).then(({ students, registrations, courses  }) => {
      setStudents(students);
      setRegistrations(registrations);
      setAllCourses(courses);
    });
  }, [instructor_id]);

  const columns = useMemo(() => [
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
      id: "courses",
      header: "Enrolled In",
      cell: ({ row }) => {
        const enrolledCourses = allCourses
          .filter(course => course.instructor_id === instructor_id)
          .filter(course =>
            registrations.some(r => r.course_id === course.id && r.student_id === row.original.id)
          )
          .map(course => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="text-blue-600 hover:underline"
            >
              {course.title}
            </Link>
          ))
          .map((el, idx, arr) => (
            <span key={idx}>
              {el}
              {idx < arr.length - 1 ? ", " : ""}
            </span>
          ));
        return <>{enrolledCourses}</>;
      },
    }),
  ], [allCourses, instructor_id, registrations]);

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (students.length === 0) {
    return <p className="text-gray-500 italic">No students enrolled with this instructor.</p>;
  }

  return (
    <>

      <BasicTable table={table} />
    </>
  );
}
