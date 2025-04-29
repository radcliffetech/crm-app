import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { BasicTable } from "~/components/ui/BasicTable";
import { Link } from "@remix-run/react";
import type { PaymentWithLabels } from "~/types/Payment";
import { useMemo } from "react";

const columnHelper = createColumnHelper<PaymentWithLabels>();

export function PaymentsList({ payments }: { payments: PaymentWithLabels[] }) {
  const data = useMemo(() => payments, [payments]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("student_name", {
        header: "Student",
        cell: ({ row }) => (
          <Link
            to={`/students/${row.original.student_id}`}
            className="text-blue-600 hover:underline"
          >
            {row.original.student_name}
          </Link>
        ),
      }),
      columnHelper.accessor("course_name", {
        header: "Course",
        cell: ({ row }) => (
          <Link
            to={`/courses/${row.original.course_id}`}
            className="text-blue-600 hover:underline"
          >
            {row.original.course_name}
          </Link>
        ),
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: ({ getValue }) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(getValue()),
      }),
      columnHelper.accessor("method", {
        header: "Method",
      }),
      columnHelper.accessor("status", {
        header: "Status",
      }),
      columnHelper.accessor("created_at", {
        header: "Created At",
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <BasicTable table={table} />;
}
