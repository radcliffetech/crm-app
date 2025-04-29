import type { Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { useState } from "react";

const ENABLE_SORTING = false;

export function BasicTable<T>({
  table,
  enableSearch = false,
}: {
  table: Table<T>;
  enableSearch?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRows = table.getRowModel().rows.filter((row) =>
    row.getVisibleCells().some((cell) =>
      String(cell.getValue() ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col gap-4">
      {enableSearch && (
        <div className="flex items-center justify-end">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="border p-2 rounded w-64"
          />
        </div>
      )}

      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-300">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`px-4 py-2 text-left ${
                    ENABLE_SORTING && header.column.getCanSort()
                      ? "cursor-pointer select-none"
                      : ""
                  }`}
                  onClick={
                    ENABLE_SORTING
                      ? header.column.getToggleSortingHandler()
                      : undefined
                  }
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {ENABLE_SORTING &&
                    ({
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted() as string] ??
                      "")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {filteredRows.map((row) => (
            <tr key={row.id} className="even:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
