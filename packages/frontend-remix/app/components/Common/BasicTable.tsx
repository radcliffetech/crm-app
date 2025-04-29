import type { Table } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

export function BasicTable<T>({ table }: { table: Table<T> }) {
  return (
    <table className="min-w-full border border-gray-200">
      <thead className="bg-gray-300">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="px-4 py-2 text-left cursor-pointer select-none"
                onClick={header.column.getToggleSortingHandler()}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
                {{
                  asc: " 🔼",
                  desc: " 🔽",
                }[header.column.getIsSorted() as string] ?? ""}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
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
  );
}
