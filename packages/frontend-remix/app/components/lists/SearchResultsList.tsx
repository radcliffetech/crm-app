import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { BasicTable } from "~/components/ui/BasicTable";
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
      cell: info => info.getValue(),
    }),
    columnHelper.display({
      id: "label",
      header: () => "Result",
      cell: info => {
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
  });

  return <BasicTable table={table} />;
}
