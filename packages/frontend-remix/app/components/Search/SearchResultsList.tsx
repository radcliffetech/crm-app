import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { BasicTable } from "~/components/Common/BasicTable";
import { Link } from "@remix-run/react";

type ResultRow = {
  type: string;
  label: string;
  link: string;
};

export function SearchResultsList({ results }: { results: ResultRow[] }) {
  const columnHelper = createColumnHelper<ResultRow>();

  const columns = [
    columnHelper.accessor("type", {
      header: () => "Result Type",
      enableSorting: true,
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: "label",
      header: () => "Result",
      enableSorting: true,
      cell: (info) => {
        const row = info.row.original;
        return (
          <Link to={row.link} className="text-blue-600 hover:underline">
            {row.label}
          </Link>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: results,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
  });

  return <BasicTable table={table} />;
}
