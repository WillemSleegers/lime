"use client"

import React, { useState } from "react"
import Link from "next/link"
import { exportToCSV } from "@/lib/csv-utils"

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
} from "@/components/data-explorer/table/columns"
import { DataTable } from "@/components/data-explorer/table/data-table"

import papers from "@/assets/data/papers.json"
import studies from "@/assets/data/studies.json"
import interventions from "@/assets/data/interventions.json"
import outcomes from "@/assets/data/outcomes.json"
import effects from "@/assets/data/effects.json"
import all from "@/assets/data/data.json"

import { FilterPapers } from "@/components/data-explorer/filters/papers"
import { FilterStudies } from "@/components/data-explorer/filters/studies"
import { FilterInterventions } from "@/components/data-explorer/filters/interventions"
import { FilterOutcomes } from "@/components/data-explorer/filters/outcomes"
import { FilterEffects } from "@/components/data-explorer/filters/effects"

import { useDataExplorerState } from "@/hooks/use-data-explorer-state"

export default function DataExplorer() {
  const [level, setLevel] = useState("paper")
  const [filterOpen, setFilterOpen] = useState(false)

  const { displayData, filteredData, setFilteredData, locks, setLocks } =
    useDataExplorerState(
      {
        papers,
        studies,
        interventions,
        outcomes,
        effects,
      },
      all
    )

  const handleDownload = (
    data: Record<string, unknown>[],
    fileName: string
  ) => {
    exportToCSV(data, fileName)
  }

  return (
    <main className="mx-3 md:mx-6 lg:mx-12 space-y-8 my-12 md:my-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Data Explorer</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse research papers using the tabs below. Filter data by topics or
          methods, and download tables for analysis. Need help? See our{" "}
          <Link
            href="/faq"
            className="font-medium text-primary hover:underline"
          >
            FAQ
          </Link>{" "}
          for detailed instructions.
        </p>
      </div>
      <Tabs defaultValue={level} className="space-y-6">
        <div className="mx-auto flex flex-wrap items-center justify-center gap-3">
          <TabsList className="flex h-auto flex-wrap items-center gap-1 rounded-2xl p-0 align-middle bg-primary-foreground sm:bg-primary">
            <TabsTrigger
              className="rounded-2xl border-4 border-primary bg-primary text-primary-foreground data-[state=active]:text-foreground grow-0"
              value="paper"
              onClick={() => setLevel("paper")}
            >
              Papers
            </TabsTrigger>
            <TabsTrigger
              className="rounded-2xl border-4 border-primary bg-primary text-primary-foreground data-[state=active]:text-foreground grow-0"
              value="study"
              onClick={() => setLevel("study")}
            >
              Studies
            </TabsTrigger>
            <TabsTrigger
              className="rounded-2xl border-4 border-primary bg-primary text-primary-foreground data-[state=active]:text-foreground grow-0"
              value="intervention"
              onClick={() => setLevel("intervention")}
            >
              Interventions
            </TabsTrigger>
            <TabsTrigger
              className="rounded-2xl border-4 border-primary bg-primary text-primary-foreground data-[state=active]:text-foreground grow-0"
              value="outcome"
              onClick={() => setLevel("outcome")}
            >
              Outcomes
            </TabsTrigger>
            <TabsTrigger
              className="rounded-2xl border-4 border-primary bg-primary text-primary-foreground data-[state=active]:text-foreground grow-0"
              value="effect"
              onClick={() => setLevel("effect")}
            >
              Effects
            </TabsTrigger>
          </TabsList>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-32 rounded-lg" variant="outline">
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl p-2">
              <DropdownMenuItem
                className="rounded-lg"
                onClick={() => handleDownload(papers, "lime-papers.csv")}
              >
                Papers
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg"
                onClick={() => handleDownload(studies, "lime-studies.csv")}
              >
                Studies
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg"
                onClick={() =>
                  handleDownload(interventions, "lime-interventions.csv")
                }
              >
                Interventions
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg"
                onClick={() => handleDownload(outcomes, "lime-outcomes.csv")}
              >
                Outcomes
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg"
                onClick={() => handleDownload(effects, "lime-effects.csv")}
              >
                Effects
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg"
                onClick={() => handleDownload(all, "lime-data.csv")}
              >
                All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <TabsContent value="paper" className="space-y-4">
          <FilterPapers
            data={papers}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            locks={locks}
            setLocks={setLocks}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
          />
          <DataTable
            columns={ColumnsPapers}
            data={displayData.papers}
            totalRows={papers.length}
          />
        </TabsContent>
        <TabsContent value="study" className="space-y-4">
          <FilterStudies
            data={studies}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            locks={locks}
            setLocks={setLocks}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
          />
          <DataTable
            columns={ColumnsStudies}
            data={displayData.studies}
            totalRows={studies.length}
          />
        </TabsContent>
        <TabsContent value="intervention" className="space-y-4">
          <FilterInterventions
            data={interventions}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            locks={locks}
            setLocks={setLocks}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
          />
          <DataTable
            columns={ColumnsInterventions}
            data={displayData.interventions}
            totalRows={interventions.length}
          />
        </TabsContent>
        <TabsContent value="outcome" className="space-y-4">
          <FilterOutcomes
            data={outcomes}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            locks={locks}
            setLocks={setLocks}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
          />
          <DataTable
            columns={ColumnsOutcomes}
            data={displayData.outcomes}
            totalRows={outcomes.length}
          />
        </TabsContent>
        <TabsContent value="effect" className="space-y-4">
          <FilterEffects
            data={effects}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            locks={locks}
            setLocks={setLocks}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
          />
          <DataTable
            columns={ColumnsEffects}
            data={displayData.effects}
            totalRows={effects.length}
          />
        </TabsContent>
      </Tabs>
    </main>
  )
}
