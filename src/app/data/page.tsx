"use client"

import React, { useEffect, useState } from "react"

import { DataTableColumns } from "@/components/tables/databank/data-columns"
import { DataTable } from "@/components/tables/databank/data-table"
import { SelectTableColumns } from "@/components/tables/select-table-columns"

import papers from "@/assets/data/papers.json"
import outcomes from "@/assets/data/outcomes.json"
import interventions from "@/assets/data/interventions.json"
import effects from "@/assets/data/effects.json"

import {
  COLUMNS_DATA,
  DEFAULT_SELECTED_COLUMNS,
  EFFECT_COLUMNS,
  INTERVENTION_COLUMNS,
  OUTCOME_COLUMNS,
} from "@/lib/constants"
import { mergeArrays } from "@/lib/json-functions"

const defaultTableColumns = DataTableColumns.filter((column: any) =>
  DEFAULT_SELECTED_COLUMNS.includes(column.id),
)
let defaultTableData = mergeArrays(papers, outcomes)
defaultTableData = mergeArrays(defaultTableData, interventions)

export default function DemoPage() {
  const [selectedColumns, setSelectedColumns] = useState(
    DEFAULT_SELECTED_COLUMNS,
  )
  const [tableColumns, setTableColumns] = useState<any>(defaultTableColumns)
  const [tableData, setTableData] = useState(defaultTableData)

  useEffect(() => {
    let newTableData
    newTableData = papers

    if (selectedColumns.some((r) => INTERVENTION_COLUMNS.includes(r))) {
      newTableData = mergeArrays(newTableData, interventions)
    }

    if (selectedColumns.some((r) => OUTCOME_COLUMNS.includes(r))) {
      newTableData = mergeArrays(newTableData, outcomes)
    }

    if (selectedColumns.some((r) => EFFECT_COLUMNS.includes(r))) {
      newTableData = mergeArrays(newTableData, effects)
    }

    const newTableColumns = DataTableColumns.filter((column: any) => {
      return selectedColumns.includes(column.id)
    })

    setTableColumns(newTableColumns)
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
        data={COLUMNS_DATA}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
      />
      <DataTable columns={tableColumns} data={tableData} />
    </main>
  )
}
