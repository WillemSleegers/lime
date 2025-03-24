"use client"

import React, { useEffect, useState } from "react"

import { InfoIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

import papers from "@/assets/data/papers.json"
import studies from "@/assets/data/studies.json"
import interventions from "@/assets/data/interventions.json"
import outcomes from "@/assets/data/outcomes.json"
import effects from "@/assets/data/effects.json"
import all from "@/assets/data/data.json"

import { semiJoin } from "@/lib/json-functions"

export default function DataExplorer() {
  const [level, setLevel] = useState("paper")

  const [dataPaper, setDataPaper] = useState(papers)
  const [dataStudy, setDataStudy] = useState(studies)
  const [dataIntervention, setDataIntervention] = useState(interventions)
  const [dataOutcome, setDataOutcome] = useState(outcomes)
  const [dataEffect, setDataEffect] = useState(effects)

  // Rename to dataTable
  const [dataPaperLevel, setDataPaperLevel] = useState(papers)
  const [dataStudyLevel, setDataStudyLevel] = useState(studies)
  const [dataInterventionLevel, setDataInterventionLevel] =
    useState(interventions)
  const [dataOutcomeLevel, setDataOutcomeLevel] = useState(outcomes)
  const [dataEffectLevel, setDataEffectLevel] = useState(effects)

  // Track lock toggles
  const [lockPapers, setLockPapers] = useState(false)
  const [lockStudies, setLockStudies] = useState(false)
  const [lockInterventions, setLockInterventions] = useState(false)
  const [lockOutcomes, setLockOutcomes] = useState(false)
  const [lockEffects, setLockEffects] = useState(false)

  const [shouldHandleLocks, setShouldHandleLocks] = useState(false)

  const handleDownload = (
    data:
      | typeof papers
      | typeof studies
      | typeof interventions
      | typeof outcomes
      | typeof effects
      | typeof all,
    fileName: string
  ) => {
    const columnNames = Object.keys(data[0])
    // Loop over the data and extract values for each column
    const rowsData: string[] = []
    data.map((row: { [key: string]: unknown }) => {
      const rowData: string[] = []
      columnNames.forEach((columnName: string) => {
        const value = String(row[columnName])
        const escapedValue = value.includes(",") ? `"${value}"` : value
        rowData.push(escapedValue)
      })
      rowsData.push(rowData.join(","))
    })
    const text = columnNames.join(",") + "\n" + rowsData.join("\n")
    const element = document.createElement("a")
    element.setAttribute(
      "href",
      "data:text/csv;charset=utf-8," + encodeURIComponent(text)
    )
    element.setAttribute("download", fileName)
    element.style.display = "none"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  useEffect(() => {
    if (shouldHandleLocks) {
      let lockedDataPapers = dataPaper
      let lockedDataStudies = dataStudy
      let lockedDataInterventions = dataIntervention
      let lockedDataOutcomes = dataOutcome
      let lockedDataEffects = dataEffect

      if (lockPapers) {
        lockedDataStudies = semiJoin(lockedDataStudies, dataPaper, "paper")
        lockedDataInterventions = semiJoin(
          lockedDataInterventions,
          dataPaper,
          "paper"
        )
        lockedDataOutcomes = semiJoin(lockedDataOutcomes, dataPaper, "paper")
        lockedDataEffects = semiJoin(lockedDataEffects, dataPaper, "paper")
      }

      if (lockStudies) {
        lockedDataPapers = semiJoin(lockedDataPapers, dataStudy, "paper")
        lockedDataInterventions = semiJoin(lockedDataInterventions, dataStudy, [
          "paper",
          "study",
        ])
        lockedDataOutcomes = semiJoin(lockedDataOutcomes, dataStudy, [
          "paper",
          "study",
        ])
        lockedDataEffects = semiJoin(lockedDataEffects, dataStudy, [
          "paper",
          "study",
        ])
      }

      if (lockInterventions) {
        lockedDataPapers = semiJoin(lockedDataPapers, dataIntervention, "paper")
        lockedDataStudies = semiJoin(lockedDataStudies, dataIntervention, [
          "paper",
          "study",
        ])
        lockedDataOutcomes = semiJoin(lockedDataOutcomes, dataIntervention, [
          "paper",
          "study",
        ])
        lockedDataEffects = semiJoin(lockedDataEffects, dataIntervention, [
          "paper",
          "study",
        ])
      }

      if (lockOutcomes) {
        lockedDataPapers = semiJoin(lockedDataPapers, dataOutcome, "paper")
        lockedDataStudies = semiJoin(lockedDataStudies, dataOutcome, [
          "paper",
          "study",
        ])
        lockedDataInterventions = semiJoin(
          lockedDataInterventions,
          dataOutcome,
          ["paper", "study"]
        )
        lockedDataEffects = semiJoin(lockedDataEffects, dataOutcome, [
          "paper",
          "study",
        ])
      }

      if (lockEffects) {
        lockedDataPapers = semiJoin(lockedDataPapers, dataEffect, "paper")
        lockedDataStudies = semiJoin(lockedDataStudies, dataEffect, [
          "paper",
          "study",
        ])
        lockedDataInterventions = semiJoin(
          lockedDataInterventions,
          dataEffect,
          ["paper", "study"]
        )
        lockedDataOutcomes = semiJoin(lockedDataOutcomes, dataEffect, [
          "paper",
          "study",
        ])
      }

      setDataPaperLevel(lockedDataPapers)
      setDataStudyLevel(lockedDataStudies)
      setDataInterventionLevel(lockedDataInterventions)
      setDataOutcomeLevel(lockedDataOutcomes)
      setDataEffectLevel(lockedDataEffects)
    }

    setShouldHandleLocks(false)
  }, [shouldHandleLocks])

  return (
    <main className="container space-y-6 my-12 md:my-16">
      <h1 className="text-center text-4xl font-bold">Data Explorer</h1>
      <Tabs defaultValue={level} className="space-y-6">
        <div className="mx-auto flex w-fit flex-wrap items-center justify-center gap-3">
          <TabsList className="flex h-auto flex-wrap items-center gap-1 rounded-full bg-white p-0 align-middle text-white min-[509px]:bg-primary">
            <TabsTrigger
              className="rounded-3xl border-4 border-primary bg-primary text-white"
              value="paper"
              onClick={() => setLevel("paper")}
            >
              Papers
            </TabsTrigger>
            <TabsTrigger
              className="rounded-3xl border-4 border-primary bg-primary text-white"
              value="study"
              onClick={() => setLevel("study")}
            >
              Studies
            </TabsTrigger>
            <TabsTrigger
              className="rounded-3xl border-4 border-primary bg-primary text-white"
              value="intervention"
              onClick={() => setLevel("intervention")}
            >
              Interventions
            </TabsTrigger>
            <TabsTrigger
              className="rounded-3xl border-4 border-primary bg-primary text-white"
              value="outcome"
              onClick={() => setLevel("outcome")}
            >
              Outcomes
            </TabsTrigger>
            <TabsTrigger
              className="rounded-3xl border-4 border-primary bg-primary text-white"
              value="effect"
              onClick={() => setLevel("effect")}
            >
              Effects
            </TabsTrigger>
          </TabsList>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-32 rounded-3xl" variant="outline">
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-3xl p-2">
              <DropdownMenuItem
                className="rounded-xl"
                onClick={() => handleDownload(papers, "lime-papers.csv")}
              >
                Papers
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl"
                onClick={() => handleDownload(studies, "lime-studies.csv")}
              >
                Studies
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl"
                onClick={() =>
                  handleDownload(interventions, "lime-interventions.csv")
                }
              >
                Interventions
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl"
                onClick={() => handleDownload(outcomes, "lime-outcomes.csv")}
              >
                Outcomes
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl"
                onClick={() => handleDownload(effects, "lime-effects.csv")}
              >
                Effects
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-xl"
                onClick={() => handleDownload(all, "lime-data.csv")}
              >
                All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog>
            <DialogTrigger asChild>
              <InfoIcon className="h-6 w-6 hover:cursor-pointer hover:text-muted-foreground" />
            </DialogTrigger>
            <DialogContent className="max-h-full max-w-3xl overflow-auto">
              <DialogHeader>
                <DialogTitle>Data Explorer Help</DialogTitle>
              </DialogHeader>
              <p>
                The Data Explorer provides access to LIME&apos;s comprehensive
                database of intervention studies focused on reducing animal
                product consumption. This tool allows you to explore detailed
                information across multiple levels of research data, organized
                into easy-to-navigate tables.
              </p>
              <p>
                Navigate between different levels using the tabs at the top to
                explore:
              </p>
              <ul className="ms-6 list-disc">
                <li>
                  Papers: Access publication details, authors, and open access
                  status
                </li>
                <li>Studies: Examine sample sizes and preregistrations</li>
                <li>
                  Interventions: Discover the various techniques and approaches
                  tested
                </li>
                <li>
                  Outcomes: Review different measurement methods and approaches
                </li>
                <li>
                  Effects: Analyze effect sizes of different types of
                  comparisons
                </li>
              </ul>
              <p>
                Each table includes filtering options to help you focus on
                specific aspects of interest.
              </p>
              <p>
                Want to work with the data directly? You can download
                information from any individual level or export the complete
                dataset all at once. The data is provided in CSV format, making
                it easy to use in your preferred analysis tools.
              </p>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="paper" className="space-y-3">
          <FilterPapers
            data={papers}
            setData={setDataPaper}
            lock={lockPapers}
            setLock={setLockPapers}
            setShouldHandleLocks={setShouldHandleLocks}
          />

          <DataTable columns={ColumnsPapers} data={dataPaperLevel} />
          <div>
            Showing {dataPaperLevel.length} out of {papers.length} rows.
          </div>
        </TabsContent>
        <TabsContent value="study" className="space-y-3">
          <FilterStudies
            data={studies}
            setData={setDataStudy}
            lock={lockStudies}
            setLock={setLockStudies}
            setShouldHandleLocks={setShouldHandleLocks}
          />
          <div>
            Showing {dataStudyLevel.length} out of {studies.length} rows.
          </div>
          <DataTable columns={ColumnsStudies} data={dataStudyLevel} />
        </TabsContent>
        <TabsContent value="intervention" className="space-y-3">
          <FilterInterventions
            data={interventions}
            setData={setDataIntervention}
            lock={lockInterventions}
            setLock={setLockInterventions}
            setShouldHandleLocks={setShouldHandleLocks}
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
        <TabsContent value="outcome" className="space-y-3">
          <FilterOutcomes
            data={outcomes}
            setData={setDataOutcome}
            lock={lockOutcomes}
            setLock={setLockOutcomes}
            setShouldHandleLocks={setShouldHandleLocks}
          />
          <div>
            Showing {dataOutcomeLevel.length} out of {outcomes.length} rows.
          </div>
          <DataTable columns={ColumnsOutcomes} data={dataOutcomeLevel} />
        </TabsContent>
        <TabsContent value="effect" className="space-y-3">
          <FilterEffects
            data={effects}
            setData={setDataEffect}
            lock={lockEffects}
            setLock={setLockEffects}
            setShouldHandleLocks={setShouldHandleLocks}
          />
          <div>
            Showing {dataEffectLevel.length} out of {effects.length} rows.
          </div>
          <DataTable columns={ColumnsEffects} data={dataEffectLevel} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
