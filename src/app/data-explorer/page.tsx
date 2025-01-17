"use client"

import React, { useState } from "react"

import { InfoIcon } from "lucide-react"

import {
  ColumnsPapers,
  ColumnsInterventions,
  ColumnsStudies,
  ColumnsOutcomes,
  ColumnsEffects,
} from "@/components/data-explorer/table-columns"
import { DataTable } from "@/components/data-explorer/table"
import {
  FilterOutcomes,
  FilterInterventions,
  FilterPapers,
  FilterStudies,
  FilterEffects,
} from "@/components/data-explorer/filters"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import papers from "@/assets/data/papers.json"
import studies from "@/assets/data/studies.json"
import interventions from "@/assets/data/interventions.json"
import outcomes from "@/assets/data/outcomes.json"
import effects from "@/assets/data/effects.json"

export default function DataExplorer() {
  const [level, setLevel] = useState("paper")
  const [dataPaperLevel, setDataPaperLevel] = useState(papers)
  const [dataStudyLevel, setDataStudyLevel] = useState(studies)
  const [dataInterventionLevel, setDataInterventionLevel] =
    useState(interventions)
  const [dataOutcomeLevel, setDataOutcomeLevel] = useState(outcomes)
  const [dataEffectLevel, setDataEffectLevel] = useState(effects)

  const handleDownload = () => {
    //const columnNames = tableColumns.map((tableColumn) => tableColumn.id!)
    // Loop over the table data and extract values for each column
    // const rowsData: string[] = []
    // tableData.map((row: { [key: string]: unknown }) => {
    //   const rowData: string[] = []
    //   columnNames.forEach((columnName: string) => {
    //     const value = String(row[columnName])
    //     const escapedValue = value.includes(",") ? `"${value}"` : value
    //     rowData.push(escapedValue)
    //   })
    //   rowsData.push(rowData.join(", "))
    // })
    // const text = columnNames.join(", ") + "\n" + rowsData.join("\n")
    // const element = document.createElement("a")
    // element.setAttribute(
    //   "href",
    //   "data:text/csv;charset=utf-8," + encodeURIComponent(text),
    // )
    // element.setAttribute("download", "lime-table.csv")
    // element.style.display = "none"
    // document.body.appendChild(element)
    // element.click()
    // document.body.removeChild(element)
  }

  return (
    <main className="container space-y-6 py-12">
      <h1 className="text-center text-4xl font-bold">Data Explorer</h1>
      <Tabs defaultValue={level} className="space-y-6">
        <div className="mx-auto flex w-fit items-center gap-3">
          <TabsList className="rounded-full bg-primary text-white">
            <TabsTrigger
              className="rounded-full"
              value="paper"
              onClick={() => setLevel("paper")}
            >
              Paper-level
            </TabsTrigger>
            <TabsTrigger
              className="rounded-full"
              value="study"
              onClick={() => setLevel("study")}
            >
              Study-level
            </TabsTrigger>
            <TabsTrigger
              className="rounded-full"
              value="intervention"
              onClick={() => setLevel("intervention")}
            >
              Intervention-level
            </TabsTrigger>
            <TabsTrigger className="rounded-full" value="outcome">
              Outcome-level
            </TabsTrigger>
            <TabsTrigger className="rounded-full" value="effect">
              Effect-level
            </TabsTrigger>
          </TabsList>

          <Dialog>
            <DialogTrigger asChild>
              <InfoIcon className="stroke-bg-primary h-6 w-6 hover:cursor-pointer hover:text-primary" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Data explorer help</DialogTitle>
                <DialogDescription>
                  Use the table below to explore the data. You can filter out
                  rows and select columns of interest using the Filter table
                  section. You can also click on the labels of each paper for
                  more information about the paper.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="paper" className="space-y-3" tabIndex={-1}>
          <FilterPapers data={papers} setData={setDataPaperLevel} />
          <div>
            Showing {dataPaperLevel.length} out of {papers.length} rows.
          </div>
          <DataTable columns={ColumnsPapers} data={dataPaperLevel} />
        </TabsContent>
        <TabsContent value="study" className="space-y-3" tabIndex={-1}>
          <FilterStudies data={studies} setData={setDataStudyLevel} />
          <div>
            Showing {dataStudyLevel.length} out of {studies.length} rows.
          </div>
          <DataTable columns={ColumnsStudies} data={dataStudyLevel} />
        </TabsContent>
        <TabsContent value="intervention" className="space-y-3" tabIndex={-1}>
          <FilterInterventions
            data={interventions}
            setData={setDataInterventionLevel}
          />
          <div>
            Showing {dataInterventionLevel.length} out of {interventions.length}{" "}
            rows.
          </div>
          <DataTable
            columns={ColumnsInterventions}
            data={dataInterventionLevel}
          />
        </TabsContent>
        <TabsContent value="outcome" className="space-y-3" tabIndex={-1}>
          <FilterOutcomes data={outcomes} setData={setDataOutcomeLevel} />
          <div>
            Showing {dataOutcomeLevel.length} out of {outcomes.length} rows.
          </div>
          <DataTable columns={ColumnsOutcomes} data={dataOutcomeLevel} />
        </TabsContent>
        <TabsContent value="effect" className="space-y-3" tabIndex={-1}>
          <FilterEffects data={effects} setData={setDataEffectLevel} />
          <div>
            Showing {dataEffectLevel.length} out of {effects.length} rows.
          </div>
          <DataTable columns={ColumnsEffects} data={dataEffectLevel} />
        </TabsContent>
      </Tabs>

      <Button
        onClick={handleDownload}
        className="rounded-full bg-primary text-white"
      >
        Download table
      </Button>
    </main>
  )
}
