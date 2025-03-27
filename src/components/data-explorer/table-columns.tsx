"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { CheckIcon, X, LinkIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { PaperDialog } from "@/components/paper-dialog"
import { DataTableColumnHeader } from "@/components/data-explorer/table-header"
import { DescriptionDialog } from "@/components/data-explorer/description-dialog"

import { round } from "@/lib/utils"
import { CellBadges } from "./cell-badges"
import { CellLongText } from "./cell-long-text"

export type ColumnsPapers = {
  paper_label: string
  paper_title: string
  paper_authors: string
  paper_year: number
  paper_type: string
  paper_source?: string
  paper_open_access: string
  paper_link?: string
}

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
      <DataTableColumnHeader className="" column={column} title="Authors" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>("paper_authors")
      return <CellBadges value={value} />
    },
  },
  {
    id: "paper_title",
    accessorKey: "paper_title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
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
    cell: ({ row }) => {
      return (
        <span className="whitespace-nowrap">{row.getValue("paper_type")}</span>
      )
    },
  },
  {
    id: "paper_source",
    accessorKey: "paper_source",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>("paper_source")
      return <span className="whitespace-nowrap">{value ? value : "-"}</span>
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

export type ColumnsStudies = {
  paper_label: string
  study: number
  study_n: number
  study_preregistered: string
  study_pregistration_link?: string
  study_data_available: string
  study_data_link?: string
}

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
    id: "study_data_available",
    accessorKey: "study_data_available",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data available" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>("study_data_available")

      return value == "yes" ? <CheckIcon strokeWidth={2} /> : <X />
    },
  },
]

export type ColumnsInterventions = {
  paper_label: string
  study: number
  intervention_description: string
  intervention_content: string
  intervention_mechanism: string
  intervention_medium: string
  control_description?: string
}

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
      return <CellLongText value={value} />
    },
  },
  {
    accessorKey: "intervention_content",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Content" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>("intervention_content")
      const content = value.split(", ").map((e) => (
        <Badge
          key={e}
          variant="secondary"
          className="text-sm font-normal whitespace-nowrap"
        >
          {e}
        </Badge>
      ))
      return <div className="flex flex-wrap gap-1">{content}</div>
    },
  },
  {
    accessorKey: "intervention_mechanism",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mechanism" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>("intervention_mechanism")
      const content = value.split(", ").map((e) => (
        <Badge
          key={e}
          variant="secondary"
          className="text-sm font-normal whitespace-nowrap"
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
      const value = row.getValue<string>("intervention_medium")
      const content = value.split(", ").map((e) => (
        <Badge
          key={e}
          variant="secondary"
          className="text-sm font-normal whitespace-nowrap"
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
        return <CellLongText value={value} />
      } else {
        return "-"
      }
    },
  },
]

export type ColumnsOutcomes = {
  paper_label: string
  study: number
  outcome_label: string
  outcome_description: string
  outcome_category: string
  outcome_subcategory: string
  outcome_measurement_type: string
}

export const ColumnsOutcomes: ColumnDef<ColumnsOutcomes>[] = [
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
    id: "outcome_label",
    accessorKey: "outcome_label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Outcome" />
    ),
  },
  {
    id: "outcome_description",
    accessorKey: "outcome_description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row, column }) => {
      const value = row.getValue<string>("outcome_description")
      return <CellLongText value={value} />
    },
  },
  {
    id: "outcome_category",
    accessorKey: "outcome_category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
  },
  {
    id: "outcome_subcategory",
    accessorKey: "outcome_subcategory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subcategory" />
    ),
  },
  {
    id: "outcome_measurement_type",
    accessorKey: "outcome_measurement_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Measure" />
    ),
  },
]

export type ColumnsEffects = {
  paper_label: string
  study: number
  //effect_size_name: string
  effect_size: number
  effect_size_var: number
  effect_intervention_n: number
  effect_control_n: number
}

export const ColumnsEffects: ColumnDef<ColumnsEffects>[] = [
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
  // {
  //   id: "effect_size_name",
  //   accessorKey: "effect_size_name",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Type" />
  //   ),
  // },
  {
    id: "effect_size",
    accessorKey: "effect_size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Effect size" />
    ),
    cell: ({ row }) => {
      return round(row.getValue<number>("effect_size"), 2)
    },
  },
  {
    id: "effect_size_var",
    accessorKey: "effect_size_var",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Effect variance" />
    ),
    cell: ({ row }) => {
      return round(row.getValue<number>("effect_size_var"), 2)
    },
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
    cell: ({ row }) => {
      return round(row.getValue<number>("effect_intervention_n"), 2)
    },
  },
  {
    id: "effect_control_n",
    accessorKey: "effect_control_n",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sample size (control)" />
    ),
    cell: ({ row }) => {
      return round(row.getValue<number>("effect_control_n"), 2)
    },
  },
]
