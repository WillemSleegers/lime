"use client"

import { useState, useEffect } from "react"
import { ForestPlot } from "./forest-plot"
import { Filters } from "./Filters"
import { Highlights } from "./highlights"

export const MetaAnalysis = () => {
  const [status, setStatus] = useState("Loading webR...")

  return (
    <div className="m-3">
      <div className="my-5 flex gap-3 justify-between">
        <h1 className="font-bold tracking-tight">Meta-Analysis</h1>
        <p className="my-3">Status: {status}</p>
      </div>

      <Highlights />

      <div className="py-5">
        <h2 className="mb-3">Forest plot</h2>
        <div className="flex flex-col p-3">
          <ForestPlot />
        </div>
      </div>

      <Filters />
    </div>
  )
}
