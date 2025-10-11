"use client"

import { WebR } from "webr"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

import { CollapsibleEstimate } from "@/components/meta-analysis/estimate"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ForestPlot } from "@/components/meta-analysis/forest-plot"
import { RCode } from "@/components/meta-analysis/R-code"
import { Filters } from "@/components/meta-analysis/filters"
import { Highlights } from "@/components/meta-analysis/highlights"
import { CollapsiblePublicationBias } from "@/components/meta-analysis/publication-bias"
import DotPlotExample from "@/components/meta-analysis/dot-plot"

import { runMetaAnalysis } from "@/lib/r-functions"
import { exportToCSV } from "@/lib/csv-utils"

import codebook from "@/assets/data/codebook.json"
import { Data, Datum, Egger, Estimate, Status } from "@/lib/types"

const handleDownload = (fileName: string, data?: Record<string, unknown>[]) => {
  if (!data) return
  exportToCSV(data, fileName)
}

const MetaAnalysisPage = () => {
  const webR = useRef<WebR>(null)

  const [status, setStatus] = useState<Status>("Loading webR...")

  const [data, setData] = useState<Data>()
  const [estimate, setEstimate] = useState<Estimate | undefined>()
  const [egger, setEgger] = useState<Egger | undefined>()

  // Setup
  useEffect(() => {
    const initializeR = async () => {
      webR.current = new WebR()

      await webR.current.init()

      setStatus("Installing packages...")
      await webR.current.installPackages(["metafor"])
      await webR.current.installPackages(["clubSandwich"])

      setStatus("Ready")
    }
    initializeR()
  }, [])

  // Run meta-analysis when data changes
  useEffect(() => {
    console.log("runing analysis")
    const analyze = async (data: Data) => {
      if (webR.current && data) {
        // Update status
        setStatus("Running meta-analysis...")

        // Reset the effect
        setEstimate(undefined)

        const subset = data.map((datum: Datum) =>
          (({
            effect_size,
            effect_size_var,
            effect_size_se,
            paper_study,
            paper,
            study,
            outcome,
            intervention_condition,
            control_condition,
          }) => ({
            effect_size,
            effect_size_var,
            effect_size_se,
            paper_study,
            paper,
            study,
            outcome,
            intervention_condition,
            control_condition,
          }))(datum)
        )

        const df = await new webR.current.RObject(subset)
        await webR.current.objs.globalEnv.bind("data", df)
        const results = await runMetaAnalysis(webR.current)

        setEstimate({
          value: results[0],
          lower: results[1],
          upper: results[2],
          piLower: results[3],
          piUpper: results[4],
        })
        setEgger({
          egger_b: results[5],
          egger_se: results[6],
          egger_z: results[7],
          egger_p: results[8],
        })
        setStatus("Ready")
      }
    }
    if (data) analyze(data)
  }, [data])

  useEffect(() => {
    console.log(status)
  }, [status])

  return (
    <main className="w-full max-w-4xl mx-auto space-y-8 my-12 md:my-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Meta-Analysis</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Run a meta-analysis on selected effects from various intervention
          studies. For more information on what to take into account when running
          a meta-analysis, see the meta-analysis section in our{" "}
          <Link
            href="/faq"
            className="font-medium text-primary hover:underline"
          >
            FAQ
          </Link>
          .
        </p>
      </div>

      <Filters status={status} setData={setData} />
      <CollapsibleEstimate estimate={estimate} />
      <Highlights data={data} />
      <CollapsiblePublicationBias
        estimate={estimate}
        egger={egger}
        data={data}
      />
      <div>
        <DotPlotExample data={data} />
      </div>
      <ForestPlot data={data} />
      <div className="flex justify-center gap-3">
        <RCode />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="w-32 rounded-lg" variant="outline">
              Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-xl p-2">
            <DropdownMenuItem
              className="rounded-lg"
              disabled={data == undefined}
              onClick={() => handleDownload("lime-data.csv", data)}
            >
              Data
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-lg"
              onClick={() => handleDownload("codebook.csv", codebook)}
            >
              Codebook
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </main>
  )
}

export default MetaAnalysisPage
