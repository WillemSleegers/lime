"use client"

import React, { useState } from "react"

import { DataTableColumns } from "@/components/tables/databank/data-columns"
import { DataTable } from "@/components/tables/databank/data-table"
import { DataExplorerFilter } from "@/components/data-explorer-filter"

import data from "@/assets/data/prepared-effects.json"
import { Button } from "@/components/ui/button"

export default function DemoPage() {
  const [tableColumns, setTableColumns] = useState(DataTableColumns)
  const [tableData, setTableData] = useState(data)

  const handleDownload = () => {
    const columnNames = tableColumns.map((tableColumn) => tableColumn.id!)

    // Loop over the table data and extract values for each column
    const rowsData: string[] = []
    tableData.map((row: { [key: string]: unknown }) => {
      const rowData: string[] = []
      columnNames.forEach((columnName: string) => {
        const value = String(row[columnName])

        const escapedValue = value.includes(",") ? `"${value}"` : value
        rowData.push(escapedValue)
      })
      rowsData.push(rowData.join(", "))
    })

    const text = columnNames.join(", ") + "\n" + rowsData.join("\n")

    const element = document.createElement("a")
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(text),
    )
    element.setAttribute("download", "lime-table.csv")
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <main className="container space-y-6 py-12">
      <div className="m-auto max-w-3xl space-y-6">
        <h1 className="text-center text-4xl font-bold">Data Explorer</h1>
        <p>
          Use the table below to explore the data. You can filter out rows and
          select columns of interest using the Filter table section. You can
          also click on the labels of each paper for more information about the
          paper.
        </p>
      </div>
      <Button onClick={handleDownload} className="me-0 ms-auto block">
        Download table
      </Button>
      <DataExplorerFilter
        data={data}
        setColumns={setTableColumns}
        setData={setTableData}
      />

      <DataTable columns={tableColumns} data={tableData} />
    </main>
  )
}
