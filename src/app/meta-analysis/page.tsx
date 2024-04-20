"use client"

import { useState } from "react"
import { Filters } from "@/components/filters"
import { Highlights } from "@/components/highlights/highlights"
import { Effect } from "@/components/effect"
import { ForestPlot } from "@/components/forest-plot"
import { FunnelPlot } from "@/components/funnel-plot"

import allData from "../../assets/data/prepared-effects.json"

const MetaAnalysis = () => {
  const [status, setStatus] = useState("Loading webR...")
  const [data, setData] = useState(allData)

  const [effect, setEffect] = useState({ value: 0, lower: 0, upper: 0 })
  return (
    <main className="m-auto max-w-screen-lg">
      <div className="m-3">
        <div className="my-5 ">
          <span className="font-semibold">Status:</span> {status}
        </div>
        <Filters
          setData={setData}
          setEffect={setEffect}
          status={status}
          setStatus={setStatus}
        />
        <Highlights data={data} />
        <Effect effect={effect} />
        <ForestPlot data={data} />
        <FunnelPlot data={data} effect={effect.value} />
      </div>
    </main>
  )
}

export default MetaAnalysis
