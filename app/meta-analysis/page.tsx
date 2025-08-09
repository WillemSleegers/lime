"use client"

import { WebR } from "webr"
import { useEffect, useRef, useState } from "react"

import { CollapsibleEstimate } from "@/components/meta-analysis/estimate"
import { Button } from "@/components/ui/button"
import { ForestPlot } from "@/components/meta-analysis/forest-plot"
import { RCode } from "@/components/meta-analysis/R-code"
import { Filters } from "@/components/meta-analysis/filters"
import { Highlights } from "@/components/meta-analysis/highlights"
import { CollapsiblePublicationBias } from "@/components/meta-analysis/publication-bias"

import { runMetaAnalysis } from "@/lib/r-functions"

import codebook from "@/assets/data/codebook.json"
import { Data, Datum, Egger, Estimate, Status } from "@/lib/types"
import { exportToCSV } from "@/lib/csv-utils"
import Link from "next/link"

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
      <h1 className="text-center text-4xl font-bold">Meta-Analysis</h1>
      <div className="text-muted-foreground">
        Run a meta-analysis on selected effects from various intervention
        studies. For more information on what to take into account when running
        a meta-analysis, see the meta-analysis section in our{" "}
        <Link className="font-medium underline text-foreground" href="/FAQ">
          FAQ
        </Link>
        .
      </div>

      <Filters status={status} setData={setData} />
      <CollapsibleEstimate estimate={estimate} />
      <Highlights data={data} />
      <CollapsiblePublicationBias
        estimate={estimate}
        egger={egger}
        data={data}
      />
      <ForestPlot data={data} />
      <div className="p-3 flex justify-center gap-3">
        <RCode />
        <Button
          variant="secondary"
          className="rounded-2xl"
          disabled={data == undefined}
          onClick={() => handleDownload("lime-data.csv", data)}
        >
          Download data
        </Button>
        <Button
          variant="secondary"
          className="rounded-2xl"
          onClick={() => handleDownload("codebook.csv", codebook)}
        >
          Download codebook
        </Button>
      </div>
    </main>
  )
}

export default MetaAnalysisPage
