"use client"

import { WebR } from "webr"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InclusionCriteriaTab } from "@/components/meta-analysis/tabs/inclusion-criteria-tab"
import { HighlightsTab } from "@/components/meta-analysis/tabs/highlights-tab"
import { MetaAnalysisTab } from "@/components/meta-analysis/tabs/meta-analysis-tab"

import { runMetaAnalysis } from "@/lib/r-functions"
import { Data, Datum, Egger, Estimate, Status } from "@/lib/types"

const MetaAnalysisPage = () => {
  const webR = useRef<WebR>(null)

  const [status, setStatus] = useState<Status>("Loading webR...")
  const [activeTab, setActiveTab] = useState("criteria")

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

  // Run meta-analysis function (called manually via button)
  const runAnalysis = async () => {
    if (!webR.current || !data) return

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

  useEffect(() => {
    console.log(status)
  }, [status])

  return (
    <main className="page-width page-container space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-page-title">Meta-Analysis</h1>
        <p className="max-w-2xl mx-auto text-description">
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger
            value="criteria"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Step 1: Filter studies
          </TabsTrigger>
          <TabsTrigger
            value="highlights"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Step 2: Review selection
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Step 3: Run meta-analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="criteria" className="mt-0">
          <InclusionCriteriaTab status={status} setData={setData} />
        </TabsContent>

        <TabsContent value="highlights" className="mt-0">
          <HighlightsTab data={data} />
        </TabsContent>

        <TabsContent value="analysis" className="mt-0">
          <MetaAnalysisTab
            data={data}
            estimate={estimate}
            egger={egger}
            status={status}
            runAnalysis={runAnalysis}
          />
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default MetaAnalysisPage
