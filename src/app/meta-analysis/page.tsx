"use client"

import { useEffect, useState } from "react"
import { Filters } from "@/components/meta-analysis/filters"
import { Highlights } from "@/components/highlights/highlights"
import { Effect } from "@/components/effect"
import { ForestPlot } from "@/components/forest-plot"
import { PublicationBias } from "@/components/meta-analysis/publication-bias"

import allData from "../../assets/data/data.json"
import { WebR } from "webr"
import { runMetaAnalysis } from "@/lib/r-functions"

const MetaAnalysis = () => {
  const [status, setStatus] = useState("Loading webR...")
  const [data, setData] = useState(allData)
  const [disableForm, setDisableForm] = useState(true)

  const [effect, setEffect] = useState({
    value: 0,
    lower: 0,
    upper: 0,
    egger_b: 0,
    egger_se: 0,
    egger_z: 0,
    egger_p: 0,
  })
  const [webR, setWebR] = useState<WebR>()

  useEffect(() => {
    const initializeR = async () => {
      const newWebR = new WebR()
      setWebR(newWebR)

      await newWebR.init()

      setStatus("Installing packages...")
      await newWebR.installPackages(["metafor"])
      await newWebR.installPackages(["clubSandwich"])
      setDisableForm(false)
    }
    initializeR()
  }, [])

  useEffect(() => {
    const analyze = async (data: any) => {
      if (webR && data) {
        setStatus("Running meta-analysis...")
        setEffect({
          value: 0,
          lower: 0,
          upper: 0,
          egger_b: 0,
          egger_se: 0,
          egger_z: 0,
          egger_p: 0,
        })
        console.log("Running meta-analysis")
        const subset = data.map((e: any) =>
          (({
            effect_size_value,
            effect_size_var,
            effect_se,
            paper_study,
            paper,
            study,
            outcome,
            intervention_condition,
            control_condition,
          }) => ({
            effect_size_value,
            effect_size_var,
            effect_se,
            paper_study,
            paper,
            study,
            outcome,
            intervention_condition,
            control_condition,
          }))(e),
        )

        const df = await new webR.RObject(subset)
        await webR.objs.globalEnv.bind("data", df)
        const results = await runMetaAnalysis(webR)

        setEffect({
          value: results[0],
          lower: results[1],
          upper: results[2],
          egger_b: results[3],
          egger_se: results[4],
          egger_z: results[5],
          egger_p: results[6],
        })
        setStatus("Ready")
      }
    }
    analyze(data)
  }, [data])

  return (
    <main className="m-auto max-w-(--breakpoint-lg)">
      <div className="m-3">
        <div className="my-5">
          <span className="font-semibold">Status:</span> {status}
        </div>
        <Filters setData={setData} disabled={disableForm} />
        <Highlights data={data} />
        <Effect effect={effect} />
        <PublicationBias
          data={data}
          effect={effect.value}
          egger_b={effect.egger_b}
          egger_se={effect.egger_se}
          egger_z={effect.egger_z}
          egger_p={effect.egger_p}
        />
        <ForestPlot data={data} />
      </div>
    </main>
  )
}

export default MetaAnalysis
