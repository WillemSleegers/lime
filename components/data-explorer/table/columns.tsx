"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { CheckIcon, X, LinkIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { PaperDialog } from "@/components/data-explorer/paper-dialog"
import { CellBadges } from "@/components/data-explorer/table/cell-badges"
import { CellLongText } from "@/components/data-explorer/table/cell-long-text"
import { DataTableColumnHeader } from "@/components/data-explorer/table/column-header"

import { round } from "@/lib/utils"
import { Effect, Intervention, Outcome, Paper, Sample, Study } from "@/lib/types"

export const ColumnsPapers: ColumnDef<Paper>[] = [
  {
    id: "paper_label",
    accessorKey: "paper_label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paper" />
    ),
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
  {
    id: "paper_details",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Details" />
    ),
    cell: ({ row }) => {
      return <PaperDialog row={row} variant="button" />
    },
    enableSorting: false,
  },
]

export const ColumnsStudies: ColumnDef<Study>[] = [
  {
    id: "paper_label",
    accessorKey: "paper_label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paper" />
    ),
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
      return value == "yes" ? <CheckIcon className="h-4 w-4" strokeWidth={2} /> : <X className="h-4 w-4" />
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
    cell: ({ row }) => {
      const value = row.getValue<string>("study_data_available")

      return value == "yes" ? <CheckIcon className="h-4 w-4" strokeWidth={2} /> : <X className="h-4 w-4" />
    },
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
    cell: ({ row }) => {
      const value = row.getValue<string>("study_randomization")

      return value == "yes" ? <CheckIcon className="h-4 w-4" strokeWidth={2} /> : <X className="h-4 w-4" />
    },
  },
  {
    id: "paper_details",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Details" />
    ),
    cell: ({ row }) => {
      return <PaperDialog row={row} variant="button" />
    },
    enableSorting: false,
  },
]

export const ColumnsSamples: ColumnDef<Sample>[] = [
  {
    id: "paper_label",
    accessorKey: "paper_label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paper" />
    ),
  },
  {
    id: "study",
    accessorKey: "study",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Study" />
    ),
  },
  {
    id: "sample_intervention",
    accessorKey: "sample_intervention",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sample" />
    ),
  },
  {
    id: "sample_intervention_n",
    accessorKey: "sample_intervention_n",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sample size (intervention)" />
    ),
  },
  {
    id: "sample_control_n",
    accessorKey: "sample_control_n",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sample size (control)" />
    ),
  },
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
    cell: ({ row }) => {
      const value = row.getValue<string>("sample_type")
      const content = value.split(", ").map((e) => (
        <Badge
          key={e}
          className="text-sm font-normal whitespace-nowrap bg-muted text-foreground"
        >
          {e}
        </Badge>
      ))
      return <div className="flex gap-1 flex-wrap">{content}</div>
    },
  },
  {
    id: "sample_representative",
    accessorKey: "sample_representative",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Representative" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>("sample_representative")
      return value == "yes" ? <CheckIcon className="h-4 w-4" strokeWidth={2} /> : <X className="h-4 w-4" />
    },
  },
  {
    id: "sample_description",
    accessorKey: "sample_description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>("sample_description")
      return <CellLongText value={value} />
    },
  },
  {
    id: "paper_details",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Details" />
    ),
    cell: ({ row }) => {
      return <PaperDialog row={row} variant="button" />
    },
    enableSorting: false,
  },
]

export const ColumnsInterventions: ColumnDef<Intervention>[] = [
  {
    id: "paper_label",
    accessorKey: "paper_label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paper" />
    ),
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
          className="text-sm font-normal whitespace-nowrap bg-muted text-foreground"
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
          className="text-sm font-normal whitespace-nowrap bg-muted text-foreground"
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
          className="text-sm font-normal whitespace-nowrap bg-muted text-foreground"
        >
          {e}
        </Badge>
      ))
      return <div className="flex flex-wrap gap-1">{content}</div>
    },
  },
  {
    accessorKey: "intervention_multicomponent",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Components" />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>("intervention_multicomponent")
      const label = value === "yes" ? "multicomponent" : "single-component"
      return (
        <Badge className="text-sm font-normal whitespace-nowrap bg-muted text-foreground">
          {label}
        </Badge>
      )
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
  {
    id: "paper_details",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Details" />
    ),
    cell: ({ row }) => {
      return <PaperDialog row={row} variant="button" />
    },
    enableSorting: false,
  },
]

export const ColumnsOutcomes: ColumnDef<Outcome>[] = [
  {
    id: "paper_label",
    accessorKey: "paper_label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paper" />
    ),
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
  {
    id: "paper_details",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Details" />
    ),
    cell: ({ row }) => {
      return <PaperDialog row={row} variant="button" />
    },
    enableSorting: false,
  },
]

export const ColumnsEffects: ColumnDef<Effect>[] = [
  {
    id: "paper_label",
    accessorKey: "paper_label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paper" />
    ),
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
  {
    id: "paper_details",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Details" />
    ),
    cell: ({ row }) => {
      return <PaperDialog row={row} variant="button" />
    },
    enableSorting: false,
  },
]
