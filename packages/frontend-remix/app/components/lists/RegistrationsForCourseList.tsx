import type { Registration } from "~/types";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { BasicTable } from "~/components/ui/BasicTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "@remix-run/react";
import { RegistrationDropdownActions } from "../ui/RegistrationDropdownActions";
import { useMemo } from "react";

const columnHelper = createColumnHelper<Registration>();

export function RegistrationsForCourseList({
  registrations,
  unregisterAction,
}: {
  registrations: Registration[];
  unregisterAction: (reg: Registration) => void;
}) {
  const columns = useMemo<ColumnDef<Registration, unknown>[]>(
    () => [
      columnHelper.display({
        id: "name",
        header: "Name",
        cell: ({ row }) => (
          <Link
            to={`/students/${row.original.student_id}`}
            className="text-blue-600 hover:underline"
          >
            {row.original.student_name}
          </Link>
        ),
      }),
      columnHelper.display({
        id: "registration_status",
        header: "Registration",
        cell: ({ row }) => row.original.registration_status,
      }),
      columnHelper.display({
        id: "payment_status",
        header: "Payment",
        cell: ({ row }) => {
          const status = row.original.payment_status;
          return (
            <span
              className={`text-${status === "completed" ? "green" : "gray"}-600`}
            >
              {status}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <RegistrationDropdownActions
            registration={row.original}
            onUnregister={unregisterAction}
          />
        ),
      }),
    ],
    [unregisterAction]
  );

  const table = useReactTable({
    data: registrations,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <BasicTable table={table} />;
}
