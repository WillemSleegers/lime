"use client"

import React, { useState } from "react"

import { DataTableColumns } from "@/components/tables/databank/data-columns"
import { DataTable } from "@/components/tables/databank/data-table"
import { DataExplorerFilter } from "@/components/data-explorer-filter"

import data from "@/assets/data/prepared-effects.json"

export default function DemoPage() {
  const [tableColumns, setTableColumns] = useState(DataTableColumns)
  const [tableData, setTableData] = useState(data)

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
      <DataExplorerFilter
        data={data}
        setColumns={setTableColumns}
        setData={setTableData}
      />
      <DataTable columns={tableColumns} data={tableData} />
    </main>
  )
}
