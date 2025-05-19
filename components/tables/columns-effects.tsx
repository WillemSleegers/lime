"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./data-columns-header"
import { cn, round } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type EffectColumn = {
  effect_label: string
}

export const effectColumns: ColumnDef<EffectColumn>[] = [
  {
    accessorKey: "effect_label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Effect" />
    ),
  },
  {
    accessorKey: "effect_size_value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Effect size" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("effect_size_value"))
      return (
        <span className={cn(amount > 0 ? "text-green-600" : "text-red-700")}>
          {round(amount, 2)}
        </span>
      )
    },
  },
  {
    accessorKey: "outcome_category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Outcome category" />
    ),
  },
  {
    accessorKey: "outcome_subcategory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Outcome subcategory" />
    ),
  },
  {
    accessorKey: "outcome_measurement_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Outcome measurement" />
    ),
  },
  {
    accessorKey: "intervention_aspect",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Aspect" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("intervention_aspect") as string
      const content = value.split("; ").map((e) => (
        <Badge key={e} variant="secondary" className="whitespace-nowrap">
          {e}
        </Badge>
      ))
      return <div className="flex flex-wrap gap-1">{content}</div>
    },
  },
  {
    accessorKey: "intervention_medium",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medium" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("intervention_medium") as string
      const content = value.split("; ").map((e) => (
        <Badge key={e} variant="secondary" className="whitespace-nowrap">
          {e}
        </Badge>
      ))
      return <div className="flex flex-wrap gap-1">{content}</div>
    },
  },
  {
    accessorKey: "intervention_appeal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type of appeal" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("intervention_appeal") as string
      const content = value.split("; ").map((e) => (
        <Badge key={e} variant="secondary" className="whitespace-nowrap">
          {e}
        </Badge>
      ))
      return <div className="flex flex-wrap gap-1">{content}</div>
    },
  },
]
