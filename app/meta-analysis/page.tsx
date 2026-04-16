"use client"

import { WebR } from "webr"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InclusionCriteriaTab } from "@/components/meta-analysis/tabs/inclusion-criteria-tab"
import { HighlightsTab } from "@/components/meta-analysis/tabs/highlights-tab"
import { MetaAnalysisTab } from "@/components/meta-analysis/tabs/meta-analysis-tab"
import { ModeratorAnalysisTab } from "@/components/meta-analysis/tabs/moderator-analysis-tab"

import { runMetaAnalysis } from "@/lib/r-functions"
import { Data, Datum, Egger, Estimate, Heterogeneity, ModeratorResult, Status } from "@/lib/types"

const MetaAnalysisPage = () => {
  const webR = useRef<WebR>(null)

  const [status, setStatus] = useState<Status>("Loading webR...")
  const [activeTab, setActiveTab] = useState("criteria")

  // Track which steps are unlocked
  const [unlockedTabs, setUnlockedTabs] = useState({
    criteria: true,
    highlights: false,
    analysis: false,
    moderator: false,
  })

  const [data, setData] = useState<Data>()
  const [moderatorResult, setModeratorResult] = useState<ModeratorResult | undefined>()
  const [estimate, setEstimate] = useState<Estimate | undefined>()
  const [egger, setEgger] = useState<Egger | undefined>()
  const [heterogeneity, setHeterogeneity] = useState<Heterogeneity | undefined>()
  const [error, setError] = useState<string | undefined>()

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

  // Handle filter application and unlock next tab
  const handleFiltersApplied = () => {
    setUnlockedTabs((prev) => ({ ...prev, highlights: true, analysis: false, moderator: false }))
    setActiveTab("highlights")
    setModeratorResult(undefined)
    // Scroll to top after tab content renders
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  const handleBackToCriteria = () => {
    setActiveTab("criteria")
    setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }) }, 100)
  }

  const handleBackToHighlights = () => {
    setActiveTab("highlights")
    setTimeout(() => { window.scrollTo({ top: 0, behavior: "smooth" }) }, 100)
  }

  // Handle meta-analysis reviewed and unlock moderator tab
  const handleAnalysisReviewed = () => {
    setUnlockedTabs((prev) => ({ ...prev, moderator: true }))
    setActiveTab("moderator")
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  // Handle highlights reviewed and unlock next tab
  const handleHighlightsReviewed = () => {
    setUnlockedTabs((prev) => ({ ...prev, analysis: true }))
    setActiveTab("analysis")
    // Scroll to top after tab content renders
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 100)
  }

  // Run meta-analysis function (called manually via button)
  const runAnalysis = async () => {
    if (!webR.current || !data) return

    try {
      // Update status
      setStatus("Running meta-analysis...")

      // Reset the effect and error
      setEstimate(undefined)
      setEgger(undefined)
      setHeterogeneity(undefined)
      setError(undefined)

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
      setHeterogeneity({
        q: results[9],
        qDf: results[10],
        qp: results[11],
        i2Paper: results[12],
        i2Study: results[13],
        i2Outcome: results[14],
        i2Total: results[15],
        tau2Paper: results[16],
        tau2Study: results[17],
        tau2Outcome: results[18],
      })
      setStatus("Ready")
    } catch (err) {
      console.error("Meta-analysis error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred while running the meta-analysis")
      setStatus("Ready")
    }
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

      <Tabs value={activeTab} onValueChange={(tab) => { setActiveTab(tab); if (tab === "analysis") runAnalysis() }} className="space-y-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger
            value="criteria"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground"
          >
            Step 1: Filter studies
          </TabsTrigger>
          <TabsTrigger
            value="highlights"
            disabled={!unlockedTabs.highlights}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground"
          >
            Step 2: Review selection
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            disabled={!unlockedTabs.analysis}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground"
          >
            Step 3: Run meta-analysis
          </TabsTrigger>
          <TabsTrigger
            value="moderator"
            disabled={!unlockedTabs.moderator}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground"
          >
            Step 4: Moderator analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="criteria" className="mt-0">
          <InclusionCriteriaTab
            status={status}
            setData={setData}
            onFiltersApplied={handleFiltersApplied}
          />
        </TabsContent>

        <TabsContent value="highlights" className="mt-0">
          <HighlightsTab
            data={data}
            onContinue={handleHighlightsReviewed}
            onBack={handleBackToCriteria}
          />
        </TabsContent>

        <TabsContent value="analysis" className="mt-0">
          <MetaAnalysisTab
            data={data}
            estimate={estimate}
            egger={egger}
            heterogeneity={heterogeneity}
            error={error}
            onContinue={handleAnalysisReviewed}
            onBack={handleBackToHighlights}
          />
        </TabsContent>

        <TabsContent value="moderator" className="mt-0">
          <ModeratorAnalysisTab
            data={data}
            webR={webR}
            status={status}
            result={moderatorResult}
            setResult={setModeratorResult}
          />
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default MetaAnalysisPage
