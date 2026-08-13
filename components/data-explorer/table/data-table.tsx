"use client"

import {
  ColumnDef,
  flexRender,
  useTable,
  RowData,
  SortingState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { features } from "@/components/data-explorer/table/table-features"

type TableLike = {
  state: { pagination: { pageIndex: number; pageSize: number } }
}

function rowCountMessage(table: TableLike, filtered: number, total: number): string {
  if (filtered === 0) return "No rows match"
  const { pageIndex, pageSize } = table.state.pagination
  const start = pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, filtered)
  const range = start === end ? `${start}` : `${start}–${end}`
  if (filtered === total) return `Showing ${range} of ${total}`
  return `Showing ${range} of ${filtered} (filtered from ${total})`
}

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<typeof features, TData>[]
  data: TData[]
  totalRows: number
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  totalRows,
}: DataTableProps<TData>) {
  // TanStack Table holds state internally that React Compiler can't track —
  // memoizing this component caches stale `table` references on sort/paginate.
  "use no memo"
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useTable({
    features,
    data,
    columns,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-wrap justify-center min-[575px]:justify-between w-full items-center gap-x-4 gap-y-2">
        <div className="text-sm">{rowCountMessage(table, data.length, totalRows)}</div>
        <div className="flex gap-x-4 items-center">
          <div className="flex items-center space-x-2 justify-center">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex rounded-lg"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 rounded-lg"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft />
            </Button>
            <div className="text-sm text-center sm:text-left">
              Page {table.state.pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 rounded-lg"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex rounded-lg"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2 justify-center sm:justify-end">
          <p className="text-sm">Rows per page</p>
          <Select
            value={`${table.state.pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-20 rounded-lg">
              <SelectValue placeholder={table.state.pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top" className="rounded-lg">
              {[10, 25, 50, 100, 200].map((pageSize) => (
                <SelectItem
                  key={pageSize}
                  value={`${pageSize}`}
                  className="rounded-lg"
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-2xl border bg-card w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted">
                {headerGroup.headers.map((header, index) => {
                  const isFirst = index === 0
                  const isLast = index === headerGroup.headers.length - 1
                  return (
                    <TableHead
                      className={`whitespace-nowrap text-foreground ${
                        isFirst ? "rounded-tl-2xl" : ""
                      } ${isLast ? "rounded-tr-2xl" : ""}`}
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-transparent">
                  {row.getAllCells().map((cell) => (
                    <TableCell className="p-3" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
