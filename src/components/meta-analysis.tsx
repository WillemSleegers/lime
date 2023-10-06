"use client"

import { useState, useEffect } from "react"
import { ForestPlot } from "./forest-plot"
import { Filters } from "./Filters"

export const MetaAnalysis = () => {
  const [status, setStatus] = useState("Loading webR...")

  return (
    <div className="m-3">
      <h1 className="font-bold tracking-tight">Meta-Analysis</h1>
      <p className="my-3">Status: {status}</p>

      <Filters />

      <div className="py-3">
        <h2 className="mb-3">Forest plot</h2>
        <div className="flex flex-col p-3">
          <ForestPlot />
        </div>
      </div>
    </div>
  )
}
