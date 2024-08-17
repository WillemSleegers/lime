"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "../data-columns-header"
import { round } from "@/lib/utils"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { PaperDialog } from "@/components/paper-dialog"
import Link from "next/link"
import { CheckIcon, X, LinkIcon } from "lucide-react"

export type Column = {
  paper_label: string
  paper_authors: string
  paper_title: string
  paper_year: number
  paper_source: string
  paper_link: string
  paper_open_access: string
  paper_data_available: string
  study: number
  outcome_label: string
  effect_size_value: number
}

export const DataTableColumns: ColumnDef<Column>[] = [
  {
    id: "paper_label",
    accessorKey: "paper_label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paper" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("paper_label") as string
      return <PaperDialog trigger={value} title={value} />
    },
  },
  {
    id: "paper_authors",
    accessorKey: "paper_authors",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Authors" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("paper_authors") as string
      const content = value.split("; ").map((e) => (
        <Badge
          key={e}
          variant="secondary"
          className="whitespace-nowrap text-sm font-normal"
        >
          {e}
        </Badge>
      ))
      return <div className="flex flex-wrap gap-1">{content}</div>
    },
  },
  {
    id: "paper_title",
    accessorKey: "paper_title",
    header: ({ column }) => (
      <DataTableColumnHeader
        className="min-w-96"
        column={column}
        title="Title"
      />
    ),
  },
  {
    id: "paper_year",
    accessorKey: "paper_year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Year" />
    ),
  },
  {
    id: "paper_source",
    accessorKey: "paper_source",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" />
    ),
  },
  {
    id: "paper_link",
    accessorKey: "paper_link",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("paper_link") as string

      if (value)
        return (
          <Link href={value} target="_blank">
            <LinkIcon width={14} />
          </Link>
        )
    },
  },
  {
    id: "paper_open_access",
    accessorKey: "paper_open_access",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Open access" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("paper_open_access") as string

      return value == "yes" ? <CheckIcon strokeWidth={2} /> : <X />
    },
  },
  {
    id: "paper_data_available",
    accessorKey: "paper_data_available",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data available" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("paper_data_available") as string

      return value == "yes" ? <CheckIcon strokeWidth={2} /> : <X />
    },
  },
  {
    id: "study",
    accessorKey: "study",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Study" />
    ),
  },
  {
    id: "intervention_appeal",
    accessorKey: "intervention_appeal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Intervention appeal" />
    ),
  },
  {
    id: "intervention_medium",
    accessorKey: "intervention_medium",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Intervention medium" />
    ),
  },
  {
    id: "intervention_aspect",
    accessorKey: "intervention_aspect",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Intervention aspect" />
    ),
  },
  {
    id: "outcome_label",
    accessorKey: "outcome_label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Outcome" />
    ),
  },
  {
    id: "outcome_category",
    accessorKey: "outcome_category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Outcome type" />
    ),
  },
  {
    id: "outcome_subcategory",
    accessorKey: "outcome_subcategory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Outcome subtype" />
    ),
  },
  {
    id: "outcome_measurement_type",
    accessorKey: "outcome_measurement_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Outcome measure" />
    ),
  },
  {
    id: "effect_size_value",
    accessorKey: "effect_size_value",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Effect size" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("effect_size_value"))
      return round(amount, 2)
    },
  },
]
