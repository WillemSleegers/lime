"use client"

import React, { useEffect, useState } from "react"

import { DataTableColumns } from "@/components/tables/databank/data-columns"
import { DataTable } from "@/components/tables/databank/data-table"
import { SelectTableColumns } from "@/components/tables/select-table-columns"

import papers from "@/assets/data/papers.json"
import studies from "@/assets/data/studies.json"
import outcomes from "@/assets/data/outcomes.json"
import interventions from "@/assets/data/interventions.json"
import effects from "@/assets/data/effects.json"

import {
  COLUMNS_DATA,
  DEFAULT_SELECTED_COLUMNS,
  STUDY_COLUMNS,
  OUTCOME_COLUMNS,
  INTERVENTION_COLUMNS,
  EFFECT_COLUMNS,
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
  const [levels, setLevels] = useState([
    "paper",
    "study",
    "intervention",
    "outcome",
  ])

  useEffect(() => {
    const newLevels = ["paper"]

    if (selectedColumns.some((r) => STUDY_COLUMNS.includes(r))) {
      newLevels.push("study")
    }

    if (selectedColumns.some((r) => INTERVENTION_COLUMNS.includes(r))) {
      newLevels.push("intervention")
    }

    if (selectedColumns.some((r) => OUTCOME_COLUMNS.includes(r))) {
      newLevels.push("outcome")
    }

    if (selectedColumns.some((r) => EFFECT_COLUMNS.includes(r))) {
      newLevels.push("effect")
    }

    if (newLevels.length != levels.length) {
      let newTableData
      newTableData = papers

      if (selectedColumns.some((r) => STUDY_COLUMNS.includes(r))) {
        newTableData = mergeArrays(newTableData, studies)
      }

      if (selectedColumns.some((r) => INTERVENTION_COLUMNS.includes(r))) {
        newTableData = mergeArrays(newTableData, interventions)
      }

      if (selectedColumns.some((r) => OUTCOME_COLUMNS.includes(r))) {
        newTableData = mergeArrays(newTableData, outcomes)
      }

      if (selectedColumns.some((r) => EFFECT_COLUMNS.includes(r))) {
        newTableData = mergeArrays(newTableData, effects)
      }

      setTableData(newTableData)
    }

    const newTableColumns = DataTableColumns.filter((column: any) => {
      return selectedColumns.includes(column.id)
    })

    setTableColumns(newTableColumns)
    setLevels(newLevels)
  }, [selectedColumns])

  return (
    <main className="container mx-auto space-y-6 py-9">
      <h1 className="text-center text-4xl font-bold">Data Explorer</h1>
      <p>
        Use the table below to explore the data. You can select and remove
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
