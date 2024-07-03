"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-columns-header"
import { round } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export type Effect = {
  effect: string
  title: string
  year: number
  effect_size: number
  intervention_aspect: string
}

export const columns: ColumnDef<Effect>[] = [
  {
    accessorKey: "effect",
    header: "Effect",
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
  },
  {
    accessorKey: "effect_size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Effect size" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("effect_size"))
      return round(amount, 2)
    },
  },
  {
    accessorKey: "intervention_aspect",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Aspect" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("intervention_aspect") as string
      const content = value.split("; ").map((e) => (
        <Badge key={e} variant="secondary">
          {e}
        </Badge>
      ))
      return <div className="flex flex-wrap gap-1">{content}</div>
    },
  },
]
