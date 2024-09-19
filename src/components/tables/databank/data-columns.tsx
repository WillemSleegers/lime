"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { CheckIcon, X, LinkIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { PaperDialog } from "@/components/paper-dialog"
import { DataTableColumnHeader } from "@/components/tables/data-columns-header"

import { round } from "@/lib/utils"

export type Column = {
  paper_label: string
  paper_title: string
  paper_authors: string
  paper_year: number
  paper_source?: string
  paper_link?: string
  paper_open_access: string
  paper_data_available?: string
  study: number
  study_n: number
  intervention_appeal: string
  intervention_medium: string
  intervention_aspect: string
  outcome_label: string
  outcome_category: string
  outcome_subcategory: string
  outcome_measurement_type: string
  sample_intervention_country: string
  effect_size_value: number
  effect_control_n: number
  effect_intervention_n: number
}

export const DataTableColumns: ColumnDef<Column>[] = [
  {
    id: "paper_label",
    accessorKey: "paper_label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paper" />
    ),
    cell: ({ row }) => {
      return <PaperDialog row={row} />
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
    id: "study_n",
    accessorKey: "study_n",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sample size" />
    ),
  },
  {
    id: "intervention_appeal",
    accessorKey: "intervention_appeal",
    header: "Intervention appeal",
    cell: ({ row }) => {
      const value = row.getValue("intervention_appeal") as string
      const content = value?.split("; ").map((e) => (
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
    id: "intervention_medium",
    accessorKey: "intervention_medium",
    header: "Intervention medium",
    cell: ({ row }) => {
      const value = row.getValue("intervention_medium") as string
      const content = value?.split("; ").map((e) => (
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
    id: "intervention_aspect",
    accessorKey: "intervention_aspect",
    header: "Intervention aspect",
    cell: ({ row }) => {
      const value = row.getValue("intervention_aspect") as string
      const content = value?.split("; ").map((e) => (
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
    id: "sample_intervention_country",
    accessorKey: "sample_intervention_country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
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
  {
    id: "effect_control_n",
    accessorKey: "effect_control_n",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sample size (control)" />
    ),
  },
  {
    id: "effect_intervention_n",
    accessorKey: "effect_intervention_n",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Sample size (intervention)"
      />
    ),
  },
]
