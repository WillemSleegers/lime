"use client"

import React, { useEffect, useState } from "react"

import { DataTableColumns } from "@/components/tables/databank/data-columns"
import { DataTable } from "@/components/tables/databank/data-table"
import { SelectTableColumns } from "@/components/tables/select-table-columns"

import { getTableData } from "@/lib/json-functions"

const columnsData = [
  {
    value: "paper-level",
    label: "Paper-level",
    columns: [
      {
        value: "paper_title",
        label: "Title",
      },
      {
        value: "paper_authors",
        label: "Authors",
      },
      {
        value: "paper_year",
        label: "Year",
      },
      {
        value: "paper_source",
        label: "Source",
      },
      {
        value: "paper_link",
        label: "URL",
      },
      {
        value: "paper_open_access",
        label: "Open access",
      },
      {
        value: "paper_data_available",
        label: "Data available",
      },
    ],
  },
  {
    value: "outcome-level",
    label: "Outcome-level",
    columns: [
      {
        value: "outcome_label",
        label: "Outcome label",
      },
      {
        value: "outcome_category",
        label: "Outcome type",
      },
      {
        value: "outcome_subcategory",
        label: "Outcome subtype",
      },
      {
        value: "outcome_measurement_type",
        label: "Outcome measure",
      },
    ],
  },
  {
    value: "intervention-level",
    label: "Intervention-level",
    columns: [
      {
        value: "intervention_appeal",
        label: "Intervention appeal",
      },
      {
        value: "intervention_medium",
        label: "Intervention medium",
      },
      {
        value: "intervention_aspect",
        label: "Intervention aspect",
      },
    ],
  },
  {
    value: "effect-level",
    label: "Effect-level",
    columns: [
      {
        value: "effect_size_value",
        label: "Effect size",
      },
    ],
  },
]

const defaultSelectedColumns = [
  "paper_label",
  "paper_year",
  "paper_open_access",
  "paper_data_available",
  "outcome_subcategory",
  "outcome_measurement_type",
  "intervention_aspect",
  "intervention_medium",
  "intervention_appeal",
]
const defaultTableColumns = DataTableColumns.filter((column: any) =>
  defaultSelectedColumns.includes(column.id),
)
const defaultTableData = getTableData(defaultSelectedColumns)

export default function DemoPage() {
  const [selectedColumns, setSelectedColumns] = useState(defaultSelectedColumns)
  const [tableColumns, setTableColumns] = useState<any>(defaultTableColumns)
  const [tableData, setTableData] = useState(defaultTableData)

  useEffect(() => {
    const newTableColumns = DataTableColumns.filter((column: any) =>
      selectedColumns.includes(column.id),
    )
    setTableColumns(newTableColumns)
    const newTableData = getTableData(selectedColumns)

    setTableData(newTableData)
  }, [selectedColumns])

  return (
    <main className="container mx-auto space-y-6 py-9">
      <h1 className="text-center text-4xl font-bold">Databank</h1>
      <p>
        Use the table below to inspect our databank. You can select and remove
        columns with the button below. You can also click on each label in the
        Paper column to see an overview of each paper.
      </p>
      <SelectTableColumns
        data={columnsData}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
      />
      <DataTable columns={tableColumns} data={tableData} />
    </main>
  )
}
