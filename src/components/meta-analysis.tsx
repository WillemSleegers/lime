"use client"

import { useState } from "react"
import { ForestPlot } from "./forest-plot"
import { Filters } from "./Filters"
import { Highlights } from "./highlights"
import {
  getData,
  getEffectsCount,
  getPapersCount,
  getPlotData,
} from "@/lib/json-functions"

export const MetaAnalysis = () => {
  const [status, setStatus] = useState("Loading webR...")

  const [effects, setEffects] = useState(getEffectsCount())
  const [papers, setPapers] = useState(getPapersCount())
  const [plotData, setPlotData] = useState(getPlotData())

  console.log(getData())

  return (
    <div className="m-3">
      <div className="my-5 flex gap-3 justify-between">
        <h1 className="font-bold tracking-tight">Meta-Analysis</h1>
        <p className="my-3">Status: {status}</p>
      </div>

      <Highlights effects={effects} papers={papers} />

      <div className="py-5">
        <div className="flex flex-col p-3">
          <ForestPlot data={plotData} />
        </div>
      </div>

      <Filters />
    </div>
  )
}
