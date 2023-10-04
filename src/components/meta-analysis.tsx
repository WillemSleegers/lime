"use client"

import { useState, useEffect } from "react"
import { Combobox } from "./combobox"
import { ForestPlot } from "./forest-plot"
import { getOutcomeCategories } from "@/lib/json-functions"

export const MetaAnalysis = () => {
  const [status, setStatus] = useState("Loading webR...")

  const outcomes = getOutcomeCategories().map((e) => {
    return { value: e.toLowerCase(), label: e }
  })
  console.log(outcomes)

  return (
    <div className="m-3">
      <h1 className="text-4xl font-bold tracking-tight">Meata-Analysis</h1>
      <p className="my-3">Status: {status}</p>

      <div className="flex flex-col-reverse md:flex-row items-start gap-3 border rounded-lg p-3">
        <Combobox options={outcomes} />
        <ForestPlot />
      </div>
    </div>
  )
}
