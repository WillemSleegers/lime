"use client"

import { useEffect, useMemo, useState } from "react"
import { dataProps, getData } from "@/lib/json-functions"
import { Filters } from "./filters"
import { Highlights } from "./highlights/highlights"
import { Effect } from "./effect"
import { ForestPlot } from "./forest-plot"
import { WebR } from "webr"
import { jsonToDataframe, runMetaAnalysis } from "@/lib/r-functions"

export const MetaAnalysis = () => {
  const [status, setStatus] = useState("Loading webR...")
  const [data, setData] = useState<dataProps>(getData({}))
  const [webR, setWebR] = useState<WebR>()
  const [effect, setEffect] = useState({ value: 0, lower: 0, upper: 0 })

  useEffect(() => {
    const initializeR = async () => {
      console.log("Initializing...")
      const newData = getData({})
      setData(newData)

      const newWebR = new WebR({ channelType: 1 })
      setWebR(newWebR)
      console.log(newWebR)

      await newWebR.init()

      setStatus("Installing packages...")
      await newWebR.installPackages(["metafor"])

      setStatus("Running meta-analysis...")
      await jsonToDataframe(newWebR, newData, "data")
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
