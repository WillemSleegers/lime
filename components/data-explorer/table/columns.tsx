"use client"

import Link from "next/link"
import { Column, ColumnDef } from "@tanstack/react-table"
import { CheckIcon, X, LinkIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { PaperDialog } from "@/components/data-explorer/paper-dialog"
import { CellBadges } from "@/components/data-explorer/table/cell-badges"
import { CellLongText } from "@/components/data-explorer/table/cell-long-text"
import { DataTableColumnHeader } from "@/components/data-explorer/table/column-header"

import { round } from "@/lib/utils"
import { Effect, Intervention, Outcome, Paper, Sample, Study } from "@/lib/types"

// ── Shared column definitions ────────────────────────────────────────────────

const paperLabelColumn = {
  id: "paper_label",
  accessorKey: "paper_label" as const,
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Paper" />
  ),
}

const studyColumn = {
  id: "study",
  accessorKey: "study" as const,
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Study" />
  ),
}

const detailsColumn = {
  id: "paper_details",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Details" />
  ),
  cell: ({ row }: { row: { original: unknown } }) => <PaperDialog row={row as never} variant="button" />,
  enableSorting: false,
}

// ── Cell helpers ─────────────────────────────────────────────────────────────

const cellYesNo = (value: string) =>
  value === "yes" ? <CheckIcon className="h-4 w-4" strokeWidth={2} /> : <X className="h-4 w-4" />

const cellCommaList = (value: string) => (
  <div className="flex flex-wrap gap-1">
    {value.split(", ").map((e) => (
      <Badge key={e} className="text-sm font-normal whitespace-nowrap bg-muted text-foreground">
        {e}
      </Badge>
    ))}
  </div>
)

// ── Column definitions ───────────────────────────────────────────────────────

export const ColumnsPapers: ColumnDef<Paper>[] = [
  paperLabelColumn,
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
    cell: ({ row }) => {
      const value = row.getValue<string>("paper_title")
      return <CellLongText value={value} />
    },
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
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.getValue("paper_type")}</span>
    ),
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
      return row.getValue("paper_open_access") == "open access" ? <CheckIcon className="h-4 w-4" /> : <X className="h-4 w-4" />
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
            <LinkIcon className="h-4 w-4" />
          </Link>
        )
      } else return "-"
    },
  },
  detailsColumn,
]

export const ColumnsStudies: ColumnDef<Study>[] = [
  paperLabelColumn,
  studyColumn,
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
    cell: ({ row }) => cellYesNo(row.getValue<string>("study_preregistered")),
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
            <LinkIcon className="h-4 w-4" />
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
    cell: ({ row }) => cellYesNo(row.getValue<string>("study_data_available")),
  },
  {
    id: "study_design",
    accessorKey: "study_design",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Design" />
    ),
  },
  {
    id: "study_condition_assignment",
    accessorKey: "study_condition_assignment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Condition assignment" />
    ),
  },
  {
    id: "study_randomization",
    accessorKey: "study_randomization",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Randomization" />
    ),
    cell: ({ row }) => cellYesNo(row.getValue<string>("study_randomization")),
  },
  detailsColumn,
]

export const ColumnsSamples: ColumnDef<Sample>[] = [
  paperLabelColumn,
  studyColumn,
  {
    id: "sample_country",
    accessorKey: "sample_country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
  },
  {
    id: "sample_type",
    accessorKey: "sample_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => cellCommaList(row.getValue<string>("sample_type")),
  },
  {
    id: "sample_representative",
    accessorKey: "sample_representative",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Representative" />
    ),
    cell: ({ row }) => cellYesNo(row.getValue<string>("sample_representative")),
  },
  detailsColumn,
]

export const ColumnsInterventions: ColumnDef<Intervention>[] = [
  paperLabelColumn,
  studyColumn,
  {
    id: "condition",
    accessorKey: "intervention_condition",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Condition" />
    ),
  },
  {
    id: "intervention_description",
    accessorKey: "intervention_description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>("intervention_description")
      return <CellLongText value={value} />
    },
  },
  {
    accessorKey: "intervention_mechanism",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mechanism" />
    ),
    cell: ({ row }) => cellCommaList(row.getValue<string>("intervention_mechanism")),
  },
  {
    accessorKey: "intervention_medium",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medium" />
    ),
    cell: ({ row }) => cellCommaList(row.getValue<string>("intervention_medium")),
  },
  {
    accessorKey: "intervention_mechanism_multicomponent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mechanism multicomponent" />
    ),
    cell: ({ row }) => cellYesNo(row.getValue<string>("intervention_mechanism_multicomponent")),
  },
  {
    accessorKey: "intervention_medium_multicomponent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medium multicomponent" />
    ),
    cell: ({ row }) => cellYesNo(row.getValue<string>("intervention_medium_multicomponent")),
  },
  detailsColumn,
]

export const ColumnsOutcomes: ColumnDef<Outcome>[] = [
  paperLabelColumn,
  studyColumn,
  {
    id: "outcome",
    accessorKey: "outcome",
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
    cell: ({ row }) => {
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
  detailsColumn,
]

export const ColumnsEffects: ColumnDef<Effect>[] = [
  paperLabelColumn,
  studyColumn,
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
    cell: ({ row }) => round(row.getValue<number>("effect_size"), 2),
  },
  {
    id: "effect_size_var",
    accessorKey: "effect_size_var",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Effect variance" />
    ),
    cell: ({ row }) => round(row.getValue<number>("effect_size_var"), 2),
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
    cell: ({ row }) => round(row.getValue<number>("effect_intervention_n"), 2),
  },
  {
    id: "effect_control_n",
    accessorKey: "effect_control_n",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sample size (control)" />
    ),
    cell: ({ row }) => round(row.getValue<number>("effect_control_n"), 2),
  },
  detailsColumn,
]
