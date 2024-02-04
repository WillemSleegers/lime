"use client"

import { useEffect, useState } from "react"
import { Filters } from "./filters"
import { Highlights } from "./highlights/highlights"
import { Effect } from "./effect"
import { ForestPlot } from "./forest-plot"
import { WebR } from "webr"
import { jsonToDataframe, runMetaAnalysis } from "@/lib/r-functions"

import allData from "../assets/data/prepared-effects.json"

export const MetaAnalysis = () => {
  const [status, setStatus] = useState("Loading webR...")
  const [data, setData] = useState(allData)
  const [webR, setWebR] = useState<WebR>()
  const [effect, setEffect] = useState({ value: 0, lower: 0, upper: 0 })

  useEffect(() => {
    const initializeR = async () => {
      const newWebR = new WebR({ channelType: 1 })
      setWebR(newWebR)

      await newWebR.init()

      setStatus("Installing packages...")
      await newWebR.installPackages(["metafor"])

      setStatus("Running meta-analysis...")
      await jsonToDataframe(newWebR, data, "data")
      const results = await runMetaAnalysis(newWebR)
      setEffect({ value: results[0], lower: results[1], upper: results[2] })

      setStatus("Ready")
    }
    initializeR()
  }, [])

  return (
    <div className="m-3">
      <div className="my-5 flex gap-3 justify-between">
        <h1 className="font-bold tracking-tight">Meta-Analysis</h1>
        <p className="my-3">
          <span className="font-semibold">Status:</span> {status}
        </p>
      </div>
      <Filters
        setData={setData}
        webR={webR}
        setEffect={setEffect}
        setStatus={setStatus}
      />
      <Highlights data={data} />
      <Effect effect={effect} />
      <ForestPlot data={data} />
    </div>
  )
}
