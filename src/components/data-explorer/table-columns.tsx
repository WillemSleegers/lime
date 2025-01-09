"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { CheckIcon, X, LinkIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { PaperDialog } from "@/components/paper-dialog"
import { DataTableColumnHeader } from "@/components/tables/data-columns-header"

import { round } from "@/lib/utils"
import { Button } from "../ui/button"
import { DescriptionDialog } from "./description-dialog"

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

export type ColumnsPapers = {
  paper_label: string
  paper_title: string
  paper_authors: string
  paper_year: number
  paper_type: string
  paper_source?: string
  paper_link?: string
  paper_open_access: string
}

export type ColumnsStudies = {
  paper_label: string
  study: number
  study_n: number
  study_preregistered: string
  study_pregistration_link?: string
  study_data_available: string
  study_data_link?: string
}

export type ColumnsInterventions = {
  paper_label: string
  study: number
  intervention_appeal: string
  intervention_medium: string
  intervention_aspect: string
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

export const ColumnsPapers: ColumnDef<ColumnsPapers>[] = [
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
      const value = row.getValue<string>("paper_authors")
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
    id: "paper_type",
    accessorKey: "paper_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
  },
  {
    id: "paper_source",
    accessorKey: "paper_source",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("paper_source")
      return value ? value : "-"
    },
  },
  {
    id: "paper_open_access",
    accessorKey: "paper_open_access",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Open access" />
    ),
    cell: ({ row }) => {
      return row.getValue("paper_open_access") == "yes" ? <CheckIcon /> : <X />
    },
  },
  {
    id: "paper_link",
    accessorKey: "paper_link",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("paper_link")

      if (value) {
        return (
          <Link href={value} target="_blank">
            <LinkIcon width={14} />
          </Link>
        )
      } else return "-"
    },
  },
]

export const ColumnsStudies: ColumnDef<ColumnsStudies>[] = [
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
    id: "study_preregistered",
    accessorKey: "study_preregistered",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Preregistered" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>("study_preregistered")

      return value == "yes" ? <CheckIcon strokeWidth={2} /> : <X />
    },
  },
  {
    id: "study_pregistration_link",
    accessorKey: "study_pregistration_link",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Preregistration URL" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("study_pregistration_link")

      if (value) {
        return (
          <Link href={value} target="_blank">
            <LinkIcon width={14} />
          </Link>
        )
      } else return "-"
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
]

export const ColumnsInterventions: ColumnDef<ColumnsInterventions>[] = [
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
    id: "study",
    accessorKey: "study",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Study" />
    ),
  },
  {
    id: "intervention_description",
    accessorKey: "intervention_description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Intervention" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>("intervention_description")
      const limit = 115
      return (
        <div className="min-w-64">
          <span
            className={
              value.length > limit ? "line-clamp-3" : "line-clamp-none"
            }
          >
            {value}
          </span>
          {value.length > limit && (
            <DescriptionDialog
              title="Intervention condition description"
              description={value}
            />
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "intervention_aspect",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Aspect" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("intervention_aspect") as string
      const content = value.split(", ").map((e) => (
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
    accessorKey: "intervention_medium",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medium" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("intervention_medium") as string
      const content = value.split(", ").map((e) => (
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
    accessorKey: "intervention_appeal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type of appeal" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("intervention_appeal") as string
      const content = value.split(", ").map((e) => (
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
    id: "control_description",
    accessorKey: "control_description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Control" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string | undefined>("control_description")
      if (value) {
        const limit = 115
        return (
          <div className="min-w-64">
            <span
              className={
                value.length > limit ? "line-clamp-3" : "line-clamp-none"
              }
            >
              {value}
            </span>
            {value.length > limit && (
              <DescriptionDialog
                title="Control condition description"
                description={value}
              />
            )}
          </div>
        )
      } else {
        return "-"
      }
    },
  },
]
