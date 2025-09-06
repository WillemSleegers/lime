"use client"

import React, { useEffect, useState } from "react"
import { exportToCSV } from "@/lib/csv-utils"

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

import papers from "@/assets/data/papers.json"
import studies from "@/assets/data/studies.json"
import interventions from "@/assets/data/interventions.json"
import outcomes from "@/assets/data/outcomes.json"
import effects from "@/assets/data/effects.json"
import all from "@/assets/data/data.json"

import { semiJoin } from "@/lib/json-functions"
import { FilterPapers } from "@/components/data-explorer/filters/filter-papers"
import { FilterStudies } from "@/components/data-explorer/filters/filter-studies"
import { FilterInterventions } from "@/components/data-explorer/filters/filter-interventions"
import { FilterOutcomes } from "@/components/data-explorer/filters/filter-outcomes"
import { FilterEffects } from "@/components/data-explorer/filters/filter-effects"

export default function DataExplorer() {
  const [level, setLevel] = useState("paper")

  // Batched filtered data state (from filter operations)
  const [filteredData, setFilteredData] = useState({
    papers,
    studies,
    interventions,
    outcomes,
    effects,
  })

  // Batched display data state (after lock operations)
  const [displayData, setDisplayData] = useState({
    papers,
    studies,
    interventions,
    outcomes,
    effects,
  })

  // Batched lock state
  const [locks, setLocks] = useState({
    papers: false,
    studies: false,
    interventions: false,
    outcomes: false,
    effects: false,
  })

  const [shouldHandleLocks, setShouldHandleLocks] = useState(false)

  // Global filter collapsible state - persists across tab changes
  const [filterOpen, setFilterOpen] = useState(false)

  // Create properly typed setter functions for each data type
  const setDataPapers: React.Dispatch<React.SetStateAction<typeof papers>> = (
    newData
  ) =>
    setFilteredData((prev) => ({
      ...prev,
      papers: typeof newData === "function" ? newData(prev.papers) : newData,
    }))
  const setDataStudies: React.Dispatch<React.SetStateAction<typeof studies>> = (
    newData
  ) =>
    setFilteredData((prev) => ({
      ...prev,
      studies: typeof newData === "function" ? newData(prev.studies) : newData,
    }))
  const setDataInterventions: React.Dispatch<
    React.SetStateAction<typeof interventions>
  > = (newData) =>
    setFilteredData((prev) => ({
      ...prev,
      interventions:
        typeof newData === "function" ? newData(prev.interventions) : newData,
    }))
  const setDataOutcomes: React.Dispatch<
    React.SetStateAction<typeof outcomes>
  > = (newData) =>
    setFilteredData((prev) => ({
      ...prev,
      outcomes:
        typeof newData === "function" ? newData(prev.outcomes) : newData,
    }))
  const setDataEffects: React.Dispatch<React.SetStateAction<typeof effects>> = (
    newData
  ) =>
    setFilteredData((prev) => ({
      ...prev,
      effects: typeof newData === "function" ? newData(prev.effects) : newData,
    }))

  // Create properly typed lock setter functions
  const setLockPapers: React.Dispatch<React.SetStateAction<boolean>> = (
    newLock
  ) =>
    setLocks((prev) => ({
      ...prev,
      papers: typeof newLock === "function" ? newLock(prev.papers) : newLock,
    }))
  const setLockStudies: React.Dispatch<React.SetStateAction<boolean>> = (
    newLock
  ) =>
    setLocks((prev) => ({
      ...prev,
      studies: typeof newLock === "function" ? newLock(prev.studies) : newLock,
    }))
  const setLockInterventions: React.Dispatch<React.SetStateAction<boolean>> = (
    newLock
  ) =>
    setLocks((prev) => ({
      ...prev,
      interventions:
        typeof newLock === "function" ? newLock(prev.interventions) : newLock,
    }))
  const setLockOutcomes: React.Dispatch<React.SetStateAction<boolean>> = (
    newLock
  ) =>
    setLocks((prev) => ({
      ...prev,
      outcomes:
        typeof newLock === "function" ? newLock(prev.outcomes) : newLock,
    }))
  const setLockEffects: React.Dispatch<React.SetStateAction<boolean>> = (
    newLock
  ) =>
    setLocks((prev) => ({
      ...prev,
      effects: typeof newLock === "function" ? newLock(prev.effects) : newLock,
    }))

  const handleDownload = (
    data: Record<string, unknown>[],
    fileName: string
  ) => {
    exportToCSV(data, fileName)
  }

  // Optimized locking logic with batched updates
  useEffect(() => {
    if (shouldHandleLocks) {
      // Start with current filtered data (mutable for efficiency)
      const result = {
        papers: [...filteredData.papers],
        studies: [...filteredData.studies],
        interventions: [...filteredData.interventions],
        outcomes: [...filteredData.outcomes],
        effects: [...filteredData.effects],
      }

      // Apply locks efficiently
      if (locks.papers) {
        result.studies = semiJoin(result.studies, filteredData.papers, "paper")
        result.interventions = semiJoin(
          result.interventions,
          filteredData.papers,
          "paper"
        )
        result.outcomes = semiJoin(
          result.outcomes,
          filteredData.papers,
          "paper"
        )
        result.effects = semiJoin(result.effects, filteredData.papers, "paper")
      }

      if (locks.studies) {
        result.papers = semiJoin(result.papers, filteredData.studies, "paper")
        result.interventions = semiJoin(
          result.interventions,
          filteredData.studies,
          ["paper", "study"]
        )
        result.outcomes = semiJoin(result.outcomes, filteredData.studies, [
          "paper",
          "study",
        ])
        result.effects = semiJoin(result.effects, filteredData.studies, [
          "paper",
          "study",
        ])
      }

      if (locks.interventions) {
        result.papers = semiJoin(
          result.papers,
          filteredData.interventions,
          "paper"
        )
        result.studies = semiJoin(result.studies, filteredData.interventions, [
          "paper",
          "study",
        ])
        result.outcomes = semiJoin(
          result.outcomes,
          filteredData.interventions,
          ["paper", "study"]
        )
        result.effects = semiJoin(result.effects, filteredData.interventions, [
          "paper",
          "study",
        ])
      }

      if (locks.outcomes) {
        result.papers = semiJoin(result.papers, filteredData.outcomes, "paper")
        result.studies = semiJoin(result.studies, filteredData.outcomes, [
          "paper",
          "study",
        ])
        result.interventions = semiJoin(
          result.interventions,
          filteredData.outcomes,
          ["paper", "study"]
        )
        result.effects = semiJoin(result.effects, filteredData.outcomes, [
          "paper",
          "study",
        ])
      }

      if (locks.effects) {
        result.papers = semiJoin(result.papers, filteredData.effects, "paper")
        result.studies = semiJoin(result.studies, filteredData.effects, [
          "paper",
          "study",
        ])
        result.interventions = semiJoin(
          result.interventions,
          filteredData.effects,
          ["paper", "study"]
        )
        result.outcomes = semiJoin(result.outcomes, filteredData.effects, [
          "paper",
          "study",
        ])
      }

      // Single batched state update instead of 5 separate ones
      setDisplayData(result)
    }

    setShouldHandleLocks(false)
  }, [shouldHandleLocks, filteredData, locks])

  return (
    <main className="mx-3 md:mx-6 lg:mx-12 space-y-8 my-12 md:my-16">
      <h1 className="text-center text-4xl font-bold">Data Explorer</h1>
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
          <Dialog>
            <DialogTrigger asChild>
              <InfoIcon className="h-6 w-6 hover:cursor-pointer hover:text-muted-foreground" />
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader className="space-y-2 pb-4 border-b">
                <DialogTitle className="text-xl font-semibold">Data Explorer Guide</DialogTitle>
                <p className="text-muted-foreground">
                  Explore LIME&apos;s database of intervention studies to find evidence-based strategies for reducing animal product consumption.
                </p>
              </DialogHeader>
              
              <div className="space-y-6 pt-4">
                <div className="space-y-3">
                  <h3 className="text-base font-medium">Navigate Research Levels</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the tabs to explore different levels of research data, from high-level publications down to specific effect measurements.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>
                      <span className="font-medium">Papers:</span> <span className="text-muted-foreground">Publication details, authors, and open access status</span>
                    </li>
                    <li>
                      <span className="font-medium">Studies:</span> <span className="text-muted-foreground">Sample sizes, methodology, and preregistration details</span>
                    </li>
                    <li>
                      <span className="font-medium">Interventions:</span> <span className="text-muted-foreground">Techniques, content, and delivery methods tested</span>
                    </li>
                    <li>
                      <span className="font-medium">Outcomes:</span> <span className="text-muted-foreground">Measurement approaches and outcome types</span>
                    </li>
                    <li>
                      <span className="font-medium">Effects:</span> <span className="text-muted-foreground">Statistical effect sizes and significance measures</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-medium">Filter & Lock</h3>
                  <p className="text-sm text-muted-foreground">
                    Use filters to focus on specific research aspects. Click the lock icon to carry filters across different data levels.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-medium">Download Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Export any data level or the complete dataset in CSV format for analysis in your preferred tools.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <TabsContent value="paper" className="space-y-4">
          <FilterPapers
            data={papers}
            setData={setDataPapers}
            lock={locks.papers}
            setLock={setLockPapers}
            setShouldHandleLocks={setShouldHandleLocks}
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
            setData={setDataStudies}
            lock={locks.studies}
            setLock={setLockStudies}
            setShouldHandleLocks={setShouldHandleLocks}
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
            setData={setDataInterventions}
            lock={locks.interventions}
            setLock={setLockInterventions}
            setShouldHandleLocks={setShouldHandleLocks}
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
            setData={setDataOutcomes}
            lock={locks.outcomes}
            setLock={setLockOutcomes}
            setShouldHandleLocks={setShouldHandleLocks}
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
            setData={setDataEffects}
            lock={locks.effects}
            setLock={setLockEffects}
            setShouldHandleLocks={setShouldHandleLocks}
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
