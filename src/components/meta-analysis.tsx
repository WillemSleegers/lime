"use client"

import { useState } from "react"
import { getData } from "@/lib/json-functions"
import { Filters } from "./filters"
import { Highlights } from "./highlights/highlights"
import { Effect } from "./effect"
import { ForestPlot } from "./forest-plot"

export const MetaAnalysis = () => {
  const [status, setStatus] = useState("Loading webR...")
  const [data, setData] = useState(getData({}))

  return (
    <div className="m-3">
      <div className="my-5 flex gap-3 justify-between">
        <h1 className="font-bold tracking-tight">Meta-Analysis</h1>
        <p className="my-3">Status: {status}</p>
      </div>
      <Filters setData={setData} />
      <Highlights data={data} />
      <Effect effect={0.21} />
      <ForestPlot data={data} />
    </div>
  )
}
